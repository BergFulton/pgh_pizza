var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.440625,
      lng: -79.995886
    },
    zoom: 14,
    mapTypeControl: false
  });
}