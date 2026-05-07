---
name: coffee-pr-format-github
description: 'Format a coffee product iteration as a GitHub-style PR with mandatory sections and clear before-vs-after impact. Use when finalizing iteration output.'
argument-hint: 'Provide problem, implemented change, and user impact evidence.'
user-invocable: true
---

# Coffee PR Format (GitHub)

## What This Skill Produces
- One complete GitHub-style PR writeup.
- Mandatory sections in consistent order.
- Clear before-vs-after and user impact framing.
- A branch name that reflects exactly what is being updated.

## Branch Naming Convention
- Format: `type/scope-short-change`
- Allowed `type`: `feat`, `fix`, `ux`, `perf`, `refactor`, `test`, `docs`
- Keep `scope-short-change` specific to the updated behavior or component.
- Use lowercase kebab-case and avoid vague names like `update`, `changes`, or `improvements`.

## Branch Name Examples
- `ux/brew-step-clarity-copy`
- `feat/timer-haptic-feedback`
- `perf/timer-drift-correction`
- `fix/step-transition-double-tap`

## Mandatory Structure

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

## Procedure
1. Convert the implemented iteration into the sections above.
2. Keep claims concrete and evidence-oriented.
3. Ensure before-vs-after is explicit and behavior-centered.
4. Generate a branch name using the convention above based on what changed.
5. Verify all mandatory sections exist before final output.

## PR Preamble
- Branch name:

## Completion Checks
- GitHub-style PR structure is complete.
- Before-vs-after section is present and specific.
- User impact is explicit and non-speculative.
- Branch name clearly maps to the actual update scope.
