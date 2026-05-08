import { describe, expect, test } from "bun:test";
import { createOsc8Link, formatPullRequestLink, parsePullRequest, statusKey } from "../src/pr-status";

describe("parsePullRequest", () => {
	test("parses GitHub CLI PR JSON", () => {
		expect(parsePullRequest('{"number":11,"url":"https://github.com/acme/repo/pull/11"}')).toEqual({
			number: 11,
			url: "https://github.com/acme/repo/pull/11",
		});
	});

	test("ignores invalid JSON", () => {
		expect(parsePullRequest("not json")).toBeUndefined();
	});

	test("requires a numeric PR number", () => {
		expect(parsePullRequest('{"number":"11","url":"https://github.com/acme/repo/pull/11"}')).toBeUndefined();
	});

	test("requires a string PR URL", () => {
		expect(parsePullRequest('{"number":11,"url":null}')).toBeUndefined();
	});
});

describe("formatPullRequestLink", () => {
	test("formats Ghostty-clickable OSC 8 link text", () => {
		const url = "https://github.com/acme/repo/pull/11";
		expect(createOsc8Link("PR #11", url)).toBe(`\x1b]8;;${url}\x1b\\PR #11\x1b]8;;\x1b\\`);
		expect(formatPullRequestLink({ number: 11, url })).toBe(createOsc8Link("PR #11", url));
	});

	test("exports stable Pi footer status key", () => {
		expect(statusKey).toBe("github-pr");
	});
});
