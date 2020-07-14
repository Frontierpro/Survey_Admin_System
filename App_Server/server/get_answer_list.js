var async = require("async");
var sql = require("../../Data_Layer/sql");

function get_response(publisher_id, title, ifID, userName, res) {
    function Answer(id, choice, text) {
        this.id = id;
        this.choice = choice;
        this.text = text;
    }
    
    function AnswerList(idRequire, id, topic, userID, userIP, formAnswerList) {
        this.ifID = idRequire;
        this.id = id;
        this.topic = topic;
        this.userID = userID;
        this.userIP = userIP;
        this.formAnswerList = formAnswerList;
    }

    var userID = "", userIP = "";
    var id_require;
    if (ifID == "true") {
        userID = userName;
        id_require = true;
    }
    else {
        userIP = userName;
        id_require = false;
    }

    answerList = new AnswerList(id_require, publisher_id, title, userID, userIP, []);

    var get_option_answer = function(callback) {
        var base = "survey_admin_system";
        var token = "select * from option_answer where ";
        token = token + "id = '" + publisher_id + "' and ";
        token = token + "topic = '" + title + "' and ";
        if (ifID == 'true')
            token = token + "user_id = '" + userName + "';";
        else
            token = token + "user_ip = '" + userName + "';";
        var resLength = 0;

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Query complete!");
            console.log("");
            console.log("--sql query result--");
            console.log(JSON.stringify(queryRes));
            resLength = parseInt(queryRes.length);
            console.log(resLength + " query results in total.");
            console.log("");

            for (var pos = 0; pos < queryRes.length; pos++) {
                var answer = new Answer(queryRes[pos].question_id, queryRes[pos].option_id, "");
                answerList.formAnswerList.push(answer);
            }

            callback(null, null);
        });
    }

    var get_text_answer = function(callback) {
        var base = "survey_admin_system";
        var token = "select * from text_answer where ";
        token = token + "id = '" + publisher_id + "' and ";
        token = token + "topic = '" + title + "' and ";
        if (ifID == 'true')
            token = token + "user_id = '" + userName + "';";
        else
            token = token + "user_ip = '" + userName + "';";
        var resLength = 0;

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Query complete!");
            console.log("");
            console.log("--sql query result--");
            console.log(JSON.stringify(queryRes));
            resLength = parseInt(queryRes.length);
            console.log(resLength + " query results in total.");
            console.log("");

            for (var pos = 0; pos < queryRes.length; pos++) {
                var answer = new Answer(queryRes[pos].question_id, 0, queryRes[pos].answer_text);
                answerList.formAnswerList.push(answer);
            }

            callback(null, null);
        });
    }

    async.series([get_option_answer, get_text_answer], function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(JSON.stringify(answerList));
    });
}

module.exports = {
    get_response
}
