var async = require("async");
var sql = require("../Data_Layer/sql");

function get_response(email, pwd, res) {
    var email_check = function(callback) {
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
                callback(null, null);
            else
                callback("1", null);
        });
    }

    var pwd_check = function(callback) {
        var base = "survey_admin_system";
        var token = "select count(*) as num from user_info where id = '" + email + "' ";
        token = token +  "and keyword = '" + pwd + "'";
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
                callback(null, null);
            else
                callback("2", null);
        });
    }

    async.series([email_check, pwd_check], function(err, data) {
        if (err)
            res.send(err);
        else
            res.send("0");
    });
}

module.exports = {
    get_response
}
