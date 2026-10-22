import assert from "node:assert/strict";
import test from "node:test";
import pkg from "../src/stretch-core.js";
const { buildStretchPrompt, cleanResponse, isValidSelection } = pkg;

test("buildStretchPrompt wraps the passage", () => {
    const p = buildStretchPrompt("This is dense.");
    assert.ok(p.includes("three times its length"));
    assert.ok(p.includes("This is dense."));
    assert.ok(p.endsWith("This is dense."));
});

test("cleanResponse strips code fences", () => {
    assert.equal(cleanResponse("```markdown\nHello\n```"), "Hello");
    assert.equal(cleanResponse("```\nabc```"), "abc");
    assert.equal(cleanResponse("plain text"), "plain text");
});

test("isValidSelection bounds length", () => {
    assert.equal(isValidSelection("abc"), true);
    assert.equal(isValidSelection("ab"), false);
    assert.equal(isValidSelection("x".repeat(700)), false);
    assert.equal(isValidSelection("   "), false);
    assert.equal(isValidSelection(null), false);
});
