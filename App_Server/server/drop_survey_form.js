var async = require("async");
var sql = require("../../Data_Layer/sql");

function get_response(id, topic, res) {
    var base = "survey_admin_system";

    var tokenList = [];

    var token = "delete from survey_info where ";
    token = token + "id = '" + id + "' and ";
    token = token + "topic = '" + topic + "';";
    tokenList[tokenList.length] = token;

    var token = "delete from survey_question where ";
    token = token + "id = '" + id + "' and ";
    token = token + "topic = '" + topic + "';";
    tokenList[tokenList.length] = token;

    var token = "delete from survey_option where ";
    token = token + "id = '" + id + "' and ";
    token = token + "topic = '" + topic + "';";
    tokenList[tokenList.length] = token;

    var token = "delete from answer_info where ";
    token = token + "id = '" + id + "' and ";
    token = token + "topic = '" + topic + "';";
    tokenList[tokenList.length] = token;

    var token = "delete from option_answer where ";
    token = token + "id = '" + id + "' and ";
    token = token + "topic = '" + topic + "';";
    tokenList[tokenList.length] = token;

    var token = "delete from text_answer where ";
    token = token + "id = '" + id + "' and ";
    token = token + "topic = '" + topic + "';";
    tokenList[tokenList.length] = token;

    var cnt = 0;
    var seriesList = [];

    var survey_delete = function(callback) {
        cnt++;
        sql.get_query_res(base, tokenList[cnt - 1], function(queryRes) {
            console.log("Delete complete!");
            console.log("");
            callback(null, null);
        });
    }

    for (var pos = 0; pos < tokenList.length; pos++)
        seriesList[pos] = survey_delete;

    async.series(seriesList, function(err, data) {
        if (err)
            res.send(err);
        else
            res.send("Delete complete!");
    });
}

module.exports = {
    get_response
}
