import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { formatPullRequestLink, parsePullRequest, statusKey } from "../../src/pr-status";

const refreshIntervalMs = 30_000;

export default function (pi: ExtensionAPI) {
	let lastRefresh = 0;
	let refreshInFlight: Promise<void> | undefined;

	async function refresh(ctx: ExtensionContext, force = false) {
		if (!ctx.hasUI) return;

		const now = Date.now();
		if (!force && now - lastRefresh < refreshIntervalMs) return;
		if (refreshInFlight) return refreshInFlight;

		lastRefresh = now;
		refreshInFlight = refreshPrStatus(pi, ctx).finally(() => {
			refreshInFlight = undefined;
		});

		return refreshInFlight;
	}

	pi.on("session_start", async (_event, ctx) => refresh(ctx, true));
	pi.on("turn_end", async (_event, ctx) => refresh(ctx));

	pi.registerCommand("pr-refresh", {
		description: "Refresh GitHub PR footer link",
		handler: async (_args, ctx) => {
			await refresh(ctx, true);
		},
	});
}

async function refreshPrStatus(pi: ExtensionAPI, ctx: ExtensionContext) {
	let stdout = "";

	try {
		const result = await pi.exec("gh", ["pr", "view", "--json", "number,url"], {
			timeout: 5_000,
		});

		if (result.code !== 0) {
			clearStatus(ctx);
			return;
		}

		stdout = result.stdout;
	} catch {
		clearStatus(ctx);
		return;
	}

	const pr = parsePullRequest(stdout);
	if (!pr) {
		clearStatus(ctx);
		return;
	}

	ctx.ui.setStatus(statusKey, ctx.ui.theme.fg("accent", formatPullRequestLink(pr)));
}

function clearStatus(ctx: ExtensionContext) {
	ctx.ui.setStatus(statusKey, undefined);
}
