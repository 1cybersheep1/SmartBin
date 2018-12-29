function initMap() {
  
  function createBinMarkers(bins) {
    let markers = [ ]
    bins.forEach( function(bin) {
    markers.push( new google.maps.Marker({
            position: new google.maps.LatLng(bin.lat, bin.lon),
            icon: 'https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png'
          }) )
    });
    return markers
  }

  function initializeMarkers(data) {
    var markers = createBinMarkers(data.bins);
    setTimeout(() => update(data, markers), 5000);
    return markers;
  }

  function placeMarkers(markers) {
    markers.forEach(marker => marker.setMap(map));
  }

  function update(oldData, markers) {
    fetchData('/api/v1/bins')
    .then( function(newData) {
        markers = updateMarkers(oldData, newData, markers);
        setTimeout(() => update(newData, markers), 5000);
    });
  }

  function updateMarkers(oldData, newData, markers) {
    oldData.bins.forEach(function(bin, index) {
      if (bin.percentage !== newData.bins[index].percentage) {
        // Update marker
      }
    });
      return markers;
  }

  
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: new google.maps.LatLng(39.091585, -9.261095),
    mapTypeId: 'roadmap'
  });
  
  fetchData('/api/v1/bins').then(data => initializeMarkers(data))
                           .then(markers => placeMarkers(markers))
                           .catch(error => console.log('Looks like there was a problem!', error))
   
}




