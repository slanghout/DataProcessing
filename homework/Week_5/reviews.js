// Sylvie Langhout
// 10792368
// 
// reviews.js
// File with the functions for D3 Map with charts

window.onload = function() {

  console.log('Yes, you can!')
};

d3.queue()
	.defer(d3.json, 'restaurant_reviews.json')
	.defer(d3.json, 'hotel_reviews.json')
	.defer(d3.json, 'states_nr.json')
	.await(MakeMap);

function MakeMap(error, restaurant_reviews, hotel_reviews, states_nr) {
  if (error) throw error;
  console.log(restaurant_reviews)
  console.log(hotel_reviews)

   // Create title of page
  d3.select("body").append("h1")
    .text("Restaurant and Hotels in different states")

  // Create undertitle with name and Student number
  d3.select("body").append("h3")
    .text("Sylvie Langhout - 10792368")

  // Create undertitle with description
  d3.select("body").append("h5")
    .text("Click on a state and different hotels and restaurants for the state will be displayed")

  var svg = d3.select("body")
    .append("svg")
    .attr("width", 960)
    .attr("height", 600);

var svg = d3.select("svg");

var path = d3.geoPath();

var state_names = ["Alabama", "Alaska", "none", "Arizona", "Arkansas", "California",
	"none", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida",
	"Georgia", "none", "Hawaii", "IdahO", "Illinois", "Indiana", "Iowa", "Kansas",
	"Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
	"Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
	"New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
	"North Dakota", "Ohio", "Oklahoma","Oregon", "Pennsylvania", "none", "Rhode Island",
	"South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
	"Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
	"American Samoa", "Guam" ,"Northern Mariana Islands",
	"Puerto Rico", "U.S. Minor Outlying Islands", "U.S. Virgin Islands"]
console.log(state_names)

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  svg.append("g")
      .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path);

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))

  svg.selectAll('path')  
   .on('click',function(d) {   
        d3.select("#statename").text(state_names[d.id]);
        d3.select("#agvalue").text(d.properties.value);
        console.log(d.id)
    })    

});
}