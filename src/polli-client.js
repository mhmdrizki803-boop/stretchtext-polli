/**
 * Minimal Pollinations API client used by the extension.
 * https://gen.pollinations.ai — Bring Your Own Pollen.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    } else {
        root.PolliClient = api;
    }
})(typeof self !== "undefined" ? self : globalThis, function () {
    const G = typeof self !== "undefined" ? self : globalThis;
    const API_URL = "https://gen.pollinations.ai/v1/chat/completions";

    async function stretchText(text, apiKey, model) {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model || "deepseek/deepseek-v4-flash",
                messages: [
                    { role: "system", content: "You expand dense passages into stretchtext: longer, readable, same meaning, no preamble." },
                    { role: "user", content: G.StretchCore ? G.StretchCore.buildStretchPrompt(text) : text },
                ],
                n: 1,
            }),
        });
        if (!res.ok) throw new Error(`Pollinations API HTTP ${res.status}`);
        const data = await res.json();
        const out = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (out === undefined || out === null) throw new Error("Pollinations empty response");
        return G.StretchCore ? G.StretchCore.cleanResponse(out) : out;
    }

    return { API_URL, stretchText };
});
