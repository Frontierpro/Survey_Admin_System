var async = require("async");
var sql = require("../../Data_Layer/sql");

function get_response(answerList, res) {
    var base = "survey_admin_system";
    var topic = answerList.topic;
    var id = answerList.id;
    var userID = answerList.userID;
    var userIP = answerList.userIP;

    var tokenList = [];

    var token = "insert into answer_info (id, topic, user_id, user_ip) values ('";
    token = token + id + "', '";
    token = token + topic + "', '";
    token = token + userID + "', '";
    token = token + userIP + "');";
    tokenList[tokenList.length] = token;

    for (var pos = 0; pos < answerList.formAnswerList.length; pos++) {
        var questionID = answerList.formAnswerList[pos].id;
        if (answerList.formAnswerList[pos].type == 2) {
            var singleAnswer = answerList.formAnswerList[pos].single;
            var token = "insert into option_answer (id, topic, question_id, option_id, user_id, user_ip) values ('";
            token = token + id + "', '";
            token = token + topic + "', ";
            token = token + questionID + ", ";
            token = token + singleAnswer + ", '";
            token = token + userID + "', '";
            token = token + userIP + "');";
            if (singleAnswer != 0)
                tokenList[tokenList.length] = token;
        }
        else if (answerList.formAnswerList[pos].type == 3) {
            var multiAnswer = answerList.formAnswerList[pos].multi;
            for (var tmp = 0; tmp < multiAnswer.length; tmp++) {
                var token = "insert into option_answer (id, topic, question_id, option_id, user_id, user_ip) values ('";
                token = token + id + "', '";
                token = token + topic + "', ";
                token = token + questionID + ", ";
                token = token + multiAnswer[tmp] + ", '";
                token = token + userID + "', '";
                token = token + userIP + "');";
                tokenList[tokenList.length] = token;
            }
        }
        else {
            var textAnswer = answerList.formAnswerList[pos].text;
            var token = "insert into text_answer (id, topic, question_id, answer_text, user_id, user_ip) values ('";
            token = token + id + "', '";
            token = token + topic + "', ";
            token = token + questionID + ", '";
            token = token + textAnswer + "', '";
            token = token + userID + "', '";
            token = token + userIP + "');";
            if (textAnswer != "")
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
        token = "select count(*) as num from answer_info where ";
        token = token + "id = '" + id + "' and ";
        token = token + "topic = '" + topic + "' and ";
        if (answerList.ifID)
            token = token + "user_id = '" + userID + "';";
        else
            token = token + "user_ip = '" + userIP + "';";

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
