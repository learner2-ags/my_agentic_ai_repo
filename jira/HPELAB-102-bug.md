# HPELAB-102 — Bug

**Summary:** PATCH silently accepts read-only `SerialNumber` property

**Issue Type:** Bug  
**Priority:** High  
**Labels:** `agentic-lab`, `redfish`, `bug`, `playwright`, `agent-ready`

## Problem statement
A Redfish client can send a PATCH containing the read-only `SerialNumber` property. The service currently returns HTTP `200` instead of rejecting the request. Silently ignoring invalid fields can hide client defects and is unsafe for a management API.

## Steps to reproduce
```bash
curl -i -X PATCH http://127.0.0.1:8000/redfish/v1/Systems/1 \
  -H "Content-Type: application/json" \
  -d '{"SerialNumber":"TAMPERED-SN"}'
```

### Current behavior
HTTP `200`; the unsupported/read-only property is silently ignored.

### Expected behavior
HTTP `400` with a Redfish-style error such as:
```json
{
  "error": {
    "code": "Base.1.0.GeneralError",
    "message": "A general error has occurred.",
    "@Message.ExtendedInfo": [
      {
        "MessageId": "Base.1.0.PropertyNotWritable",
        "MessageArgs": ["SerialNumber"],
        "Message": "The property SerialNumber is read-only."
      }
    ]
  }
}
```

## Acceptance criteria
1. **Before changing application code**, create a Playwright API regression test that reproduces the defect and run it to demonstrate the test fails for the expected HTTP-status/payload reason.
2. PATCH with `SerialNumber` returns HTTP `400` and contains `MessageId="Base.1.0.PropertyNotWritable"` plus `MessageArgs=["SerialNumber"]`.
3. PATCH with any other unsupported property also returns HTTP `400`; the response identifies the offending property.
4. Valid PATCH of `AssetTag` still returns HTTP `200` and updates the value.
5. The read-only `SerialNumber` value remains unchanged after the rejected request.
6. All existing unit tests and Playwright tests pass after the fix.
7. The PR description includes the observed red test before the fix and green test evidence after the fix.

## Agent instruction / safety boundary
The agent may diagnose, edit, test, commit, push, and open a PR. It must not merge the PR, bypass CI, or trigger deployment. Those are human-gated steps.
