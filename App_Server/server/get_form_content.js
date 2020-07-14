var async = require("async");
var sql = require("../../Data_Layer/sql");

function get_response(email, topic, res) {
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

    form = new Form(topic, true, []);

    var get_form_info = function(callback) {
        var base = "survey_admin_system";
        var token = "select id_require from survey_info where id = '" + email + "'";
        token = token + " and topic = '" + topic + "';";

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Query complete!");
            console.log("");
            console.log("--sql query result--");
            console.log(JSON.stringify(queryRes));
            resLength = parseInt(queryRes.length);
            console.log(resLength + " query results in total.");
            console.log("");
            
            if (resLength > 0) {
                if (queryRes[0].id_require == '0')
                    form.ifID = false;
                callback(null, null);
            }
            else {
                form.title = "unknown";
                callback(JSON.stringify(form), null);
            }
        });
    }

    var get_unit_info = function(callback) {
        var base = "survey_admin_system";
        var token = "select * from survey_question where id = '" + email + "'";
        token = token + " and topic = '" + topic + "';";

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Query complete!");
            console.log("");
            console.log("--sql query result--");
            console.log(JSON.stringify(queryRes));
            resLength = parseInt(queryRes.length);
            console.log(resLength + " query results in total.");
            console.log("");

            if (resLength > 0) {
                form.cnt = resLength;
                for (var pos = 0; pos < resLength; pos++) {
                    var questionType = 0;
                    if (queryRes[pos].question_type == "01")
                        questionType = 1;
                    else if (queryRes[pos].question_type == "10")
                        questionType = 2;
                    else if (queryRes[pos].question_type == "11")
                        questionType = 3;
                    
                    var questionID = queryRes[pos].question_id;
                    var questionTitle = queryRes[pos].question_title;
                    var preQuestionID = queryRes[pos].pre_question_id;
                    var preAnswerID = queryRes[pos].pre_answer_id;

                    var unit = new Unit(questionType, questionID, questionTitle, preQuestionID, preAnswerID, []);
                    form.unitList[pos] = unit;
                }
                callback(null, null);
            }
            else
                callback(JSON.stringify(form), null);
        });
    }

    var get_option_info = function(callback) {
        var base = "survey_admin_system";
        var token = "select * from survey_option where id = '" + email + "'";
        token = token + " and topic = '" + topic + "';";

        sql.get_query_res(base, token, function(queryRes) {
            console.log("Query complete!");
            console.log("");
            console.log("--sql query result--");
            console.log(JSON.stringify(queryRes));
            resLength = parseInt(queryRes.length);
            console.log(resLength + " query results in total.");
            console.log("");

            if (resLength > 0) {
                for (var pos = 0; pos < resLength; pos++) {
                    var questionID = queryRes[pos].question_id;
                    var optionID = queryRes[pos].option_id;
                    var optionContent = queryRes[pos].option_content;

                    var option = new Option(optionID, optionContent);
                    for (var tmp = 0; tmp < form.cnt; tmp++) {
                        if (form.unitList[tmp].id == questionID) {
                            form.unitList[tmp].optionList[form.unitList[tmp].cnt] = option;
                            form.unitList[tmp].cnt++;
                            break;
                        }
                    }
                }
                callback(null, null);
            }
            else
                callback(JSON.stringify(form), null);
        });
    }

    async.series([get_form_info, get_unit_info, get_option_info], function(err, data) {
        if (err)
            res.send(err);
        else
            res.send(JSON.stringify(form));
    });
}

module.exports = {
    get_response
}
