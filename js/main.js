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
                    'COUNTERFEITING/FORGERY', '#FF0000',  // Red for Counterfeiting/Forgery
                    'LARCENY-THEFT', '#00FF00',  // Green for Larceny/Theft
                    'ASSAULT OFFENSES', '#FFA500',  // Orange for Assault Offenses
                    'DESTRUCTION/DAMAGE/VANDALISM OF PROPERTY', '#ff3311',  // Custom color for Destruction/Damage/Vandalism of Property
                    'ROBBERY', '#800080',  // Purple for Robbery
                    'PORNOGRAPHY/OBSCENE MATERIAL', '#8B4513',  // Saddle Brown for Pornography/Obscene Material
                    'BURGLARY/BREAKING&ENTERING', '#0000FF',  // Blue for Burglary/Breaking&Entering
                    'DRUG/NARCOTIC OFFENSES', '#008080',  // Teal for Drug/Narcotic Offenses
                    'STOLEN PROPERTY OFFENSES', '#663399',  // Rebecca Purple for Stolen Property Offenses
                    'TRESPASS OF REAL PROPERTY', '#8A2BE2',  // Blue Violet for Trespass of Real Property
                    'ARSON', '#FF6347',  // Tomato for Arson
                    'MOTOR VEHICLE THEFT', '#FFFF00',  // Yellow for Motor Vehicle Theft
                    'FRAUD OFFENSES', '#00CED1',  // Dark Turquoise for Fraud Offenses
                    'DRIVING UNDER THE INFLUENCE', '#4B0082',  // Indigo for Driving Under the Influence
                    'EXTORTION/BLACKMAIL', '#FFD700',  // Gold for Extortion/Blackmail
                    'KIDNAPPING/ABDUCTION', '#9400D3',  // Dark Violet for Kidnapping/Abduction
                    'WEAPON LAW VIOLATIONS', '#ADFF2F',  // Green Yellow for Weapon Law Violations
                    'PEEPING TOM', '#2F4F4F',  // Dark Slate Gray for Peeping Tom
                    'FAMILY OFFENSES, NONVIOLENT', '#00FA9A',  // Medium Spring Green for Family Offenses, Nonviolent
                    'EMBEZZLEMENT', '#FF4500',  // Orange Red for Embezzlement
                    'ANIMAL CRUELTY', '#8B0000',  // Dark Red for Animal Cruelty
                    'BAD CHECKS', '#556B2F',  // Dark Olive Green for Bad Checks
                    'HOMICIDE OFFENSES', '#B22222',  // Fire Brick for Homicide Offenses
                    'HUMAN TRAFFICKING', '#D2691E',  // Chocolate for Human Trafficking
                    'PROSTITUTION OFFENSES', '#FF1493',  // Deep Pink for Prostitution Offenses
                    'BRIBERY', '#6A5ACD',  // Slate Blue for Bribery
                    'SEX OFFENSES, CONSENSUAL', '#9370DB',  // Medium Purple for Sex Offenses, Consensual
                    'LIQUOR LAW VIOLATIONS', '#B0C4DE',  // Light Steel Blue for Liquor Law Violations
                    'CURFEW/LOITERING/VAGRANCY VIOLATIONS', '#20B2AA',  // Light Sea Green for Curfew/Loitering/Vagrancy Violations
                    'GAMBLING OFFENSES', '#FF8C00',  // Dark Orange for Gambling Offenses
                    // Add more cases for other offense groups and their corresponding colors
                    'rgba(0, 0, 0, 0.1)'  // Default color for unknown groups
                ],
                'circle-radius': 5,
                'circle-opacity': .3
            }
        }, 'waterway-label');

             // Create legend
        const legendContainer = document.getElementById('legend-container');

        // Function to toggle layer visibility
        function toggleLayerVisibility(layerName) {
            const visibility = map.getLayoutProperty('crime-circles', 'visibility');
            const visibleLayers = visibility === 'visible' ? map.getStyle().layers : [];

            if (visibleLayers.includes('crime-circles')) {
                map.setLayoutProperty('crime-circles', 'visibility', 'none');
            }

            map.setLayoutProperty('crime-circles', 'visibility', 'visible');
            map.setFilter('crime-circles', ['==', 'Offense Parent Group', layerName]);
        }

        // Append legend items to legend container with interactivity
        crime.features.forEach(feature => {
            const crimeType = feature.properties['Offense Parent Group'];

            if (legendContainer.querySelector(`[data-type="${crimeType}"]`) === null) {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                legendItem.setAttribute('data-type', crimeType);

                const legendColor = document.createElement('div');
                legendColor.className = 'legend-color';
                legendColor.style.backgroundColor = getColorForCrimeType(crimeType);

                const legendLabel = document.createElement('div');
                legendLabel.className = 'legend-label';
                legendLabel.textContent = crimeType;

                legendItem.appendChild(legendColor);
                legendItem.appendChild(legendLabel);

                // Add click event to toggle layer visibility
                legendItem.addEventListener('click', () => {
                    toggleLayerVisibility(crimeType);
                });

                // Add hover event to update styling
                legendItem.addEventListener('mouseover', () => {
                    legendItem.style.backgroundColor = '#9b9898';
                    legendItem.style.fontWeight = 'bold';
                });

                legendItem.addEventListener('mouseout', () => {
                    legendItem.style.backgroundColor = '';
                    legendItem.style.fontWeight = '';
                });

                legendContainer.appendChild(legendItem);
            }
        });
    });
}

