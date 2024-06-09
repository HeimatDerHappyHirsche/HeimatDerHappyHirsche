/* Nationalpark Hohe Tauern */


//Großglockner Object
var großglockner = {
lat: 47.074531,
lng: 12.6939,
title: "Großglockner"
};

// Karte initialisieren
var map = L.map("map").setView([großglockner.lat, großglockner.lng], 10);

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
var startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

var themaLayer = {
    borders: L.featureGroup().addTo(map),
    //hotels: L.markerClusterGroup({ disableClusteringAtZoom: 17 }).addTo(map),
  }
  // Hintergrundlayer
  L.control
    .layers({
      "BasemapAT Grau": startLayer,
      "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
      "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
      "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
      "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
      "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
      "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    }, {
      "Nationalparkgrenzen": themaLayer.borders,
    })
    .addTo(map);

// Maßstab
L.control
  .scale({
    imperial: false,
  })
  .addTo(map);

L.control
  .fullscreen()
  .addTo(map);


//Startpunkt
let jsonPunkt = {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [12.6939, 47.074531]
    },
    "properties": {
        "name": "Großglockner"

    }
};
L.geoJSON(jsonPunkt, {}).bindPopup(function (layer) {
    return `
    <h2>${layer.feature.properties.name}</h2>
    <ul> 
        <li>Breite: ${layer.feature.geometry.coordinates[0]}</li>
        <li>Länge: ${layer.feature.geometry.coordinates[1]}</li>
    </ul>
`;
}).addTo(map);


//add Außengrenzen

// Fetch JSON data from the local file
fetch('npht_agrenze_new.geojson')
    .then(response => response.json())
    .then(data => {
        // Process the fetched data and add it to the map
        L.geoJSON(data).addTo(themaLayer.borders);
    })
    .catch(error => console.error('Error fetching data:', error));
