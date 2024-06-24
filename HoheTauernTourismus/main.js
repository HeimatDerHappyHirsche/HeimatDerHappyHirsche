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
    routen: L.featureGroup().addTo(map),
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
            "GPX-Routen": themaLayer.routen.addTo(map)
        })
    .addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

let controlElevation = L.control.elevation({
    time: false,
    elevationDiv: "#profile",
    height: 300,
    theme: "bike-tirol",
}).addTo(map);
controlElevation.load("data/etappe18.gpx");

let pulldown = document.querySelector("#pulldown");

for (let etappe of ETAPPEN) {
    let status = "";
    if (etappe.nr == 18) {
        status = "selected";
    }
    pulldown.innerHTML += `<option ${status} value="${etappe.user}">Etappe ${etappe.nr}: ${etappe.titel}</option>`;
}

new L.Control.MiniMap(
    L.tileLayer("https://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
    }), {
    toggleDisplay: true,
}
).addTo(map);