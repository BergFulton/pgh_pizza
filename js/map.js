var map;

var markers = [];


    //Some pizza places- only the best!
    var pizzaLocations = [{
        'title': 'Fior\'s',
        'location': {
            lat: 40.4127159,
            lng: -80.0325241
        }
    }, {
        'title': 'Franks',
        'location': {
            lat: 40.5882699,
            lng: -80.2267282
        }
    }, {
        'title': 'Police Station Pizza',
        'location': {
            lat: 40.5918369,
            lng: -80.2325444
        }
    }, {
        'title': 'Beto\'s',
        'location': {
            lat: 40.4127159,
            lng: -80.0325241
        }
    }, {
        'title': 'Aiello\'s',
        'location': {
            lat: 40.4332582,
            lng: -79.9253431
        }
    }, {
        'title': 'Mineo\'s',
        'location': {
            lat: 40.4328888,
            lng: -79.9253663
        }
    }, {
        'title': 'Spak Bros.',
        'location': {
            lat: 40.4328888,
            lng: -79.9253663
        }
    }, {
        'title': 'Ephesus',
        'location': {
            lat: 40.4398797,
            lng: -80.0045522
        }
    }];

    //Apply Knockout.js bindings to Pizza data.
    var Pizza = function(data){
    this.title = ko.observable(data.title);
    };

    var ViewModel = function(){
    var self = this;

    this.pizzaList = ko.observableArray([]);

    pizzaLocations.forEach(function(pizzaItem){
        self.pizzaList.push( new Pizza(pizzaItem) );
    })
}   

ko.applyBindings(new ViewModel());

//Draw the map. It's centered on the LatLng for Pittsburgh, PA, USA.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.440625,
            lng: -79.995886
        },
        zoom: 13,
        mapTypeControl: false
    });

    //Set default marker icon color
    var defaultIcon = makeMarkerIcon('0091ff');

    //Set highlighted marker icon color
    var highlightedIcon = makeMarkerIcon('FFFF24');

    //Create marker icons for use in the default icon and highlighted icon
    function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21, 34));
      return markerImage;
    }

    //Loop through the locations array
    for (var i = 0; i < pizzaLocations.length; i++) {
        //get the lat/lng for each item
        var position = pizzaLocations[i].location;
        var title = pizzaLocations[i].title;
        //place a marker on each location
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            id: i
        });

        //Push the marker to our array of markers.
        markers.push(marker);

        // To add the marker to the map, call setMap();
        marker.setMap(map);

        // //Create an onclick event to open the infowindow.
        // marker.addListener('click', function() {
        //     populateInfoWindow(this, largeInfowindow);
        // });

        //Two event listeners - one for mouseover, one for mouseout- changes colors of icon.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });

        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        //This is the autocomplete for use in the search within time field
        var timeAutocomplete = new google.maps.places.Autocomplete(
                document.getElementById('pizza-search'));

        var searchBox = new google.maps.places.SearchBox(
                document.getElementById('pizza-search'));

         //Listen for the event fired when the user selects a prediction 
         //and then clicks "go". Then get more details about the place
            document.getElementById('get-pizza').
            addEventListener('click', textSearchPlaces);

        //Search for Places data based on the input of the user. 
        function textSearchPlaces(){
          var bounds = map.getBounds();
          //hideMarkers(placeMarkers);
          var placesService = new google.maps.places.PlacesService(map);
          placesService.textSearch({
            query: document.getElementById('pizza-search').value,
            bounds: bounds
          }, function(results, status){
            if (status === google.maps.places.PlacesServiceStatus.OK){
              createMarkersForPlaces(results);
            }
          });
        }


        //This function fires when the user selects a searchbox picklist
        //item. It will do a nearby search using the selected query. 
        function searchBoxPlaces(searchBox){
          hideMarkers(placeMarkers);
          var places = searchBox.getPlaces();
          //For each place, get the icon, name, and location.
          createMarkersForPlaces(places);
          if (places.length == 0){
            window.alert('We did not find any places matching that search.');
          }
        }

        //This function creates markers for each place found in 
        //places search.
        function createMarkersForPlaces(places){
          var bounds = new google.maps.LatLngBounds();
          for (var i = 0; i < places.length; i++){
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
              icon: icon, 
              title: place.name,
              position: place.geometry.location,
              id: place.id
            });

            //Create a single infowindow to be used with the place detail. 
            //Allow only 1 to be open at a time.
            var placeInfoWindow = new google.maps.InfoWindow();
            
            //If a marker is clicked, do a place details search on 
            //it in the next function.
            marker.addListener('click', function(){
              if (placeInfoWindow.marker == this){
                console.log("This infowindow is already on this marker!");
              } else {
                getPlacesDetails(this, placeInfoWindow);
              }
            })
            placeMarkers.push(marker);
            if (place.geometry.viewport){
              //Only geocodes have viewports. Apparently.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          }
          map.fitBounds(bounds);
        }
    }
}
