---
name: plan
description: Start a ticket. Fetch it from Jira, inspect the repository, and produce an implementation plan plus a test plan mapped to the acceptance criteria. Use at the beginning of any ticket, before any code is written. Makes no changes.
argument-hint: '<TICKET-KEY>   e.g. HPELAB-102'
---

Ticket: **$ARGUMENTS**

Select the `planner` agent before running this — it has no edit tools, which
is what keeps this step from turning into implementation.

1. **Fetch the ticket.** Use the Atlassian MCP tools. If they are not
   authenticated, fall back to `jira/<TICKET-KEY>-*.md` in this repo and say
   which source you used — the learner needs to know.
2. **Inspect the repo** before forming any opinion: `app/main.py` for the
   routes and models involved, `tests/unit/` and `tests/playwright/` for what
   is already covered, and the Redfish error shape already in use.
3. **Produce the plan** in the `planner` agent's six-part format.

Two things to get right:

- **Number the acceptance criteria `AC-1..n` and map every one to a test
  case.** An AC with no test will simply not get built, and nothing
  downstream will notice.
- **For a bug, reproduction comes first.** State the test that proves the
  defect and what it asserts, before proposing any fix. You cannot know the
  cause until you can observe the effect.

Then stop. The human approves the plan before anything is written.
