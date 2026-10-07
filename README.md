# HPE Redfish-Style Agentic SDLC + Loop Engineering Lab — Starter Repository

A deliberately small FastAPI service used to demonstrate ticket-driven software delivery with Jira, GitHub, GitHub Copilot Agent mode, VS Code, Playwright API testing, CI/CD, and human approval gates.


## Core concept: Loop Engineering
This lab is deliberately more than “ask Copilot to code a Jira ticket.” The engineering objective is to design a bounded loop:

`TRIGGER -> GOAL -> ACT -> OBSERVE -> VERIFY -> ADJUST -> ... -> STOP / ESCALATE`

The most visible inner loop is HPELAB-102: Playwright reproduces the defect (RED), the agent observes the failure, diagnoses and edits, then re-runs until GREEN. The full outer-loop mode uses a Jira event/Automation rule to invoke the coding agent so a developer is no longer responsible for composing the next prompt at every stage.

See `loop/README.md` and `loop/loop-contract.yaml`.

## What is already implemented
- `GET /redfish/v1`
- `GET /redfish/v1/Systems`
- `GET /redfish/v1/Systems/1`
- `PATCH /redfish/v1/Systems/1` for `AssetTag`
- Python unit tests
- Playwright REST/API smoke tests
- GitHub Actions CI and an approval-ready deployment workflow

The starter intentionally contains the defect described in `jira/HPELAB-102-bug.md`. The enhancement in `jira/HPELAB-101-enhancement.md` is intentionally not implemented.

## Local setup

### Python service
```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Open API docs: `http://127.0.0.1:8000/docs`

### Unit tests
```bash
pytest -q
```

### Playwright API tests
```bash
npm install
npm run test:playwright
```

The Playwright configuration starts the FastAPI service automatically if `BASE_URL` is not set. These tests use Playwright's HTTP `request` fixture; no browser UI is required.

### Docker deployment
```bash
docker compose up -d --build
curl http://127.0.0.1:8000/health
```

## Agent connections
The repo contains `.vscode/mcp.json` for GitHub MCP and Atlassian Rovo MCP. Authenticate interactively in VS Code and keep permissions least-privilege.

## Classroom rule
Copilot may do engineering work, but a human must approve merge and deployment. See `.github/copilot-instructions.md`.
