// geolocation section
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

let galvanizePos = {lat: 40.0165685, lng: -105.2816839}
let billsHomePos = {lat: 39.938978299999995, lng: -105.14245729999999}
let map, infoWindow, pos;
// let service = new google.maps.places.PlacesService(map);

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: billsHomePos,
    zoom: 13
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

      //PlacesService code
    //   console.log("pos is: ",pos);
      let service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: pos,
        radius: 10000,
        type: ['museum']
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
          var marker = new google.maps.Marker({
            map: map,
            title: place.name,
            position: place.geometry.location
          });
          marker.addListener(‘click’, function() {
              console.log("in marker click listener");
              infowindow.setContent(“<h1>“+place.name+“</h1><div>Desc: </div>“);
              infowindow.open(map, marker);
            });

    // function createMarker(place) {
    // //    console.log("place = ",place);
    // //    let infoWindow = new google.maps.InfoWindow;
    // //    console.log("in createMarker infoWindow = ",infoWindow);
    //
    //   var placeLoc = place.geometry.location;
    //   var marker = new google.maps.Marker({
    //     map: map,
    //     position: place.geometry.location
    //   });
    //
    //   document.addEventListener('DOMContentLoaded', function() {
    //
    //       google.maps.event.addListener(marker, 'click', function() {
    //           console.log("in marker click listener");
    //     //   google.maps.event.addListener(map, 'click', function() {
    //     //       console.log("in map click listener");
    //         //let infoWindow = new google.maps.InfoWindow;
    //         infowindow.setContent(place.name);
    //         infowindow.open(map, this);
    //       });
      }); //DOMContentLoaded braces
  } // end of createMarker function


  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

} // enf of initMap function


// function callback(results, status) {
//     //console.log("in callback, results = ", results, "status = ",status, "infoWindow = ",infoWindow);
//     console.log("infoWindow = ",infoWindow);
//     if (status === google.maps.places.PlacesServiceStatus.OK) {
//       for (let i = 0; i < results.length; i++) {
//         createMarker(results[i]);
//       }
//     }
// }


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: Please Authorize Location Service' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
//
// End of geolocation section
//
