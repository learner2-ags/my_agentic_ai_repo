---
name: review
description: Review the current diff and its tests before opening a PR — acceptance-criteria coverage, test integrity, scope discipline and risk. Read-only. Use after implementation and before shipping.
argument-hint: '(no arguments — reviews the current branch diff)'
---

Select the `reviewer` agent before running this.

Read `git diff` against the base branch in full, then the test files it
touched, then the ticket. Report on all six, explicitly:

1. **Coverage** — AC by AC, which test covers it. List any AC with none.
2. **Test integrity** — were any assertions weakened, loosened, skipped or
   deleted? Quote before and after. This is the check that matters most: an
   agent can reach green by changing the test instead of the code, and every
   other check in the pipeline reads the tests as ground truth.
3. **Assertion strength** — does the test fail if the behaviour regresses?
   Asserting a status code but not the error body is weaker than it looks.
4. **Scope** — anything touched that the ticket did not call for.
5. **Risk** — breaking changes to existing routes or error shapes.
6. **RED evidence** — is the before/after output specific and credible?

End with **ready for PR** or **not ready**, and if not ready, the shortest
list of what must change.

Report only. Do not fix what you find — the point of this step is a second
opinion, and an agent that fixes its own findings isn't one.
