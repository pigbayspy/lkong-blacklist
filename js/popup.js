let filter_count = 0;
let mode_init = false;

window.onload = function ()
{
    const mode = document.getElementById("mode");
    const save = document.getElementById("save_settings");
    const count = document.getElementById("filter_count");

    chrome.storage.local.get({
        "FILTER_MODE": mode_init,
        "FILTER_COUNT": filter_count
    }, result =>
    {
        mode_init = result["FILTER_MODE"];
        filter_count = result["FILTER_COUNT"];
        mode.checked = mode_init;
        count.innerText = filter_count;
    });

    save.addEventListener("click", () =>
    {
        let m = mode.checked;
        chrome.storage.local.set({
            "FILTER_MODE": m
        });
    });

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse)
    {
        if (message["FILTER_COUNT"])
        {
            filter_count = message["FILTER_COUNT"];
            count.innerText = filter_count;
        }
    })
};