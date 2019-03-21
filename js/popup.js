let mode_init = false;

window.onload = function ()
{
    const mode = document.getElementById("mode");
    const save = document.getElementById("save_settings");

    chrome.storage.local.get({
        "FILTER_MODE": mode_init,
    }, result =>
    {
        mode_init = result["FILTER_MODE"];
        mode.checked = mode_init;
    });

    save.addEventListener("click", () =>
    {
        let m = mode.checked;
        chrome.storage.local.set({
            "FILTER_MODE": m
        });
    });
};