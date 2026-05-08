export type PullRequest = {
	number: number;
	url: string;
};

export const statusKey = "github-pr";

export function createOsc8Link(label: string, url: string) {
	return `\x1b]8;;${url}\x1b\\${label}\x1b]8;;\x1b\\`;
}

export function parsePullRequest(stdout: string) {
	try {
		const value = JSON.parse(stdout) as Partial<PullRequest>;
		if (typeof value.number !== "number") return;
		if (typeof value.url !== "string") return;
		return { number: value.number, url: value.url };
	} catch {
		return;
	}
}

export function formatPullRequestLink(pr: PullRequest) {
	return createOsc8Link(`PR #${pr.number}`, pr.url);
}
