/**
        * select all link elements of the player.
        * id the id for search.
        * selected for status of select status
        **/
function find_path(id, selected) {
    selection = d3.selectAll("#" + id).attr("class", selected ? "link_selected" : "link");
}

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    g = svg.append("g").attr("transform", "translate(" + (width / 2 - 15) + "," + (height / 2 + 25) + ")");

var stratify = d3.stratify()
    .parentId(function (d) { return d.parent; });

var tree = d3.cluster()
    .size([360, 390])
    .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

d3.json("2013.json", function (error, data) {
    if (error) throw error;

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
        })

        .attr("id", function (d) { return "path_" + d.data.name.replace(/\s/, '_') });

    var node = g.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function (d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function (d) { return "translate(" + project(d.x, d.y) + ")"; })
        .on("mouseover", function (d, i) {
            id = "path_" + d.data.name
            find_path(id.replace(/\s/, '_'), true);
            d3.select(this).selectAll('text').style("font-size", "18px").style("fill", "#359")
        })
        .on("mouseout", function (d, i) {
            id = "path_" + d.data.name
            find_path(id.replace(/\s/, '_'), false);
            d3.select(this).selectAll('text').style("font-size", "12px").style("fill", "#111")
        });

    node.append("circle")
        .attr("r", 4);

    node.append("text")
        .attr("dy", ".31em")
        .attr("x", function (d) { return d.x < 180 === !d.children ? 6 : -6; })
        .style("text-anchor", function (d) { return d.x < 180 === !d.children ? "start" : "end"; })
        .attr("transform", function (d) {
            if (d.data.round != 'semi' && d.data.round != 'Final')
                return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
            else if (d.data.round != 'Final')
                return "translate(" + (d.x > 180 ? -100 : d.x) + ")";
            else
                return "translate(" + (d.x > 180 ? -45 : d.x) + ",-20)";
        })
        .text(function (d) { return d.data.name; });
});

function project(x, y) {
    var angle = (x - 90) / 180 * Math.PI, radius = y;
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
}


var zoom = d3.zoom()
    .scaleExtent([0.1, 10])
    .on('start', () => {
        console.log('start')
        svg.style('cursor', 'pointer')
    })
    .on('zoom', (e) => {
        console.log(e)
        svg.selectAll('rect').attr('transform',
            'translate(' + e.transform.x + ',' + e.transform.y + ') scale(' + e.transform.k + ')'
        )
    })
    .on('end', () => {
        svg.style('cursor', 'default')
    });

svg.call(zoom).call(zoom.transform, d3.zoomIdentity.scale(1))