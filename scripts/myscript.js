// add your JavaScript/D3 to this file
const dataset = [
    { Reason: "Competitor had better devices", Freq: 313 },
    { Reason: "Competitor made better offer", Freq: 311 },
    { Reason: "Other", Freq: 230 },
    { Reason: "Attitude of support person", Freq: 220 },
    { Reason: "Don't know", Freq: 130 },
    { Reason: "Competitor offered more data", Freq: 117 },
    { Reason: "Competitor offered higher download speeds", Freq: 100 },
    { Reason: "Attitude of service provider", Freq: 94 },
    { Reason: "Price too high", Freq: 78 },
    { Reason: "Product dissatisfaction", Freq: 77 },
    { Reason: "Network reliability", Freq: 72 },
    { Reason: "Long distance charges", Freq: 64 },
    { Reason: "Service dissatisfaction", Freq: 63 }
];

// Set dimensions
const margin = { top: 40, right: 30, bottom: 150, left: 80 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Function to sanitize the ID by replacing special characters
function sanitizeId(reason) {
    return reason.replace(/[^a-zA-Z0-9]/g, "-");
}

// Create scales
const x = d3.scaleBand()
  .domain(dataset.map(d => d.Reason))
  .range([0, width])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, d3.max(dataset, d => d.Freq)])
  .nice()
  .range([height, 0]);

// Add axes
svg.append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end");

svg.append("g")
  .attr("class", "y-axis")
  .call(d3.axisLeft(y));

// Add bars
svg.selectAll(".bar")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => x(d.Reason))
  .attr("y", d => y(d.Freq))
  .attr("width", x.bandwidth())
  .attr("height", d => height - y(d.Freq))
  .attr("fill", "lightblue")
  .on("click", function (event, d) {
    const bar = d3.select(this);
    const isBlue = bar.attr("fill") === "blue";

    const textId = `text-${sanitizeId(d.Reason)}`;

    if (isBlue) {
      // Revert to lightblue and remove count
      bar.attr("fill", "lightblue");

      // Remove the count text
      svg.select(`#${textId}`).remove();
    } else {
      // Change the bar color to blue
      bar.attr("fill", "blue");

      // Add the count text on top of the bar
      svg.append("text")
        .attr("id", textId)
        .attr("x", x(d.Reason) + x.bandwidth() / 2)
        .attr("y", y(d.Freq) - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .text(d.Freq);
    }
  });

// Add a title
svg.append("text")
  .attr("x", width / 2)
  .attr("y", -10)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text("Distribution of Churn Reasons");