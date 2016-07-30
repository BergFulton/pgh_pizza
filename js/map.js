var map;

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
}

//Some pizza places
var locations = [{
  title: 'Fior\'s',
  location: {
    lat: 40.4053055,
    lng: -80.019612
  }, {
    title: 'Franks\'s',
    location: {
    lat: 40.5882699,
    lng: -80.2267282
  }, {
    title: 'Police Station Pizza',
    location: {
    lat: 40.5918369,
    lng: -80.2325444
  }, {
    title: 'Beto\'s',
    location: {
    lat: 40.4127159,
    lng: -80.0325241
  }, {
    title: 'Aiello\'s',
    location: {
    lat: 40.4332582,
    lng: -79.9253431
  }, {
    title: 'Mineo\'s',
    location: {
    lat: 40.4328888,
    lng: -79.9253663
  }, {
    title: 'Spak Bros',
    location: {
      lat: 40.4650793, 
      lng: -79.9447003
    }
  }

}]