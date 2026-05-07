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
4. Verify all mandatory sections exist before final output.

## Completion Checks
- GitHub-style PR structure is complete.
- Before-vs-after section is present and specific.
- User impact is explicit and non-speculative.
