function initMap() {
  
  const config = {
    mapInitialZoom: 16,
    mapInitialCenter:new google.maps.LatLng(39.091585, -9.261095),
    markerInitalSize: 8,
    markerMaxSize: 64,
    markerScaleFactor: 1.5,
    markerUpdateRate: 5000
  }
  
  function update(oldData, markers) {
    fetchData('/api/v1/bins')
    .then( function(newData) {
        markers = updateMarkers(oldData, newData, markers);
        setTimeout(() => update(newData, markers), config.markerUpdateRate);
    });
  }
  
  function initializeUpdate(markers, data) {
    setTimeout(() => update(data, markers), config.markerUpdateRate);
    return markers;
  }


  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: config.mapInitialZoom,
    center: config.mapInitialCenter,
    mapTypeId: 'roadmap',
    disableDefaultUI: true,
    fullscreenControl: true,
    styles: [{
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }]
  });
  
  
 fetchData('/api/v1/bins').then(data => createBinMarkers(data, map, config))
                          .then(data => initializeUpdate(data.markers, data.data))
                          .then(markers => placeMarkers(markers, map))
                          .catch(error => console.log('Looks like there was a problem!', error))
    
}

