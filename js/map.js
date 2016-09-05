//Global variables
var map;
var infowindow; // create global infowindow


//Some pizza places- only the best! This is the model.
var pizzaLocations = [{
    'title': 'Fiori\'s',
    'address': '103 Capital Ave, Pittsburgh, PA 15226',
    'phone': '412-343-7788',
    'site': 'http://www.fiorispizzaria.com',
    'cash_only': 'cash only',
    'inside_info': "A little greasy, but a Pittsburgh favorite. Also: pinball!",
    'fqId': "4b529c71f964a520d68327e3",
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
    'fqId': "4b58ac5cf964a520fc6428e3",
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
    'fqId': "4b9ac8adf964a52048d535e3",
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
    'fqId': "4af38ebcf964a52098ee21e3",
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
    'fqId': "4aa6cafdf964a520ff4a20e3",
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
    'fqId': "4ad7c0ebf964a520600e21e3",
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
    'fqId': "4ad7af38f964a520a50d21e3",
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
    'fqId': "4ad89cbcf964a520d71221e3",
    'location': {
        lat: 40.4398797,
        lng: -80.0045522
    }
}, {
    'title': 'Juliano\'s',
    'address': '5476 Steubenville Pike, McKees Rocks, PA 15136',
    'phone': '412-787-2959',
    'site': 'http://www.julianosonline.com',
    'cash_only': 'accepts cards',
    'inside_info': "A family joint with great pasta AND pizza. You want the chunky sauce.",
    'fqId': "4b6a08a3f964a5201fc32be3",
    'location': {
        lat: 40.4502136,
        lng: -80.1283347
    }
}];

/* MOVE FOURSQUARE API REQUEST OUT OF VIEW MODEL -----------------------------------------------*/

// Run Foursquare venue seach for location *********************************
var addFq = function(location) {
    //Foursquare credentials for executing API request
    var clientID = 'HTWGIKQP10NE4YN5UTTQP5VDG5VSBGVC51PCQPG5NJCF1IG3';
    var clientSecret = 'GIM4SA1DH43FQ5JN0VEG013HJ3D3JMAOORG2V1GKZXHFHYQM';
    var reqUrl = "https://api.foursquare.com/v2/venues/";

    var fsquareId = location.fqId;
    var myUrl = reqUrl + fsquareId + "?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20160624";

    function prettyHours(timeframes) {
       // create an empty string to hold the formatted data
       var formattedTimeframes = "";
       var formattedHours = "";
       var times = "";

       // unpack the timeframes object and create the HTML to display it
       timeframes.forEach(function(frame) {

        for (var i = 0; i < frame.open.length; i++) {
          times = frame.open[i].renderedTime;
        }
        formattedTimeframes += frame.days + ': ' + times + '<br />';
       });

       // return formatted data to be used in infowindow
       return formattedTimeframes;
    }

    $.ajax({
        type: "GET",
        dataType: "json",
        url: myUrl
    })
    .done(function(data) {
        // set shortand for venue
        var venue = data.response.venue;

        // unless the API thinks the hours are empty
        if (typeof venue.hours != 'undefined') {
          // Get the timeframes array from the venue object
          var timeframes = venue.hours.timeframes;
          // Format the data and return it
          location.times = prettyHours(timeframes);
          // also show whether it is open or closed
          location.open = venue.hours.isOpen ? 'Open' : 'Closed';
        } else {
          // otherwise it's all n/a
          location.times = "Not available";
          location.open = "Not available";
        }

        // Error messages for other data
        location.likes = venue.likes.count ? venue.likes.count : "Like count not available" ;
        location.url = venue.url ? venue.url : "No website";

        var fsContent = '<h3>' + location.title + '</h3>' +
                '<p> Open now?: '+ location.open + '</p>' +
                '<p> Hours: ' + location.times + '</p>' +
                '<p> url: <a href="' + location.url + '">' + location.url + '</a></p>' +
                '<p> Likes: ' + location.likes + '</p>';
        infowindow.setContent(fsContent);
        infowindow.open(map, location.marker);
    });
};


//Pizza constructor
var Pizza = function(data) {
    var self = this;
    this.title = data.title;
    this.address = data.address;
    this.phone = data.phone;
    this.site = data.site;
    this.cash_only = data.cash_only;
    this.inside_info = data.inside_info;
    this.fqId = data.fqId;
    // add the location data so self you can create a marker with pizzaList
    this.location = data.location;

    //Set default map marker icon color
    var defaultIcon = makeMarkerIcon('0091ff');

    //Set highlighted marker icon color
    var highlightedIcon = makeMarkerIcon('FFFF24');

    //Set icon color for a user-submitted entry
    var userSubIcon = makeMarkerIcon('FFA500');

    this.marker = new google.maps.Marker({
        position: self.location,
        title: self.title,
        icon: defaultIcon,
        animation: google.maps.Animation.DROP
    });

    // To add the marker to the map, call setMap();
    self.marker.setMap(map);

    //Two event listeners - one for mouseover, one for mouseout- changes colors of icon.
    self.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });

    self.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });

    // add listener to set infowindow content and set open
    self.marker.addListener('click', function() {
        addFq(self);
    });


    //Create marker icons for use in the default icon and highlighted icon
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
            // markerColor + '|40|_|%E2%80%A2',
            markerColor + '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }
        //Directions search event listener
        document.getElementById('search-within-time').addEventListener('click', function() {
                searchWithinTime();
            });
        //Listen for the event fired when the user selects a prediction
        //and then clicks "go". Then get more details about the place
        // document.getElementById('get-pizza').addEventListener('click', textSearchPlaces);
        
        //This is the code for the location/distance search
        //This function allows the user to input a desired travel time and travel mode, and a location. It will only show places that are reachable within the desired travel duration period.
        function searchWithinTime() {
             //Initialize the distance matrix service
            var distanceMatrixServce = new google.maps.DistanceMatrixService;
            var address = document.getElementById('search-within-time-text').value;
            console.log(address);

            //Check to see that the field isn't blank
            if (address == '') {
                window.alert('Yinz gotta give me an address.');}
          
                //Use the distance matrix service to calcuate the duration of the routes between all markers, and the destiation set by the user. 
                //Then put all the origins into an origin matrix.
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



var ViewModel = function() {
    var self = this;

    // add variable to hold text input value
    self.query = ko.observable();

    this.pizzaList = ko.observableArray([]);

    pizzaLocations.forEach(function(pizzaItem) {
        self.pizzaList.push(new Pizza(pizzaItem));
    });

    // function to trigger marker click when list view item is clicked *********
    self.openWindow = function(location) {
        google.maps.event.trigger(location.marker, 'click');
    };
};


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

