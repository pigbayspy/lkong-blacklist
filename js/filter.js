//observer setting
const config = {
    attributes: false,
    childList: true,
    subtree: true,
    characterData: false
};

//主题栏 class
const title = "onefeed";
//帖子 class
const posting = "st_post";
//类型
const childList = "childList";

const forum_remover = function (elements, blacklist)
{
    elements.filter(e => e.classList && e.classList.length > 0).forEach(e =>
    {
        if (e.classList.contains(posting))
        {
            let author = e.children[0].children[2].children[0].children[0].innerText;
            if (blacklist.has(author))
            {
                e.remove();
                console.log("remove "+author);
            }
        }
        else if (e.classList.contains(title))
        {
            let author = e.children[1].children[0].children[0].innerText;
            if (blacklist.has(author))
            {
                e.remove();
                console.log("remove "+author);
            }
        }
    });
};

const thread_remover = function (elements, blacklist)
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
                    d.remove();
                }
            });
        }
    });
};

let mode = true;//true => remover

chrome.storage.local.get({
    "FILTER_MODE": mode,
}, result =>
{
    mode = result["FILTER_MODE"];
    if (mode)
    {
        fetch("/setting/index.php?mod=ajax&action=getblack").then(response =>
        {
            return response.text();
        }).then(text =>
        {
            let p = new DOMParser();
            let html = p.parseFromString(text, "text/html");
            let elements = html.querySelectorAll("table>tbody>tr>td>a");
            return new Set(Array.prototype.map.call(elements, e => e.innerText));
        }).then(blacklist =>
        {
            let observer = new MutationObserver(list =>
            {
                let callback = null;
                switch (window.location.pathname.split("/")[1])
                {
                    case "forum":
                    {
                        callback = forum_remover;
                        break;
                    }
                    case "thread":
                    {
                        callback = thread_remover;
                        break;
                    }
                }
                list.forEach(m =>
                {
                    if (m.type === childList)
                    {
                        callback(Array.from(m.addedNodes), blacklist);
                    }
                })
            });
            observer.observe(document, config);
        });
    }
});