var 
  width = $(".max").width(),
  height = $(".max").height(),
  race = Artist.getRace(),
  graph = undefined,
  color = d3.scale.category20(),
  svg = null;


// As stolen from mbostock
var force = d3.layout.force()
    .charge(-4000)
    .linkDistance(250)
    .size([width, height]);

function drawGraph () {
  console.log("Redrawing the graph");

  // Make new svg
  svg = d3.select(".max").append("svg");

  // may the force be with you
  force
      .nodes(graph.all)
      .links(graph.links)
      .start();

  // make links
  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  // create groups
  var gnodes = svg.selectAll('g.gnode')
      .data(graph.all)
      .enter()
      .append('g')
      .classed('gnode', true);

  // create nodes
  var node = gnodes.append('circle')
      .attr("class", "node")
      .attr("r", 75)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  // add text
  gnodes.append("text")
    .text(function(d) { return d.name; })
    .style('text-anchor', 'middle');

  // update positions
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    gnodes.attr("transform", function(d) {
      return 'translate(' + [d.x, d.y] + ')';
    })
  });

  enlargeCenter();

  svg.selectAll(".gnode").on("click", click);
}

function clearGraph() {
  console.log("Clearing the graph");
  d3.select("svg").remove();
}

var clickcount = 0;

var click = function (d) {
  console.log("Click!");
  clickcount++;
  $("#clicks").html("Clicks: " + clickcount);
  console.log(d);
  if (d.id !== graph.center.id) {
    Artist.getNext(d).done(function () {
        graph = this;
        clearGraph();
        drawGraph();
      }).fail(function () {
        console.log("Failure to get next");
      })
  }
  return true;
}

var enlargeCenter = function() {
  svg.select('.node').attr("r", 90)
}

var setGoal = function(goal) {
  $("#goal").html("Race to " + goal);
}

// Start up!
console.log("Querying for initial");
Artist.getInitial(race.from, {
  success: function () {
    console.log("Got initial graph, starting up");
    console.log(this);
    graph = this;
    drawGraph();
    setGoal(race.to.name);
  }
})

