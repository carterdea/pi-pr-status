# pi-pr-status

Pi extension that shows a clickable GitHub PR link in the footer, like `PR #11`.

It uses GitHub CLI to inspect the current branch, then renders an OSC 8 hyperlink. Terminals with OSC 8 support, including Ghostty, open the PR when clicked.

## Prerequisites

- [Pi](https://pi.dev) installed and working
- [GitHub CLI](https://cli.github.com/) installed as `gh`
- Authenticated GitHub CLI:

  ```bash
  gh auth status
  ```

- A Git repository with a GitHub remote
- A current branch with an open PR for the footer link to appear
- Optional for development: Bun

## Install

Install directly from GitHub:

```bash
pi install git:github.com/carterdea/pi-pr-status
```

Restart Pi, or run this in an existing Pi session:

```text
/reload
```

## Usage

Open Pi inside a branch that has a PR. The footer should show a clickable link like:

```text
PR #11
```

Force refresh:

```text
/pr-refresh
```

If the current branch has no PR, the footer status is cleared.

## Local development

```bash
git clone git@github.com:carterdea/pi-pr-status.git
cd pi-pr-status
bun install
bun test
bun run typecheck
```

Load the local checkout during development:

```bash
rm -f ~/.pi/agent/extensions/pr-status.ts
ln -sfn "$PWD/extensions/pr-status" ~/.pi/agent/extensions/pr-status
```

Then restart Pi or run `/reload`.

## Notes

- The extension only reads PR metadata using `gh pr view --json number,url`.
- It does not store tokens or secrets.
- It does not call the GitHub API directly; authentication is handled by `gh`.
