# HPELAB-101 — Enhancement

**Summary:** Add Redfish-style `ComputerSystem.Reset` action

**Issue Type:** Story / Enhancement  
**Priority:** Medium  
**Labels:** `agentic-lab`, `redfish`, `enhancement`, `agent-ready`

## Business context
Remote platform-management clients need to change the power state of the lab server through a Redfish-style action rather than modifying `PowerState` directly.

## Requirement
Add the action endpoint:

`POST /redfish/v1/Systems/1/Actions/ComputerSystem.Reset`

Request:
```json
{ "ResetType": "ForceOff" }
```

Supported values for this lab are:
- `On`
- `ForceOff`
- `GracefulRestart`

## Acceptance criteria
1. `GET /redfish/v1/Systems/1` contains an `Actions` section advertising `#ComputerSystem.Reset`, its target URI, and `ResetType@Redfish.AllowableValues` containing the three supported values.
2. `ResetType=ForceOff` returns HTTP `204` and a subsequent GET reports `PowerState="Off"`.
3. `ResetType=On` returns HTTP `204` and a subsequent GET reports `PowerState="On"`.
4. `ResetType=GracefulRestart` returns HTTP `204`, leaves the system in `PowerState="On"`, and records `Oem.Hpe.LastResetType="GracefulRestart"`.
5. An unsupported `ResetType` returns HTTP `400` with a structured Redfish-style error payload.
6. Existing GET and PATCH behavior continues to work.
7. Automated tests cover the happy paths and invalid input. Both Python unit tests and Playwright API tests must pass.

## Non-functional constraints
- In-memory state is acceptable for the lab.
- Do not introduce a database.
- Keep implementation small and readable.
- Do not merge or deploy without human approval.

## Definition of Done
- Code + tests committed on a ticket-named branch.
- CI green.
- PR opened with this Jira key and test evidence.
- Human reviewer approves and merges.
- Jira updated with PR link and final outcome.
