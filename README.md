# StretchText Polli

[![Made with pollinations.ai](https://raw.githubusercontent.com/pollinations/pollinations/main/packages/ui/src/brand/badge-made-with.svg)](https://pollinations.ai/?ref=badge)

A browser extension that turns **any web page into stretchtext** — the 1967 Ted Nelson idea, made cheap by generated text. Select a dense passage, click **Stretch**, and it expands in place to about three times its length. Click the summary to collapse it back.

Built on [Pollinations](https://pollinations.ai) text models. Readers pay with their **own Pollen** (Bring Your Own Pollen) — no extension servers, no hidden billing.

## Install (unpacked)

1. Download or clone this repository.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this folder.
5. Pin the extension, click the icon, and paste your **Pollinations API key** from [enter.pollinations.ai/keys](https://enter.pollinations.ai/keys).
6. Optional: change the model (default `deepseek/deepseek-v4-flash` — see the [text model list](https://gen.pollinations.ai/text/models)).

## Use

1. On any page, select a sentence or short passage (3–600 characters).
2. Click the **Stretch** button that floats below the selection.
3. The expanded passage appears as a collapsible block right where you selected it.
4. Click the **Stretched** summary to toggle it.


## Pollinations integration (verified)

The extension calls the Pollinations text chat API directly. Code path: [`src/content.js`](src/content.js), function `stretch()`:

```js
const res = await fetch("https://gen.pollinations.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
        model, // Pollinations text model, default deepseek/deepseek-v4-flash
        messages: [
            { role: "system", content: "You expand dense passages into stretchtext..." },
            { role: "user", content: StretchCore.buildStretchPrompt(text) },
        ],
        n: 1,
    }),
});
```

Users paste a key from [enter.pollinations.ai/keys](https://enter.pollinations.ai/keys) in the popup, and each Stretch request bills their own Pollen (Bring Your Own Pollen). Settings: [`src/popup.js`](src/popup.js), storage via `chrome.storage.sync`.

## Demo

Open [demo.html](demo.html) for a static preview of the UI.

## How it works

- `src/stretch-core.js` — pure prompt/cleanup logic (shared with tests).
- `src/content.js` — selection button, in-place expansion, Pollinations API call.
- `src/popup.js` — API key and model settings (stored in `chrome.storage.sync`).

Calls go to `https://gen.pollinations.ai/v1/chat/completions` with your key as the bearer token, so each read pays with the reader's own Pollen.

## Development

```bash
node --test test/stretch.test.js
```

## License

MIT

## Credit

[![Made with pollinations.ai](https://raw.githubusercontent.com/pollinations/pollinations/main/packages/ui/src/brand/badge-made-with.svg)](https://pollinations.ai/?ref=badge)
