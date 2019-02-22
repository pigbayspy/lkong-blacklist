const scale_class = "scale-out";
let mode_init = false;
let blur_init = 5;
chrome.storage.local.get({
    "FILTER_MODE": mode_init,
    "BLUR_SCALE": blur_init
}, function (result)
{
    mode_init = result["FILTER_MODE"];
    blur_init = result["BLUR_SCALE"];
    console.log("query");
    console.log(mode_init);
    console.log(blur_init);
});

window.onload = function ()
{
    const mode = document.getElementById("mode");
    const blur_range = document.getElementById("blur_range");
    const range_container = document.getElementById("blur_range_container");
    const save = document.getElementById("save_settings");

    console.log("init");
    console.log(mode_init);
    console.log(blur_init);

    blur_range.value = blur_init;
    mode.checked = mode_init;
    if (!mode_init)
    {
        range_container.classList.add(scale_class);
    }

    mode.addEventListener("click", () =>
    {
        if (range_container.classList.contains(scale_class))
        {
            range_container.classList.remove(scale_class);
        }
        else
        {
            range_container.classList.add(scale_class);
        }
    });

    save.addEventListener("click", () =>
    {
        let blur_value = blur_range.value;
        let m = mode.checked;
        chrome.storage.local.set({
            "FILTER_MODE": m,
            "BLUR_SCALE": blur_value
        });
    });
};