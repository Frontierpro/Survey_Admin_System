function set_cookie(cookieName, cookieValue, expireDuration, cookiePath) {
    var date = new Date();
    date.setTime(date.getTime() + (expireDuration * 24 * 60 * 60 * 1000));
    var cookieExpire = "expires="+ date.toGMTString();
    if (cookiePath) {
        var pathCookie = "path=" + cookiePath;
        document.cookie = cookieName + "=" + cookieValue + "; " + cookieExpire + "; " + pathCookie + ";";
    }
    else
        document.cookie = cookieName + "=" + cookieValue + "; " + cookieExpire + ";";
}

function get_cookie(cookieName) {
    cookieName = cookieName + "=";
    var cookieList = document.cookie.split(';');
    for(var cnt = 0; cnt < cookieList.length; cnt++) {
        var cookieItem = cookieList[cnt].trim();
        if (cookieItem.indexOf(cookieName) == 0) {
            return cookieItem.substring(cookieName.length, cookieItem.length);
        }
    }
    return undefined;
}

function clear_cookie(cookieName, cookiePath) {
    set_cookie(cookieName, "", 0, cookiePath);
}

$(document).ready(function() {
    if (get_cookie("user_name") != undefined)
        setInterval("renew_cookie()", 600000);
})

function renew_cookie() {
    set_cookie("user_name", get_cookie("user_name"), 3, "/");
}
