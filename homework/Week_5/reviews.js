// Sylvie Langhout
// 10792368
// 
// reviews.js
// File with the functions for D3 Map with charts

window.onload = function() {

  console.log('Yes, you can!')
};

// load in the needed json files
d3.queue()
	.defer(d3.json, 'restaurant_reviews.json')
	.defer(d3.json, 'hotel_reviews.json')
	.defer(d3.json, 'states_nr.json')
	.await(MakeMap);

// create function to make map
function MakeMap(error, restaurant_reviews, hotel_reviews, states_nr) {
  if (error) throw error;
  
// create list of the state names
var state_names = ["none", "Alabama", "Alaska", "none", "Arizona", "Arkansas", "California",
	"none", "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida",
	"Georgia", "none", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
	"Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
	"Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
	"New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", 
	"North Dakota", "Ohio", "Oklahoma","Oregon", "Pennsylvania", "none", "Rhode Island",
	"South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
	"Virginia","none", "Washington", "West Virginia", "Wisconsin", "Wyoming"]

// create an array with all the abbreviations of the states
var provinces = ["none", "AL", "AK", "none",  "AZ", "AR", "CA", "none", "CO",
	"CT", "DE", "none", "FL", "GA", "none", "HI", "ID", "IL","IN", "IA", "KS",
	"KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV",
	"NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "none",
	"RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "none", "WA", "WV", "WI" ,"WY"]

// create list of restaurants in America
  var american_restaurants = []
  for(var restaurant = 0; restaurant < restaurant_reviews.length; restaurant ++)
  {
  	if (restaurant_reviews[restaurant].Country == "United States")
  	{	
  		american_restaurants.push(restaurant_reviews[restaurant])
  	}
  }

// set lenght of the number of states and restaurants
var nr_of_states = provinces.length
var nr_of_restaurants = american_restaurants.length
var restaurant_per_state = []
  
// create list with all the restaurants per state
for (var state = 0; state < nr_of_states; state ++)
{
	// var restaurant_in_state = []\
	var restaurant_count = 0

	for (var restaurant = 0; restaurant < nr_of_restaurants; restaurant++)
	{
		if (provinces[state] == american_restaurants[restaurant].State)
		{
			restaurant_count += 1
		}
	}
	restaurant_per_state.push(restaurant_count)
}

// create list of all the hotels per state
var hotel_per_state = []
var nr_of_hotels = hotel_reviews.length

for (var state = 0; state < nr_of_states; state ++)
{
	var hotel_count = 0

	for (var hotel = 0; hotel < nr_of_hotels; hotel++)
	{
		if (provinces[state] == hotel_reviews[hotel].province)
		{
			hotel_count += 1
		}
	}
	hotel_per_state.push(hotel_count)
}

// combine hotel and restaurant data into one dataset per state
var dataset = []
for (var state = 0; state < nr_of_states; state ++)
{
	dataset.push([restaurant_per_state[state], hotel_per_state[state]])

}
 
 // set width and height for svg
 w = 1000
 h = 1000
 
// create svg element
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

var svg = d3.select("svg");

// create map of the USA
var path = d3.geoPath();
d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  svg.append("g")
      .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
 
  
 // select a random state for begin of page
 var randomcounty = Math.floor(Math.random() * 56)
 
 // create Scale for x-axis
 var xScale = d3.scaleLinear()
	.domain([0, 3])
	.range([150, 300]);

// scale the y to max of the dataset
if (dataset[parseInt(randomcounty)][0] < dataset[parseInt(randomcounty)][1])
{
	yMax = dataset[parseInt(randomcounty)][1]
}
else
{
	yMax = dataset[parseInt(randomcounty)][0]
}
		  	
// create scale for y-axis 
var yScale = d3.scaleLinear()
.domain([0, yMax])
.range([900, 600])

// create title with state name
svg.selectAll("text")
.data(dataset[parseInt(randomcounty)])
	.enter()
	.append("text")
	.text(state_names[parseInt(randomcounty)])
	.attr("x", 200)
	.attr("y", 550)

// create x-axis text restaurants
svg.append('text')
.attr('x', 200)
.attr('y', 950)
.attr('text-anchor', 'end')
.attr('class', 'label')
.text('Restaurants');

// create x-axis text hotels
svg.append('text')
.attr('x', 250)
.attr('y', 950)
.attr('text-anchor', 'end')
.attr('class', 'label')
.text('Hotels');

// create bars
svg.selectAll("rect")
.data(dataset[parseInt(randomcounty)])
	.enter()
	.append("rect")
	.attr("x",function(d,i) {return xScale(i); })
	.attr("y",function(d) { return yScale(d); })
	.attr("width", 40)
	.attr("height", function(d) {return 900 - yScale(d)})
	.attr("fill", function(d) {
	return "pink";
})

// create x-axis
svg.append('g')
.attr('transform', 'translate(0, 900)')
.attr('class', 'x axis')
.call(d3.axisTop(xScale).ticks(0))
.selectAll("text").remove()
// .ticks(0)

// creaye y-axis
svg.append('g')
.attr('transform', 'translate(150,0)')
.attr('class', 'y axis')
.call(d3.axisLeft(yScale).ticks(4));


// when hovering over state update graph
svg.selectAll('path')
    .on('mouseover', update_graph) 

// function to update graph
function update_graph(d) {
    	svg.selectAll("rect").remove()
    	svg.selectAll("text").remove()

    	  // create Scale for x-axis
		  var xScale = d3.scaleLinear()
		   .domain([0, 3])
		   .range([150, 300]);

		  if (dataset[parseInt(d.id)][0] < dataset[parseInt(d.id)][1])
		  	{
		  		yMax = dataset[parseInt(d.id)][1]
		  	}
		  else
		  {
		  	yMax = dataset[parseInt(d.id)][0]
		  }
		  	
		  // create scale for y-axis 
		  var yScale = d3.scaleLinear()
		    .domain([0, yMax])
		    .range([900, 600])
    	
    	// create title with state name
    	svg.selectAll("text")
			.data(dataset[parseInt(d.id)])
		   	.enter()
		   	.append("text")
		   	.text(state_names[parseInt(d.id)])
		   	.attr("x", 200)
		   	.attr("y", 550)

		 // create x-axis text restaurants
		 svg.append('text')
		    .attr('x', 200)
		    .attr('y', 950)
		    .attr('text-anchor', 'end')
		    .attr('class', 'label')
		    .text('Restaurants');
		  
		  // create x-axis text hotels
		  svg.append('text')
		    .attr('x', 250)
		    .attr('y', 950)
		    .attr('text-anchor', 'end')
		    .attr('class', 'label')
		    .text('Hotels');

		// create bars
		svg.selectAll("rect")
			.data(dataset[parseInt(d.id)])
		   	.enter()
		   	.append("rect")
		   	.attr("x",function(d,i) {return xScale(i); })
   			.attr("y",function(d) { return yScale(d); })
		   	.attr("width", 40)
		   	.attr("height", function(d) {return 900 - yScale(d)})
		   	.attr("fill", function(d) {
        		return "pink";
        	})
        	
         // create x-axis
		  svg.append('g')
		    .attr('transform', 'translate(0, 900)')
		    .attr('class', 'x axis')
		    .call(d3.axisTop(xScale).ticks(0))
		    .selectAll("text").remove()
		    // .ticks(0)
		
		// creaye y-axis
		  svg.append('g')
		    .attr('transform', 'translate(150,0)')
		    .attr('class', 'y axis')
		    .call(d3.axisLeft(yScale).ticks(4));
        
    }
});
}
