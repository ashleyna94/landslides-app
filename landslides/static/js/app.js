// Store our API endpoint inside queryUrl
var queryUrl = "/api/leaflet/geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, assign the data.features object 

  // Create a map object
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2
  });
  
  // Add a tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiYW5kcmV3cHJpY2UtdXQiLCJhIjoiY2pkaG5mZndyMHh0cDMzcmxqNGJocTBhcyJ9.bp8toFh-kL7HIXZZg43rjw"
  ).addTo(myMap);
  
//   // Loop through the cities array and create one marker for each city, bind a popup containing its name and population add it to the map   

// Create rain icon variable
var landslideIcon = L.icon({
    iconUrl: '/static/js/landslideicon.png',
    iconSize: [15,10]
});

for (var i = 0; i < data.features.length; i++) {
    L.marker(data.features[i].geometry.coordinates, {icon: landslideIcon}).bindPopup("<h3>" + "Type: " + data.features[i].properties.landslide_type + "</h3> <hr> <h3>Size: " + data.features[i].properties.landslide_size + "</h3>" + "<h3>" + "Trigger" + data.features[i].properties.trigger + "</h3>").addTo(myMap);
   }
    
  });
  



function buildPlot() {
    /* data route */
    var url = "/api/pals";
    // @TODO: Create your plot here
}

buildPlot();

// create an array with nodes
var nodes = new vis.DataSet([
    // inner circle nodes
    { id: 1, label: 'Asia', color: '#4E495F', shape: 'circle', font: {strokeWidth: 3, strokeColor: 'white'}},
    { id: 2, label: 'Africa', color: '#876C64', shape: 'circle', font: {strokeWidth: 3, strokeColor: 'white'}},
    { id: 3, label: 'North America', color: '#A33B20', shape: 'circle', font: {strokeWidth: 3, strokeColor: 'white'}},
    { id: 4, label: 'South America', color: '#A47963', shape: 'circle', font: {strokeWidth: 3, strokeColor: 'white'}},
    { id: 5, label: 'Antartica', color: '#DEEAEA', shape: 'circle', font: {strokeWidth: 3, strokeColor: 'white'}},
    { id: 6, label: 'Europe', color: '#A6A57A', shape: 'circle', font: {strokeWidth: 3, strokeColor: 'white'}},
    { id: 7, label: 'Oceania', color: '#78A5A5', shape: 'circle', font: {strokeWidth: 3, strokeColor: 'white'}}
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
