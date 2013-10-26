var 
  width = $("svg").width(),
  height = $("svg").height(),
  race = Artist.getRace(),
  graph = undefined,
  color = d3.scale.category20();


// As stolen from mbostock
var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(230)
    .size([width, height]);

var svg = d3.select("svg");

function drawGraph () {
  force
      .nodes(graph.all)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.all)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 40)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  node.append("text").text(function(d) { console.log(d.name); return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });

  enlargeCenter();
}

var click = function (d) {
  if (d.id !== graph.center.id) {
    graph = Artist.getNext(d);
    drawGraph();
  }
}

var enlargeCenter = function() {
  svg.select('.node').attr("r", 60)
}

// Start up!
console.log("Querying for initial");
Artist.getInitial(race.from, {
  success: function (_graph) {
    console.log("Got initial graph, starting up");
    console.log(_graph);
    graph = _graph;
    drawGraph();
  }
})










  // function click (d) {

  //     if(d.group === 2) {
  //       d.group = 1;
        
  //       console.log("fuck")
  //       graph = 
  //       update()


  //     }
  // }  