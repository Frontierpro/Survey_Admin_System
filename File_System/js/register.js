window.onload = function() {
    initial();
}

window.onresize = function() {
    initial();
}

function initial() {
    var containerWidth = 0.64 * $(window).height();
    var containerHeight = 0.8 * $(window).height();
    if ($(window).width() < containerWidth) {
        containerWidth = 0.8 * $(window).width();
        containerHeight = 1.25 * containerWidth;
    }
    var edgeWidth = 0.5 * ($(window).width() - containerWidth);
    var edgeHeight = 0.5 * ($(window).height() - containerHeight);

    $("#page").height($(window).height());
    $("#page").width($(window).width());
    $("#page").css("font-size", containerHeight);

    $("#left").width(edgeWidth);
    $("#container").width(containerWidth);
    $("#right").width(edgeWidth);
    $("#top").height(edgeHeight);
    $("#center").height(containerHeight);
    $("#down").height(edgeHeight);

    $("#content-header").css("padding-top", 0.15 * containerWidth);
    $("#content-header").css("padding-left", 0.15 * containerWidth);

    $(".input-container").css("margin-top", 0.005 * containerWidth);
    $(".input-container").css("margin-left", 0.1 * containerWidth);
    $(".input-container").css("padding-left", 0.05 * containerWidth);

    $(".input-content").css("margin-top", 0.002 * containerHeight);

    $(".hidden-icon").height(0.05 * containerHeight);
    $(".hidden-icon").width(0.05 * containerHeight);
    $(".hidden-icon").css("margin-top", 0.025 * containerHeight);

    $("#content-button").css("margin-top", 0.01 * containerWidth);
    $("#content-button").css("margin-left", 0.1 * containerWidth);

    $(".input-error").css("margin-top", 0.005 * containerWidth);
    $(".input-error").css("margin-left", 0.15 * containerWidth);

    $(".page-link").css("margin-left", 0.15 * containerWidth);
    $(".page-link").css("margin-top", 0.05 * containerWidth);
    $("#link-right").css("margin-left", 0);
}

$(document).ready(function() {
    $("#content-button").mouseover(function() {
        $(this).css("box-shadow", "0 0 15px coral");
        $(this).css("cursor", "pointer");
    });

    $("#content-button").mouseout(function() {
        $(this).css("box-shadow", "0 0 15px transparent");
        $(this).css("cursor", "default");
    });

    $(".hidden-icon").mouseover(function() {
        $(this).css("cursor", "pointer");
    });

    $(".hidden-icon").mouseout(function() {
        $(this).css("cursor", "default");
    });

    $("#email-input").focus(function() {
        $("#email-format-error").text("");
        get_focus($("#email-container"));
    });

    $("#email-input").blur(function() {
        email_response();
        lose_focus($("#email-container"));
    });

    $("#pwd-input").focus(function() {
        $("#pwd-format-error").text("");
        get_focus($("#pwd-container"));
    });

    $("#pwd-input").blur(function() {
        pwd_response();
        lose_focus($("#pwd-container"));
    });

    $("#pwd-repeat").focus(function() {
        $("#pwd-confirm-error").text("");
        get_focus($("#confirm-container"));
    });

    $("#pwd-repeat").blur(function() {
        confirm_response();
        lose_focus($("#confirm-container"));
    });

    $("#pwd-hidden").click(function() {
        change_type($("#pwd-input"), $("#pwd-hidden"));
    });

    $("#confirm-hidden").click(function() {
        change_type($("#pwd-repeat"), $("#confirm-hidden"));
    });

    $("#content-button").click(function () {
        var emailLock = check_email();
        var pwdLock = check_pwd();
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
                    "email": $("#email-input").val(),
                    "pwd": $("#pwd-input").val()
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
            email_response();
            pwd_response();
            confirm_response();
        }
    });
})

function email_response() {
    if ($("#email-input").val() == "")
        $("#email-format-error").text("创建账户所用的邮箱不能为空");
    else if(!check_email())
        $("#email-format-error").text("邮箱格式不正确");
}

function pwd_response() {
    if ($("#pwd-input").val() == "")
        $("#pwd-format-error").text("密码不能设定为空");
    else if($("#pwd-input").val().length > 20)
        $("#pwd-format-error").text("密码长度不能超过20位");
    if ($("#pwd-repeat").val() == "");
    else if ($("#pwd-input").val() == "" || check_again())
        $("#pwd-confirm-error").text("");
    else
        $("#pwd-confirm-error").text("验证密码与设定密码不一致");
}

function confirm_response() {
    if ($("#pwd-repeat").val() == "")
        $("#pwd-confirm-error").text("验证密码不能为空");
    else if ($("#pwd-input").val() == "");
    else if(!check_again())
        $("#pwd-confirm-error").text("验证密码与设定密码不一致");
}

function check_email() {
    var pattern = new RegExp(
        "^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"
    );
    return pattern.test($("#email-input").val());
}

function check_pwd() {
    var length = $("#pwd-input").val().length;
    return length > 0 && length <= 20;
}

function check_again() {
    return $("#pwd-repeat").val().length > 0 && $("#pwd-input").val() == $("#pwd-repeat").val();
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
