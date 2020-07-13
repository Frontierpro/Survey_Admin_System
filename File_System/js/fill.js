var form;
var userID = "", userIP = "";
var answerList;

function Answer(id, type, single, multi, text) {
    this.id = id;
    this.type = type;
    this.single = single;
    this.multi = multi;
    this.text = text;
}

function AnswerList(ifID, id, topic, userID, userIP, formAnswerList) {
    this.ifID = ifID;
    this.id = id;
    this.topic = topic;
    this.userID = userID;
    this.userIP = userIP;
    this.formAnswerList = formAnswerList;
}

window.onload = function() {
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
            if (form.ifID) {
                userID = get_cookie("user_name");
                if (userID != undefined) {
                    console.log("--user info--");
                    console.log("'user_id': " + userID);
                    renew_cookie();
                }
                else {
                    set_cookie("edit_log", window.location, 1 / 144,  "/");
                    alert("请先登录");
                    $(location).attr("href", "http://127.0.0.1:8080/login.html");
                }
            }
            else {
                userIP = returnCitySN["cip"];
                console.log("--user info--");
                console.log("'user_ip': " + userIP);
            }
            $("title").text("问卷填写 | " + form.title);
            var formAnswerList = [];
            for (var pos = 0; pos < form.cnt; pos++) {
                var answer = new Answer(form.unitList[pos].id, form.unitList[pos].type, 0, [], "");
                formAnswerList[pos] = answer;
            }
            answerList = new AnswerList(form.ifID, id, title, userID, userIP, formAnswerList);
            initial();
        }
    });
}

window.onresize = function() {
    initial();
}

$(document).ready(function() {
    $("body").on("blur", ".unit-text", function() {
        var unitID = $(this).parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf("text-") + 5));
        answerList.formAnswerList[unitNum - 1].text = $(this).val();
    });

    $("body").on("click", ".unit-option", function() {
        var unitID = $(this).parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf("choice-") + 7));
        if (answerList.formAnswerList[unitNum - 1].type == 2) {
            answerList.formAnswerList[unitNum - 1].single = parseInt($(this).val());
            data_view_async();
        }
        else {
            var index = answerList.formAnswerList[unitNum - 1].multi.indexOf(parseInt($(this).val()));
            if (index == -1)
                answerList.formAnswerList[unitNum - 1].multi.push(parseInt($(this).val()));
            else
                answerList.formAnswerList[unitNum - 1].multi.splice(index, 1);
        }
    });

    $(".form-btn").click(function() {
        var flag = legal_check();
        document_write();
        if (flag) {
            $.ajax({
                type: "post",
                url: "http://127.0.0.1:8080/set_form_answer",
                data: {
                    "answer_list": JSON.stringify(answerList)
                },
                success: function(data) {
                    console.log("--nodejs response from web server--");
                    console.log("'sql_input': " + data);
                    if (data == "0")
                        alert("您已提交过该问卷，请勿重复提交！");
                    $(location).attr("href", "http://127.0.0.1:8080/index.html");
                }
            });
        }
        setTimeout(clear_err, 1500);
    });
});

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
        console.log("--question " + (pos + 1).toString() + " answer--");
        console.log("'question_id': " + answerList.formAnswerList[pos].id);
        console.log("'question_type': " + answerList.formAnswerList[pos].type);
        if (answerList.formAnswerList[pos].type == 2)
            console.log("'question_answer': " + answerList.formAnswerList[pos].single);
        else if (answerList.formAnswerList[pos].type == 3)
            console.log("'question_answer': " + answerList.formAnswerList[pos].multi);
        else
            console.log("'question_answer': " + answerList.formAnswerList[pos].text);
    }
    console.log('');
    console.log('');
    console.log('');
}

function legal_check() {
    var flag = true;

    var unitTmp = $("#form-end").prev();
    while (unitTmp.attr("id") != "form-begin") {
        if (unitTmp.css("display") != "none") {
            var unitID = unitTmp.attr("id");
            if (unitID.indexOf("text") >= 0) {
                if (unitTmp.children(".unit-text").val() == "") {
                    unitTmp.children(".unit-err").text("请填写答案");
                    flag = false;
                }
                else if (unitTmp.children(".unit-text").val().length > 1000) {
                    unitTmp.children(".unit-err").text("答案不能超过1000字");
                    flag = false;
                }
                else
                    unitTmp.children(".unit-err").text("");
            }
            else {
                var unitNum = parseInt(unitID.substring(unitID.indexOf("choice-") + 7));
                if (answerList.formAnswerList[unitNum - 1].type == 2) {
                    if (answerList.formAnswerList[unitNum - 1].single == 0) {
                        unitTmp.children(".unit-err").text("请选择一个答案");
                        flag = false;
                    }
                    else
                        unitTmp.children(".unit-err").text("");
                }
                else {
                    if (answerList.formAnswerList[unitNum - 1].multi.length == 0) {
                        unitTmp.children(".unit-err").text("请选择至少一个答案");
                        flag = false;
                    }
                    else
                        unitTmp.children(".unit-err").text("");
                }
            }
        }
        unitTmp = unitTmp.prev();
    }

    return flag;
}

function clear_err() {
    var unitTmp = $("#form-end").prev();
    while (unitTmp.attr("id") != "form-begin") {
        unitTmp.children(".unit-err").text("");
        unitTmp = unitTmp.prev();
    }
}

function initial() {
    var containerWidth = 0.95 * $(window).width();
    var containerMarginLeft = 0.025 * $(window).width(); 

    if ($(window).height() < $(window).width()) {
        containerWidth = 0.6 * $(window).width();
        containerMarginLeft = ($(window).width() - containerWidth) / 2;
    }

    $(".container").width(containerWidth);
    $(".container").css("margin-left", containerMarginLeft);

    $("#form-title").text(form.title);
    data_view_async();
}

function data_view_async() {
    var unitTmp = $("#form-end").prev();
    while (unitTmp.attr("id") != "form-begin") {
        unitTmp.remove();
        unitTmp = $("#form-end").prev();
    }
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
        if (form.unitList[pos].type < 2) {
            unitTmp.children(".unit-title").text(form.unitList[pos].title + "（不得超过1000字）");
            unitTmp.children(".unit-text").val(answerList.formAnswerList[pos].text);
        }
        else
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
            if (form.unitList[pos].type == 3) {
                if (answerList.formAnswerList[pos].multi.indexOf(col + 1) >= 0)
                    optionTitleTmp.prop("checked", true);
                else
                    optionTitleTmp.prop("checked", false);
            }
            else {
                if (answerList.formAnswerList[pos].single == col + 1)
                    optionTitleTmp.prop("checked", true);
                else
                    optionTitleTmp.prop("checked", false);
            }
            optionTextTmp.text(form.unitList[pos].optionList[col].title);
            unitTmp.children(".unit-err").before(optionTitleTmp);
            unitTmp.children(".unit-err").before(optionTextTmp);
        }
        var preID = form.unitList[pos].preID;
        if (preID == 0)
            unitTmp.css("display", "");
        else if (form.unitList[pos].preNum == answerList.formAnswerList[preID - 1].single)
            unitTmp.css("display", "");
        $("#form-end").before(unitTmp);
    }
}
