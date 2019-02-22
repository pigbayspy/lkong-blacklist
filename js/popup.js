const scale_class = "scale-out";

window.onload = function ()
{
    let mode_init = false;
    let blur_init = 7;

    const mode = document.getElementById("mode");
    const blur_range = document.getElementById("blur_range");
    const range_container = document.getElementById("blur_range_container");
    const save = document.getElementById("save_settings");

    blur_range.value = blur_init;
    mode.checked = mode_init;
    if (!mode_init)
    {
        range_container.classList.add(scale_class);
    }

    mode.addEventListener("change", () => $(range_container).toggleClass(scale_class));

    // chrome.storage.sync.get({"BLUR": true}, function (result)
    // {
    //     console.log(result);
    // });
    // chrome.storage.sync.get({"BLUR_SCALE":5},function (result)
    // {
    //     console.log(result);
    // });

    save.addEventListener("click", () =>
    {
        let blur_value = blur_range.value;
        let m = mode.checked;
    });
};