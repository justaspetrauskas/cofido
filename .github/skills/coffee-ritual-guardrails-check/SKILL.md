---
name: coffee-ritual-guardrails-check
description: 'Validate proposed coffee app iterations against ritual UX constraints and quality standards. Use before implementation and before PR finalization.'
argument-hint: 'Provide proposed change and expected user impact.'
user-invocable: true
---

# Coffee Ritual Guardrails Check

## What This Skill Produces
- A pass/fail guardrail decision.
- A concise list of violations, if any.
- Required adjustments to make the iteration acceptable.

## Hard Constraints (Must Never Break)
- Single-step-per-screen flow.
- Minimal cognitive load.
- Calm ritual experience.
- No clutter or dashboard-style UI.
- No unnecessary complexity.

## Procedure
1. Summarize the proposed change in one sentence.
2. Evaluate against each hard constraint.
3. If any constraint fails, mark as reject and propose smallest fix.
4. If all pass, run quality checks and produce a readiness decision.

## Quality Standard
- Concrete and user-focused, not speculative.
- Clearly justified with explicit problem-to-solution logic.
- Preserves flow consistency and emotional calmness.
- Incremental scope suitable for one PR iteration.

## Output Template
- Guardrail status: Pass | Reject
- Constraint review:
- Quality review:
- Required adjustments (if reject):
- Final readiness: