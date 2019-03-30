var http = require('http');
var urlTool = require('url');
var querystring = require('querystring');
var jade = require('jade');
var fs = require('fs');
var validator = require('./validator');


var users = {}


http.createServer(function(req, res){
    console.log(req.method);
    //sendFile(res, 'validator.js', 'text/javascript');
    //sendFile(res, 'signup.js', 'text/javascript');
    switch(req.url){
        case '/validator.js':
            //console.log("run");
            sendFile(res, 'validator.js', 'text/javascript');
            break;
        case '/signup.js':
            sendFile(res, 'signup.js', 'text/javascript');
            break;
        case '/style.css':
            sendFile(res, 'style.css', 'text/css');
            //sendFile(res, 'font.ttf', 'text/ttf');
            break;
        default:
            req.method === 'POST' ? registUser(req, res) : sendHtml(req, res);

    }
}).listen(8000);

console.log("Signup server is listening at 8000");

function sendFile(res, filepath, mime){
    //console.log(mime);
    res.writeHead(200,{"Content-Type": mime});
    res.end(fs.readFileSync(filepath));
}

function registUser(req, res) {
    req.on('data', function (chunk) {
        try{
            var user = parseUser(chunk.toString());
            tmp_user = user;
            checkUser(user);
            //console.log("user: ",user);
            users[user.username] = user;
            res.writeHead(301, {Location : "?username=" + user.username});
            res.end();
        } catch(error) {
            console.warn("[regist error]", error);
            showSignup(res, user, error.message);
        }


    });
}

function checkUser(user) {
    var errorMessages = [];
    for(var key in user){
        if (!validator.isFieldValid(key, user[key])){
            errorMessages.push(validator.form[key].errorMessage);
        }
        if(!validator.isAttrValueUnique(users, user, key)){
            errorMessages.push("key: " + key + " is not unique by value: " + user[key]);
        }
    }
    if (errorMessages.length > 0) throw new Error(errorMessages.join('<br />'));
}

function parseUser(message) {
    params = message.match(/username=(.+)&sid=(.+)&phone=(.+)&email=(.+)/);
    var user = {username: params[1],
                sid: params[2],
                phone: params[3],
                email: decodeURIComponent(params[4])};
    console.log("user parsed is: ", user);
    return user;
}

function sendHtml(req, res){
    var username = parseUsername(req);
    //console.log(username);
    if (!username || !isRegistedUser(username)) {
        //console.log("yes");
        showSignup(res, {username: username}, null);
    } else {
        //console.log("no");
        showDetail(res, users[username]);
    }
}

function parseUsername(req) {
    return querystring.parse(urlTool.parse(req.url).query).username;
}

function isRegistedUser(username){
    return !!users[username];
}

function showSignup(res, user, error){
    showHtml(res, 'signup.jade', {usr: user, error:error});
}

function showDetail(res, user) {
    showHtml(res, 'detail.jade', user);
}

function showHtml(res, template, data) {
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end(jade.renderFile(template, data));
}