var async = require("async");
var sql = require("../../Data_Layer/sql");

function get_response(email, pwd, res) {
    var email_unique_check = function(callback) {
        var base = "survey_admin_system";
        var token = "select count(*) as num from user_info where id = '" + email + "'";
        var resLength = 0;

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Query complete!");
            console.log("");
            console.log("--sql query result--");
            console.log(JSON.stringify(queryRes));
            resLength = parseInt(queryRes[0].num);
            console.log(resLength + " query results in total.");
            console.log("");

            if (resLength > 0)
                callback(true, null);
            else
                callback(null, null);
        });
    }

    var info_insert = function(callback) {
        var base = "survey_admin_system";
        var token = "insert into user_info (id, keyword) values ('" + email + "', '" + pwd + "')";

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Insertion complete!");
            console.log("");
            callback(null, null);
        });
    }

    async.series([email_unique_check, info_insert], function(err, data) {
        if (err)
            res.send(false);
        else
            res.send(true);
    });
}

module.exports = {
    get_response
}
