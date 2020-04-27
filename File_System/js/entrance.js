var containerHeight, containerWidth;
var verifyLock = false;

window.onload = function() {
    initial();
    if ($(".verify-container").length) {
        var userName = get_cookie("user_name");
        if (userName != undefined) {
            console.log("--website cookie--");
            console.log("'user_name': " + userName);
            $(location).attr("href", "http://127.0.0.1:8080/home.html");
        }
    }
}

window.onresize = function() {
    initial();
    if (verifyLock) {
        $(".verify-button").css("left", 0.56 * containerWidth);
        $(".verify-bkg").width(20 + 0.56 * containerWidth);
    }
}

function initial() {
    containerWidth = 0.64 * $(window).height();
    containerHeight = 0.8 * $(window).height();
    if ($(window).width() < containerWidth) {
        containerWidth = 0.8 * $(window).width();
        containerHeight = 1.25 * containerWidth;
    }
    var edgeWidth = 0.5 * ($(window).width() - containerWidth);
    var edgeHeight = 0.5 * ($(window).height() - containerHeight);

    $(".page").height($(window).height());
    $(".page").width($(window).width());
    $(".page").css("font-size", containerHeight);

    $(".left").width(edgeWidth);
    $(".container").width(containerWidth);
    $(".right").width(edgeWidth);
    $(".top").height(edgeHeight);
    $(".center").height(containerHeight);
    $(".bottom").height(edgeHeight);

    $(".content-header").css("padding-top", 0.15 * containerWidth);
    $(".content-header").css("padding-left", 0.15 * containerWidth);

    $(".input-container").css("margin-top", 0.005 * containerWidth);
    $(".input-container").css("margin-left", 0.1 * containerWidth);
    $(".input-container").css("padding-left", 0.05 * containerWidth);

    $(".input-content").css("margin-top", 0.002 * containerHeight);

    $(".hidden-icon").height(0.05 * containerHeight);
    $(".hidden-icon").width(0.05 * containerHeight);
    $(".hidden-icon").css("margin-top", 0.025 * containerHeight);

    $(".verify-button").css("padding-top", 0.027 * containerHeight);
    $(".verify-text").css("padding-top", 0.027 * containerHeight);

    $(".content-button").css("margin-top", 0.01 * containerWidth);
    $(".content-button").css("margin-left", 0.1 * containerWidth);

    $(".input-error").css("margin-top", 0.005 * containerWidth);
    $(".input-error").css("margin-left", 0.15 * containerWidth);

    $(".page-link").css("margin-left", 0.15 * containerWidth);
    $(".page-link").css("margin-top", 0.05 * containerWidth);
    $("#link-right").css("margin-left", 0);
}

