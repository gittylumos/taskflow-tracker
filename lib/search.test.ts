import { test } from "node:test";
import assert from "node:assert/strict";
import { filterTasks, matchesQuery } from "./search.ts";
import type { Task } from "./types.ts";

const task = (o: Partial<Task>): Task => ({
  id: "x", title: "", description: "", assigneeId: null, priority: "Low", due: null, status: "todo", ...o,
});
const tasks: Task[] = [
  task({ id: "1", title: "Fix login bug", description: "Users cannot sign in", assigneeId: "a", priority: "Urgent" }),
  task({ id: "2", title: "Draft roadmap", description: "Quarterly PLANNING doc", assigneeId: "b", priority: "High" }),
  task({ id: "3", title: "Review copy", assigneeId: null, priority: "Urgent" }),
];
const ids = (ts: Task[]) => ts.map((t) => t.id);
const none = { assignee: "all", priority: "all" };

test("empty / whitespace query matches everything", () => {
  assert.deepEqual(ids(filterTasks(tasks, { ...none, query: "" })), ["1", "2", "3"]);
  assert.deepEqual(ids(filterTasks(tasks, { ...none, query: "   " })), ["1", "2", "3"]);
});
test("matches title, case-insensitively, partially", () => {
  assert.deepEqual(ids(filterTasks(tasks, { ...none, query: "LOGI" })), ["1"]);
});
test("matches description", () => {
  assert.deepEqual(ids(filterTasks(tasks, { ...none, query: "planning" })), ["2"]);
  assert.equal(matchesQuery(tasks[0], "sign in"), true);
});
test("no matches returns empty list", () => {
  assert.deepEqual(filterTasks(tasks, { ...none, query: "zzz" }), []);
});
test("trims surrounding whitespace in the query", () => {
  assert.deepEqual(ids(filterTasks(tasks, { ...none, query: "  roadmap " })), ["2"]);
});
test("combines with assignee and priority filters", () => {
  assert.deepEqual(ids(filterTasks(tasks, { query: "", assignee: "none", priority: "all" })), ["3"]);
  assert.deepEqual(ids(filterTasks(tasks, { query: "o", assignee: "all", priority: "Urgent" })), ["1", "3"]);
  assert.deepEqual(ids(filterTasks(tasks, { query: "copy", assignee: "a", priority: "all" })), []);
});
