var map;
var directionsService = new google.maps.DirectionsService();
var markers = [];

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

function addMarker(driver, location) {
	var marker = new google.maps.Marker({
	  position: location,
	  map: map,
	  driver: driver
	});
	markers.push(marker);
}

var updateMarker = function(driver, latLng){
	console.log('updating pin:', driver);
	for (var i = 0; i < markers.length; i++) {
		if(markers[i].driver == driver){
			//update this pin
			markers[i].setPosition(latLng)
		}
	}
}


var startMagic = function(){

	var store;
	var storeRef = firebase.database().ref('stores/borza');
	var drivers = firebase.database().ref('stores/borza/drivers');

	//get store details
	storeRef.once('value').then(function(snapshot) {
	  store = snapshot.val();
	  console.log(snapshot.val());
	  watchDrivers();
	});


	//get drivers once for adding pins
	drivers.once('value').then(function(snapshot){
		var driversObj = snapshot.val()
		for (var driver in driversObj ) {
			if (driversObj.hasOwnProperty(driver)) {
				//add marker
				var latlng = new google.maps.LatLng(driversObj[driver].locationObj.latitude, driversObj[driver].locationObj.longitude);
				addMarker(driver, latlng);

				//add html element
				var p = document.createElement("P");
				p.id = 'driver_'+driver;
				document.getElementById("drivers").appendChild(p); 
			}
		}
	})

	//watch drivers for changes
	var watchDrivers = function(){
		drivers.on('value', function(data) {
	    console.log("drivers object change:",data.val());
	    var driversObj = data.val();

	    for (var driver in driversObj) {
			  if (driversObj.hasOwnProperty(driver)) {
			    console.log(" -> " + JSON.stringify(driversObj[driver]));

					var latlng = new google.maps.LatLng(driversObj[driver].locationObj.latitude, driversObj[driver].locationObj.longitude);
					calcRoute(driver, driversObj[driver])
					updateMarker(driver, latlng)
			  }
			}
		})
	}
  


	function calcRoute(driverName, driverObj) {
		console.log('running calcRoute', driverName, driverObj, store);
	  var start = driverObj.locationObj.latitude + ", "+ driverObj.locationObj.longitude;
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
	    	var updated = new Date(driverObj.locationObj.time);
	      document.getElementById('driver_'+driverName).innerHTML = driverName + " is "+ eta + " away. Updated: " + updated.getHours() + ":" + updated.getMinutes();

	    }
	  });
	}

}

