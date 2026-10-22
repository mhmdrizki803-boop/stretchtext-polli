const KEY = "stretchtext_settings";
document.getElementById("save").addEventListener("click", () => {
    const apiKey = document.getElementById("key").value.trim();
    const model = (document.getElementById("model").value.trim() || "deepseek/deepseek-v4-flash");
    chrome.storage.sync.set({ [KEY]: { apiKey, model } }, () => {
        document.getElementById("msg").textContent = "Saved ✓";
        setTimeout(() => { window.close(); }, 800);
    });
});
chrome.storage.sync.get(KEY, (v) => {
    const s = v[KEY] || {};
    if (s.apiKey) document.getElementById("key").value = s.apiKey;
    document.getElementById("model").value = s.model || "deepseek/deepseek-v4-flash";
});
