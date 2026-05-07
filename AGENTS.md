<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repository agent guide

All coding agents working in this repository must use a test-driven workflow by default.

## Core workflow

1. Start with a failing test that describes the desired behavior.
2. Run the smallest relevant test scope and confirm it fails for the expected reason.
3. Implement the minimum production change needed to make the test pass.
4. Refactor only after the test is green.
5. Re-run the affected tests, then run the broader relevant validation for the touched area.

## TDD rules

- Do not ship behavior changes without automated test coverage for that behavior.
- When fixing a bug, add a regression test first.
- Prefer small, focused tests over broad integration coverage unless the behavior crosses boundaries.
- Keep test names behavior-oriented and explicit about the expected outcome.
- Avoid rewriting large areas of code to satisfy a test when a smaller change would work.
- If a test framework or helper is missing for the task, add it before implementing the feature itself.

## Current project commands

- `npm run lint`
- `npm run build`

## Testing expectations

- If the repository does not yet contain a test runner for the area being changed, the first implementation step is to add the minimal testing setup needed for TDD.
- For UI behavior, prefer component or integration tests close to user-visible behavior.
- For pure logic, prefer fast unit tests.

## Next.js guidance

- Follow App Router conventions already used in this repository.
- Check the local Next.js docs in `node_modules/next/dist/docs/` before introducing framework-specific patterns.
