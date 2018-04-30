// Sylvie Langhout
// 10792368
// 
// Scatter.js
// File with the functions for D3 Scatterplot

window.onload = function() {

  console.log('Yes, you can!')
};


// var data = "http://stats.oecd.org/SDMX-JSON/data/WILD_LIFE/TOT_KNOWN+TOT_KNOWN_IND+CRITICAL+CRITICAL_IND+ENDANGERED+ENDANGERED_IND+VULNERABLE+VULNERABLE_IND+THREATENED+THREATENED_IND+THREAT_PERCENT+IND_PERCENT.MAMMAL+BIRD+REPTILE+AMPHIBIAN+FISH_TOT+MARINE_F+FRESHW_F+VASCULAR_PLANT+MOSS+LICHEN+INVERTEB.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+BRA+COL+CRI+LTU+RUS/all?&dimensionAtObservation=allDimensions"

// var critical = "http://stats.oecd.org/SDMX-JSON/data/WILD_LIFE/CRITICAL.MAMMAL+BIRD+REPTILE+AMPHIBIAN+FISH_TOT+MARINE_F+FRESHW_F+VASCULAR_PLANT+MOSS+LICHEN+INVERTEB.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+BRA+COL+CRI+LTU+RUS/all?&dimensionAtObservation=allDimensions"
// var criticalindo = "http://stats.oecd.org/SDMX-JSON/data/WILD_LIFE/CRITICAL_IND.MAMMAL+BIRD+REPTILE+AMPHIBIAN+FISH_TOT+MARINE_F+FRESHW_F+VASCULAR_PLANT+MOSS+LICHEN+INVERTEB.AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+NMEC+BRA+COL+CRI+LTU+RUS/all?&dimensionAtObservation=allDimensions"

// load min wage per year
var minimum_wage = "http://stats.oecd.org/SDMX-JSON/data/RMW/AUS+BEL+CAN+CHL+CZE+EST+FRA+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+GBR+USA+LTU.EXR.A/all?startTime=2000&endTime=2016&dimensionAtObservation=allDimensions"

// load average wage per year
var average_wage = "http://stats.oecd.org/SDMX-JSON/data/AV_AN_WAGE/AUS+BEL+CAN+CHL+CZE+EST+FRA+GRC+HUN+IRL+ISR+JPN+KOR+LVA+LUX+MEX+NLD+NZL+POL+PRT+SVK+SVN+ESP+GBR+USA+LTU.USDEX/all?startTime=2000&endTime=2016&dimensionAtObservation=allDimensions"
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
  		var money = (data_minimum["dataSets"]["0"]["observations"][country + ":" + time + ":0:0"][0])
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
  		var money = (data_average["dataSets"]["0"]["observations"][country + ":" + time + ":0"][0])
  		this_country.push(money)
  	}
  	average_per_country.push(this_country)
  }
  console.log(average_per_country)
  console.log(minimum_per_country)


  // convert to one array with for every country array per year with average and minimum
  pay_per_year = []

  for (per_country = 0; per_country < NR_COUNTRIES; per_country++)
  {
  	// var country = []
  	var years = []
  	for(per_year = 0; per_year < NR_YEARS; per_year++)
	{
		var year = [average_per_country[per_country][per_year], minimum_per_country[per_country][per_year]]
	  	years.push(year)
	}
	pay_per_year.push(years)
  }
  
   console.log(pay_per_year[0])

   var svg = d3.select("body")
            .append("svg")
            .attr("width", 1000)
            .attr("height", 1000);

   svg.selectAll("circle")
   .data(pay_per_year[0])
   .enter()
   .append("circle")
   .attr("cx", function(d) {
        return d[0];
   })
   .attr("cy", function(d) {
        return d[1];
   })
   .attr("r", 5);

 
};