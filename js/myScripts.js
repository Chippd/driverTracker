var map;

var loadMap = function(){
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
      center: {lat: 53.252751, lng: -6.213784 },
      zoom: 8
  });
}

var store = firebase.database().ref('stores/borza');
var drivers = firebase.database().ref('stores/borza/drivers');

var watchDriver = function(){
    drivers.on('child_changed', function(data) {
      console.log(data.val());
      var driver = data.val();
      var latlng = new google.maps.LatLng(driver.position.lat, driver.position.long);
      updatePin(latlng)
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

