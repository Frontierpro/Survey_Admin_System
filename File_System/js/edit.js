var userName;

function Option(id, title) {
    this.id = id;
    this.title = title;
}

function Unit(type, id, title, preID, preNum, optionList) {
    this.cnt = 0;
    this.type = type;
    this.id = id;
    this.title = title;
    this.preID = preID;
    this.preNum = preNum;
    this.optionList = optionList;
}

function Form(title, ifID, unitList) {
    this.cnt = 0;
    this.title = title;
    this.ifID = ifID;
    this.unitList = unitList;
}

var form = new Form("", true, []);

window.onload = function() {
    userName = get_cookie("user_name");
    if (userName != undefined) {
        console.log("--website cookie--");
        console.log("'user_name': " + userName);
        $("title").text("问卷编辑 | " + userName);
        renew_cookie();
        initial();
    }
    else {
        set_cookie("edit_log", "http://127.0.0.1:8080/edit.html", 1 / 144,  "/");
        alert("请先登录");
        $(location).attr("href", "http://127.0.0.1:8080/login.html");
    }
}

window.onresize = function() {
    initial();
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
}

$(document).ready(function() {
    $("#unit-insert").mouseover(function() {
        $(this).css("cursor", "pointer");
    });

    $("#unit-insert").mouseout(function() {
        $(this).css("cursor", "default");
    });

    $("body").on("mouseover", "#unit-delete", function() {
        $(this).css("cursor", "pointer");
    });

    $("body").on("mouseout", "#unit-delete", function() {
        $(this).css("cursor", "default");
    });

    $("body").on("mouseover", "#option-delete", function() {
        $(this).css("cursor", "pointer");
    });

    $("body").on("mouseout", "#option-delete", function() {
        $(this).css("cursor", "default");
    });

    $("#unit-insert").click(function() {
        var optionA = new Option(1, "");
        var optionB = new Option(2, "");
        form.cnt++;
        var unit = new Unit(0, form.cnt, "", 0, 0, [optionA, optionB]);
        form.unitList[form.cnt - 1] = unit;
        data_view_async();
    });

    $("#form-btn").click(function() {
        var flag = legal_check();
        if (flag) {
            $.ajax({
                type: "post",
                url: "http://127.0.0.1:8080/set_survey_form",
                data: {
                    "id": userName,
                    "form": JSON.stringify(form)
                },
                success: function(data) {
                    console.log("--nodejs response from web server--");
                    console.log("'sql_input': " + data);
                    if (data == "0")
                        alert("您已创建过该问卷，请勿重复创建！");
                    $(location).attr("href", "http://127.0.0.1:8080/home.html");
                }
            });
        }
        console_log();
        setTimeout(clear_err, 1500);
    });

    $("#form-title").on("blur", function() {
        form.title = $(this).val();
    });

    $("#form-select").on("change", function() {
        if($(this).val() == 'true')
            form.ifID = true;
        else
            form.ifID = false;
    });

    $("body").on("click", "#unit-delete", function() {
        var unitID = $(this).parent().parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf('-') + 1));
        form.cnt--;
        form.unitList.splice(unitNum - 1, 1);
        for (var pos = 0; pos < form.cnt; pos++) {
            form.unitList[pos].id = pos + 1;
            form.unitList[pos].preID = 0;
            form.unitList[pos].preNum = 0;
        }
        data_view_async();
    });

    $("body").on("change", "#unit-type", function() {
        var unitID = $(this).parent().parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf('-') + 1));
        form.unitList[unitNum - 1].type = parseInt($(this).val());
        if ($(this).val() <= 1) {
            form.unitList[unitNum - 1].optionList = [];
            form.unitList[unitNum - 1].cnt = 0;
        }
        data_view_async();
    });

    $("body").on("change", "#pre-unit", function() {
        var unitID = $(this).parent().parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf('-') + 1));
        form.unitList[unitNum - 1].preID = $(this).val();
        data_view_async();
    });

    $("body").on("change", "#pre-option", function() {
        var unitID = $(this).parent().parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf('-') + 1));
        form.unitList[unitNum - 1].preNum = $(this).val();
        data_view_async();
    });

    $("body").on("click", "#unit-btn", function() {
        var unitID = $(this).parent().parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf('-') + 1));
        form.unitList[unitNum - 1].cnt++;
        var option = new Option(form.unitList[unitNum - 1].cnt, "");
        form.unitList[unitNum - 1].optionList[form.unitList[unitNum - 1].cnt - 1] = option;
        data_view_async();
    });

    $("body").on("click", "#option-delete", function() {
        var unitID = $(this).parent().parent().parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf('-') + 1));
        form.unitList[unitNum - 1].cnt--;
        var optionID = $(this).parent().attr("id");
        var optionNum = parseInt(optionID.substring(optionID.indexOf('-') + 1));
        form.unitList[unitNum - 1].optionList.splice(optionNum - 1, 1);
        for (var pos = 0; pos < form.unitList[unitNum - 1].cnt; pos++)
            form.unitList[unitNum - 1].optionList[pos].id = pos + 1;
        for (var pos = 0; pos < form.cnt; pos++)
            if (form.unitList[pos].preID == unitNum)
                form.unitList[pos].preNum = 0;
        data_view_async();
    });

    $("body").on("blur", "#unit-text", function() {
        var unitID = $(this).parent().parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf('-') + 1));
        form.unitList[unitNum - 1].title = $(this).val();
    });

    $("body").on("blur", "#option-text", function() {
        var unitID = $(this).parent().parent().parent().attr("id");
        var unitNum = parseInt(unitID.substring(unitID.indexOf('-') + 1));
        var optionID = $(this).parent().attr("id");
        var optionNum = parseInt(optionID.substring(optionID.indexOf('-') + 1));
        form.unitList[unitNum - 1].optionList[optionNum - 1].title = $(this).val();
    });
})

