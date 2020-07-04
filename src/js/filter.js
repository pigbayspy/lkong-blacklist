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

/**
 * true => remover
 */
let mode = true;
/**
 * filter count
 */
let count = 0;

const forum_remover = function (elements, blacklist) {
    let i = 0;
    elements.filter(e => e.classList && e.classList.length > 0).forEach(e => {
        if (e.classList.contains(posting)) {
            let author = e.children[0].children[2].children[0].children[0].innerText;
            if (blacklist.has(author)) {
                e.remove();
                ++i;
            }
        } else if (e.classList.contains(title)) {
            let author = e.children[1].children[0].children[0].innerText;
            if (blacklist.has(author)) {
                e.remove();
                ++i;
            }
        }
    });
    count += i;
    chrome.runtime.sendMessage({"FILTER_COUNT": count});
    chrome.storage.local.set({"FILTER_COUNT": count});
};

const thread_remover = function (elements, blacklist) {
    let i = 0;
    elements.filter(e => e.nodeType === Node.ELEMENT_NODE).forEach(e => {
        if (e.parentElement && e.parentElement.id === "thefeed") {
            Array.prototype.forEach.call(e.children, d => {
                if (d === e.firstElementChild || d === e.lastElementChild) {
                    return;
                }
                let author = d.querySelector("div>div>div>a>span").innerText;
                console.log(author);
                if (blacklist.has(author)) {
                    d.remove();
                    ++i;
                }
            });
        }
    });
    count += i;
    chrome.runtime.sendMessage({"FILTER_COUNT": count});
    chrome.storage.local.set({"FILTER_COUNT": count});
};

chrome.storage.local.get({
    "FILTER_MODE": mode,
    "FILTER_COUNT": 0
}, result => {
    mode = result["FILTER_MODE"];
    count = result["FILTER_COUNT"];

    if (mode) {
        // 获取黑名单
        fetch("/setting/index.php?mod=ajax&action=getblack").then(response => {
            return response.text();
        }).then(text => {
            // 解析
            let p = new DOMParser();
            let html = p.parseFromString(text, "text/html");
            let elements = html.querySelectorAll("table>tbody>tr>td>a");
            return new Set(Array.prototype.map.call(elements, e => e.innerText));
        }).then(blacklist => {
            let observer = new MutationObserver(list => {
                let callback;
                switch (window.location.pathname.split("/")[1]) {
                    case "forum": {
                        callback = forum_remover;
                        break;
                    }
                    case "thread": {
                        callback = thread_remover;
                        break;
                    }
                    default: {
                        callback = null;
                        break;
                    }
                }
                list.forEach(m => {
                    if (m.type === childList && callback !== null) {
                        callback(Array.from(m.addedNodes), blacklist);
                    }
                })
            });
            observer.observe(document, config);
        }).catch(err => {
            console.error("请求黑名单异常", err);
        });
    }
});
