//observer setting
const config = {
    attributes: false,
    childList: true,
    subtree: true,
    CharacterData: false
};
//blur filter
const blur_filter = "blur(5px)";
//black list class
const black_list_class = "blacklist";
// cursor style
const pointer = "pointer";


const p = function (event)
{
    event.stopPropagation();
    event.preventDefault();
    return false;
};

//主题栏 class
const title = "onefeed";

//帖子 class
const posting = "st_post";

function spin_blacklist(element)
{
    let hrefs = element.getElementsByTagName("a");
    if (hrefs && hrefs.length > 0)
    {
        Array.prototype.forEach.call(hrefs, e =>
        {
            if (e.classList.contains(black_list_class))
            {
                e.classList.remove(black_list_class);
            }
            else
            {
                e.classList.add(black_list_class);
            }
        });
    }
}

//blacklist
let blacklist;

//observer callback function
const callback = function (mutationsList)
{

    for (let mutation of mutationsList)
    {
        if (mutation.type === 'childList')
        {
            let elements = mutation.addedNodes;
            for (let element of elements)
            {
                let class_list = element.classList;
                if (class_list && class_list.length > 0)
                {
                    if (class_list.contains(posting))
                    {
                        let author = element.children[0].children[2].children[0].children[0].innerText;
                        if (blacklist.has(author))
                        {
                            element.style.filter = blur_filter;
                            element.style.cursor = pointer;
                            spin_blacklist(element);
                            element.addEventListener("click", p, true);
                            element.addEventListener("dblclick", function ()
                            {
                                if (element.style.filter.length === 0)
                                {
                                    element.style.filter = blur_filter;
                                    element.style.cursor = pointer;
                                    element.addEventListener("click", p, true);
                                }
                                else
                                {
                                    element.style.filter = null;
                                    element.style.cursor = null;
                                    element.removeEventListener("click", p, true);
                                }
                                spin_blacklist(element);
                            });
                        }
                    }
                    else if (class_list.contains(title))
                    {
                        let author = element.children[1].children[0].children[0].innerText;
                        if (blacklist.has(author))
                        {
                            element.style.filter = blur_filter;
                            element.addEventListener("click", p, true);
                            spin_blacklist(element);
                            element.addEventListener("dblclick", function ()
                            {
                                if (element.style.filter.length === 0)
                                {
                                    element.style.filter = blur_filter;
                                    element.addEventListener("click", p, true);
                                }
                                else
                                {
                                    element.style.filter = null;
                                    element.removeEventListener("click", p, true);
                                }
                                spin_blacklist(element);
                            })
                        }
                    }
                }
            }
        }
    }
};

function get_black_list()
{
    let req = new XMLHttpRequest();
    req.open("GET", "/setting/index.php?mod=ajax&action=getblack", true);
    req.send(null);
    req.onreadystatechange = function ()
    {
        if (req.readyState === 4 && req.status === 200)
        {
            let html = document.createElement("html");
            html.innerHTML = req.responseText;
            let as = html.querySelectorAll("table>tbody>tr>td>a");
            blacklist = new Set(Array.prototype.map.call(as, e => e.innerText));

            const observer = new MutationObserver(callback);
            observer.observe(document, config);
        }
    }
}

get_black_list();
