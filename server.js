var express = require("express");

var server = express();

var rp = require("request-promise");

var bp = require("body-parser");
server.use(bp.json());

server.use(express.static("client"));

server.post("/api/register", function(req, res){
    
    var options = {
        method: 'POST',
        uri: 'https://containerparkproject.firebaseio.com/users.json',
        body: req.body,
        json: true
    };
    
    //console.log(req.body);
    
    rp(options).then(function(){
        console.log("ja!");
    }).catch(function(){
        console.log("nee");
    });
});

server.get("/api/emailcontrole", function(req, res){
    var option = {
        uri: 'https://containerparkproject.firebaseio.com/users.json?orderBy="email"&equalTo="'+ req.body.email+'"',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
})




server.listen(3000);