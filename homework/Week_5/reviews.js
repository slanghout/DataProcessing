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
  
  var american_restaurants = []
  for(var restaurant = 0; restaurant < restaurant_reviews.length; restaurant ++)
  {
  	if (restaurant_reviews[restaurant].Country == "United States")
  	{	
  		american_restaurants.push(restaurant_reviews[restaurant])
  	}
  }
  console.log(american_restaurants)
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

  w = 1000
  h = 1000
  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var svg = d3.select("svg");

var path = d3.geoPath();

var state_names = ["none", "Alabama", "Alaska", "none", "Arizona", "Arkansas", "California",
	"none", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida",
	"Georgia", "none", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
	"Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
	"Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
	"New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
	"North Dakota", "Ohio", "Oklahoma","Oregon", "Pennsylvania", "none", "Rhode Island",
	"South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
	"Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]

// create an array with all the abbreviations of the states
var provinces = ["none", "AL", "AK", "none",  "AZ", "AR", "CA", "none", "CO",
	"CT", "DE", "none", "FL", "GA", "none", "HI", "ID", "IL","IN", "IA", "KS",
	"KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV",
	"NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "none",
	"RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI" ,"WY"]

var restaurant_per_state = []

for (var state = 0; state < provinces.length; state ++)
{
	// var restaurant_in_state = []\
	var restaurant_count = 0

	for (var restaurant = 0; restaurant < american_restaurants.length; restaurant++)
	{
		if (provinces[state] == american_restaurants[restaurant].State)
		{
			restaurant_count += 1
		}
	}
	restaurant_per_state.push(restaurant_count)
}

var hotel_per_state = []

for (var state = 0; state < provinces.length; state ++)
{
	var hotel_count = 0

	for (var hotel = 0; hotel < hotel_reviews.length; hotel++)
	{
		if (provinces[state] == hotel_reviews[hotel].province)
		{
			hotel_count += 1
		}
	}
	hotel_per_state.push(hotel_count)
}

var dataset = []
for (var state = 0; state < provinces.length; state ++)
{
	dataset.push([restaurant_per_state[state], hotel_per_state[state]])

}
console.log(dataset)

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
    	svg.selectAll("rect").remove()
    	svg.selectAll("text").remove()
    	// create Scale for x-axis
		  var xScale = d3.scaleLinear()
		   .domain([d3.min(dataset[parseInt(d.id)]), function(d) {return d;}, d3.max(dataset[parseInt(d.id)]), function(d) {return d;}])
		   .range([100, 300]);

		  // create scale for y-axis 
		  var yScale = d3.scaleLinear()
		    .domain([0, d3.max((dataset[parseInt(d.id)]), function(d) {return d;})])
		    .range([600, 800]);
    	
    	svg.selectAll("text")
			.data(dataset[parseInt(d.id)])
		   	.enter()
		   	.append("text")
		   	.text(state_names[parseInt(d.id)])
		   	.attr("x", 200)
		   	.attr("y", 600)
		svg.selectAll("rect")
			.data(dataset[parseInt(d.id)])
		   	.enter()
		   	.append("rect")
		   	.attr("x", function(d, i) {return 50 +(i *100)})
		   	.attr('y', 600)
		   	.attr("width", 10)
		   	.attr("height", function(d) {return d})
		   	.attr("fill", function(d) {
        		return "pink";
        	})
        	// console.log(data)
        
    })


});
}