function getColorForCrimeType(crimeType) {
    // Define color mapping based on crime type
    const colorMapping = {
        'COUNTERFEITING/FORGERY': '#FF0000',
        'LARCENY-THEFT': '#00FF00',
        'ASSAULT OFFENSES': '#FFA500',
        'DESTRUCTION/DAMAGE/VANDALISM OF PROPERTY': '#ff3311',
        'ROBBERY': '#800080',
        'PORNOGRAPHY/OBSCENE MATERIAL': '#8B4513',
        'BURGLARY/BREAKING&ENTERING': '#0000FF',
        'DRUG/NARCOTIC OFFENSES': '#008080',
        'STOLEN PROPERTY OFFENSES': '#663399',
        'TRESPASS OF REAL PROPERTY': '#8A2BE2',
        'ARSON': '#FF6347',
        'MOTOR VEHICLE THEFT': '#FFFF00',
        'FRAUD OFFENSES': '#00CED1',
        'DRIVING UNDER THE INFLUENCE': '#4B0082',
        'EXTORTION/BLACKMAIL': '#FFD700',
        'KIDNAPPING/ABDUCTION': '#9400D3',
        'WEAPON LAW VIOLATIONS': '#ADFF2F',
        'PEEPING TOM': '#2F4F4F',
        'FAMILY OFFENSES, NONVIOLENT': '#00FA9A',
        'EMBEZZLEMENT': '#FF4500',
        'ANIMAL CRUELTY': '#8B0000',
        'BAD CHECKS': '#556B2F',
        'HOMICIDE OFFENSES': '#B22222',
        'HUMAN TRAFFICKING': '#D2691E',
        'PROSTITUTION OFFENSES': '#FF1493',
        'BRIBERY': '#6A5ACD',
        'SEX OFFENSES, CONSENSUAL': '#9370DB',
        'LIQUOR LAW VIOLATIONS': '#B0C4DE',
        'CURFEW/LOITERING/VAGRANCY VIOLATIONS': '#20B2AA',
        'GAMBLING OFFENSES': '#FF8C00',
        'rgba(0, 0, 0, 0.1)': '#CCCCCC'
    };

    return colorMapping[crimeType] || '#CCCCCC';
}

// Invoke the function to fetch GeoJSON and set up the map
geojsonFetch();

// capture the element reset and add a click event to it.
const reset = document.getElementById('reset');
reset.addEventListener('click', event => {
    // This event will trigger a page refresh
    location.reload();
});