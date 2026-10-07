---
name: check
description: Quick readiness check before starting agentic development. Verdict is either "ready to go" or a short list of what's blocking with exact fix steps.
argument-hint: '(no arguments)'
---

Run each check silently. Do not narrate each step — just collect results, then
print the verdict at the end.

---

## Checks

**1. GitHub write path** — can the agent push and open a PR?
- Search available tools for `create_pull_request` → MCP write tools present
- OR: run `gh --version` → gh CLI installed
- OR: check `$env:GH_TOKEN` or `$env:GITHUB_TOKEN` is non-empty

Pass if ANY ONE of the three is true. Fail if all three are missing.

**2. Git remote** — is there a repo to push to?
- Run `git remote get-url origin`
- Pass if it returns a URL. Fail if no remote.

**3. Atlassian MCP** — can the agent fetch tickets?
- Call `searchJiraIssuesUsingJql` with `project IS NOT EMPTY ORDER BY created DESC` limit 1
- Pass if any result comes back. Fail if the tool errors or is not available.
- If fail: check `jira/*.md` files exist as offline fallback.

**4. Tests exist** — is there something to run?
- Check `tests/unit/` has at least one `.py` file
- Pass if yes. Warn if empty (not a hard blocker).

---

## Verdict

Print ONE of these two outcomes — nothing else:

### Ready to go
```
✅ Ready to go

GitHub write:   ✅  (MCP / gh CLI / token — whichever passed)
Git remote:     ✅  learner1-ags/hpe-labs
Atlassian MCP:  ✅  connected
Tests:          ✅  N unit files
```

### Blocked
```
⚠️ Not ready — fix these before starting:

❌ GitHub write — no MCP write tools, no gh CLI, no token
   → Run: winget install --id GitHub.cli
   → Then set GH_TOKEN in .vscode/settings.json → terminal.integrated.env.windows

❌ Git remote — not configured
   → Run: git remote add origin git@github-ags:learner1-ags/<repo>.git

⚠️ Atlassian MCP — not connected (offline fallback: jira/*.md files present / missing)
   → Authenticate at mcp.atlassian.com or add ticket files to jira/

(list only the checks that failed — skip the ones that passed)
```

One sentence after the block: what to do next.
- All green → "Run /plan <TICKET-KEY> to start."
- Blocked → "Fix the ❌ items above, then re-run /check."
