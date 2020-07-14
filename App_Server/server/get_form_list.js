var async = require("async");
var sql = require("../../Data_Layer/sql");

function get_response(id, res) {
    function Form(title) {
        this.title = title;
    }

    function FormList() {
        this.id = id;
        this.userFormList = [];
    }

    var formList = new FormList();

    var get_form_title = function(callback) {
        var base = "survey_admin_system";
        var token = "select topic from survey_info where id = '" + id + "';";

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Query complete!");
            console.log("");
            console.log("--sql query result--");
            console.log(JSON.stringify(queryRes));
            resLength = parseInt(queryRes.length);
            console.log(resLength + " query results in total.");
            console.log("");

            for (var pos = 0; pos < resLength; pos++) {
                var form = new Form(queryRes[pos].topic);
                formList.userFormList[pos] = form;
            }

            if (resLength > 0)
                callback(null, null);
            else
                callback(JSON.stringify(formList), null);
        });
    }

    async.series([get_form_title], function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(JSON.stringify(formList));
    });
}

module.exports = {
    get_response
}
