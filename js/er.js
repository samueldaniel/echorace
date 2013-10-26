var 
  width = $(".max").width(),
  height = $(".max").height(),
  race = Artist.getRace(),
  graph = undefined,
  color = d3.scale.category20(),
  linkDistance = 170,
  centerRadius = 50,
  childRadius = 65,
  svg = null;


// As stolen from mbostock
var force = d3.layout.force()
    .charge(-4000)
    .linkDistance(linkDistance)
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
    .attr("r", childRadius)
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

  // Shrink center node
  svg.select('.node').attr("r", centerRadius);

  svg.selectAll(".gnode").on("click", click);
}

function clearGraph() {
  console.log("Clearing the graph");
  d3.select("svg").remove();
}

var clickcount = 0;

var click = function (d) {
  console.log("Click!");
  if (clickcount == 0) {
    $("#counter-secs").flipCounter("startAnimation",
      {
              number: 0, // the number we want to scroll from
                end_number: 60, // the number we want the counter to scroll to
                easing: false, // this easing function to apply to the scroll.
                duration: 60000 // number of ms animation should take to complete
      });
  }
  clickcount++;
  $("#clicks").html("Clicks: " + clickcount);
  console.log(d);
  if (d.cid !== graph.center.cid) {
    if (d.id === graph.center.id) {
      // You win!
      console.log("You won");
      victory();
    } else {
      console.log("Getting next");
      // Switch child to center and proceed
      Artist.getNext(d).done(function () {
        graph = this;
        clearGraph();
        drawGraph();
      }).fail(function () {
        console.log("Failure to get next");
      })
    }
  }
  return true;
}

var victory = function () {

}

var setGoal = function(goal) {
  $("#goal").html("Race to " + goal);
}

// Start up!
console.log("Querying for initial");
Artist.getInitial(race.from, {
  success: function (g) {
    console.log("Got initial graph, starting up");
    console.log(g);
    graph = g;
    drawGraph();
    setGoal(race.to.name);
  }
})

