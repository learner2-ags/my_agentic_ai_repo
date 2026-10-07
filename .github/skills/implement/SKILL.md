---
name: implement
description: Carry out an approved plan — create the branch, write the failing tests first, capture the RED output, make them pass, then run the full suite. Use after a plan has been approved.
argument-hint: '(no arguments — uses the approved plan in this conversation)'
---

Select the `implementer` agent before running this.

Precondition: a plan has been approved in this conversation. If not, stop and
say so.

1. **Branch** — `jira/<TICKET-KEY>-<short-slug>`.

2. **RED.** Write every test from the plan. Run only those tests. Show the
   failing output, and for each failure say in one line why it is the correct
   reproduction rather than a broken test.

   A failure that reads `assert 200 == 400` is RED. One that reads
   `ImportError` or `fixture not found` is a broken test — fix it and rerun
   before going further.

   If a test **passes** here, stop. Either it does not assert what the
   criterion says, or the behaviour already exists. Both need a human.

3. **GREEN.** The smallest change that satisfies the tests. Nothing else.

4. **Loop.** Targeted test → `pytest -q` → `npm run test:playwright`.
   On failure: read the actual output, diagnose, fix, rerun. Three attempts,
   then stop and report what you tried and what still fails.

5. **Commit** with the ticket key in the subject.

The rule that holds throughout: **never edit a test to reach green.** If a
test looks wrong, say which assertion and why, and stop. Changing it would
invalidate the only independent evidence this change works.
