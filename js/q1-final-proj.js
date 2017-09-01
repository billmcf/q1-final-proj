$(document).ready(function() {
    var service;
});  //end of document ready

// geolocation section
let galvanizePos = {lat: 40.0165685, lng: -105.2816839}
let billsHomePos = {lat: 39.938978299999995, lng: -105.14245729999999}
let map, infoWindow, pos, type;
let selectedType = window.location.hash.substring(1);

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: galvanizePos,
    zoom: 14
  });
  infoWindow = new google.maps.InfoWindow;

  //Find Current Location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Your Location');
      infoWindow.open(map);
      map.setCenter(pos);
      console.log("infoWindow = ",infoWindow);
      console.log("your pos is ",pos);
      console.log("selectedType ",selectedType);
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: pos,
        radius: 5000,
        type: [selectedType]
      }, callback);

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });

    function callback(results, status) {
        //console.log("in callback, results = ", results, "status = ",status, "infoWindow = ",infoWindow);
        console.log("infoWindow = ",infoWindow);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
    }

    function createMarker(place) {
          var placeLoc = place.geometry.location;
          var id = place.place_id;
          //console.log("id is ", id);
          var detailRequest = {placeId: id};
          console.log("detailRequest is ",detailRequest);

          service.getDetails(place, function(destination, status){
              console.log("destination is ", destination, " status is ", status);
              var marker = new google.maps.Marker({
                map: map,
                title: place.name,
                position: place.geometry.location,
                address: destination.formatted_address,
                phoneNum: destination.formatted_phone_number,
                url: destination.website,
                reviews: destination.reviews
              });
              console.log("marker add is ",destination.formatted_address);
              google.maps.event.addListener(marker, 'click', function() {
                console.log("in marker click listener");
                infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' + destination.formatted_address + '<br>' +
                 destination.formatted_phone_number + '<br><a href=' + destination.website + '>' + destination.website + '</a></div>');
                // infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' + destination.formatted_address + '<br>' + place.place_id + '</div>');
                infoWindow.open(map, marker);
              });
          })
    } // end of createMarker function
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

} // end of initMap function

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: Please Reload Page And Authorize Location Service' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
//
// End of geolocation section
//
