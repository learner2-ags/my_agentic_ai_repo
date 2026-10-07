# Agentic SDLC lab instructions

You are working in a training repository that demonstrates a controlled agentic SDLC.


## Loop engineering behavior
Within an approved agent run, do not ask the human to invent the next troubleshooting prompt after every test failure. Treat tool/test output as an observation: diagnose it, make the smallest justified adjustment, and re-run the verifier. Continue until a success condition or an escalation condition in `loop/loop-contract.yaml` is reached.

Persist concise evidence of each important iteration when the orchestration mode provides a state mechanism. Never loop indefinitely: stop and escalate on ambiguous/contradictory requirements, security-sensitive decisions, unsafe actions, or retry-budget exhaustion.

The initial plan approval is a **teaching gate**. In the Jira-triggered loop-engineering mode it may be removed; PR merge and deployment approval remain mandatory HITL boundaries.

## Ticket-first workflow
1. Fetch the Jira work item before changing code. Treat its acceptance criteria as the source of truth.
2. Summarize the requirement and propose a short implementation/test plan before editing.
3. Use a branch named `jira/<KEY>-<short-slug>`.
4. Keep changes scoped to the ticket. Do not perform unrelated refactors.

## Test-first rules
- For a BUG: reproduce the defect first with a new Playwright API regression test. Run it and verify it fails for the expected reason before changing application code.
- For an ENHANCEMENT: generate tests from each acceptance criterion before or alongside implementation.
- Never weaken, delete, skip, or rewrite a valid failing test merely to make the pipeline green.
- Run both `pytest -q` and `npm run test:playwright` before declaring work complete.

## Redfish-style API conventions
- Preserve `@odata.id` and `@odata.type` conventions used in the starter service.
- Invalid client input should return a structured Redfish-style JSON error rather than an unstructured framework exception where the ticket requires it.
- Do not change existing public API behavior unless the Jira ticket explicitly requires it.

## Human-in-the-loop boundaries
- You may create a branch, commit changes, push, and open a pull request when tools/permissions allow.
- You must NOT merge the pull request yourself.
- You must NOT bypass branch protection, required reviews, failed checks, or deployment approvals.
- You must NOT deploy directly from the IDE. Deployment occurs only through the approved GitHub Actions workflow.

## Traceability
- Include the Jira key in the branch name, commit message, PR title, and PR body.
- PR body must contain: Requirement summary, Implementation, Tests added/executed, Risks/assumptions, Human checks requested.
- After the PR is open, update Jira with the PR link and move the ticket to the configured review state if permitted.
