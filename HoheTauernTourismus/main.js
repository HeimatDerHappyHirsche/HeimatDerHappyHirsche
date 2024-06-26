//Punkt definieren
var großglockner = {
  lat: 47.074531,
  lng: 12.6939,
  title: "Großglockner"
};
var gorßglockner = L.marker([47.074531,12.6939])
gorßglockner.setOpacity(0);

// Karte initialisieren
var map = L.map('map', {
  fullscreenControl: true,
}
).setView([großglockner.lat, großglockner.lng], 10);
gorßglockner.addTo(map)

// BasemapAT Layer mit Leaflet provider plugin als startLayer Variable
var startLayer = L.tileLayer.provider("BasemapAT.grau");
startLayer.addTo(map);

let themaLayer = {
  borders: L.featureGroup().addTo(map),
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
      "Almen": themaLayer.hut.addTo(map),
    })
  .addTo(map);

// Maßstab
L.control.scale({
  imperial: false,
}).addTo(map);

new L.Control.MiniMap(
  L.tileLayer("https://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
    attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
  }), {
  toggleDisplay: true,
}
).addTo(map);

let controlElevation_1 = L.control.elevation({
  time: false,
  elevationDiv: "#profile",
  toggleDisplay: false,
  theme: "touren",
  height: 200,
 collapsed:true,
}).addTo(map);
controlElevation_1.load("Daten/kreuzeckhoehenweg_etappe1.gpx");

let controlElevation_2 = L.control.elevation({
  time: false,
  elevationDiv: "#profile",
  toggleDisplay: false,
  theme: "touren",
  height: 200,
  collapsed:true,
}).addTo(map);
controlElevation_2.load("Daten/kreuzeckhoehenweg_etappe2.gpx");

let controlElevation_3 = L.control.elevation({
  time: false,
  elevationDiv: "#profile",
  toggleDisplay: false,
  theme: "touren",
  height: 200,
  collapsed:true,
}).addTo(map);
controlElevation_3.load("Daten/kreuzeckhoehenweg_etappe3.gpx");

let controlElevation_4 = L.control.elevation({
  time: false,
  elevationDiv: "#profile",
  toggleDisplay: false,
  theme: "touren",
  height: 200,
  collapsed:true,
}).addTo(map);
controlElevation_4.load("Daten/kreuzeckhoehenweg_etappe4.gpx");

let controlElevation_5 = L.control.elevation({
  time: false,
  elevationDiv: "#profile2",
  toggleDisplay: false,
  theme: "tracks",
  height: 200,
  collapsed:true,
}).addTo(map);
controlElevation_5.load("Daten/track1.gpx");

let controlElevation_6 = L.control.elevation({
  time: false,
  elevationDiv: "#profile2",
  toggleDisplay: false,
  theme: "tracks",
  height: 200,
  collapsed:true,
}).addTo(map);
controlElevation_6.load("Daten/track2.gpx");

let controlElevation_7 = L.control.elevation({
  time: false,
  elevationDiv: "#profile2",
  toggleDisplay: false,
  theme: "tracks",
  height: 200,
  collapsed:true,
}).addTo(map);
controlElevation_7.load("Daten/track3.gpx");

let controlElevation_8 = L.control.elevation({
  time: false,
  elevationDiv: "#profile2",
  toggleDisplay: false,
  theme: "tracks",
  height: 200,
  collapsed:true,
}).addTo(map);
controlElevation_8.load("Daten/track4.gpx");



/*let polygons = new Array();*/
fetch("../NationalparkHoheTauern/npht_agrenze_new.geojson")
  .then(response => response.json())
  .then(data => {
   /* for(var i = 0; i< data.features[0].geometry.coordinates.length;i++){
      for(var j=0; j< data.features[0].geometry.coordinates[i].length;j++){
        polygons.push(data.features[0].geometry.coordinates[i][j])
        console.log("edit new polygon")
      } 
    }*/
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
        /*polygons.forEach((p)=>{
          if(inside(latlng,p))return null;
        });*/
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: 'icons/hut.png',
          })
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`
          <h4>${feature.properties.NAME}</h4>
          <ul>
          <li>Wirtschaftsform: ${feature.properties.OBJEKTBEZEICHNUNG||'keine Angabe'} </li>
          </ul>
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
 
function zoomToKreuzeckhoehenweg (){
  var bounds1 = controlElevation_1.getBounds();
  var bounds2 = controlElevation_2.getBounds();
  var bounds3 = controlElevation_3.getBounds();
  var bounds4 = controlElevation_4.getBounds();
  map.fitBounds(bounds1.extend(bounds2.extend(bounds3.extend(bounds4))));
}
function zoomToEtappe1 (){
  map.fitBounds(controlElevation_1.getBounds());
}
function zoomToEtappe2 (){
  map.fitBounds(controlElevation_2.getBounds());
}
function zoomToEtappe3 (){
  map.fitBounds(controlElevation_3.getBounds());
}
function zoomToEtappe4 (){
  map.fitBounds(controlElevation_4.getBounds());
}
function zoomToNP (){
  map.flyTo(gorßglockner.getLatLng(), 10);
}


//Versuch zuschneiden der Almen auf Multipolygon Grenzen des Nationalpark Hohe Tauern
  /*function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];
console.log(vs)
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
*/
/*fetch("Daten/NPHT_POI.json")
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
  */