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
                    let class_list = e.classList;
                    if (class_list && class_list.length > 0)
                    {
                        if (class_list.contains(posting))
                        {
                            let author = e.children[0].children[2].children[0].children[0].innerText;
                            if (blacklist.has(author))
                            {
                                e.style.filter = blur_filter;
                                e.style.cursor = pointer;
                                $(e, "a").toggleClass(black_list_class);
                                e.addEventListener("click", p, true);
                                e.addEventListener("dblclick", function ()
                                {
                                    $(e, "a").toggleClass(black_list_class);
                                    if (e.style.filter.length === 0)
                                    {
                                        e.style.filter = blur_filter;
                                        e.style.cursor = pointer;
                                        e.addEventListener("click", p, true);
                                    }
                                    else
                                    {
                                        e.style.filter = null;
                                        e.style.cursor = null;
                                        e.removeEventListener("click", p, true);
                                    }
                                });
                            }
                        }
                        else if (class_list.contains(title))
                        {
                            let author = e.children[1].children[0].children[0].innerText;
                            if (blacklist.has(author))
                            {
                                e.style.filter = blur_filter;
                                e.addEventListener("click", p, true);
                                $(e, "a").toggleClass(black_list_class);
                                e.addEventListener("dblclick", function ()
                                {
                                    $(e, "a").toggleClass(black_list_class);
                                    if (e.style.filter.length === 0)
                                    {
                                        e.style.filter = blur_filter;
                                        e.addEventListener("click", p, true);
                                    }
                                    else
                                    {
                                        e.style.filter = null;
                                        e.removeEventListener("click", p, true);
                                    }
                                })
                            }
                        }
                    }
                });
            }
        });
    });
    observer.observe(document, config);
});