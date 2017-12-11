/* Run the main function after the index page loads */
d3.select(window).on('load', main("trump-tree-graph.json"));

function main(filename) {d3.json(filename, visualize)}

/* This is the main routine */
function visualize(data) {

  console.log("Data", data)

  var colors = d3.scaleOrdinal(d3.schemeCategory20)

  var simulation = d3.forceSimulation()
    .force("link",
          d3.forceLink()
            .id(function(d) {return d.name})
            .strength(3))
    .force("collide", d3.forceCollide().radius(function(d) {return d.gen*24}).iterations(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(1600/2, 800/2))
    .force("y", d3.forceY(0))
    .force("x", d3.forceX(0))

  var svg = d3.select("body")
    .append("svg")
    .attr("width", 1600)
    .attr("height", 800)

  var everything = svg.append("g")
    .attr("class", "everything")

  var link = everything.append("g")
    .attr("id", "links")
    .selectAll("line")
    .data(data.links)

    .enter()
    .append("line")
    .attr("class", "linkOff")

  var node = everything.append("g")
    .attr("id", "nodes")
    .selectAll("g")
    .data(data.nodes)

    .enter()
    .append("g")
    .attr("id", function(d) {return d.name})
    .attr("class", "node")

  node.append("circle")
    .attr("r", function(d) {return d.gen * 10})
    .attr("class", function(d) {
      if (d.type == "person") {
        if (d.blood) {return "personBlood"} else {return "personNotBlood"}
      } else {return "partnership"}
    })
    .style("stroke-width", function(d) { return 1 })

  node.append("text")
    .attr("class", "name mono")
    .attr("transform", function(d) {return "translate(" + 0 + "," + (d.gen*12 + 10) + ")" })
    .text(function(d) {if (d.type == "partnership") {return ""} else {return d.name}})
    .style("text-anchor", "middle")
    .style("font-size", function(d) {return "" + ((d.gen * 1.5) + 5) + "pt"})

  // link.on("mouseover", function(l) {
  //     node.attr("class", function(n) {
  //       console.log(l,n); return "linkOn"})
  //     })


  simulation
    .nodes(data.nodes)
    .on("tick", update)

  simulation.force("link")
    .links(data.links)

  var zoom_handler = d3.zoom()
    .on("zoom", zoom_actions)

  zoom_handler(svg)

  function zoom_actions() {
    d3.select(".everything")
      .attr("transform", d3.event.transform)
  }

  function update() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"})
      // .attr("cy", function(d) { return d.y; })
  }

}
