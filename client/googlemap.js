var map;
var initMap;
var arrayLocations;

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