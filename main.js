let austriaBounds = [[46.372276, 9.530952], [49.020608, 17.160776]]; // Bounding box for Austria
let mapCenter = [48.245556, 12.522778]; // Center the map on Mühldorf am Inn
let initialZoom = 7;

// Liste der Nationalparks in Österreich
let nationalParks = [
    {
        name: "Nationalpark Hohe Tauern",
        lat: 47.121201,
        lng: 12.713109,
        image: "images/hohetauern.jpg",
        credit: "@WeAppU https://pixabay.com/de/photos/maltatal-malta-stausee-kraftwerk-578207/",
        tourismLink: "HoheTauernTourismus/index.html",
        natureLink: "NationalparkHoheTauern/index.html",
        wikiTitle: "Nationalpark_Hohe_Tauern"
    },
    {
        name: "Nationalpark Neusiedler See - Seewinkel",
        lat: 47.773514,
        lng: 16.769231,
        image: "images/seewinkel.jpg",
        credit: "@echtzeitjohann https://pixabay.com/de/photos/rinderherde-burgenland-seewinkel-1203871/",
        wikiTitle: "Nationalpark_Neusiedler_See_-_Seewinkel"
    },
    {
        name: "Nationalpark Gesäuse",
        lat: 47.569953,
        lng: 14.615875,
        image: "images/gesäuse.jpg",
        credit: "@jplenio https://pixabay.com/de/photos/alpine-berge-sonnenuntergang-alpen-5630807/",
        wikiTitle: "Nationalpark_Gesäuse"
    },
    {
        name: "Nationalpark Thayatal",
        lat: 48.859317,
        lng: 15.898437,
        image: "images/thaya.jpg",
        credit: "@Neo98 https://pixabay.com/de/photos/natur-tschechien-podyji-nationalpark-3520727/",
        wikiTitle: "Nationalpark_Thayatal"
    },
    {
        name: "Nationalpark Kalkalpen",
        lat: 47.805639,
        lng: 14.307364,
        image: "images/kalkalpen.jpg",
        credit: "@HF_AT https://pixabay.com/de/photos/dambergwarte-fog-foggy-foggy-forest-7566021/",
        wikiTitle: "Nationalpark_Kalkalpen"
    },
    {
        name: "Nationalpark Donau-Auen",
        lat: 48.155263,
        lng: 16.816245,
        image: "images/donauauen.jpg",
        credit: "@Cs- https://pixabay.com/de/photos/danube-die-donau-donau-rückstau-2424063/",
        wikiTitle: "Nationalpark_Donau-Auen"
    }
];

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true,
}).setView(mapCenter, initialZoom);

// Layer für thematische Daten
let themaLayer = {
    forecast: L.layerGroup(),
    wind: L.layerGroup(),
    parks: L.layerGroup(),
};

// Basislayer hinzufügen
L.tileLayer.provider("Esri.WorldImagery").addTo(map);

// thematische Layer zur Layer-Kontrolle hinzufügen
L.control.layers({}, {
    "Wettervorhersage MET Norway": themaLayer.forecast,
    "ECMWF Windvorhersage": themaLayer.wind,
    "Nationalparks": themaLayer.parks
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Funktion, um Wikipedia-Inhalte abzurufen
async function fetchWikipediaContent(title) {
    let url = `https://de.wikipedia.org/api/rest_v1/page/summary/${title}`;
    let response = await fetch(url);
    let data = await response.json();
    return data.extract;
}

// Funktion, um den gesamten Wikipedia-Artikel abzurufen
async function fetchFullWikipediaContent(title) {
    let url = `https://de.wikipedia.org/api/rest_v1/page/html/${title}`;
    let response = await fetch(url);
    let data = await response.text();
    return data;
}

// Nationalparks Marker hinzufügen
nationalParks.forEach(park => {
    let marker = L.marker([park.lat, park.lng], { title: park.name }).addTo(themaLayer.parks);
    marker.name = park.name;

    // Popup-Inhalt abhängig vom Nationalpark
    let popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');
    
    let parkName = document.createElement('h4');
    parkName.textContent = park.name;
    popupContent.appendChild(parkName);

    let parkImage = document.createElement('img');
    parkImage.src = park.image;
    parkImage.alt = park.name;
    parkImage.style.width = '100%';
    popupContent.appendChild(parkImage);

    let credit = document.createElement('small');
    credit.innerHTML = `Bildnachweis: <a href="${park.credit.split(', ')[2]}" target="_blank">${park.credit}</a>`;
    popupContent.appendChild(credit);

    // Links für den Nationalpark Hohe Tauern hinzufügen
    if (park.name === "Nationalpark Hohe Tauern") {
        let tourismLink = document.createElement('p');
        tourismLink.innerHTML = `Für Informationen über touristische Angebote im Nationalpark: <a href="${park.tourismLink}" target="_blank">Nationalpark Hohe Tauern - Tourismus</a>`;
        popupContent.appendChild(tourismLink);

        let natureLink = document.createElement('p');
        natureLink.innerHTML = `Die Schönheit der Natur im Nationalpark erleben: <a href="${park.natureLink}" target="_blank">Nationalpark Hohe Tauern - Ökologie und Geographie</a>`;
        popupContent.appendChild(natureLink);
    }

    marker.bindPopup(popupContent);

    // Wikipedia-Inhalt anzeigen, wenn auf den Marker geklickt wird
    marker.on('click', async () => {
        let wikiText = await fetchWikipediaContent(park.wikiTitle);
        let wikiFull = await fetchFullWikipediaContent(park.wikiTitle);
        document.getElementById('wiki-text').innerText = wikiText;
        document.getElementById('wiki-full').innerHTML = wikiFull;
    });
});

// Leaflet Search Control für Nationalparks
let searchControl = new L.Control.Search({
    layer: themaLayer.parks,
    propertyName: 'name',
    zoom: 12,
    marker: false,
    textPlaceholder: "Suchen...",
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, initialZoom);
        let marker = L.marker(latlng).addTo(map).bindPopup(title).openPopup();
    }
}).addTo(map);

