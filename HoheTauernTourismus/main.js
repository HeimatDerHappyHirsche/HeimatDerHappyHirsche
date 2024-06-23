//Punkt definieren
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