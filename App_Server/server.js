var express = require("express");
var bodyParser = require("body-parser");
var getRegisterForm = require("./get_register_form");
var getLoginForm = require("./get_login_form");

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
    console.log("--post request from register.html--")
    console.log("'email': " + email);
    console.log("'password': " + pwd);
    console.log("");
    getRegisterForm.get_response(email, pwd, res);
});

app.post("/get_login_form", function(req, res) {
    var email = req.body.email;
    var pwd = req.body.pwd;
    console.log("--post request from login.html--")
    console.log("'email': " + email);
    console.log("'password': " + pwd);
    console.log("");
    getLoginForm.get_response(email, pwd, res);
});

var server = app.listen(8080);
