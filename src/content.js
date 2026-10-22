/* StretchText Polli content script */
(() => {
    const STORAGE_KEY = "stretchtext_settings";
    const POPUP_CSS = `
      .polli-stretch-btn {
        position: absolute; z-index: 2147483647; display: inline-flex; align-items: center; gap: 4px;
        font: 600 12px/1 system-ui, sans-serif; color: #fff; background: #4c1d95; border: none;
        border-radius: 6px; padding: 6px 10px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,.25);
      }
      .polli-stretch-btn:hover { background: #6d28d9; }
      .polli-stretch-details { margin: 8px 0; border-left: 3px solid #a78bfa; background: #f5f3ff; padding: 0 12px; border-radius: 4px; }
      .polli-stretch-details summary { cursor: pointer; font-weight: 700; color: #4c1d95; padding: 6px 0; user-select: none; }
      .polli-stretch-details p { margin: 0 0 8px; line-height: 1.6; }
      .polli-stretch-err { color: #dc2626; font-size: 12px; margin-left: 8px; }
    `;

    let btn = null;

    function injectStyle() {
        if (document.getElementById("polli-stretch-style")) return;
        const style = document.createElement("style");
        style.id = "polli-stretch-style";
        style.textContent = POPUP_CSS;
        (document.head || document.documentElement).appendChild(style);
    }

    function getSettings() {
        return new Promise((resolve) => {
            try {
                chrome.storage.sync.get(STORAGE_KEY, (v) => resolve(v[STORAGE_KEY] || {}));
            } catch {
                resolve({});
            }
        });
    }

    function floatButton(rect) {
        if (btn) btn.remove();
        btn = document.createElement("button");
        btn.className = "polli-stretch-btn";
        btn.textContent = "Stretch";
        btn.style.left = Math.max(4, rect.left + window.scrollX) + "px";
        btn.style.top = rect.bottom + window.scrollY + 6 + "px";
        document.documentElement.appendChild(btn);
        return btn;
    }

    async function stretch(text) {
        const settings = await getSettings();
        const key = settings.apiKey || "";
        if (!key) {
            return "Open the StretchText Polli popup and add your Pollinations API key (enter.pollinations.ai/keys).";
        }
        try {
            return await PolliClient.stretchText(text, key, settings.model);
        } catch (err) {
            return err.message || "Pollinations request failed.";
        }
    }

    function insertStretch(selection) {
        if (btn) btn.remove();
        const summary = document.createElement("details");
        summary.className = "polli-stretch-details";
        const head = document.createElement("summary");
        head.textContent = "Stretched";
        const body = document.createElement("p");
        body.textContent = "…";
        summary.appendChild(head);
        summary.appendChild(body);
        selection.collapseToEnd();
        selection.insertNode(summary);
        summary.scrollIntoView({ block: "nearest" });
        stretch(selection.toString()).then((text) => {
            body.textContent = text;
        }).catch((err) => {
            body.textContent = "Failed: " + err.message;
        });
    }

    document.addEventListener("mouseup", async (e) => {
        const sel = window.getSelection();
        const text = sel ? sel.toString() : "";
        if (!text || !StretchCore.isValidSelection(text)) {
            if (btn) btn.remove();
            return;
        }
        const range = sel.getRangeAt(0).getBoundingClientRect();
        const b = floatButton(range);
        b.addEventListener("click", () => {
            const sel2 = window.getSelection();
            if (sel2 && sel2.toString()) insertStretch(sel2);
        });
    });

    document.addEventListener("scroll", () => { if (btn) btn.remove(); }, { passive: true });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && btn) btn.remove(); });

    injectStyle();
})();
