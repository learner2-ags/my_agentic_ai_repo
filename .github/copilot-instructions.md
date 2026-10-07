# HPE Redfish-Style Lab Service — agent rules

Always-on rules for this repository. Procedures live in `.github/skills/`;
this file is only the things that are true for every task.

## Available slash commands

When the user types a `/command`, read `.github/skills/<command>/SKILL.md`
for the full procedure. Available commands:

| Command | When to use |
|---|---|
| `/check` | Before starting any ticket — verify GitHub write access, Atlassian MCP, repo setup, and tests exist |
| `/plan` | Start a ticket — fetch from Jira, inspect repo, produce implementation + test plan |
| `/implement` | Execute an approved plan — branch, red/green, commit, push, draft PR |
| `/verify` | Run the full test suite and report failures |
| `/review` | Review the diff before opening a PR |
| `/ship` | Push branch, open draft PR, write back to Jira |

If a `/command` is typed that has no matching SKILL.md, say so — do not guess.

## The app

FastAPI service simulating a Redfish-style management API.
- `app/main.py` — all routes
- `tests/unit/` — pytest, uses FastAPI TestClient
- `tests/playwright/` — Playwright **API** tests via the `request` fixture (no browser)
- `jira/` — ticket text, usable offline if Atlassian MCP is unauthenticated

## How to run things

```
pytest -q                     unit / API tests
npm run test:playwright       Playwright API tests (auto-starts uvicorn)
docker compose up -d --build  packaged run on :8000
```

Playwright starts the server itself unless `BASE_URL` is set. Don't start
uvicorn separately first — the port collision looks like a test failure.

## Credentials

`GITHUB_TOKEN` is set in the environment. `git push` and `gh pr create` work
without interactive prompts — no need to hand off to a human for push or PR
creation.

## GitHub Write Access

Agents must use one of these paths for push and PR — in priority order:

1. **GitHub MCP `create_pull_request` tool** — use it if the tool is available
   in the session (check by searching for `create_pull_request` in available
   tools). Prefer this when connected.
2. **`gh` CLI fallback** — if MCP write tools are absent or the session has
   only the read-only `github-mcp-server`:
   ```
   git push -u origin <branch>
   gh pr create --draft --title "<KEY>: <subject>" --body "$(cat .github/PULL_REQUEST_TEMPLATE.md)"
   ```
3. **Never ask a human to push.** Both paths above are non-interactive.
   If neither works (no `gh`, no MCP), report the blocker and stop.

## Conventions

- Branch: `jira/<TICKET-KEY>-<short-slug>`
- Commit subject starts with the ticket key: `HPELAB-102: reject read-only SerialNumber`
- Redfish errors use the `@Message.ExtendedInfo` shape already in `app/main.py`
- Keep the diff minimal. No drive-by refactors, no formatting-only changes.

## Rules that do not bend

1. **Never weaken a test to get green.** Not by changing an assertion, not by
   skipping, not by deleting. A test that looks wrong is a finding to report —
   stop and say which assertion and why.
2. **Never merge a PR.** Open it as a draft and stop. A human merges.
3. **Never deploy from the IDE.** Deployment runs only through
   `.github/workflows/deploy-lab.yml` after its environment approval.
4. **Stay inside the ticket.** If the work needs a file the plan didn't name,
   stop and say so rather than widening silently.
5. **Don't invent business behaviour.** If the acceptance criteria don't settle
   a product question, ask — don't pick an answer.


## Evidence

Every PR body follows `.github/PULL_REQUEST_TEMPLATE.md`: the ticket key, what
changed, the RED output before the fix and the GREEN output after, and any risk
or assumption. CI re-runs everything independently — your local result is a
claim until the PR checks agree with it.

## Credentials

`GITHUB_TOKEN` is set in the environment. Git push and `gh pr create` work
without interactive prompts — no need to ask a human to push.
