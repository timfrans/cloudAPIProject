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
    
    //console.log(req.body.email);
    rp(optionsGet)
        .then(function(reposGet){
        console.log(reposGet);
            if(Object.keys(reposGet).length == 0){
                rp(optionsPost).then(function(reposPost){
                    res.status(200).send(true);
                    
                }).catch(function(){
                    console.log("error bij register post");
                });
            }
            else{
                res.status(200).send(false);
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
                res.status(200).send(false);
            }
            else{
                var user = reposGet[Object.keys(reposGet)[0]];
                console.log(user);
                if(user.email == req.body.email && user.password == req.body.password){
                    res.status(200).send(true);
                }
                
            }
        })
        .catch(function(err){
            console.log(err);
    });
});

server.post("/api/betaal", function(req, res){
    console.log(req);
    var optionPost={
        method: 'POST',
        uri: 'https://api.stripe.com/v1/tokens',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer sk_test_aBBaoRknKHT6nY4zMer4HeNg'
        },
        data: {
            'card[number]': 4242424242424242,
            'card[exp_month]': 12,
            'card[exp_year]': 2018,
            'card[cvc]': 123
        }
        //data: 'card[number]=' + req.kaartNr + '&card[exp_month]=' + req.vervalMaand + '&card[exp_year]=' + req.vervalJaar + '&card[cvc]=' + req.CVC
    }
    
    rp(optionPost).then(function(repos){
        console.log(repos);
    }).catch(function(err){
        console.log(err);
    });
    
})




server.listen(3000);