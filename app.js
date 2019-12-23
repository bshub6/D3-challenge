
  

var svgWidth = 960;
var svgHeight = 500;

var margin = {
	top: 20,
	right: 40,
	bottom: 80,
	left: 100,
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
	.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
	// create scales
	var xLinearScale = d3.scaleLinear()
		.domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
		  d3.max(data, d => d[chosenXAxis]) * 1.2
		])
		.range([0, width]);

	return xLinearScale;

}
//Function used for updating Y scale variable upon click on axis label
function YScale(data, chosenYAxis) {

	var yLinearScale = d3.scaleLinear()
		.domain([d3.min(data, d => d[chosenYAxis]) * .8,
			d3.max(data, d => d[chosenYAxis]) * 1.2
		])
		.range([height, 0]);
	return yLinearScale

}

	// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
	var bottomAxis = d3.axisBottom(newXScale);

		xAxis.transition()
			.duration(1000)
			.call(bottomAxis);

		return xAxis;
}

	//Function used to update Yaxis variable upon click on a axis label
function renderAxes(newYScale, yAxis) {
	var leftAxis = d3.axisLeft(newYScale);

	yAxis.transition()
		.duration(1000)
		.call(leftAxis);

	return yAxis;
}

	// function used for updating circles group with a transition to
	// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYaxis) {

	circlesGroup.transition()
		.duration(1000)
		.attr("cx", d => newXScale(d[chosenXAxis]))
		.attr("cy", d => newYScale(d[chosenYAxis]));

	return circlesGroup;
}
	//function used to updating text in circles group with transition to new text
