var express = require("express");

var server = express();

var rp = require("request-promise");

var bp = require("body-parser");
server.use(bp.json());

server.use(express.static("client"));

server.post("/api/register", function(req, res){
    var optionsGet = {
        method: 'GET',
        uri: 'https://containerparkproject.firebaseio.com/users.json?orderBy="email"&equalTo="' + req.body.email +'"',
        json: true
        }
    
    var optionsPost = {
        method: 'POST',
        uri: 'https://containerparkproject.firebaseio.com/users.json',
        body: req.body,
        json: true
    }
    
    rp(optionsGet)
        .then(function(reposGet){
            console.log(reposGet);
            if(Object.keys(reposGet).length == 0){
                rp(optionsPost).then(function(reposPost){
                    res.status(200).send("email aangemaakt");
                    
                }).catch(function(){
                    console.log("error bij register post");
                });
            }
            else{
                res.status(200).send("email bestaat al");
            }
    }).catch(function(err){
        console.log("error bij register get");
    });
});

server.post("/api/login", function(req, res){
    var optionsGet = {
        method: 'GET',
        uri: 'https://containerparkproject.firebaseio.com/users.json?orderBy="email"&equalTo="' + req.body.email +'"',
        json: true
        }
    rp(optionsGet)
        .then(function(reposGet){
            if(Object.keys(reposGet).length == 0){
                res.status(200).send("account bestaat niet");
            }
            else{
                var user = reposGet[Object.keys(reposGet)[0]];
                console.log(user.email);
                if(user.email == req.body.email && user.password == req.body.password){
                    res.status(200).send("u bent ingelogd");
                }
                
            }
        })
        .catch(function(err){
            console.log(err);
    });
});




server.listen(3000);