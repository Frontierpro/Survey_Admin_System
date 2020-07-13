var userName;
var formList;

window.onload = function() {
    userName = get_cookie("user_name");
    if (userName != undefined) {
        console.log("--website cookie--");
        console.log("'user_name': " + userName);
        $("title").text(userName);
        renew_cookie();
        get_form_list();
    }
    else
        $(location).attr("href", "http://127.0.0.1:8080/index.html");
}

window.onresize = function() {
    initial();
}

function initial() {
    $(".head-icon").css("margin-left", 0.035 * $(window).width());
    $(".quit-icon").css("margin-right", 0.04 * $(window).width());

    var contentLength = (formList.userFormList.length + 1) * 65 + 20;

    var windowHeight = $(window).height() - 130;
    var contentHeight = contentLength > windowHeight ? contentLength : windowHeight;
    $(".content").height(contentHeight);

    var containerWidth = $(window).width();
    var containerMarginLeft = 0; 

    if ($(window).height() < 1.25 * $(window).width()) {
        containerWidth = 0.9 * $(window).width();
        containerMarginLeft = ($(window).width() - containerWidth) / 2;
    }

    $(".container").width(containerWidth);
    $(".container").css("margin-left", containerMarginLeft);

    $(".content-button").css("margin-left", 0.05 * $(".container").width());
}

$(document).ready(function () {
    $(".quit-text, .quit-icon").bind("mousemove", function() {
        $(".quit-text").css("color", "coral");
        $(".quit-icon").attr("src", "quit_b.png");
        $(this).css("cursor", "pointer");
    }).bind("mouseout", function() {
        $(".quit-text").css("color", "#666666");
        $(".quit-icon").attr("src", "quit_a.png");
        $(this).css("cursor", "default");
    }).bind("click", function() {
        clear_cookie("user_name", "/");
        $(location).attr("href", "http://127.0.0.1:8080/index.html");
    });

    var scrollTop = 0;

    $(window).scroll(function() {
        if ($(window).scrollTop() > 80) {
            if ($(window).scrollTop() > scrollTop)
                $(".head").css("margin-top", -100);
            else
                $(".head").css("margin-top", 0);
            scrollTop = $(window).scrollTop();
        }
    });

    $(".content-button").bind("mousemove", function() {
        $(this).css("box-shadow", "0 1px 6px 0 cornflowerblue");
        $(this).css("cursor", "pointer");
    }).bind("mouseout", function() {
        $(this).css("box-shadow", "0 1px 6px 0 rgba(32, 33, 36, 0.28)");
        $(this).css("cursor", "default");
    }).bind("click", function() {
        $(location).attr("href", "http://127.0.0.1:8080/edit.html");
    });

    $("body").on("mousemove", ".form-container", function() {
        $(this).css("box-shadow", "0 1px 6px 0 cornflowerblue");
    });

    $("body").on("mouseout", ".form-container", function() {
        $(this).css("box-shadow", "0 1px 6px 0 rgba(32, 33, 36, 0.28)");
    });

    $("body").on("mousemove", "input", function() {
        $(this).css("cursor", "pointer");
    });

    $("body").on("mouseout", "input", function() {
        $(this).css("cursor", "default");
    });

    $("body").on("click", "#form-res", function() {
        var containerID = $(this).parent().attr("id");
        var containerNum = parseInt(containerID.substring(containerID.indexOf('-') + 1)) - 1;
        var resTitle = formList.userFormList[containerNum].title;
        var targetAddr = "http://127.0.0.1:8080/result.html";
        targetAddr = targetAddr + "?title=" + resTitle;
        targetAddr = targetAddr + "&id=" + userName;
        $(location).attr("href", targetAddr);
    });

    $("body").on("click", "#form-share", function() {
        var containerID = $(this).parent().attr("id");
        var containerNum = parseInt(containerID.substring(containerID.indexOf('-') + 1)) - 1;
        var shareTitle = formList.userFormList[containerNum].title;
        var shareAddr = "http://127.0.0.1:8080/fill.html";
        shareAddr = shareAddr + "?title=" + shareTitle;
        shareAddr = shareAddr + "&id=" + userName;
        var tag = document.createElement('input');
        tag.setAttribute('id', 'cp_zdy_input');
        tag.value = shareAddr;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_zdy_input').select();
        document.execCommand('copy');
        document.getElementById('cp_zdy_input').remove();
        alert("分享链接已复制到剪贴板");
    });

    $("body").on("click", "#form-delete", function() {
        var containerID = $(this).parent().attr("id");
        var containerNum = parseInt(containerID.substring(containerID.indexOf('-') + 1)) - 1;
        var deleteTitle = formList.userFormList[containerNum].title;
        $.ajax({
            type: "get",
            url: "http://127.0.0.1:8080/drop_survey_form",
            data: {
                "id": userName,
                "topic": deleteTitle
            },
            success: function(data) {
                console.log("--nodejs response from web server--");
                console.log(data);
                location.reload();
            }
        });
    });
})

function get_form_list() {
    $.ajax({
        type: "post",
        url: "http://127.0.0.1:8080/get_form_list",
        data: {
            "id": userName
        },
        success: function(data) {
            formList = JSON.parse(data);
            console.log("--nodejs response from web server--");
            console.log("'form_num': " + formList.userFormList.length);
            for (var pos = 0; pos < formList.userFormList.length; pos++)
                console.log("'form_" + (pos + 1).toString() + "': " + formList.userFormList[pos].title);
            data_view_async();
        }
    });
}

function data_view_async() {
    for (var pos = 0; pos < formList.userFormList.length; pos++) {
        var formTmp = $("#container-0").clone();
        formTmp.attr("id", "container-" + (pos + 1).toString());
        formTmp.css("display", "");
        formTmp.children("#form-title").children("b").text(formList.userFormList[pos].title);
        $(".content-button").before(formTmp);
    }
    initial();
}
