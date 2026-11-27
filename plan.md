# Plan — Issue #1: Add search functionality to the task list

Link: https://github.com/gittylumos/taskflow-tracker/issues/1
Status: **Ready for Review — Awaiting PR Approval**

## 1. Problem & requirements
Users must browse the board manually to find a task. Add keyword search over task title and description,
live-updating, case-insensitive, partial match, clearable, with an empty state, working with existing filters.

## 2. Acceptance criteria
- [x] Search by keyword; results update as the user types
- [x] Partial matches; case-insensitive; title AND description
- [x] Clearing restores the full list
- [x] Empty state when nothing matches
- [x] Input follows existing UI patterns
- [x] Existing functionality unaffected (assignee/priority filters, drag & drop)
- [x] Tests added

## 3. Repository context
- Next.js 16 / React 19 / Tailwind 4 / shadcn (base-ui) / zustand. Kanban board, no list view: "task list" = the board.
- `components/layout/app-shell.tsx` already has a search `Input` (title-only, no clear, no empty state) and the
  `visible` filter combining assignee + priority + query.
- No test runner or test script exists.

## 4. Approach
1. Extract filtering into a pure, typed helper `lib/search.ts` (`matchesQuery`, `filterTasks`) — trims the query,
   case-insensitive substring match on title + description, combined with assignee/priority filters.
2. In `app-shell.tsx`: use the helper, add a clear (X) button to the existing search input (shown only when
   non-empty, Escape also clears), and show an empty state in place of the board when filters/search match nothing,
   with a "Clear search" action.
3. Tests: `lib/search.test.ts` using Node's built-in `node:test` (Node 22 strips TS types natively) + `npm test`
   script. Chosen over vitest to avoid adding dependencies.

Reasoning: reuses the existing input rather than duplicating it; a pure helper makes behaviour testable without a
DOM test stack; minimal footprint.

## 5. Files affected
- `lib/search.ts` (new), `lib/search.test.ts` (new)
- `components/layout/app-shell.tsx` (modified)
- `package.json` (add `test` script only), `tsconfig.json` (`allowImportingTsExtensions` so the test file typechecks)
- `plan.md` (this file)

## 6. Checklist
- [x] Analyze repo
- [x] Write plan
- [x] `lib/search.ts` + tests (red → green)
- [x] Wire into `app-shell.tsx`: clear button, empty state
- [x] `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`
- [x] Manual browser check (Playwright screenshot)
- [x] Review diff, commit to branch, push

## 7. Risks / assumptions
- Assumption: "task list" == kanban board; the search stays in the header where it already is ("above the task list").
- Empty state only when there are tasks overall but none match (the board's own per-column "No tasks" remains otherwise).
- Searching the assignee name is out of scope (not requested).
- Risk: `tsc`/Node type stripping requires `.ts` file with only type imports — keep helper dependency-free.

## 8. Open questions / blockers
None.
