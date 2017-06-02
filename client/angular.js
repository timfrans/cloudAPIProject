var app = angular.module("app", ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl: "login.html",
        controller: "controller"
    }).when("/main",{
        templateUrl: "main.html",
        controller: "mainController"
    });
});

app.factory('service', function(){
    var user = {}
    return user;
});
        app.controller("controller", function($scope, $http, $location, service) {
            
            service.user = $scope.user;
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
                window.location.href = "https://www.facebook.com/v2.9/dialog/oauth?client_id=840991062719449&redirect_uri=http://localhost:3000/ingelogd.html?html&response_type=token&scope=email";
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

app.controller("mainController", function($scope, $http, service){
    var map;
    var initMap;
    var arrayLocations;
    //initMap();
    
    $scope.user = service.getUser();
    console.log($scope.user.firstName);
    

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
});