---
name: coffee-feature-usability-review
description: 'Evaluate usability of existing coffee app features and recommend keep, iterate, or remove decisions. Use when auditing feature value, reducing clutter, and prioritizing simplification.'
argument-hint: 'Provide feature list, user pain points, and any usage signals.'
user-invocable: true
---

# Coffee Feature Usability Review

## What This Skill Produces
- A feature-by-feature usability assessment.
- A decision per feature: Keep, Iterate, or Remove.
- Prioritized recommendations with rationale and expected impact.

## Review Criteria
- Task success: Does this feature help users complete a brew step correctly?
- Cognitive load: Does it simplify or add mental overhead?
- Discoverability: Can users find and understand it without training?
- Error profile: Does it prevent mistakes or introduce them?
- Ritual fit: Does it preserve calm, one-step-per-screen flow?
- Evidence: Is there usage/adoption or observed behavior supporting it?

## Decision Rules
1. Keep when feature is clear, used, and supports core flow.
2. Iterate when feature is valuable but causes friction, confusion, or errors.
3. Remove when feature adds complexity, has low value, or conflicts with ritual constraints.
4. Prefer removal over adding compensating UI if simplification solves the issue.

## Procedure
1. List candidate features to review.
2. Score each feature against review criteria (High/Medium/Low or 1-5).
3. Identify top usability risks and cognitive-load hotspots.
4. Assign decision: Keep, Iterate, or Remove.
5. Propose smallest next action:
   - Keep: no change, monitor.
   - Iterate: one concrete improvement experiment.
   - Remove: safe deprecation plan and migration note.
6. Output prioritized actions for the next PR iteration.

## Output Template
- Feature:
- Current user problem:
- Criteria summary:
- Decision: Keep | Iterate | Remove
- Recommendation:
- Expected user impact:
- Suggested branch name:

## Completion Checks
- Every reviewed feature has a decision and rationale.
- Recommendations are incremental and testable.
- Suggestions respect one-step-per-screen and calm ritual UX.
- At least one low-value or high-friction item is considered for simplification/removal.
