// assign the access token
mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

// declare the map object
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v9',
    zoom: 10.6, // starting zoom
    minZoom: 1,
    center: [-122.25, 47.6002614] // starting center
});


// define the asynchronous function to load geojson data.
async function geojsonFetch() {
    let response;
    response = await fetch('assets/seattleCrime2023.geojson');
    crime = await response.json();

    map.on('load', () => {
        // Add GeoJSON data as a source
        map.addSource('crime', {
            type: 'geojson',
            data: crime
        });

        // Circle Layer
        map.addLayer({
            id: 'crime-circles',
            type: 'circle',
            source: 'crime',
            paint: {
                'circle-color': [
                    'match',
                    ['get', 'Offense Parent Group'],
                    'COUNTERFEITING/FORGERY', 'rgba(255, 0, 0, 0.6)',  // Red for Counterfeiting/Forgery
                    'LARCENY-THEFT', 'rgba(0, 255, 0, 0.6)',  // Green for Larceny/Theft
                    // Add more cases for other offense groups and their corresponding colors
                    'rgba(0, 0, 0, 0.1)'  // Default color for unknown groups
                ],
                'circle-radius': 7.5,
                'circle-opacity': 0.6
            }
        }, 'waterway-label');
    });
}

// call the geojson loading function
geojsonFetch();

// capture the element reset and add a click event to it.
const reset = document.getElementById('reset');
reset.addEventListener('click', event => {

    // this event will trigger the map fly to its origin location and zoom level.
    map.flyTo({
        zoom: 10.6, // starting zoom
        center: [-122.25, 47.6002614] // starting center
    });
});