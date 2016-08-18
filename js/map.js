//Global variables
var map;
var infowindow;     // create global infowindow 


//Some pizza places- only the best! This is the model.
var pizzaLocations = [{
    'title': 'Fiori\'s',
    'address': '103 Capital Ave, Pittsburgh, PA 15226',
    'phone': '412-343-7788',
    'site': 'http://www.fiorispizzaria.com',
    'cash_only': 'cash only',
    'inside_info': "A little greasy, but a Pittsburgh favorite. Also: pinball!",
    'location': {
        lat: 40.4127159,
        lng: -80.0325241
    }
}, {
    'title': 'Franks',
    'address': '618 Duss Ave, Ambridge, PA 15003',
    'phone': '724-266-2890',
    'site': 'http://www.franks-pizzeria.com',
    'cash_only': 'cash only',
    'inside_info': "Because putting the cheese on top is boring.",
    'location': {
        lat: 40.5882699,
        lng: -80.2267282
    }
}, {
    'title': 'Police Station Pizza',
    'address': '618 Duss Ave, Ambridge, PA 15003',
    'phone': '724-266-3904',
    'site': '',
    'cash_only': 'cash only',
    'inside_info': "By the slice, and know how many slices you need before you hit the door. Cash only.",
    'location': {
        lat: 40.5918369,
        lng: -80.2325444
    }
}, {
    'title': 'Beto\'s',
    'address': '1473 Banksville Rd, Pittsburgh, PA 15216',
    'phone': '412-561-0121',
    'site': '',
    'cash_only': 'accepts cards',
    'inside_info': "Who says the cheese has to be melted?",
    'location': {
        lat: 40.4127159,
        lng: -80.0325241
    }

}, {
    'title': 'Aiello\'s',
    'address': '2112 Murray Ave, Pittsburgh, PA 15217',
    'phone': '412-521-9973',
    'site': 'http://www.aiellospizza.com',
    'cash_only': 'accepts cards',
    'inside_info': "Because someone will ask you: Aiello's or Mineo's? And you'll have to pick a side. Choose wisely.",
    'location': {
        lat: 40.4332582,
        lng: -79.9253431
    }
}, {
    'title': 'Mineo\'s',
     'address': '2128 Murray Ave, Pittsburgh, PA 15217',
    'phone': '412-521-9864',
    'site': 'http://www.mineospizza.com',
    'cash_only': 'accepts cards',
    'inside_info': "Because someone will ask you: Aiello's or Mineo's? And you'll have to pick a side. Choose wisely.",
    'location': {
        lat: 40.4328888,
        lng: -79.9253663
    }
}, {
    'title': 'Spak Bros.',
    'address': '5107 Penn Ave, Pittsburgh, PA 15224',
    'phone': '412-362-7725',
    'site': 'http://www.spakbrothers.com',
    'cash_only': 'accepts cards',
    'inside_info': "Need some seitan wings with your pizza? Plays Fugazi's 'Waiting Room' as their hold music.",
    'location': {
        lat: 40.4650793,
        lng: -79.9447056
    }
}, {
    'title': 'Ephesus',
    'address': '219 Fourth Ave, Pittsburgh, PA 15222',
    'phone': '412-552-9020',
    'site': 'http://www.ephesuspizza.com',
    'cash_only': 'accepts cards',
    'inside_info': "One of a very few local pizza joints in downtown.",
    'location': {
        lat: 40.4398797,
        lng: -80.0045522
    }
}];



