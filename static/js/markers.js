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
    
    var infowindow = new google.maps.InfoWindow({
          content: generateInfoWindow(bin.id, bin.percentage, bin.type, bin.last_update)
    });

        
        newMarker.addListener('click', function () {
          infowindow.open(map, newMarker);
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
      let bin = newData.bins[index];
      var infowindow = new google.maps.InfoWindow({
        content: generateInfoWindow(bin.id, bin.percentage, bin.type, bin.last_update)
      });
      google.maps.event.clearListeners(markers[index], 'click');
      markers[index].addListener('click', function() {
        infowindow.open(map, markers[index]);
      });
    }
  });
  return markers;
}

function generateInfoWindow(id, percentage, type, date) {
  date = date.replace('T',' ').split(".")[0]
  return `<style>.progress-bar {width:${percentage}%}</style>
          <div class="bin-info-window">
            <h2 style="text-align:center;">SmartBin - ${id}</h2>
            <p><b>Type:</b>&ensp;${type}</p><p>
            <b>Last Update:</b>&ensp;${date}</p><p>
            <b>Fill level:</b>&ensp;${percentage}%</p>
            <div class="progress">
              <div class="progress-bar"></div>
            </div>
          </div>`
}