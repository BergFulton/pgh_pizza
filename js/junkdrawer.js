
// end ViewModel *************************************************************

// comment out code not needed
/*        //Event listeners for button interactions
        document.getElementById('hide-listings').addEventListener('click',
            function() {
                hideMarkers(markers);
            });
        //Directions search event listener
        document.getElementById('search-within-time').addEventListener('click', function() {
                searchWithinTime();
            });
        //Listen for the event fired when the user selects a prediction
        //and then clicks "go". Then get more details about the place
        document.getElementById('get-pizza').
        addEventListener('click', textSearchPlaces);
        // //This is the function to hide all listings
        // function hideMarkers(markers) {
        //     for (var i = 0; i < markers.length; i++) {
        //         markers[i].setMap(null);
        //     }
        // }
        //This is the autocomplete for use in the search box to add new places
        var timeAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('pizza-search'));
        //This is the autocomplete for use in getting directions...can this
        //be added to above?
        var timeAutocomplete = new google.maps.places.Autocomplete(
            document.getElementById('search-within-time-text'));
        var searchBox = new google.maps.places.SearchBox(
            document.getElementById('pizza-search'));
        //Search for Places data based on the input of the user.
        function textSearchPlaces() {
            var bounds = map.getBounds();
            hideMarkers(placeMarkers);
            var placesService = new google.maps.places.PlacesService(map);
            placesService.textSearch({
                query: document.getElementById('pizza-search').value,
                bounds: bounds
            }, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    createMarkersForPlaces(results);
                }
            });
        }
        //This function fires when the user selects a searchbox picklist
        //item. It will do a nearby search using the selected query.
        function searchBoxPlaces(searchBox) {
            hideMarkers(placeMarkers);
            var places = searchBox.getPlaces();
            //For each place, get the icon, name, and location.
            createMarkersForPlaces(places);
            if (places.length == 0) {
                window.alert('We did not find any places matching that search.');
            }
        }
        //This function creates markers for each place found in
        //places search.
        function createMarkersForPlaces(places) {
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < places.length; i++) {
                var place = places[i];
                var icon = {
                    url: place.icon,
                    size: new google.maps.Size(35, 35),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                    scaledSize: new google.maps.Size(25, 25)
                };
                //Create a marker for each place.
                var marker = new google.maps.Marker({
                    map: map,
                    icon: userSubIcon,
                    title: place.name,
                    position: place.geometry.location,
                    id: place.id
                });
                //Create a single infowindow to be used with the place detail.
                //Allow only 1 to be open at a time.
                var placeInfoWindow = new google.maps.InfoWindow();
                //If a marker is clicked, do a place details search on
                //it in the next function.
                marker.addListener('click', function() {
                    if (placeInfoWindow.marker == this) {
                        console.log("This infowindow is already on this marker!");
                    } else {
                        getPlacesDetails(this, placeInfoWindow);
                    }
                })
                placeMarkers.push(marker);
                if (place.geometry.viewport) {
                    //Only geocodes have viewports. Apparently.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            }
            map.fitBounds(bounds);
        }
}
     //This is the function to hide all listings
            function hideMarkers(markers) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        }
//This function allows the user to input a desired travel time and travel mode, and a location. It will only show places that are reachable within the desired travel duration period.
        function searchWithinTime() {
            //Initialize the distance matrix service
            var distanceMatrixServce = new google.maps.DistanceMatrixService;
            var address = document.getElementById('search-within-time-text').value;
            //Check to see that the field isn't blank
            if (address == '') {
                window.alert('Yinz gotta give me an address.');
            } else {
                hideMarkers(markers);
                //Use the distance matrix service to calcuate the duration of the routes between all markers, and the destiation set by the user. The put all the origins into an origin matrix.
                var origins = [];
                for (var i = 0; i < markers.length; i++) {
                    origins[i] = markers[i].position;
                }
                var destination = address;
                var mode = document.getElementById('mode').value;
                // Since we have defined the origin & destination, we'll
                // get the info for the distances between them.
                distanceMatrixServce.getDistanceMatrix({
                    origins: origins,
                    destinations: [destination],
                    travelMode: google.maps.TravelMode[mode],
                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                }, function(response, status) {
                    if (status !== google.maps.DistanceMatrixStatus.OK) {
                        window.alert('Error was: ' + status);
                    } else {
                        displayMarkersWithinTime(response);
                    }
                });
            }
        }
//This function checks the results--if the distance is less
        //than the value in the picker, then show it on the map.
        function displayMarkersWithinTime(response) {
            var maxDuration = document.getElementById('max-duration').value;
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;
            // Parse the results, and get distance and duration of each.
            // Because there might be multiple origins and //destinations, we have a nested loop. Then make sure that //at least 1 result was found.
            var atLeastOne = false;
            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    var element = results[j];
                    if (element.status === "OK") {
                        //The distance is returned in feet, but the text is
                        //in miles. If we wanted to show the function to
                        //show markers within a user-specified distance, we
                        //would need the value for distance, but for now we
                        //only need the text.
                        var distanceText = element.distance.text;
                        //Duration is given in seconds, so convert it to minutes.
                        var duration = element.duration.value / 60;
                        var durationText = element.duration.text;
                        if (duration <= maxDuration) {
                            //the origin[i] shoulld = the markers[i]
                            markers[i].setMap(map);
                            atLeastOne = true;
                            //Create a mini infowindow to open immediately //containing the distance and duration
                            var infowindow = new google.maps.InfoWindow({
                                content: durationText + ' away, ' + distanceText +
                                    '<div><input type=\"button\" value=\"View Route\" onclick=' +
                                    '\"displayDirections(&quot;' + origins[i] + '&quot;);\"></input></div>'
                            });
                            infowindow.open(map, markers[i]);
                            //If the user clicks the marker, the small window
                            //closes, and the larger infowindow opens.
                            markers[i].infowindow = infowindow;
                            google.maps.event.addListener(markers[i], 'click', function() {
                                this.infowindow.close();
                            });
                        }
                    }
                }
            }
        }
        //This function is in reponse to the user selecting "show
        //route" on one of the markers iwthin the caluclated distance.
        //This will display the route on the map
        function displayDirections(origin) {
            hideListings();
            var directionsService = new google.maps.DirectionsService;
            //Get the destination service address from the user input.
            var destinationAddress = document.getElementById('search-within-time-text').value;
            //Get mode of transportation from user input.
            var mode = document.getElementById('mode').value;
            directionsService.route({
                //The origin is passed in marker's position.
                origin: origin,
                //The desitation is user entered address
                destination: destinationAddress,
                travelMode: google.maps.TravelMode[mode]
            }, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    var directionsDisplay = new google.maps.DirectionsRenderer({
                        map: map,
                        directions: response,
                        draggable: true,
                        polylineOptions: {
                            strokeColor: 'green'
                        }
                    });
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
}
*/