---
name: coffee-product-pr-iteration
description: 'Create one incremental product-improvement iteration for the coffee brewing app and present it as a GitHub-style PR. Use when improving UX/UI clarity, user behavior outcomes, guidance features, or technical reliability without breaking the calm single-step ritual flow.'
argument-hint: 'Provide current friction, target metric, and preferred improvement area (UX/UI, behavior, features, or technical).'
user-invocable: true
---

# Coffee Product PR Iteration

## What This Skill Produces
- One concrete, incremental product improvement iteration.
- A complete GitHub-style PR writeup with mandatory sections.
- Changes that improve at least one target area while preserving product constraints.

## Composed Skills
- [Opportunity Selection](../coffee-improvement-opportunity-selection/SKILL.md)
- [Guardrails Check](../coffee-ritual-guardrails-check/SKILL.md)
- [PR Formatting](../coffee-pr-format-github/SKILL.md)

## When To Use
- You want a structured iteration instead of open-ended brainstorming.
- You need consistent PR outputs across repeated improvement cycles.
- You must preserve a calm, ritual-like, mobile-first brewing flow.

## Inputs
- Current issue or user friction point.
- Target improvement area: UX/UI, User Behavior, Features, or Performance/Technical.
- Optional metric signal: completion rate, drop-off point, onboarding conversion, timer reliability.

## Decision Logic
1. Pick exactly one primary improvement area and one secondary area at most.
2. If multiple opportunities compete, prioritize in this order:
   - Clarity of brewing steps
   - Reduced cognitive load
   - Faster time-to-first-brew
   - Emotional calmness
   - Flow consistency
3. Reject ideas that violate constraints:
   - Never break single-step-per-screen flow.
   - Never add clutter/dashboard-style complexity.
   - Never increase cognitive load.
   - Never deviate from the calm ritual experience.
4. Prefer small, testable improvements over broad redesigns.

## Iteration Procedure
1. Run [Opportunity Selection](../coffee-improvement-opportunity-selection/SKILL.md) to choose one primary target.
2. Identify the current behavior and the specific user-facing problem.
3. Define why the problem matters (user impact and product impact).
4. Choose the smallest meaningful change that improves at least one target area.
5. Implement using repository workflow rules:
   - Write a failing test for the behavior first.
   - Implement the minimum change to pass.
   - Refactor only after tests are green.
6. Run [Guardrails Check](../coffee-ritual-guardrails-check/SKILL.md) and resolve any rejects.
7. Produce the PR output in the exact structure below or use [PR Formatting](../coffee-pr-format-github/SKILL.md).

## Mandatory PR Output Format

### 1. PR Title
- Short
- Action-oriented
- Clear improvement focus

### 2. Summary
- What issue was found
- Why it matters
- What was improved

### 3. Changes Made
- UX changes
- UI changes
- Flow changes
- Feature additions/removals
- Technical improvements

### 4. Before vs After (Mandatory)
- Before: current behavior
- After: new behavior
- Why it is better
- User impact explanation

### 5. User Impact
- Usability
- Speed
- Clarity
- Engagement
- Completion rate

### 6. Optional Technical Notes
- State changes
- Architecture adjustments
- Component refactors
- Performance improvements

## Completion Checks
- At least one of the approved target areas is measurably improved.
- All hard constraints remain satisfied.
- Improvement is incremental, not a redesign.
- PR includes all mandatory sections, including Before vs After.
- Claims are concrete, user-focused, and justified (not speculative).

## Quick Prompt Examples
- Create one iteration to reduce hesitation in step instructions and output a full PR.
- Improve onboarding conversion by simplifying equipment check while preserving ritual calmness; output PR format.
- Improve timer accuracy feedback loops with minimal UI changes and present as GitHub-style PR.