function data_view_async() {
    var unitTmp = $("#add-model").prev();
    while (unitTmp.attr("id") != "container-0") {
        unitTmp.remove();
        unitTmp = $("#add-model").prev();
    }
    for (var pos = 0; pos < form.cnt; pos++) {
        unitTmp = $("#container-0").clone();
        unitTmp.css("display", "");
        if (form.unitList[pos].type > 1) {
            for (var row = 0; row < form.unitList[pos].cnt; row++) {
                var optionTmp = $("#option-0").clone();
                optionTmp.css("display", "");
                var optionID = form.unitList[pos].optionList[row].id;
                optionTmp.attr("id", "option-" + optionID.toString());
                optionTmp.children("#option-num").text(String.fromCharCode(optionID + 64));
                optionTmp.children("#option-text").val(form.unitList[pos].optionList[row].title);
                unitTmp.children(".unit-content").children("#unit-btn").before(optionTmp);
            }
            unitTmp.children(".unit-content").children("#unit-btn").css("display", "");
        }
        unitTmp.attr("id", "container-" + (pos + 1).toString());
        unitTmp.children(".unit-content").children("#unit-num").text((form.unitList[pos].id).toString());
        unitTmp.children(".unit-content").children("#unit-text").val(form.unitList[pos].title);
        unitTmp.children(".unit-content").children("#unit-type").val((form.unitList[pos].type).toString());
        for (var col = 0; col < pos; col++)
            if (form.unitList[col].type == 2) {
                var nextStr = (col + 1).toString();
                var nextOption = "<option value='" + nextStr + "'>" + nextStr + "</option>";
                unitTmp.children(".unit-content").children("#pre-unit").append(nextOption);
            }
        var preTmp = form.unitList[pos].preID;
        unitTmp.children(".unit-content").children("#pre-unit").val((preTmp).toString());
        if (preTmp > 0)
            for (var tmp = 0; tmp < form.unitList[preTmp - 1].cnt; tmp++) {
                var nextNum = (tmp + 1).toString();
                var nextStr = String.fromCharCode(tmp + 65);
                var nextOption = "<option value='" + nextNum + "'>" + nextStr + "</option>";
                unitTmp.children(".unit-content").children("#pre-option").append(nextOption);
            }
        preTmp = form.unitList[pos].preNum;
        unitTmp.children(".unit-content").children("#pre-option").val(preTmp.toString());
        $("#add-model").before(unitTmp);
    }
}

function legal_check() {
    var flag = true;

    if (form.title.length == 0) {
        $("#form-title-err").text("问卷题目不能为空");
        flag = false;
    }
    else if (form.title.length > 40) {
        $("#form-title-err").text("问卷题目不能超过40字");
        flag = false;
    }
    else
        $("#form-title-err").text("");
    
    for (var pos = 0; pos < form.cnt; pos++) {
        var unitNum = (pos + 1).toString();
        var unitID = "#container-" + unitNum;
        if (form.unitList[pos].title.length == 0) {
            $(unitID).children(".unit-content").children("#unit-text-err").text("题目不能为空");
            flag = false;
        }
        else if (form.unitList[pos].title.length > 1000) {
            $(unitID).children(".unit-content").children("#unit-text-err").text("题目不能超过1000字");
            flag = false;
        }
        else
            $(unitID).children(".unit-content").children("#unit-text-err").text("");
        for (var tmp = 0; tmp < form.unitList[pos].cnt; tmp++) {
            var optionNum = (tmp + 1).toString();
            var optionID = "#option-" + optionNum;
            var parentNode = $(unitID).children(".unit-content").children(optionID);
            if (form.unitList[pos].optionList[tmp].title.length == 0) {
                parentNode.children("#option-text-err").text("选项内容不能为空");
                flag = false;
            }
            else if (form.unitList[pos].optionList[tmp].title.length > 1000) {
                parentNode.children("#option-text-err").text("选项内容不能超过1000字");
                flag = false;
            }
            else
                parentNode.children("#option-text-err").text("");
        }
    }

    return flag;
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

function clear_err() {
    $("#form-title-err").text("");
    for (var pos = 0; pos < form.cnt; pos++) {
        var unitNum = (pos + 1).toString();
        var unitID = "#container-" + unitNum;
        $(unitID).children(".unit-content").children("#unit-text-err").text("");
        for (var tmp = 0; tmp < form.unitList[pos].cnt; tmp++) {
            var optionNum = (tmp + 1).toString();
            var optionID = "#option-" + optionNum;
            var parentNode = $(unitID).children(".unit-content").children(optionID);
            parentNode.children("#option-text-err").text("");
        }
    }
}
