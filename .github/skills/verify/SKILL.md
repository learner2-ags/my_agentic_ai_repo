---
name: verify
description: Run the full verification suite for this repo and report what passed, what failed, and the exact failing assertion. Use after any change, and before opening a PR.
argument-hint: '[unit | playwright | all]   default all'
---

Scope: **$ARGUMENTS** (default: all)

```
pytest -q                     unit / API
npm run test:playwright       Playwright API tests
```

Playwright auto-starts uvicorn unless `BASE_URL` is set. Do not start the
server separately first — the port collision looks like a test failure and
sends you diagnosing the wrong thing.

Report:

- **per layer**: passed / failed, with counts
- **for each failure**: the test name, the expected value and the actual value.
  Not "a test failed" — the assertion, as the runner printed it
- **verdict**: green, or the shortest statement of what is broken

Do not fix anything from this skill. Reporting and fixing are different steps,
and mixing them is how a verification run quietly becomes a code change.

Your local result is a claim. CI re-runs everything independently on the PR,
and the PR checks are the evidence a reviewer actually trusts.