// Wettervorhersage MET Norway
async function showForecast(lat, lon) {
    if (!isInAustria({lat: lat, lng: lon})) {
        alert("Bitte innerhalb Österreichs klicken.");
        return;
    }

    let url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
    let response = await fetch(url);
    let jsondata = await response.json();

    // aktuelles Wetter und Wettervorhersage implementieren
    console.log(jsondata);
    let content = `
        <h4>Wettervorhersage für ${lat.toFixed(2)}, ${lon.toFixed(2)}</h4>
        <ul>
            <li>Luftdruck Meereshöhe (hPa): ${jsondata.properties.timeseries[0].data.instant.details.air_pressure_at_sea_level}</li>
            <li>Lufttemperatur (°C): ${jsondata.properties.timeseries[0].data.instant.details.air_temperature}</li>
            <li>Bewölkungsgrad (%): ${jsondata.properties.timeseries[0].data.instant.details.cloud_area_fraction}</li>
            <li>Luftfeuchtigkeit(%): ${jsondata.properties.timeseries[0].data.instant.details.relative_humidity}</li>
            <li>Windrichtung (°): ${jsondata.properties.timeseries[0].data.instant.details.wind_from_direction}</li>
            <li>Windgeschwindigkeit (km/h): ${Math.round(jsondata.properties.timeseries[0].data.instant.details.wind_speed * 3.6)}</li>
        </ul>
    `;

    // Wettericons für die nächsten 24 Stunden in 3-Stunden Schritten
    for (let i = 0; i <= 24; i += 3) {
        if (i < jsondata.properties.timeseries.length) {
            let forecastTime = new Date(jsondata.properties.timeseries[i].time);
            let symbol = jsondata.properties.timeseries[i].data.next_1_hours.summary.symbol_code;
            content += `<img src="https://api.met.no/images/weathericons/svg/${symbol}.svg" alt="${symbol}" style="width:32px" title="${forecastTime.toLocaleString()}">`;
        }
    }

    // Link zum Datendownload
    content += `<p><a href="${url}" target="_blank">Daten downloaden</a></p>`;

    L.popup()
        .setLatLng([lat, lon])
        .setContent(content)
        .openOn(map);
}

// Karte auf Klick aktualisieren, nur wenn innerhalb der österreichischen Grenzen
map.on("click", function (evt) {
    if (isInAustria(evt.latlng)) {
        showForecast(evt.latlng.lat, evt.latlng.lng);
    } else {
        alert("Bitte innerhalb Österreichs klicken.");
    }
});

// Überprüfen, ob der Punkt in Österreich liegt
function isInAustria(latlng) {
    return latlng.lat >= austriaBounds[0][0] && latlng.lat <= austriaBounds[1][0] &&
           latlng.lng >= austriaBounds[0][1] && latlng.lng <= austriaBounds[1][1];
}

// Grenzen von Österreich einfügen
fetch('Daten/Oesterreich.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'red'
      },
    }).addTo(map);
  })
  .catch(error => console.error('Error fetching data:', error));

// Windkarte
async function loadWind(url) {
    const response = await fetch(url);
    const jsondata = await response.json();
    console.log(jsondata);
    L.velocityLayer({
        data: jsondata,
        lineWidth: 2,
        displayOptions: {
            directionString: "Windrichtung",
            speedString: "Windgeschwindigkeit",
            speedUnit: "km/h",
            position: "bottomright",
            velocityType: "",
        }
    }).addTo(themaLayer.wind);

    // Vorhersagezeitpunkt ermitteln
    let forecastDate = new Date(jsondata[0].header.refTime);
    forecastDate.setHours(forecastDate.getHours() + jsondata[0].header.forecastTime);

    document.querySelector("#forecast-date").innerHTML = `
    (<a href="${url}" target="_blank">Stand ${forecastDate.toLocaleString()}</a>)
    `;
}

// Beispielhafte Winddaten laden
loadWind("https://geographie.uibk.ac.at/data/ecmwf/data/wind-10u-10v-europe.json");

// Windvorhersage beim Laden der Seite aktivieren
themaLayer.wind.addTo(map);
