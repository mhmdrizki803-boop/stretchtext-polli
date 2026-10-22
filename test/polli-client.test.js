import assert from "node:assert/strict";
import test from "node:test";
import pkg from "../pollinations-client.js";
const { API_URL, stretchText } = pkg;

test("stretchText posts to Pollinations with bearer key", async (t) => {
    let url = null, init = null;
    t.mock.method(globalThis, "fetch", async (u, i) => { url = u; init = i; return Response.json({ choices: [{ message: { content: "Expanded text" } }] }); });
    const out = await stretchText("Dense.", "sk_test", "deepseek/deepseek-v4-flash");
    assert.equal(out, "Expanded text");
    assert.equal(String(url), "https://gen.pollinations.ai/v1/chat/completions");
    assert.equal(new Headers(init.headers).get("authorization"), "Bearer sk_test");
    const body = JSON.parse(init.body);
    assert.equal(body.model, "deepseek/deepseek-v4-flash");
    assert.match(body.messages[1].content, /Dense\./);
});

test("stretchText surfaces non-200", async (t) => {
    t.mock.method(globalThis, "fetch", async () => new Response("no", { status: 429 }));
    await assert.rejects(() => stretchText("x", "k"), /429/);
});
