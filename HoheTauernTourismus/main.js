//Punkt definieren
var großglockner = {
  lat: 47.074531,
  lng: 12.6939,
  title: "Großglockner"
};

// Karte initialisieren
var map = L.map('map', {
  fullscreenControl: true,
}
).setView([großglockner.lat, großglockner.lng], 10);


// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
var startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  borders: L.featureGroup().addTo(map),
  poi: L.featureGroup().addTo(map),
  hut: L.markerClusterGroup({ disableClusteringAtZoom: 17 }),
}

L.control
  .layers({
    "BasemapAT Grau": startLayer,
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
  },
    {
      "Nationalparkgrenze": themaLayer.borders.addTo(map),
      "Points of interest": themaLayer.poi.addTo(map),
      "Almen": themaLayer.hut.addTo(map),
    })
  .addTo(map);

// Maßstab
L.control.scale({
  imperial: false,
}).addTo(map);

/*let controlElevation = L.control.elevation({
   time: false,
    elevationDiv: "#profile",
    height: 300,
    theme: "trail-HoheTauern",
}).addTo(map);
controlElevation.load("HoheTauernTourismus/grossglockner_a");

let pulldown = document.querySelector("#pulldown");

for (let tour of TOUREN) {
    let status = "";
    if (tour.nr == 1) {
        status = "selected";
    }
    pulldown.innerHTML += `<option ${status}>Etappe ${tour.nr}: ${tour.titel}</option>`;
}
*/
new L.Control.MiniMap(
  L.tileLayer("https://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
    attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
  }), {
  toggleDisplay: true,
}
).addTo(map);

var controlElevation = L.control.elevation({
  time: false,
  elevationDiv: "#profile",
  height: 200,
}).addTo(map);
controlElevation.load("Daten/kreuzeckhoehenweg_etappe1.gpx");


/*let pulldown = document.querySelector("#pulldown");

for (let etappe of ETAPPEN) {
  let status = "";
  if (etappe.nr == 1) {
      status = "selected";
  }
  pulldown.innerHTML += `<option ${status} value="${etappe.start}">Etappe ${etappe.nr}: ${etappe.titel}</option>`;
}

pulldown.onchange = function (evt) {
  let username = evt.target.value;
  let url = `${etappe.link}`;
  window.location.href = url;
}
*/

// Variable für den aktuellen GPX-Layer
/*let currentGPXLayer;

// Funktion zum Laden einer GPX-Datei
function loadGPX(gpxData) {
  if (currentGPXLayer) {
    map.removeLayer(currentGPXLayer);
    controlElevation.clear();
  }

  fetch(gpxData)
    .then(response => response.text())
    .then(gpxData => {
      currentGPXLayer = new L.Layer(gpxData, {
        async: true
      });
      console.log(1);

      currentGPXLayer.on('loaded', function (e) {
        map.fitBounds(e.target.getBounds());
      });
      console.log(2);
      currentGPXLayer.on('addline', function (e) {
        controlElevation.addData(e.line);
      });
      console.log(3);
      

      
    })
    .catch(error => console.error('Error loading GPX file:', error));
}
console.log(4);
*/
// Lade die erste Etappe standardmäßig



fetch("Daten/kreuzeckhoehenweg_etappe1.gpx")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'green'
      },
    }).addTo(themaLayer.borders);
  })
  .catch(error => console.error('Error fetching data:', error))

fetch("../NationalparkHoheTauern/npht_agrenze_new.geojson")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'green'
      },
    }).addTo(themaLayer.borders);
  })
  .catch(error => console.error('Error fetching data:', error));

fetch("Daten/Almzentren.json")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'icons/hut.png',
          })
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`
          <h4>${feature.properties.NAME}</h4>
        `);
      }
    }).addTo(themaLayer.hut);
  })
  .catch(error => {
    console.error('Error loading the JSON data:', error);
  });


  var markers = L.markerClusterGroup({
      disableClusteringAtZoom: 17
  });

fetch("Daten/NPHT_POI.json")
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'icons/information.png',
          })
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`
          <h4>${feature.properties.NAME}</h4>
        `);
      }
    }).addTo(themaLayer.poi);
  })
  .catch(error => {
    console.error('Error loading the JSON data:', error);
  });





