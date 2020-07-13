var form;
var answerList;
var userList;

window.onload = function() {
    initial();

    var queryStr = window.location.search;
    var querySet = queryStr.split("&");
    var title = decodeURI(querySet[0].substring(querySet[0].indexOf('=') + 1));
    var id = decodeURI(querySet[1].substring(querySet[1].indexOf('=') + 1));
    console.log("--form info--");
    console.log("'form_title': " + title);
    console.log("'form_publisher': " + id);

    $.ajax({
        type: "get",
        url: "http://127.0.0.1:8080/get_form_content",
        data: {
            "id": id,
            "title": title
        },
        success: function(data) {
            form = JSON.parse(data);
            console_log();
            if (form.title != title) {
                alert("该问卷不存在");
                $(location).attr("href", "http://127.0.0.1:8080/index.html");
            }
            $("title").text("结果展示 | " + form.title);
            data_view_initial();
            get_answer_user(id, title);
        }
    });
}

window.onresize = function() {
    initial();
}

function get_answer_user(id, title) {
    $.ajax({
        type: "get",
        url: "http://127.0.0.1:8080/get_answer_user",
        data: {
            "id": id,
            "title": title,
            "ifID": form.ifID
        },
        success: function(data) {
            userList = JSON.parse(data);
            console.log("--nodejs response from web server--");
            console.log("'user_list': " + userList);
            for (var pos = 0; pos < userList.length; pos++) {
                var optionTmp = "<option value='" + userList[pos] + "'>" + userList[pos] + "</option>";
                $("#form-answer").append(optionTmp);
            }
            if (userList.length > 0) {
                $("#form-answer").val(userList[0]);
                get_answer_list(id, title);
            }
        }
    });
}

function get_answer_list(id, title) {
    $.ajax({
        type: "get",
        url: "http://127.0.0.1:8080/get_answer_list",
        data: {
            "id": id,
            "title": title,
            "ifID": form.ifID,
            "userName": $("#form-answer").val()
        },
        success: function(data) {
            answerList = JSON.parse(data);
            document_write();
            data_view_async();
            $("input").attr("disabled", true);
            $("textarea").attr("disabled", true);
        }
    });
}

$(document).ready(function() {
    $("#form-answer").on("change", function() {
        get_answer_list(answerList.id, answerList.topic)
    });
});

function initial() {
    var containerWidth = 0.95 * $(window).width();
    var containerMarginLeft = 0.025 * $(window).width(); 

    if ($(window).height() < $(window).width()) {
        containerWidth = 0.6 * $(window).width();
        containerMarginLeft = ($(window).width() - containerWidth) / 2;
    }

    $(".container").width(containerWidth);
    $(".container").css("margin-left", containerMarginLeft);
}

function data_view_initial() {
    $("#form-title").text(form.title);
    var unitTmp;
    for (var pos = 0; pos < form.cnt; pos++) {
        if (form.unitList[pos].type == 0) {
            unitTmp = $("#single-text-0").clone();
            unitTmp.attr("id", "single-text-" + (pos + 1).toString());
        }
        else if (form.unitList[pos].type == 1) {
            unitTmp = $("#multi-text-0").clone();
            unitTmp.attr("id", "multi-text-" + (pos + 1).toString());
        }
        else if (form.unitList[pos].type == 2) {
            unitTmp = $("#single-choice-0").clone();
            unitTmp.attr("id", "single-choice-" + (pos + 1).toString());
        }
        else {
            unitTmp = $("#multi-choice-0").clone();
            unitTmp.attr("id", "multi-choice-" + (pos + 1).toString());
        }
        unitTmp.children(".unit-num").text(form.unitList[pos].id.toString() + ". ");
        unitTmp.children(".unit-title").text(form.unitList[pos].title);
        for (var col = 0; col < form.unitList[pos].cnt; col++) {
            var optionTitleTmp = $("#single-choice-0").children(".unit-option").clone();
            var optionTextTmp = $("#single-choice-0").children(".option-text").clone();
            if (form.unitList[pos].type == 3) {
                optionTitleTmp = $("#multi-choice-0").children(".unit-option").clone();
                optionTextTmp = $("#multi-choice-0").children(".option-text").clone();
            }
            optionTitleTmp.attr("id", "option-" + (col + 1).toString());
            optionTextTmp.attr("id", "option-" + (col + 1).toString());
            optionTitleTmp.css("display", "");
            optionTextTmp.css("display", "");
            optionTitleTmp.attr("name", (pos + 1).toString());
            optionTitleTmp.attr("value", (col + 1).toString());
            optionTextTmp.text(form.unitList[pos].optionList[col].title);
            unitTmp.children(".unit-err").before(optionTitleTmp);
            unitTmp.children(".unit-err").before(optionTextTmp);
        }
        unitTmp.css("display", "");
        $("#form-end").before(unitTmp);
    }
}

