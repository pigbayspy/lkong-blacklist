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

const forum_filter = function (elements, blacklist)
{
    elements.filter(e => e.classList && e.classList.length > 0).forEach(e =>
    {
        if (e.classList.contains(posting))
        {
            let author = e.children[0].children[2].children[0].children[0].innerText;
            if (blacklist.has(author))
            {
                e.style.filter = blur_filter;
                e.style.cursor = pointer;
                $("a", e).toggleClass(black_list_class);
                e.addEventListener("click", p, true);
                e.addEventListener("dblclick", function ()
                {
                    $("a", e).toggleClass(black_list_class);
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
        else if (e.classList.contains(title))
        {
            let author = e.children[1].children[0].children[0].innerText;
            if (blacklist.has(author))
            {
                e.style.filter = blur_filter;
                e.addEventListener("click", p, true);
                $("a", e).toggleClass(black_list_class);
                e.addEventListener("dblclick", function ()
                {
                    $("a", e).toggleClass(black_list_class);
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
    });
};

const thread_filter = function (elements, blacklist)
{
    elements.filter(e => e.nodeType === Node.ELEMENT_NODE).forEach(e =>
    {
        if (e.parentElement && e.parentElement.id === "thefeed")
        {
            Array.prototype.forEach.call(e.children, d =>
            {
                if (d === e.firstElementChild || d === e.lastElementChild)
                {
                    return;
                }
                let author = d.children[1].children[0].children[0].innerText;
                if (blacklist.has(author))
                {
                    d.style.filter = blur_filter;
                    d.style.cursor = pointer;
                    $("a", d).toggleClass(black_list_class);
                    d.addEventListener("click", p, true);
                    d.addEventListener("dblclick", function ()
                    {
                        $("a", d).toggleClass(black_list_class);
                        if (d.style.filter.length === 0)
                        {
                            d.style.filter = blur_filter;
                            d.style.cursor = pointer;
                            d.addEventListener("click", p, true);
                        }
                        else
                        {
                            d.style.filter = null;
                            d.style.cursor = null;
                            d.removeEventListener("click", p, true);
                        }
                    });
                }
            });
        }
    });
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
        let callback = null;
        switch (window.location.pathname.split("/")[1])
        {
            case "forum":
            {
                callback = forum_filter;
                break;
            }
            case "thread":
            {
                callback = thread_filter;
                break;
            }
        }
        if (callback === null)
        {
            return;
        }
        list.forEach(m =>
        {
            if (m.type === "childList")
            {
                callback(Array.from(m.addedNodes), blacklist);
            }
        })
    });
    observer.observe(document, config);
});