let coords = [38.977399, 45.049746];
let zoom = 15;

$(() => {
	$('.lazy').lazy();

	if($('#map').length){
		loadScript("https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js", () => {
			initMap();
		})
	}

    $('body').on('click', '.scroll-top', animateTop);
});

function animateTop(e){
    e.preventDefault();
    $('.scroller').animate({
        scrollTop: 0
    }, 400);
}

//= Асинхронная загрузка скриптов =========================================
function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";
    
    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

//= Инициализация карты ===================================================
function initMap(){

    mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VuZXN5cyIsImEiOiJja2xyejVqbTAwN3c2MnBwdjZvdHVhOHpiIn0.IrmmbUMTtmXBxZjv8mcH8Q';

    const geoJson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "point",
                    "coordinates": coords
                },
                "properties": {
                    "title": "Образовательный центр «Бином»",
                    "coordinates": coords
                }
            }
        ]
    }

    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/genesys/ckls2dt0l12fj17qxtbz91bqg',
        center: coords,
        zoom: zoom,
        pitch: 60,
        bearing: -20
    });

    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
        }));

    map.scrollZoom.disable();

    for (const feature of geoJson.features){
        const el = $('<div class="marker"><div class="marker-element"></div></div>')[0];
        el.className = "marker";

        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({offset: 25})
                    .setHTML(
                        `<div class="popup-logo"></div><div class="popup-header">${feature.properties.title}</div><div class="popup-description"><p>г. Краснодар, ул. Красная 155/2 офис 1001</p><a target="_blank" rel="nofollow" href="https://yandex.ru/maps/-/CCUJb8WqSA">Подробнее</a></div>`
                    )
            )
            .addTo(map);
    }
}