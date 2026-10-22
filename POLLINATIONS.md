# Pollinations Integration (evidence)

This extension uses the **Pollinations text chat API** to generate stretchtext.

Provider: [Pollinations](https://pollinations.ai) · API base: `https://gen.pollinations.ai`

## Code path

`src/content.js` — function `stretch()` — issues the Pollinations request:

```js
const res = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  body: JSON.stringify({
    model, // Pollinations text model (default deepseek/deepseek-v4-flash)
    messages: [
      { role: "system", content: "You expand dense passages into stretchtext..." },
      { role: "user", content: StretchCore.buildStretchPrompt(text) },
    ],
  }),
});
```

- `manifest.json` declares `host_permissions: ["https://gen.pollinations.ai/*"]`.
- `src/popup.js` stores the user's Pollinations API key (from https://enter.pollinations.ai/keys) in `chrome.storage.sync`.
- Every Stretch action calls the Pollinations endpoint with the reader's key — Bring Your Own Pollen.

## Raw files

- [src/content.js](https://github.com/mhmdrizki803-boop/stretchtext-polli/blob/main/src/content.js)
- https://raw.githubusercontent.com/mhmdrizki803-boop/stretchtext-polli/main/src/content.js
