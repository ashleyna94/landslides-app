
// populate country names
function getCountryName() {

    // Grab a reference to the dropdown select element
    var selector = document.getElementById("selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/api/countrynames",function(error,countryNames){

        for(var i=0; i<countryNames.length;i++){
            var currentOption = document.createElement('option')
            currentOption.text = countryNames[i]
            currentOption.value = countryNames[i]
            selector.appendChild(currentOption);
        }
    })
};

function optionChanged(country){
    // fetch new data each time a new country is selected
    var getCountryUrl = "/api/"+country;
    d3.json(getCountryUrl,function(error,countryData){
        debug = countryData;
    });
};


function init(){
    getCountryName();
}

// Initialize the dashboard
init();



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
