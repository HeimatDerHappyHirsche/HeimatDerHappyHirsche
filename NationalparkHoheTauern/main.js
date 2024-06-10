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
  zones: L.featureGroup().addTo(map),
  bogs: L.featureGroup().addTo(map),
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
    "Zonierung": themaLayer.zones,
    "Moore": themaLayer.bogs,
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
    L.geoJSON(data, {
      style: {
        color: 'green' // Change the color to blue
      }
    }).addTo(themaLayer.borders);
  })
  .catch(error => console.error('Error fetching data:', error));


//add Zones
// Fetch JSON data from the local file
fetch('zonierung_npht.json')
  .then(response => response.json())
  .then(data => {
    // Process the fetched data and add it to the map
    L.geoJSON(data, {
      style: function (feature) {
        var lineName = feature.properties.ZONENAME;
        var lineColor = "black";
        if (lineName == "Kernzone") {
          lineColor = "#3D9970";
        } else if (lineName == "Aussenzone") {
          lineColor = "#2ECC40";
        } else if (lineName == "Sonderschutzgebiet") {
          lineColor = "#FF851B";
        } else {
          //return sth
        }
        return {
          color: lineColor,
        };
      },
      onEachFeature: function (feature, layer) {
        var popupContent = "<h3>This is a test</h3>";

        if (feature.properties.ZONENAME === "Kernzone") {
          popupContent = "<h3>Kernzone</h3><p>Weitgehend ungestört, aber für sanften Tourismus und Bildungszwecke zugänglich. Ziel ist der Erhalt natürlicher Prozesse ohne intensive menschliche Eingriffe.</p>";
        } else if (feature.properties.ZONENAME === "Aussenzone") {
          popupContent = "<h3>Aussenzone</h3><p>Niedrigster Schutzstatus, erlaubt nachhaltige Nutzungen und menschliche Aktivitäten, dient als Pufferzone..</p>";
        } else if (feature.properties.ZONENAME === "Sonderschutzgebiet") {
          popupContent = "<h3>Sonderschutzgebiet</h3><p>Streng geschützt und in der Regel für die Öffentlichkeit gesperrt. Ziel ist der Schutz besonders sensibler und wertvoller Naturräume ohne jegliche menschliche Beeinflussung.</p>";
        }

        layer.bindPopup(popupContent);
      }
    }).addTo(themaLayer.zones);
  })
  .catch(error => console.error('Error fetching data:', error));


//add Moore
  fetch('MoorBiotopeWGS84.geojson')
  .then(response => response.json())
  .then(data => {
    // Process the fetched data and add it to the map
    L.geoJSON(data, {
      style: function (feature) {
        var lineName = feature.properties.MOORTYP;
        var lineColor = "black"; // farben noch ändern
        if (lineName.includes("Kalk-Niedermoor")) {
          lineColor = "#3D9970";
        } else if  (lineName.includes("Kalk-Silikat-Niedermoor")) {
          lineColor = "#2ECC40";
        } else if  (lineName.includes("Silikat-Niedermoor")) {
          lineColor = "#FF851B";
        } else if  (lineName.includes("Schwemmland")) {
          lineColor ="#FF851B";
        } else {
          //return sth
        }
        return {
          color: lineColor,
        };
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.KOMMENTAR) {
          layer.bindPopup(feature.properties.KOMMENTAR);
        }
      }
    }).addTo(themaLayer.bogs);
  }).catch(error => console.error('Error fetching data:', error));
