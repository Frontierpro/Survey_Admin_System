var async = require("async");
var sql = require("../../Data_Layer/sql");

function get_response(id, title, ifID, res) {
    var userList = [];

    var get_user_list = function(callback) {
        var base = "survey_admin_system";
        var token;
        if (ifID == 'true')
            token = "select user_id from answer_info where ";
        else
            token = "select user_ip from answer_info where ";
        token = token + "id = '" + id + "' and ";
        token = token + "topic = '" + title + "';"
        var resLength = 0;

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Query complete!");
            console.log("");
            console.log("--sql query result--");
            console.log(JSON.stringify(queryRes));
            resLength = parseInt(queryRes.length);
            console.log(resLength + " query results in total.");
            console.log("");

            for (var pos = 0; pos < queryRes.length; pos++)
                if (ifID == 'true')
                    userList[pos] = queryRes[pos].user_id;
                else
                    userList[pos] = queryRes[pos].user_ip;

            callback(null, null);
        });
    }

    async.series([get_user_list], function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(JSON.stringify(userList));
    });
}

module.exports = {
    get_response
}
