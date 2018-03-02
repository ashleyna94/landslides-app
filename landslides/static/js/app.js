

///////////////////////////
// javascript for plotly //
///////////////////////////

// populate country names
function getCountryName() {

    // Grab a reference to the dropdown select element
    var selector = document.getElementById("selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/api/countrynames", function (error, countryNames) {

        countryNames.sort();

        for (var i = 0; i < countryNames.length; i++) {
            var currentOption = document.createElement('option')
            currentOption.text = countryNames[i]
            currentOption.value = countryNames[i]
            selector.appendChild(currentOption);
        }
    })
};

var base_url = "/api/"
getData(base_url + "Afghanistan");

function getData(url) {
    d3.json(url, function (data) {
        buildPlot(data);
    })
}

function optionChanged(country) {
    var url = base_url + country;
    getData(url);
};

function buildPlot(data) {
    var yearArray = [];
    var countArray = [];
    var parseYear = d3.timeParse("%Y");

    // fill each of the arrays with data
    for (var i = 0; i < data.length; i++) {
        yearArray.push(parseYear(data[i].year));
        countArray.push(data[i].count);
    }

    // Create a trace object with the new arrays created
    var trace1 =
        {
            x: yearArray,
            y: countArray,
            type: 'scatter'
        };


    var layout = {
        title: "Trends in Landslide Occurances",
        xaxis: {
            title: "Year"
        },
        yaxis: {
            title: "Number of Landslide Occurances"
        }

    };


    // create a data array with the traces
    var data = [trace1]

    Plotly.newPlot('timePlot', data, layout);

}


function init() {
    getCountryName();
};



// Initialize the dashboard
init();


///////////////////////////
// javascript for leaflet //
///////////////////////////

// Store our API endpoint inside queryUrl
var queryUrl = "/api/leaflet/geojson";

// perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json(queryUrl, createMarkers);

function createMarkers(response) {

    // pull the "features" property off of the response
    var features = response.features;

    // initialize an array to hold markers
    var markers = [];

    // loop through the features array
    for (var index = 0; index < features.length; index++) {
        var coordinate = features[index].geometry.coordinates

        // for each station, create a marker and bind a popup with the station's name
        var marker = new L.CircleMarker([coordinate[0], coordinate[1]], {
            radius: 2,
            fillColor: "#ff7800",
            color: "#000",
            weight: 0,
            opacity: 0,
            fillOpacity: 0.5
        })

        // add the marker to the markers array
        markers.push(marker);
    }

    // create a layer group made from the markers array, pass it into the createMap function
    createMap(L.layerGroup(markers));
}

function createMap(markers) {

    // create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYXNlbGExOTgyIiwiYSI6ImNqZDNocXRlNTBoMWEyeXFmdWY1NnB2MmIifQ.ziEOjgHun64EAp4W3LlsQg",
        {
            maxZoom: 18
        });

    // create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        "Landslides": markers
    };

    // Create the map object with options
    var geoMap = L.map("map", {
        center: [26.3351, 17.2283],
        zoom: 2,
        preferCanvas: true,
        layers: [lightmap, markers]
    });

    // create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(geoMap);
}


///////////////////////////
// javascript for network //
///////////////////////////

// create an array with nodes
var nodes = new vis.DataSet([
    // inner circle nodes
    { id: 1, label: 'Asia', color: '#4E495F', shape: 'circle', font: { strokeWidth: 3, strokeColor: 'white' } },
    { id: 2, label: 'Africa', color: '#876C64', shape: 'circle', font: { strokeWidth: 3, strokeColor: 'white' } },
    { id: 3, label: 'North America', color: '#A33B20', shape: 'circle', font: { strokeWidth: 3, strokeColor: 'white' } },
    { id: 4, label: 'South America', color: '#A47963', shape: 'circle', font: { strokeWidth: 3, strokeColor: 'white' } },
    { id: 5, label: 'Antartica', color: '#DEEAEA', shape: 'circle', font: { strokeWidth: 3, strokeColor: 'white' } },
    { id: 6, label: 'Europe', color: '#A6A57A', shape: 'circle', font: { strokeWidth: 3, strokeColor: 'white' } },
    { id: 7, label: 'Oceania', color: '#78A5A5', shape: 'circle', font: { strokeWidth: 3, strokeColor: 'white' } }
]);
// below code is used to add countries from json file into viz
var vis_link = "/api/vis"
d3.json(vis_link, function (error, data) {
    if (error) throw error;

    data.forEach(function (value, index) {
        nodes.add({
            id: (index + 8), size: (Math.sqrt((30 + value.fatalities))), label: value.country_code, shape: 'dot'
        });
    })
});

// create an array with edges
var edges = new vis.DataSet([
    // edges for inner circle
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 7, to: 1 }
]);

// below code used to properly connect country nodes to the continents
d3.json(vis_link, function (error, data) {
    if (error) throw error;

    data.forEach(function (value, index) {
        if (value.continent_code == 'NA') {
            edges.add({
                from: 3, to: (index + 8)
            })
        } else if (value.continent_code == 'AF') {
            edges.add({
                from: 2, to: (index + 8)
            })
        } else if (value.continent_code == 'AS') {
            edges.add({
                from: 1, to: (index + 8)
            })
        } else if (value.continent_code == 'EU') {
            edges.add({
                from: 6, to: (index + 8)
            })
        } else if (value.continent_code == 'OC') {
            edges.add({
                from: 7, to: (index + 8)
            })
        } else {
            edges.add({
                from: 4, to: (index + 8)
            })
        }
    })


});

// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {};

// initialize your network!
var network = new vis.Network(container, data, options);