function data_view_async() {
    var unitTmp = $("#form-begin").next();
    var pos = 0, index = 0;
    while (unitTmp.attr("id") != "form-end") {
        if (form.unitList[pos].type <= 1) {
            for (index = 0; index < answerList.formAnswerList.length; index++)
                if (answerList.formAnswerList[index].id == pos + 1)
                    break;
            unitTmp.children(".unit-text").val(answerList.formAnswerList[index].text);
        }
        else {
            var optionTitleTmp = unitTmp.children(".unit-num").next().next();
            for (var col = 0; col < form.unitList[pos].cnt; col++) {
                optionTitleTmp = optionTitleTmp.next().next();
                optionTitleTmp.prop("checked", false);
                for (index = 0; index < answerList.formAnswerList.length; index++)
                    if (answerList.formAnswerList[index].id == pos + 1) {
                        if (answerList.formAnswerList[index].choice == col + 1)
                            optionTitleTmp.prop("checked", true);
                    }
            }
        }
        var preID = form.unitList[pos].preID;
        for (index = 0; index < answerList.formAnswerList.length; index++)
            if (answerList.formAnswerList[index].id == preID)
                if (answerList.formAnswerList[index].choice == form.unitList[pos].preNum)
                    break;
        if (preID == 0 || index < answerList.formAnswerList.length)
            unitTmp.css("display", "");
        else
            unitTmp.css("display", "none");
        unitTmp = unitTmp.next();
        pos++;
    }
}

function console_log() {
    console.log('');
    console.log('');
    console.log('');
    console.log('--form data--');
    console.log("'unit_count': " + form.cnt);
    console.log("'form_title': " + form.title);
    console.log("'if_id': " + form.ifID);
    for (var pos = 0; pos < form.cnt; pos++) {
        console.log('');
        console.log('');
        console.log('--unit data ' + (pos + 1).toString() + '--');
        console.log("'unit_type': " + form.unitList[pos].type);
        console.log("'unit_id': " + form.unitList[pos].id);
        console.log("'unit_title': " + form.unitList[pos].title);
        console.log("'pre_id': " + form.unitList[pos].preID);
        console.log("'pre_option': " + form.unitList[pos].preNum);
        if (form.unitList[pos].type > 1) {
            console.log('');
            console.log("'option_count': " + form.unitList[pos].cnt);
            for (var tmp = 0; tmp < form.unitList[pos].cnt; tmp++) {
                console.log('');
                console.log('--option data ' + (pos + 1).toString() + String.fromCharCode(tmp + 65) + '--');
                console.log("'option_id': " + form.unitList[pos].optionList[tmp].id);
                console.log("'option_title': " + form.unitList[pos].optionList[tmp].title);
            }
        }
    }
    console.log('');
    console.log('');
    console.log('');
}

function document_write() {
    console.log('');
    console.log('');
    console.log('');
    console.log('--answer data--');
    console.log("'publisher_id': " + answerList.id);
    console.log("'form_title': " + answerList.topic);
    console.log("'if_id': " + answerList.ifID);
    if (answerList.ifID)
        console.log("'user_id': " + answerList.userID);
    else
        console.log("'user_ip': " + answerList.userIP);
    console.log('');
    for (var pos = 0; pos < answerList.formAnswerList.length; pos++) {
        console.log('');
        console.log("--question " + answerList.formAnswerList[pos].id.toString() + " answer--");
        console.log("'question_id': " + answerList.formAnswerList[pos].id);
        if (answerList.formAnswerList[pos].choice == 0)
            console.log("'question_answer': " + answerList.formAnswerList[pos].text);
        else
            console.log("'question_answer': " + answerList.formAnswerList[pos].choice);
    }
    console.log('');
    console.log('');
    console.log('');
}
