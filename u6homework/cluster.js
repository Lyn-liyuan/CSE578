
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  g = svg.append("g").attr("transform", "translate(" + 15 + "," + 25 + ")");

var stratify = d3.stratify()
  .parentId(function (d) { return d.parent; });

var tree = d3.cluster()
  .size([980, 200])
  .separation(function (a, b) { return (a.parent == b.parent ? 1 : 1.5) / a.depth; });

  d3.selectAll("input").on("change", changed);

  function changed() {
    g.selectAll(".link").remove();
    g.selectAll(".node").remove();
    d3.json("cluster_"+this.value+".json", function (error, data) {
      if (error) throw error;
      drawTree(data);
    });
  }

  d3.json("cluster_ward.json", function (error, data) {
    if (error) throw error;
    drawTree(data);
  });

function drawTree(data) {
  var root = tree(stratify(data)
    .sort(function (a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); }));

  var link = g.selectAll(".link")
    .data(root.descendants().slice(1))
    .enter().append("path")
    .attr("class", "link")
    .attr("d", function (d) {
      return "M" + project(d.x, d.y)
        + "C" + project(d.x, (d.y + d.parent.y) / 2)
        + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
        + " " + project(d.parent.x, d.parent.y);
    });


  var node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function (d) { return "translate(" + project(d.x, d.y) + ")"; });


  node.append("text")
    .attr("dy", ".31em")
    .attr("x", function (d) {
      return d.children ? -40 : 8;
    })
    .attr("y", 0)
    .style("text-anchor", "end")
    .attr("transform", function (d) {
      if (!d.children)
        return "rotate(" + (-90) + ")";

      else
        return "";
    })
    .text(function (d) {
      if (!d.children)
        return d.data.name;

      else
        return "";
    });
}

function project(x, y) {

  return [x, y];
}