$(document).ready(function() {
    $(".content-button").mouseover(function() {
        $(this).css("box-shadow", "0 0 15px coral");
        $(this).css("cursor", "pointer");
    });

    $(".content-button").mouseout(function() {
        $(this).css("box-shadow", "0 0 15px transparent");
        $(this).css("cursor", "default");
    });

    $(".hidden-icon").mouseover(function() {
        $(this).css("cursor", "pointer");
    });

    $(".hidden-icon").mouseout(function() {
        $(this).css("cursor", "default");
    });

    $(".verify-button").mouseover(function() {
        $(this).css("cursor", "pointer");
    });

    $(".verify-button").mouseout(function() {
        $(this).css("cursor", "default");
    });

    $("#register-email").focus(function() {
        $("#register-email-error").text("");
        get_focus($("#email-container"));
    });

    $("#register-email").blur(function() {
        register_email_response();
        lose_focus($("#email-container"));
    });

    $("#login-email").focus(function() {
        $("#login-email-error").text("");
        get_focus($("#email-container"));
    });

    $("#login-email").blur(function() {
        login_email_response();
        lose_focus($("#email-container"));
    });

    $("#register-pwd").focus(function() {
        $("#register-pwd-error").text("");
        get_focus($("#pwd-container"));
    });

    $("#register-pwd").blur(function() {
        register_pwd_response();
        lose_focus($("#pwd-container"));
    });

    $("#login-pwd").focus(function() {
        $("#login-pwd-error").text("");
        get_focus($("#pwd-container"));
    });

    $("#login-pwd").blur(function() {
        login_pwd_response();
        lose_focus($("#pwd-container"));
    });

    $("#confirm").focus(function() {
        $("#confirm-error").text("");
        get_focus($("#confirm-container"));
    });

    $("#confirm").blur(function() {
        confirm_response();
        lose_focus($("#confirm-container"));
    });

    $("#register-pwd-hidden").click(function() {
        change_type($("#register-pwd"), $("#register-pwd-hidden"));
    });

    $("#login-pwd-hidden").click(function() {
        change_type($("#login-pwd"), $("#login-pwd-hidden"));
    });

    $("#confirm-hidden").click(function() {
        change_type($("#confirm"), $("#confirm-hidden"));
    });

    $("#register-submit").click(function () {
        var emailLock = check_email($("#register-email"));
        var pwdLock = check_pwd($("#register-pwd"));
        var confirmLock = check_again();
        console.log("--local params--");
        console.log("'email_format': " + emailLock);
        console.log("'password_format': " + pwdLock);
        console.log("'check_again': " + confirmLock);
        if (emailLock && pwdLock && confirmLock) {
            $.ajax({
                type: "post",
                url: "http://127.0.0.1:8080/get_register_form",
                data: {
                    "email": $("#register-email").val(),
                    "pwd": $("#register-pwd").val()
                },
                success: function(data) {
                    console.log("--nodejs response from web server--");
                    console.log("'email_unique': " + data);
                    if (data)
                        $(location).attr("href", "http://127.0.0.1:8080/login.html");
                    else
                        alert("该邮箱已被注册！");
                }
            });
        }
        else {
            register_email_response();
            register_pwd_response();
            confirm_response();
        }
    });

    var start_x;
    var lock = true;

    $(".verify-button").on("mousedown touchstart", function(e) {
        start_x = e.clientX || e.originalEvent.targetTouches[0].pageX;
        lock = false;
    });

    $(".verify-button").on("mousemove touchmove", function(e) {
        if (!lock && !verifyLock) {
            var move_x = (e.clientX || e.originalEvent.targetTouches[0].pageX) - start_x;
            if (move_x > 0) {
                $(this).css("left", move_x);
                $(".verify-bkg").width(20 + move_x);
                if (move_x >= 0.56 * containerWidth) {
                    lock = true;
                    verifyLock = true;
                    $(".verify-text").text("验证通过");
                    $("#verify-error").text("");
                }
            }
        }
    });

    $(".verify-button").on("mouseup mouseleave touchend", function(e) {
        if (!verifyLock) {
            $(this).css("left", 0);
            $(".verify-bkg").width(0);
        }
        lock = true;
    });

    $("#login-submit").click(function() {
        var emailLock = check_email($("#login-email"));
        var pwdLock = check_pwd($("#login-pwd"));
        console.log("--local params--");
        console.log("'email_format': " + emailLock);
        console.log("'password_format': " + pwdLock);
        console.log("'verify-validation': " + verifyLock);
        if (emailLock && pwdLock && verifyLock) {
            $.ajax({
                type: "post",
                url: "http://127.0.0.1:8080/get_login_form",
                data: {
                    "email": $("#login-email").val(),
                    "pwd": $("#login-pwd").val()
                },
                success: function(data) {
                    console.log("--nodejs response from web server--");
                    if (data == 0) {
                        set_cookie("user_name", $("#login-email").val(), 3, "/");
                        $(location).attr("href", "http://127.0.0.1:8080/home.html");
                    }
                    else if (data == 1) {
                        console.log("'error code': " + data);
                        alert("邮箱用户名不存在！");
                    }
                    else {
                        console.log("'error code': " + data);
                        alert("密码错误！");
                    }
                }
            });
        }
        else {
            login_email_response();
            login_pwd_response();
            if (!verifyLock)
                $("#verify-error").text("请完成滑动验证");
        }
    });
})

function register_email_response() {
    if ($("#register-email").val() == "")
        $("#register-email-error").text("创建账户所用的邮箱不能为空");
    else if(!check_email($("#register-email")))
        $("#register-email-error").text("邮箱格式不正确");
}

function login_email_response() {
    if ($("#login-email").val() == "")
        $("#login-email-error").text("用户名邮箱不能为空");
    else if(!check_email($("#login-email")))
        $("#login-email-error").text("邮箱格式不正确");
}

function register_pwd_response() {
    if ($("#register-pwd").val() == "")
        $("#register-pwd-error").text("密码不能设定为空");
    else if($("#register-pwd").val().length > 20)
        $("#register-pwd-error").text("密码长度不能超过20位");
    if ($("#confirm").val() == "");
    else if ($("#register-pwd").val() == "" || check_again())
        $("#confirm-error").text("");
    else
        $("#confirm-error").text("验证密码与设定密码不一致");
}

function login_pwd_response() {
    if ($("#login-pwd").val() == "")
        $("#login-pwd-error").text("登录密码不能为空");
    else if($("#login-pwd").val().length > 20)
        $("#login-pwd-error").text("密码长度不能超过20位");
}

function confirm_response() {
    if ($("#confirm").val() == "")
        $("#confirm-error").text("验证密码不能为空");
    else if ($("#register-pwd").val() == "");
    else if(!check_again())
        $("#confirm-error").text("验证密码与设定密码不一致");
}

function check_email(object) {
    var pattern = new RegExp(
        "^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"
    );
    return pattern.test(object.val());
}

function check_pwd(object) {
    var length = object.val().length;
    return length > 0 && length <= 20;
}

function check_again() {
    return $("#confirm").val().length > 0 && $("#register-pwd").val() == $("#confirm").val();
}

function change_type(objectType, objectImg) {
    if (objectImg.attr("src") == "hidden.png") {
        objectType.attr("type", "text");
        objectImg.attr("src", "unhidden.png");
    }
    else {
        objectType.attr("type", "password");
        objectImg.attr("src", "hidden.png");
    }
}

function get_focus(object) {
    object.css("border-color", "cornflowerblue");
    object.css("box-shadow", "0 0 15px cornflowerblue");
}

function lose_focus(object) {
    object.css("border-color", "#cccccc");
    object.css("box-shadow", "0 0 0 transparent");
}
