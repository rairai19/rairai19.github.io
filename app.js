var slider = document.getElementById("dateSlider");
var output = document.getElementById("selectedDate");
output.innerHTML = slider.value; // Display the default slider value
var startIndex = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
    initHeatMap(this.value);
}

// Function that parses the csv file for the data
function getPoints(index) {
    var points = [];
    var dates = [];
    var date;
    d3.csv("/time_series_covid_19_confirmed.csv").then(function(data) {
        for (x in data[1]) {
            dates.push(x);
        }
        date = dates[index];
        output.innerHTML = date;

        for (var i = 1; i < data.length; i++) {
            const lat = data[i].Lat;
            const long = data[i].Long
            const weight = data[i][date];
            points.push({location: new google.maps.LatLng( lat, long), weight: weight});
        }
    });
    return points;
}

// creates the google maps
// calls initHeatMap
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 3,
        center: { lat: 37.774546, lng: -122.433523 },
        //mapTypeId: "satellite",
    });
    initHeatMap(startIndex);
}

// creates the heatmap layer of google maps
function initHeatMap(index) {
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(index),
        opacity: 0.5,
        map: map,
        radius: 5,
    });
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
  }