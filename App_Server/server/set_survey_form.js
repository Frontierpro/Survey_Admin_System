var async = require("async");
var sql = require("../../Data_Layer/sql");

function get_response(id, form, res) {
    var base = "survey_admin_system";
    var topic = form.title;

    var tokenList = [];

    var id_require = '0';
    if (form.ifID)
        id_require = '1';
    var token = "insert into survey_info (id, topic, id_require) values ('";
    token = token + id + "', '";
    token = token + topic + "', '";
    token = token + id_require + "');";
    tokenList[tokenList.length] = token;

    for (var pos = 0; pos < form.cnt; pos++) {
        var question_type = "00";
        if (form.unitList[pos].type == 1)
            question_type = "01";
        else if (form.unitList[pos].type == 2)
            question_type = "10";
        else if (form.unitList[pos].type == 3)
            question_type = "11";
        
        var question_id = form.unitList[pos].id;
        var question_title = form.unitList[pos].title;
        var pre_question_id = form.unitList[pos].preID;
        var pre_answer_id = form.unitList[pos].preNum;

        token = "insert into survey_question (id, topic, ";
        token = token + "question_type, question_id, question_title, ";
        token = token + "pre_question_id, pre_answer_id) values ('";
        token = token + id + "', '";
        token = token + topic + "', '";
        token = token + question_type + "', ";
        token = token + question_id + ", '";
        token = token + question_title + "', ";
        token = token + pre_question_id + ", ";
        token = token + pre_answer_id + ");";

        tokenList[tokenList.length] = token;
    }
    
    for (var pos = 0; pos < form.cnt; pos++) {
        var question_id = form.unitList[pos].id;
        for (var tmp = 0; tmp < form.unitList[pos].cnt; tmp++) {
            var option_id = form.unitList[pos].optionList[tmp].id;
            var option_content = form.unitList[pos].optionList[tmp].title;
            token = "insert into survey_option ";
            token = token + "(id, topic, question_id, option_id, option_content) values ('";
            token = token + id + "', '";
            token = token + topic + "', ";
            token = token + question_id + ", ";
            token = token + option_id + ", '";
            token = token + option_content + "');";
            tokenList[tokenList.length] = token;
        }
    }

    var cnt = 0;
    var seriesList = [];

    var survey_insert = function(callback) {
        cnt++;
        sql.get_query_res(base, tokenList[cnt - 1], function(queryRes) {
            console.log("Insertion complete!");
            console.log("");
            callback(null, null);
        });
    }

    var check_unique = function(callback) {
        token = "select count(*) as num from survey_info where ";
        token = token + "id = '" + id + "' and ";
        token = token + "topic = '" + topic + "';"

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Query complete!");
            console.log("");
            console.log("--sql query result--");
            console.log(JSON.stringify(queryRes));
            resLength = parseInt(queryRes.length);
            console.log(resLength + " query results in total.");
            console.log("");

            if (queryRes[0].num > 0)
                callback("0", null);
            else
                callback(null, null);
        })
    }

    seriesList[0] = check_unique;

    for (var pos = 0; pos < tokenList.length; pos++)
        seriesList[pos + 1] = survey_insert;

    async.series(seriesList, function(err, data) {
        if (err)
            res.send(err);
        else
            res.send("Insertion complete!");
    });
}

module.exports = {
    get_response
}
