/**
 * Pure stretch-text logic, shared by the browser content script and Node tests.
 * Works in both environments via conditional exports.
 */
(function (root, factory) {
    const api = factory();
    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    } else {
        root.StretchCore = api;
    }
})(typeof self !== "undefined" ? self : globalThis, function () {
    const MIN_SELECTION = 3;
    const MAX_SELECTION = 600;

    function buildStretchPrompt(text) {
        return (
            "Expand this passage to about three times its length. Keep the exact meaning, " +
            "add natural concrete detail, mild examples, and keep the register of the original. " +
            "Do not add a preamble, do not wrap it in quotes, output only the expanded passage:\n\n" +
            text
        );
    }

    function cleanResponse(text) {
        let t = String(text || "").trim();
        if (t.startsWith("```")) {
            t = t.replace(/^```[a-zA-Z]*\n?/, "").replace(/```\s*$/, "").trim();
        }
        return t;
    }

    function isValidSelection(sel) {
        if (!sel) return false;
        const s = String(sel).trim();
        return s.length >= MIN_SELECTION && s.length <= MAX_SELECTION;
    }

    return { MIN_SELECTION, MAX_SELECTION, buildStretchPrompt, cleanResponse, isValidSelection };
});
