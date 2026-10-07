# Loop Engineering Contract

This directory makes the **control loop** explicit. It is a teaching artifact: Copilot does not automatically consume `loop-contract.yaml` unless your orchestration wiring passes it to the agent.

## The central distinction
- **Prompt engineering:** a human decides and types each next instruction.
- **Agentic engineering:** an agent can execute multiple tool actions inside a delegated task.
- **Loop engineering:** triggers, verifiers, state, stopping rules and escalation rules decide what happens next. The human is reserved for exceptions and approval authority.

## Three loops in this lab
1. **Engineering loop:** edit -> test -> observe -> diagnose -> adjust -> test.
2. **PR feedback loop:** PR/CI/reviewer observation -> agent change -> re-verify.
3. **Outer orchestration loop:** Jira event -> coding-agent run -> verification/evidence -> complete or escalate.

See `loop-contract.yaml` and `state.example.json`.