function renderText(circleTextGroup, newXScale, newYScale, chosenXAxis, chosenYaxis) {

	circleTextGroup.transition()
		.duration(1000)
		.attr("x", d => newXScale(d[chosenXAxis]))
		.attr("y", d => newYScale(d[chosenYAxis]));

	return circleTextGroup;
}

	// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

	if (chosenXAxis === "poverty") {
		var xlabel = "Poverty:";
	} else if (chosenXAxis == "income") {
		var xlabel = "Median Income";
	} else {
		var xlabel = "Age:";
    }
	// Conditional for Y Axis
	if (chosenYAxis === "healthcare") {
		var ylabel = "Lack of Healthcare:";
	} else if (chosenYAxis == "smokes") {
		var ylabel = "Smokers";
	} else {
			var ylabel = "Obesity:";
    }
	var toolTip = d3.tip()
	    .attr("class", "d3-tip")
	    .offset([80, -60])
		.html(function(d) {
		if (chosenXAxis === "age") {

		    return (`${d.state}<br>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
		} else if (chosenXAvis !== "poverty" && chosenXAxis !== "age") {

			return (`${d.state}<br>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
		} else {

			return (`$d.state}<br>${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
		}
		});

	circlesGroup.call(toolTip);

	circlesGroup.on("mouseover", function(data) {
		toolTip.show(data);
	})
			// onmouseout event
		.on("mouseout", function(dataTip, index) {
		   toolTip.hide(dataTip);
		});

		return circlesGroup;
	}

	// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
	if (err) throw err;
				//Test console.log
	console.log(data[1]);

				// Step 1: Parse Data/Cast as numbers

	data.forEach(function(data) {
		data.poverty = +data.poverty; // x
		data.healthcare = +data.healthcare / 100; //y
		data.age = +data.age;
		data.income = +data.income;
		data.smokes = +data.smokes;
		data.obesity = +data.obesity;
		console.log(data);


	});

				// xLinearScale function above csv import
	var xLinearScale = xScale(data, chosenXAxis);



				// Create y scale function
	var yLinearScale = YScale(data, chosenYAxis);

				// Create initial axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

				// append x axis
	var xAxis = chartGroup.append("g")
		.classed("x-axis", true)
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

				// append y axis
	chartGroup.append("g")
		.call(leftAxis
		.ticks(10)
		.tickFormat(d3.format(",.1%")));

				// append initial circles
	var circlesGroup = chartGroup.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", d => xLinearScale(d[chosenXAxis]))
		.attr("cy", d => yLinearScale(d[chosenYAxis]))
		.attr("r", 20)
		.attr("fill", "blue")
		.attr("opacity", ".5");

	var labelsGroup = chartGroup.append("g")
		.attr("transform", `translate(${width/2}, ${height + 20})`);

	var povertyLabel = labelsGroup.append("text")
		.attr("x", 0)
		.attr("y", 20)
		.attr("value", "poverty")
		.classed("active", true)
		.text("Living in Poverty (%)");

	var ageLabel = labelsGroup.append("text")
		.attr("x", 0)
		.attr("y", 40)
		.attr("value", "age")
		.classed("inactive", true)
		.text("Average Age Per US State");

	var incomeLabel = labelsGroup.append("text")
		.attr("x", 0)
		.attr("y", 60)
		.attr("value", "income")
		.classed("inactive", true)
		.text("Household Median Income");

	var healthcareLabel = labelsGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", (margin.left) + 2.5)
		.attr("y", 0 - (height - 60))
		.attr("value", "healthcare")
		.classed("active", true)
		.text("Lack of Healthcare (%)");

	var smokeLabel = labelsGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", (margin.left) + 2.5)
		.attr("y", 0 - (height - 40))
		.attr("value", "smokes")
		.classed("active", true)
		.text("Smokes(%)");

	var obesityLabel = labelsGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", (margin.left) + 2.5)
		.attr("y", 0 - (height - 20))
		.attr("value", "obesity")
		.classed("inactive", true)
		.text("Obesity (%)");

				//update toolTip function
	var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

		labelsGroup.selectAll("text")
			.on("click", function() {

				var value = d3.select(this).attr("value");

				if (true) {

				if (value === "poverty" || value === "age" || value === "income") {

					chosenXAxis = value;

					xLinearScale = xScale(data, chosenXAxis);

					xAxis = renderAxes(xLinearScale, xAxis);

					circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis);

					circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

				if (chosenXAxis === "poverty") {
					povertyLabel
						.classed("active", true)
						.classed("inactive", false);

					ageLabel
						.classed("active", false)
						.classed("inactive", true);

					incomeLabel
						.classed("active", false)
                        .classed("inactive", true);
                            
                } 
                else if (chosenXAxis === "age") {
					povertyLabel
						.classed("active", false)
						.classed("inactive", true);

					ageLabel
						.classed("active", true)
						.classed("inactive", false);

					incomeLabel
						.classed("active", false)
                        .classed("inactive", true);
                            
                } 
                else {
					povertyLabel
						.classed("active", false)
						.classed("inactive", true);

					ageLabel
						.classed("active", false)
						.classed("inactive", true);

					incomeLabel
						.classed("active", true)
						.classed("inactive", false);
				}

                } 
                else {

					chosenYAxis = value;
									// Update Y scale for new data
					yLinearScale = yScale(data, chosenYAxis);
									// Update y axis for transition
					yAxis = renderYAxes(yLinearScale, yAxis);
									//Changes classes to change bold text
				if (chosenYAxis === "healthcare") {
					healthcareLabel
						.classed("active", true)
						.classed("inactive", false);

					smokeLabel
						.classed("active", false)
						.classed("inactive", true);

					obesityLabel
						.classed("active", false)
                        .classed("inactive", true);
                            
                } 
                else if (chosenYAxis === "smokes") {
					healthcareLabel
						.classed("active", false)
						.classed("inactive", true);

					smokeLabel
						.classed("active", true)
						.classed("inactive", false);

					obesityLabel
						.classed("active", false)
						.classed("inactive", true);
                } 
                else {
					healthcareLabel
						.classed("active", false)
						.classed("inactive", true);

					smokeLabel
						.classed("active", false)
						.classed("inactive", true);

					obesityLabel
						.classed("active", true)
						.classed("inactive", false);
					
				}

			}
		  
			});
		  
		});
	