var ViewModel = function() {
    var self = this;

    // add variable to hold text input value 
    self.query = ko.observable();


    //Pizza constructor
    var Pizza = function(data) {
      this.title = data.title;
      this.address = data.address;
      this.phone = data.phone;
      this.site = data.site;
      this.cash_only = data.cash_only;
      this.inside_info = data.inside_info;
      // add the location data so that you can create a marker with pizzaList
      this.location = data.location;
    };

    this.pizzaList = ko.observableArray([]);

    pizzaLocations.forEach(function(pizzaItem) {
        self.pizzaList.push(new Pizza(pizzaItem));
    });

     //Foursquare API request. 
    //Thanks to CPerry24 and his repo at github.com/cperry24/interactive-map
    //for the help. 
    function fourSquareData(location){
        var clientID = 'HTWGIKQP10NE4YN5UTTQP5VDG5VSBGVC51PCQPG5NJCF1IG3';
        var clientSecret = 'GIM4SA1DH43FQ5JN0VEG013HJ3D3JMAOORG2V1GKZXHFHYQM';
        var fqVersion = '20130815'; //I don't actually know what this is?
        var fourSqURL;
        var fqLat;
        var fqLng;

        //Use the lat/lng from the pizzaLocations array to build the Foursquare request
        var fqLat = pizzaLocation.location.lat;
        var fqLng = pizzaLocation.location.lng;
        fourSqURL = 'https://api.foursquare.com/v2/venues/explore' + '?client_id=' + clientID + '&client_secret=' + clientSecret + '&v=' + fqVersion + '&ll=' + fqLat + ',' + fqLng + '&limit=50';

        //AJAX request
         $.ajax({
            url: fourSqUrl,
            datatype: "jsonp",
            success: function(response) {
                resp = response.response.groups[0].items[0].venue;
                console.log(resp);
                //Build infoWindow content string with data from API Request
                infoWindow.setContent('<a href="' + location.fourSqUrl + '">' + resp.name + '</a>' + '<br>' + location.phone + '<br>' + location.address + '<br>' + resp.location.city + ', ' + resp.location.state + ' ' + resp.location.postalCode + '<br>' + location.description + '<br>'  + '<a href="' + location.website + '">' + location.website + '</a>' + '<br>' + '<a href="' + location.twitterLink + '">' + '@' + location.twitter + '</a>');
                
                infoWindow.open(map, location.marker); //open the info window
            }, // Error method to be run if request fails
            error: function(fourSqUrl, errorMsg) {
                setTimeout(function() { // Display error after 2 seconds if Request to API fails
                    if (errorMsg) {
                        infoWindow.setContent("I'm sorry, an error has occurred. Please try again later.");
                        infoWindow.open(map, location.marker);
                    }
                }, 2000);
            }
            
        });

    }

    //Set default map marker icon color
    var defaultIcon = makeMarkerIcon('0091ff');

    //Set highlighted marker icon color
    var highlightedIcon = makeMarkerIcon('FFFF24');

    //Set icon color for a user-submitted entry
    var userSubIcon = makeMarkerIcon('FFA500');


    //Create marker icons for use in the default icon and highlighted icon
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    //Loop through the self.pizzaList() array
    for (var i = 0; i < self.pizzaList().length; i++) {
        //get the lat/lng for each item
        var position = self.pizzaList()[i].location;
        var title = self.pizzaList()[i].title;       
        //place a marker on each location
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            id: i
        });

        // To add the marker to the map, call setMap();
        marker.setMap(map);

        //Two event listeners - one for mouseover, one for mouseout- changes colors of icon.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });

        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        // add listener to set infowindow content and set open
        marker.addListener('click', function() {
            infowindow.setContent(this.title)
            infowindow.open(map, this )
        });

        // set marker as a property of pizzaList location 
        self.pizzaList()[i].marker = marker;

    }


    // function to trigger marker click when list view item is clicked *********
    self.openWindow = function(location) {
      google.maps.event.trigger( location.marker,'click');
    }
} 






























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

//Draw the map. It's centered on the LatLng for Pittsburgh, PA, USA.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.440625,
            lng: -79.995886
        },
        zoom: 10,
        mapTypeControl: true
    });

    // create global infowindow ************************************************
    infowindow = new google.maps.InfoWindow();
    ko.applyBindings(new ViewModel());
}
