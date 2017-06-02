var app = angular.module("app", ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl: "login.html",
        controller: "controller"
    }).when("/main",{
        templateUrl: "main.html",
        controller: "mainController"
    }).when("/betalen",{
        templateUrl: "betaling.html",
        controller: "mainController"
    }).otherwise({
        redirectTo: "/"
    });
});

        app.controller("controller", function($scope, $http, $location) {
            
            $scope.user = {
                "password": "",
                "firstName": "",
                "lastName": "",
                "email": ""
            };
            

            parseParams = function() {
                var params = {},
                    queryString = location.hash.substring(1),
                    regex = /([^&=]+)=([^&]*)/g,
                    m;
                while (m = regex.exec(queryString)) {
                    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                }
                return params;
            };

            params = parseParams();

            if (params.access_token) {
                $http.get('https://graph.facebook.com/v2.5/me?fields=name,id&access_token=' + params.access_token).then(function(res) {
                    console.log(res);
                    $scope.test = res.data.name;
                }, function(err) {
                    $scope.test = err;
                });
            }



            $scope.OAuthFb = function() {
                window.location.href = "https://www.facebook.com/v2.9/dialog/oauth?client_id=840991062719449&redirect_uri=http://localhost:3000/main.html?html&response_type=token&scope=email";
                $location.path("/main");
            };

            $scope.register = function() {
                if($scope.user.email && $scope.user.firstName && $scope.user.lastName && $scope.user.password){
                    if($scope.user.password == $scope.herhaalPassword){
                        $http.post("http://localhost:3000/api/register", $scope.user).success(function(res) {
                            if(res == true){
                                $scope.test = "Account aangemaakt";
                                document.getElementById("defaultOpen").click();
                            }
                            else{
                                $scope.test = "email al in gebruik."
                            }
                        });
                    }
                    else{
                        $scope.test = "Wachtwoorden komen niet overeen."
                    }
                }
                else{
                    $scope.test = "Controlleer of alle velden zijn ingevuld";
                }
            };
            $scope.login = function() {
                $http.post("http://localhost:3000/api/login", $scope.user).success(function(res) {
                    if(res == true){
                        $location.path('/main');
                    }
                }).catch(function(err) {
                    console.log(err);
                });
            };


        });

app.controller("mainController", function($scope, $http, $location){
    var map;
    var initMap;
    var arrayLocations;
    //initMap();
    
    $scope.credentials = {
        "kaartNr": "",
        "vervalMaand": "",
        "vervalJaar":"",
        "CVC":"",
        "kost":""
    }
    
    
    

            initMap = function() {
                map = new google.maps.Map(document.getElementById('map'));
                $http.get("http://datasets.antwerpen.be/v4/gis/recyclageparkoverzicht.json").success(function(res) {
                    arrayLocations = res.data;
                    for (var i = 0; i < arrayLocations.length; i++) {
                        createMarker(i);
                    }
                }).catch(function(err) {
                    console.log(err);
                });
                getCurrentLocation();
            }
            
            
            
            var createMarker = function(i) {
                var markerLatLng = {
                    lat: parseFloat(arrayLocations[i].point_lat),
                    lng: parseFloat(arrayLocations[i].point_lng)
                };


                var content = '<h3>' + arrayLocations[i].naam + '</h3>' +
                    '<p>Adres: ' + arrayLocations[i].straat + ' ' + arrayLocations[i].district + ' ' + arrayLocations[i].postcode + '</p><p>type: ' + arrayLocations[i].type + '</p><p>subtype: ' + arrayLocations[i].subtype;

                var infoWindow = new google.maps.InfoWindow({
                    content: content
                });

                var marker = new google.maps.Marker({
                    position: markerLatLng,
                    title: arrayLocations[i].naam,
                    map: map
                });
                marker.addListener('click', function() {
                    infoWindow.open(map, marker);
                });
            }
            
            var getCurrentLocation = function(){
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var pos = {
                            lat: parseFloat(position.coords.latitude),
                            lng: parseFloat(position.coords.longitude)
                        };
                        console.log(pos);

                        var marker = new google.maps.Marker({
                            position: pos,
                            title: "u bent hier",
                            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            animation: google.maps.Animation.DROP
                        });

                        marker.setMap(map);
                        map.setCenter(pos);
                        map.setZoom(13);
                    }, function() {
                        console.log("location not found");
                    });
                } else {
                    console.log("location not found");
                }
            }
            initMap();
    
    
    var prijsSteenpuin=37.5;
    var prijsGrofVuil = 20.0;
    
    var kostSteenpuin = 0.0;
    var kostGrofVuil = 0.0;
    
    $scope.kost = 0.0;
    
    $scope.aantalTot3 = [0, 1, 2,3];
    $scope.aantalTot2 = [0,1,2];
    $scope.aantalTot5 = [0,1,2,3,4,5];
    
    
    
    
    
    $scope.$watch('selectedSteenpuin', function(){
        kostSteenpuin = $scope.selectedSteenpuin * prijsSteenpuin;
        console.log(kostSteenpuin);
    });
    $scope.$watch('selectedGrofVuil', function(){
        kostGrofVuil = $scope.selectedGrofVuil * prijsGrofVuil;
        console.log(kostGrofVuil);
    });
    
    $scope.betaal = function(){
        $scope.credentials.kost = $scope.calculateTotalAmount();
        $location.path('betalen');
    }
    
    $scope.calculateTotalAmount = function(){
        return kostSteenpuin + kostGrofVuil; 
    }
    
    $scope.bevestigBetaling = function(){
        $scope.credentials.kost = $scope.calculateTotalAmount();
        //console.log($scope.credentials);
        $http.post("http://localhost:3000/api/betaal", $scope.credentials).success(function(res){
            
        });
    }
    
    
});