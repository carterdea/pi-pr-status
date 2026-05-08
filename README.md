# pi-pr-status

Pi extension that shows a clickable GitHub PR link in the footer, like `PR #11`.

It uses `gh pr view --json number,url` for the current branch and renders an OSC 8 hyperlink, which Ghostty can open on click.

## Install for local use

```bash
bun install
pi install git:file:///Users/carterdeangelis/Sites/pi-pr-status
```

For development, symlink the extension into Pi's global extension directory:

```bash
rm -f ~/.pi/agent/extensions/pr-status.ts
ln -sfn /Users/carterdeangelis/Sites/pi-pr-status/extensions/pr-status ~/.pi/agent/extensions/pr-status
```

Then restart Pi or run:

```text
/reload
```

## Usage

The footer updates on session start and after turns. To force a refresh:

```text
/pr-refresh
```

If the current branch has no PR, the footer status is cleared.

## Development

```bash
bun test
bun run typecheck
```
