function updateMarkerSize(marker, map, config) {
  const zoom = map.getZoom();
  let newSize = config.markerInitalSize * Math.pow(config.markerScaleFactor, zoom-config.mapInitialZoom);
  newSize = Math.min(config.markerMaxSize, Math.max(config.markerInitalSize, newSize)); 
  marker.setIcon({
    url: marker.getIcon().url, 
    size: null, 
    origin: null,
    anchor: null, 
    scaledSize: new google.maps.Size(newSize, newSize) 
  });
}

function createBinMarkers(data, map, config) {
  const bins = data.bins
  const markers = [ ]
  bins.forEach( function(bin) {
    const image = {
      url: 'https://1cybersheep1.pythonanywhere.com/static/images/markers/'+bin.type+'.png',
      size: new google.maps.Size(config.markerInitalSize, config.markerInitalSize),
      origin: null,
      anchor: null,
      scaledSize: new google.maps.Size(config.markerInitalSize, config.markerInitalSize)
    };
    const newMarker = new google.maps.Marker({
      position: new google.maps.LatLng(bin.lat, bin.lon),
      icon: image
    });
    google.maps.event.addListener(map, "zoom_changed", () => updateMarkerSize(newMarker, map, config));
    markers.push(newMarker)
  });
  return {markers: markers, data: data};
}
  
function placeMarkers(markers, map) {
  markers.forEach(marker => marker.setMap(map));
}
  
function updateMarkers(oldData, newData, markers) {
  oldData.bins.forEach(function(bin, index) {
    if (bin.percentage !== newData.bins[index].percentage) {
        // Update marker
    }
  });
  return markers;
}

