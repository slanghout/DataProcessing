// Sylvie Langhout
// 10792368
// 
// Scatter.js
// File with the functions for D3 Scatterplot

window.onload = function() {

  console.log('Yes, you can!')
};

// load min wage per year
var minimum_wage = "https://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+CZE+EST+FRA+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+GBR+USA+LTU.EXR.A/all?startTime=2000&endTime=2016&dimensionAtObservation=allDimensions"

// load average wage per year
var average_wage = "https://stats.oecd.org/SDMX-JSON/data/AV_AN_WAGE/AUS+BEL+CAN+CHL+CZE+EST+FRA+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+GBR+USA+LTU.USDEX/all?startTime=2000&endTime=2016&dimensionAtObservation=allDimensions"
// set two datasets in queue
d3.queue()
  .defer(d3.request, minimum_wage)
  .defer(d3.request, average_wage)
  .awaitAll(MakeScatter)

// function to make scatterplot of the data
function MakeScatter(error, response) {
  if (error) throw error;
  
  // set number of countries and number of years
  var NR_COUNTRIES = 26
  var NR_YEARS = 17

  // make empty arrays for data
  var minimum_per_country = []
  var average_per_country = []

  // select datasets
  data_minimum = JSON.parse(response[0].responseText)
  data_average = JSON.parse(response[1].responseText)

  // loop over countries and add array for every country
  for(country = 0; country < NR_COUNTRIES; country++)
  {
  	var this_country = []
  	
  	// loop over years and add data to array for every year
  	for(time = 0; time < NR_YEARS; time ++)
  	{
  		var money = (data_minimum["dataSets"]["0"]["observations"][country + ":" +
        time + ":0:0"][0])
  		this_country.push(money)
  	}
  	minimum_per_country.push(this_country)
  }
  	
  // loop over countries and add array for every country
  for(country = 0; country < NR_COUNTRIES; country++)
  {
  	var this_country = []

  	// loop over years and add data to array for every year
  	for(time = 0; time < NR_YEARS; time ++)
  	{
  		var money = (data_average["dataSets"]["0"]["observations"][country + ":" +
        time + ":0"][0])
  		this_country.push(money)
  	}
  	average_per_country.push(this_country)
  }

  // create empty array
  pay_per_year = []

  // iterate over years and countries
  for(per_year = 0; per_year < NR_YEARS; per_year++)  
  {
  	var years = []	
    
    // add every point to seperate list per country
    for (per_country = 0; per_country < NR_COUNTRIES; per_country++)
    {
      var country_stats = [average_per_country[per_country][per_year],
      minimum_per_country[per_country][per_year]]
	  	years.push(country_stats)
    }
	pay_per_year.push(years)
  }

  // create a list of the country names
  country_list = []
  for(country = 0; country < NR_COUNTRIES; country ++)
    {
      var country_name = (data_average["structure"]["dimensions"]["observation"]
        ["0"]["values"][country]["name"])
      country_list.push(country_name)
    } 

  // create a list of the years
  year_list = []
  for(country = 0; country < NR_YEARS; country ++)
    {
      var this_year = (data_average["structure"]["dimensions"]["observation"]
        ["1"]["values"][country]["name"])
      year_list.push(this_year)
    }
   
  // pick dataset
  var dataset = pay_per_year[9]
  
  // set width and height for the scatterplot
  var h = 600
  var w = 900
  
  // set padding for width and height
  var w_padding = 100
  var h_padding = 50
  
  // pick color scheme for scatterplot
  var color = d3.scaleOrdinal(d3.schemeCategory20)
  
  // Create title of page
  d3.select("body").append("h1")
    .text("Scatterplot of annual wage against minimum wage")

  // Create undertitle with name and Student number
  d3.select("body").append("h3")
    .text("Sylvie Langhout - 10792368")

  // Create undertitle with description
  d3.select("body").append("h5")
    .text("Scatterplot displaying the average wage against
        the minimal wage of various countries in US dollar rates. 
        Source: https://stats.oecd.org ")

// create drop down menu
var select = d3.select('body')
  .append('select')
  .attr('class','select')
  .attr("value", function(d, i){return (i)})
  .on('change', changeyear)

// create text in dropdown menu
var options = select
  .selectAll('option')
  .data(year_list).enter()
  .append('option')
  .text(function (d) { return d; });

function changeyear() {
  selectValue = d3.select('select').property('value')
  return 
};

  // create svg of width and height
  var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // create Scale for x-axis
  var xScale = d3.scaleLinear()
   .domain([0, d3.max(dataset, function(d) { return d[0]; })])
   .range([w_padding, w - w_padding]);

  // create scale for y-axis 
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) {return d[1];})])
    .range([h - h_padding, h_padding]);

  // create circles for the datapoints in scatterplot
  svg.selectAll("circle")
	 .data(dataset)
	 .enter()
	 .append("circle")
	 .attr("cx", function(d) {return xScale(d[0]);})
	 .attr("cy", function(d) {return yScale(d[1]);})
	 .attr("r", 5)
   .style("fill", function(d) { return color(d); })

  // create x-axis
  svg.append('g')
    .attr('transform', 'translate(0,550)')
    .attr('class', 'x axis')
    .call(d3.axisBottom(xScale))
    
  // Create x-axis text
  svg.append('text')
    .attr('x', w)
    .attr('y', h - 10)
    .attr('text-anchor', 'end')
    .attr('class', 'label')
    .text('Minimum annual wage (US dollar rate)');

  // creaye y-axis
  svg.append('g')
    .attr('transform', 'translate(50,0)')
    .attr('class', 'y axis')
    .call(d3.axisRight(yScale));

  // y-axis text
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20)
    .attr("x", 0 - (h / 2))
    .attr("dy", "1em")
    .style("text-anchor", "begin")
    .text("Averga annual wage (US dollar rate)");  

  // create attribute legend in right top corner
  var legend = svg.selectAll(".legend")
    .data(country_list)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0,"
       + i * 20 + ")"; });

  // append colored squares for legend
  legend.append("rect")
    .attr("x", w - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  // add text to legend
  legend.append("text")
    .attr("x", w - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });


};


