window.onload = function ()
{
    const mode = document.getElementById("mode");
    const blur_range = document.getElementById("blur_range");
    const range_container = document.getElementById("blur_range_container");
    const save = document.getElementById("save_settings");

    mode.addEventListener("change", function ()
    {
        $(range_container).toggleClass("scale-out");
    });

    // chrome.storage.sync.get({"BLUR": true}, function (result)
    // {
    //     console.log(result);
    // });
    // chrome.storage.sync.get({"BLUR_SCALE":5},function (result)
    // {
    //     console.log(result);
    // });
};