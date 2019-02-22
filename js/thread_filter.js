//observer setting
const config = {
    attributes: false,
    childList: true,
    subtree: true,
    characterData: false
};
//ajax param
const param = {
    "mod": "ajax",
    "action": "getblack"
};
//blur filter
const blur_filter = "blur(5px)";
//black list class
const black_list_class = "blacklist";
// cursor style
const pointer = "pointer";
//主题栏 class
const title = "onefeed";
//帖子 class
const posting = "st_post";
//functions
const p = function (event)
{
    event.stopPropagation();
    event.preventDefault();
    return false;
};

$.get("/setting/index.php", param).then(function (result)
{
    let element = document.createElement("html");
    element.innerHTML = result;
    let elements = element.querySelectorAll("table>tbody>tr>td>a");
    return new Set(Array.prototype.map.call(elements, e => e.innerText));
}).then(function (blacklist)
{
    let observer = new MutationObserver(function (list)
    {
        list.forEach(m =>
        {
            if (m.type === "childList")
            {
                let elements = m.addedNodes;
                elements.forEach(e =>
                {
                    console.log(e);
                });
            }
        });
    });
    observer.observe(document, config);
});