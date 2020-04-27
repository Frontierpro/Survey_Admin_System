var userName;

window.onload = function() {
    userName = get_cookie("user_name");
    if (userName != undefined) {
        console.log("--website cookie--");
        console.log("'user_name': " + userName);
        clear_cookie('user_name', "/");
    }
}
