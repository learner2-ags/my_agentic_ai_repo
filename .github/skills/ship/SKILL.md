---
name: ship
description: Push the branch, open a draft pull request with evidence, and write the result back to Jira. Use once the review is clean and the full suite is green. Never merges.
argument-hint: '(no arguments — ships the current branch)'
---

Precondition: full suite green and `/review` came back ready. If not, stop.

1. **Push** the branch.

2. **Open a DRAFT pull request.** Fill in
   `.github/PULL_REQUEST_TEMPLATE.md` completely — in particular the RED block
   (the failing output from before the fix) and the GREEN block (the same test
   passing). Those two blocks are what a reviewer reads first; a PR with
   empty or vague ones is not ready.

3. **Jira write-back** via the Atlassian MCP: add a comment with the PR link
   and a short test summary, and transition the ticket to the configured
   In Review state.

4. **Stop.**

You do not approve the PR, mark it ready for review, or merge it. All three
are a human's action, every time, however green the checks are. You do not
run the deployment workflow either — release approval is a separate gate from
code review, and that separation is the point.

Report the PR URL and what you wrote back to Jira.
