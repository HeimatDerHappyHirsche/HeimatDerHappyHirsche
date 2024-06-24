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

var themaLayer = {
    borders: L.featureGroup().addTo(map),
}

L.control
    .layers({
        "BasemapAT Grau": startLayer,
        "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
        "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
        "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
        "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
        "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
        "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay"),
    },
        {
            "Nationalparkgrenzen": themaLayer.borders,
        })
    .addTo(map);