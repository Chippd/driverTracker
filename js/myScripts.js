var map;
var directionsService = new google.maps.DirectionsService();
var driverMarker = new google.maps.Marker();

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

  driverMarker.setMap(map);
}

var startMagic = function(){


	var store;
	var storeRef = firebase.database().ref('stores/borza');
	var drivers = firebase.database().ref('stores/borza/drivers');

	storeRef.on('value', function(snapshot) {
	  store = snapshot.val();
	  console.log(snapshot.val());
	  watchDrivers();
	});

	var watchDrivers = function(){
	    drivers.on('value', function(data) {
	      console.log(data.val());
	      var driversObj = data.val();

	      for (var driver in driversObj) {
				  if (driversObj.hasOwnProperty(driver)) {
				    console.log(" -> " + JSON.stringify(driversObj[driver]));

						var latlng = new google.maps.LatLng(driversObj[driver].latitude, driversObj[driver].longitude);
						calcRoute(driversObj[driver])
						updatePin(latlng)
				  }
				}
	    });
	}


	var updatePin = function(latLng){
		console.log('updating pin');
		driverMarker.setPosition(latLng)
	}


	function calcRoute(driver) {
		console.log('running calcRoute', driver, store);
	  var start = driver.latitude + ", "+ driver.longitude;
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
	    	var point = result.routes[ 0 ].legs[ 0 ];
	    	var eta = point.duration.text;
	    	var updated = new Date(driver.time);
	      document.getElementById('driverChris').innerHTML = driver.driverName + " is "+ eta + " away. Updated: " + updated.getHours() + ":" + updated.getMinutes();

	    }
	  });
	}

}

