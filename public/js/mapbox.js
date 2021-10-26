/*eslint-disable*/
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWJ1a2hhaWxhbGkiLCJhIjoiY2t2N3hmMXhsMGdyNDJvbWd5aHpycW9qdiJ9._JhGkBDtuPA0Wn66141z8w';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/abukhailali/ckv7xv1tt6b3a15mpn9qgvmzm', // style URL
  scrollZoom: false,
  //   center: [-74.5, 40], // starting position [lng, lat]
  //   zoom: 9, // starting zoom
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
