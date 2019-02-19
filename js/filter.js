function get_black_list()
{
    let req = new XMLHttpRequest();
    req.open("GET", "/setting/index.php?mod=ajax&action=getblack", true);
    req.send(null);
    req.onreadystatechange = function ()
    {
        if (req.readyState === 4 && req.status === 200)
        {
            let element=document.createElement("html");
            element.innerHTML=req.responseText;
            console.log(element);
            let as=element.getElementsByTagName("a");
            console.log(as);
        }
    }
}

get_black_list();