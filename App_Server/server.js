var express = require("express");
var bodyParser = require("body-parser");
var getRegisterForm = require("./server/get_register_form");
var getLoginForm = require("./server/get_login_form");
var setSurveyForm = require("./server/set_survey_form");
var getFormList = require("./server/get_form_list");
var getFormContent = require("./server/get_form_content");
var setFormAnswer = require("./server/set_form_answer");
var getAnswerUser = require("./server/get_answer_user");
var getAnswerList = require("./server/get_answer_list");
var dropSurveyForm = require("./server/drop_survey_form");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("../File_System/html"));
app.use(express.static("../File_System/css"));
app.use(express.static("../File_System/js"));
app.use(express.static("../File_System/img"));

app.post("/get_register_form", function(req, res) {
    var email = req.body.email;
    var pwd = req.body.pwd;
    console.log("--post request from register.html--");
    console.log("'email': " + email);
    console.log("'password': " + pwd);
    console.log("");
    getRegisterForm.get_response(email, pwd, res);
});

app.post("/get_login_form", function(req, res) {
    var email = req.body.email;
    var pwd = req.body.pwd;
    console.log("--post request from login.html--");
    console.log("'email': " + email);
    console.log("'password': " + pwd);
    console.log("");
    getLoginForm.get_response(email, pwd, res);
});

app.post("/set_survey_form", function(req, res) {
    var id = req.body.id;
    var form = JSON.parse(req.body.form);
    console.log("--post request from edit.html--");
    console.log("'user_id': " + id);
    console.log("'form_title': " + form.title);
    console.log("");
    setSurveyForm.get_response(id, form, res);
});

app.post("/get_form_list", function(req, res) {
    var id = req.body.id;
    console.log("--post request from edit.html--");
    console.log("'user_id': " + id);
    console.log("");
    getFormList.get_response(id, res);
});

app.get('/get_form_content', function(req, res) {
    var topic = req.query.title;
    var email = req.query.id;
    console.log("--post request from fill/result.html--");
    console.log("'user_id': " + email);
    console.log("'form_title': " + topic);
    console.log("");
    getFormContent.get_response(email, topic, res);
});

app.post('/set_form_answer', function(req, res) {
    var answerList = JSON.parse(req.body.answer_list);
    console.log("--post request from fill.html--");
    if (answerList.ifID)
        console.log("'user_id': " + answerList.userID);
    else
        console.log("'user_ip': " + answerList.userIP);
    console.log("'form_title': " + answerList.topic);
    console.log("");
    setFormAnswer.get_response(answerList, res);
});

app.get('/get_answer_user', function(req, res) {
    var id = req.query.id;
    var title = req.query.title;
    var ifID = req.query.ifID;
    console.log("--post request from result.html--");
    console.log("'user_id': " + id);
    console.log("'form_title': " + title);
    console.log("'id_require': " + ifID);
    console.log("");
    getAnswerUser.get_response(id, title, ifID, res);
});

app.get('/get_answer_list', function(req, res) {
    var id = req.query.id;
    var title = req.query.title;
    var ifID = req.query.ifID;
    var userName = req.query.userName;
    console.log("--post request from result.html--");
    console.log("'user_id': " + id);
    console.log("'form_title': " + title);
    console.log("'id_require': " + ifID);
    console.log("'user_name': " + userName);
    console.log("");
    getAnswerList.get_response(id, title, ifID, userName, res);
});

app.get('/drop_survey_form', function(req, res) {
    var id = req.query.id;
    var topic = req.query.topic;
    console.log("--post request from result.html--");
    console.log("'user_id': " + id);
    console.log("'form_title': " + topic);
    console.log("");
    dropSurveyForm.get_response(id, topic, res);
});

var server = app.listen(8080);
