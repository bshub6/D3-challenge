

var svgWidth = 960;
var svgHeight = 500;

var margin = {
	top: 20,
	right: 40,
	bottom: 80,
  left: 100
  
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
	.select(".chart")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "state";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
	// create scales
	var xLinearScale = d3.scaleLinear()
		.domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
			d3.max(censusData, d => d[chosenXAxis]) * 1.2
		])
		.range([0, width]);

	return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
	var bottomAxis = d3.axisBottom(newXScale);

	xAxis.transition()
		.duration(1000)
		.call(bottomAxis);

	return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

	circlesGroup.transition()
		.duration(1000)
		.attr("cx", d => newXScale(d[chosenXAxis]));

	return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

	if (chosenXAxis === "state") {
		var label = "Lives in Poverty (%):";
	} else {
		var label = "Lack of Healthcare (%):";
	}

	var toolTip = d3.tip()
		.attr("class", "tooltip")
		.offset([80, -60])
		.html(function (d) {
			return (`${d.state}<br>${label} ${[d.chosenXAxis]}`);
		});

	circlesGroup.call(toolTip);

	circlesGroup.on("mouseover", function (data, index) {
			toolTip.show(data);
		})
		// onmouseout event
		.on("mouseout", function (data, index) {
			toolTip.hide(data);
		});

	return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {
	if (err) throw err;

	// Step 1: Parse Data/Cast as numbers

	censusData.forEach(function(data) {
		data.poverty = +data.poverty; // x
		data.healthcare = +data.healthcare; //y
		console.log("state: ", data.abbr)
		console.log("poverty:", data.poverty)
		console.log("healthcare", data.healthcare)

	});

	// xLinearScale function above csv import
	var xLinearScale = d3.scaleLinear()
		.domain([8, d3.max(censusData, d => d.poverty)])
		.range([0, width]);


	// Create y scale function
	var yLinearScale = d3.scaleLinear()
		.domain([0, d3.max(censusData, d => d.healthcare)])
		.range([height, 0]);

	// Create initial axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	// append x axis
	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	// append y axis
	chartGroup.append("g")
		.call(leftAxis);

	// append initial circles
	var circlesGroup = chartGroup.selectAll("circle")
		.data(censusData)
		.enter()
		.append("circle")
		.attr("cx", d => xLinearScale(d.healthcare))
		.attr("cy", d => yLinearScale(d.poverty))
		.attr("r", 20)
		.attr("fill", "blue")
		.attr("opacity", ".5");

    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  

  chartGroup.append("g")
    .call(leftAxis);



  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2)- 60)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lack of Healthcare (%)");

// Append x-axis labels
  chartGroup.append("text")
    .attr("transform", "translate(" + (width / 2 - 25) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("In Poverty (%)");

});