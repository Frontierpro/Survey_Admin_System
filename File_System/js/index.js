window.onload = function() {
    var userName = get_cookie("user_name");

    if (userName != undefined) {
        console.log("--website cookie--");
        console.log("'user_name': " + userName);
        $(location).attr("href", "http://127.0.0.1:8080/home.html");
    }

    initial();
}

window.onresize = function() {
    initial();
}

function initial() {
    $(".head").height(0.05 * $(window).width());
    $(".dummy-head").height(0.05 * $(window).width());
    $(".head").width($(window).width());
    $(".dummy-head").width($(window).width());
    $(".content").height(0.625 * $(window).width());
    $(".sample").height(0.4 * $(window).width());
    $(".container").height(1.5 * $(window).width());
    $(".intro-bkg").height(1.5 * $(window).width());
    $(".intro-table").height(1.5 * $(window).width());
    $(".foot").height(0.05 * $(window).width());

    $(".head-icon").height(0.5 * $(".head").height());
    $(".head-icon").width(0.5 * $(".head").height());
    $(".head-icon").css("margin-top", 0.25 * $(".head").height());
    $(".head-icon").css("margin-left", 0.045 * $(window).width());

    $(".head-title").css("font-size", 0.3 * $(".head").height());
    $(".head-title").css("margin-top", 0.33 * $(".head").height());
    $(".head-title").css("margin-left", 0.01 * $(window).width());

    $("#head-left-link").css("margin-left", 0.66 * $(window).width());
    $(".head-link").css("font-size", 0.25 * $(".head").height());
    $(".head-sym").css("font-size", 0.25 * $(".head").height());
    $(".head-link").css("margin-top", 0.4 * $(".head").height());
    $(".head-sym").css("margin-top", 0.4 * $(".head").height());

    $(".content-mask").css("margin-top", 0.2 * $(".content").height());
    $(".content-mask").height(0.5 * $(".content").height());
    $(".content-title").css("font-size", 0.075 * $(".content").height());
    $(".content-title").css("margin-top", 0.37 * $(".content").height());
    $(".content-text").css("font-size", 0.03 * $(".content").height());
    $(".content-text").css("margin-top", 0.495 * $(".content").height());

    $(".img-container").css("margin-top", 0.125 * $(".sample").height());
    $("#container-one").css("margin-left", 0.175 * $(window).width());
    $("#container-two").css("margin-left", 0.1 * $(window).width());
    $("#container-three").css("margin-left", 0.1 * $(window).width());
    $(".text-container").css("margin-top", 0.1 * $(".sample").height());
    $(".text-container").css("margin-left", 0.11 * $(window).width());
    $(".text-container").css("font-size", 0.06 * $(".sample").height());
    $(".sample-text").css("margin-top", 0.03 * $(".sample").height());
    $(".dummy-text").css("margin-top", 0.03 * $(".sample").height());

    $(".intro-title").css("font-size", 0.023 * $(window).width());
    $(".intro-title").css("margin-top", 0.15 * $(window).width());
    $(".intro-title").css("margin-left", 0.13 * $(window).width());
    $(".intro-step").css("font-size", 0.015 * $(window).width());
    $(".intro-step").css("margin-top", 0.015 * $(window).width());
    $(".intro-step").css("margin-left", 0.13 * $(window).width());

    $("line").attr("stroke-width", 0.005 * $(window).width());
    $("circle").attr("stroke-width", 0.005 * $(window).width());

    $(".foot-text").css("font-size", 0.3 * $(".foot").height());
}

$(document).ready(function() {
    setInterval(function() {
        if ($(window).scrollTop() > 0) {
            $(".dummy-head").css("background", "white");
            $(".head").css("box-shadow", "0 1px 6px 0 rgba(32, 33, 36, 0.28)");
            $(".head-icon").attr("src", "survey_b.png");
            $(".head-title").css("color", "cornflowerblue");
            $(".head-link").css("color", "cornflowerblue");
            $(".head-sym").css("color", "cornflowerblue");
        }
        else {
            $(".dummy-head").css("background", "transparent");
            $(".head").css("box-shadow", "none");
            $(".head-icon").attr("src", "survey_a.png");
            $(".head-title").css("color", "white");
            $(".head-link").css("color", "white");
            $(".head-sym").css("color", "white");
        }
    }, 50);
})
