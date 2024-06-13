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
  borders: L.featureGroup(),
  zones: L.featureGroup(),
  bogs: L.featureGroup(),
  glaciers: L.featureGroup().addTo(map),
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
    "Gletscher (Stand 2015)": themaLayer.glaciers,
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

// Define  MiniMap
var miniMap = new L.Control.MiniMap(
  L.tileLayer.provider("BasemapAT.grau"), {
    toggleDisplay: true,
    minimized: false 
  }
).addTo(map);


L.geoJSON(jsonPunkt, {}).bindPopup(function (layer) {
  return `
    <h2>${layer.feature.properties.name}</h2>
    <h4>Der Großglockner ist mit einer Höhe von 3798 m ü. A. der höchste Berg Österreichs. Die markante Spitze aus Gesteinen der Grünschieferfazies gehört zur Glocknergruppe, einer Bergkette im mittleren Teil der Hohen Tauern, und gilt als einer der bedeutendsten Gipfel der Ostalpen.</h4>
    <ul> 
        <li> geographische Breite: ${layer.feature.geometry.coordinates[0]}</li>
        <li> geographische Länge: ${layer.feature.geometry.coordinates[1]}</li>
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
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties && feature.properties.NAME) {
          layer.bindPopup(`
          <h3>${feature.properties.NAME}</h3>
          <h4>Der Nationalpark Hohe Tauern gehört zu den großartigsten Hochgebirgslandschaften der Erde. Die Höhenstufen von den Tälern bis zu den Gipfelregionen der Dreitausender stehen für einen außergewöhnlichen Artenreichtum. Hier leben viele Pflanzen und Wildtiere, die ursprünglich aus den zentralasiatischen Kältesteppen, aus der Arktis oder auch aus Südeuropa stammen. Unsere Aufgabe als Nationalpark ist dieses einzigartige Ökosystem zu schützen, zu erforschen und das Wissen an die nächsten Generationen weiterzugeben. Entdecken Sie diese faszinierende Wildnis mitten in Europa!</h4>
        `)
        }
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







// Add Moore
fetch('MoorBiotopeWGS84.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: function (feature) {
        var lineName = feature.properties.MOORTYP;
        var lineColor = "green";
        if (lineName.includes("Kalk-Niedermoor")) {
          lineColor = "#2ECC40";
        } else if (lineName.includes("Kalk-Silikat-Niedermoor")) {
          lineColor = "#3D9970";
        } else if (lineName.includes("Silikat-Niedermoor")) {
          lineColor = "#01FF70";
        } else if (lineName.includes("Schwemmland")) {
          lineColor = "#7FDBFF";
        }
        return {
          color: lineColor,
        };
      },
      onEachFeature: function (feature, layer) {
        {
          if (feature.properties && feature.properties.KOMMENTAR) {
            layer.bindPopup(`
          <h4>${feature.properties.FONAME}</h4>
          <ul>
          <li>Moortyp:${feature.properties.MOORTYP}</li>
          <li>Nutzung:${feature.properties.NUTZUNG}</li>
          </ul>
          <h4>hier noch genauere Info zum Moor einfügen</h4>
        `)
          }
        };
        layer.on('click', function () {
          if (feature.properties && feature.properties.KOMMENTAR && feature.properties.FONAME) {
            document.getElementById('feature-name').innerText = feature.properties.FONAME;
            document.getElementById('comment').innerText = feature.properties.KOMMENTAR;
          } else {
            document.getElementById('feature-name').innerText = 'No Feature Name';
            document.getElementById('comment').innerText = 'No comments available';
          }
        });
      }
    }).addTo(themaLayer.bogs);
  })
  .catch(error => console.error('Error fetching data:', error));




 
  fetch('Gletscherinventar2015.geojson')
  .then(response => response.json())
  .then(data => {
    // Create a GeoJSON layer and add it to the map
    L.geoJSON(data, {
      style: {
        color: 'blue'
      },
      onEachFeature: function (feature, layer) {
        // Check if the feature has properties and a name property
        if (feature.properties && feature.properties.name) {
          var areaInKM2 = feature.properties.Shape_Area.toFixed(0);
          layer.bindPopup(`
          <h3>${feature.properties.name}</h3>
          <p>Fläche (2015): ${areaInKM2} m²</p>
          `);
        }
      }
    }).addTo(themaLayer.glaciers);
  })
  .catch(error => console.error('Error fetching GeoJSON data:', error));