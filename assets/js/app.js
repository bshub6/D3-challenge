// d3.select(window).on("resize", makeResponsive);
// loadChart();
function makeResponsive() {
// if the SVG area isn't empty when the browser loads,

// remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
      // clear svg is not empty

    if (!svgArea.empty()) {
      svgArea.remove();
      // loadChart()

    }

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });


   //Create scales
var xLinearScale = d3.scaleLinear()
   .domain(d3.extent(censusData, d => d.poverty))
   .range([0, width]);

var yLinearScale = d3.scaleLinear()
   .domain([8, d3.max(censusData, d => d.healthcare)])
   .range([height, 0]);

 // Create axes
var xAxis = d3.axisBottom(xLinearScale);
var yAxis = d3.axisLeft(yLinearScale);

 // Append axes
chartGroup.append("g")
   .attr("transform", `translate(0, ${height})`)
   .call(xAxis);


chartGroup.append("g")
   .call(yAxis);

 //Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("stroke-width", "1")
    .attr("stroke", "black")
    .attr("opacity", ".5");

    //Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([60, -80])
      .html(function(d) {
        return (`${d.abbr}<br>Coverage: ${d.healthcare}<br>Poverty: ${d.poverty}`);
      });

    //Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    //Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

//Create Axes Labels and Append them
chartGroup.selectAll("circle")
 .data(censusData)
 .enter()
 .append("circle")
 .attr("cx", d => xLinearScale(d.poverty))
 .attr("cy", d => yLinearScale(d.healthcare))
 .attr("r", "10")
 .attr("fill", "blue")
 .attr("stroke-width", "1")
 .attr("stroke", "black")
 .attr("opacity", ".5");

 chartGroup.append("g").selectAll("text")
 .data(censusData)
 .enter()
 .append("text")
 .text(d => d.abbr)
 .attr("x", d => xLinearScale(d.poverty))
 .attr("y", d => yLinearScale(d.healthcare))
 .attr("text-anchor", "middle")
 .attr("alignment-baseline", "central")
 .attr("font_family", "sans")
 .attr("font-size", "10px")
 .attr("fill", "white")
 .style("font-weight", "bold");


 chartGroup.append("text")
 .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
 .attr("text-anchor", "middle")
 .attr("font-size", "12px")
 .attr("fill", "black")
 .text("In Poverty (%)");



 chartGroup.append("text")
 .attr("y", 0 - (margin.left / 2))
 .attr("x", 0 - (height / 2))
 .attr("text-anchor", "middle")
 .attr("font-size", "12px")
 .attr("fill", "black")
 .attr("transform", "rotate(-90)")
 .text("Lacks Healthcare (%)");

})    


};



// When the browser loads, makeResponsive() is called.

makeResponsive();

// When the browser window is resized, makeResponsive() is called.

d3.select(window).on("resize", makeResponsive); 