var map;
var directionsService = new google.maps.DirectionsService();

var loadMap = function(){
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
      center: {lat: 53.252751, lng: -6.213784 },
      zoom: 11
  });


  var homeMarker = new google.maps.Marker({
    position: {lat: 53.252751, lng: -6.213784 },
    map: map
  });
}

var store;
var storeRef = firebase.database().ref('stores/borza');
var drivers = firebase.database().ref('stores/borza/drivers');

storeRef.on('value', function(snapshot) {
  store = snapshot.val();
  console.log(snapshot.val());
  watchDriver();
});

var watchDriver = function(){
    drivers.on('value', function(data) {
      console.log(data.val());
      var driversArray = data.val();

      for (var i = driversArray.length - 1; i >= 0; i--) {
      	driversArray[i]
      	var latlng = new google.maps.LatLng(driversArray[i].position.lat, driversArray[i].position.long);
	      calcRoute(driversArray[i])
	      updatePin(latlng)
      }
      
    });
}


var updatePin = function(latLng){
	console.log('updating pin');
	var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: latLng
    });
}


function calcRoute(driver) {
	console.log('running calcRoute', driver, store);
  var start = driver.position.lat + ", "+ driver.position.long;
  var end = store.location.lat + ", " + store.location.long;
  console.log('start:', start, "end:", end)
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
  	console.log('result:', result, status)
    if (status == 'OK') {
    	var point = result.routes[ 0 ].legs[ 0 ]
      console.log(point.duration.text)
    }
  });
}

