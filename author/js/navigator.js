/**
 * Case Navigator
 *
 * Concentrates routines related to navigation throughout a case.
 * It shows a visual map of knots and enables to visually access and edit them.
 */

class Navigator {

constructor() {
   this.expandClicked = this.expandClicked.bind(this);
   window.messageBus.ext.subscribe("control/navigator/expand", this.expandClicked);
   this.retractClicked = this.retractClicked.bind(this);
   window.messageBus.ext.subscribe("control/navigator/retract", this.retractClicked);
}
   
async mountPlainCase(author, knots) {
   this._author = author;
   this._knots = knots;
   this._navigationPanel = document.querySelector("#navigation-panel");
   this._knotPanel = document.querySelector("#knot-panel");

   this._navigationPanel.innerHTML = "";
   document.querySelector("#navigation-block").style.flex = "15%";
   this._knotPanel.style.flex = "75%";
   
   this._capsule = await window.messageBus.ext.request("capsule/knot/get", "", "capsule/knot");
   
   for (let kn in this._knots) {
      if (this._knots[kn].type == "knot") {
         let miniature = this._createKnotEntry("mini-" + kn.replace(/\./g, "_"));
         
         const dot = this._knots[kn].title.lastIndexOf(".");
         const title = (dot == -1) ? this._knots[kn].title : this._knots[kn].title.substring(dot);
         if (this._knots[kn].render) {
            miniature.innerHTML = "<h3 style='margin: 0px'><dcc-trigger action='knot/" + kn + "/selected' xstyle='sty-navigation-knot-cover' " +
                                       "label = '" + title + "'>" +
                                  "</dcc-trigger></h3>";
            let iframe = await this._createMiniature(kn);
            miniature.appendChild(iframe);
         } else
            miniature.innerHTML = "<h2 style='background-color: lightgray; margin: 5px;'>" + title + "</h2>" +
                                  "<div class='sty-navigation-knot-cover'></div>";
         this._navigationPanel.appendChild(miniature);
      }
         
   }
}

_createKnotEntry(id) {
   let miniature = document.createElement("div");
   miniature.id = id; 
   miniature.classList.add("sty-navigation-knot");
   miniature.classList.add("std-border");
   return miniature;
}

async _createMiniature(kn) {
   let htmlKnot = await this._author._generateHTML(kn);
   let iframe = document.createElement('iframe');
   iframe.width = Navigator.miniKnot.width;
   iframe.height = Navigator.miniKnot.height;
   iframe.srcdoc = this._capsule.message.replace(/{width}/g, Navigator.miniKnot.width)
                                        .replace(/{height}/g, Navigator.miniKnot.height-6)
                                        .replace("{knot}", htmlKnot);
   return iframe;
}

async expandClicked(topic, message) {
   this.mountTreeCase(this._author, this._knots);
   document.querySelector("#button-expand").style.display = "none";
   document.querySelector("#button-retract").style.display = "initial";
}

async retractClicked(topic, message) {
   this.mountPlainCase(this._author, this._knots);
   document.querySelector("#button-expand").style.display = "initial";
   document.querySelector("#button-retract").style.display = "none";
}

async mountTreeCase(author, knots) {
   this._author = author;
   this._knots = knots;
   this._navigationPanel = document.querySelector("#navigation-panel");
   this._knotPanel = document.querySelector("#knot-panel");
   
   this._capsule = await window.messageBus.ext.request("capsule/knot/get", "", "capsule/knot");
   
   this._navigationPanel.innerHTML = "";
   document.querySelector("#navigation-block").style.flex = "80%";
   this._knotPanel.style.flex = "20%";
   
   // building the visual tree
   let tree = {level: 0, children: []};
   let current = tree;
   let levelStack = [];
   let previousKnot = null;
   let maxLevel = 0;
   for (let k in this._knots) {
      if (!this._knots[k].categories || this._knots[k].categories.indexOf("note") < 0) {
         let newKnot = {id: "mini-" + k.replace(/\./g, "_"),
                        knotid: k,
                        title: this._knots[k].title,
                        level: this._knots[k].level};
         if (previousKnot == null || newKnot.level == previousKnot.level)
            current.children.push(newKnot);
         else if (newKnot.level > previousKnot.level) {
            previousKnot.children = [newKnot];
            levelStack.push(current);
            current = previousKnot;
         } else {
            let newLevel = previousKnot.level;
            while (levelStack.length > 0 && newKnot.level < newLevel) {
               current = levelStack.pop();
               newLevel = current.level;
            }
            current.children.push(newKnot);
         }
         previousKnot = newKnot;
      }
      maxLevel = (this._knots[k].level > maxLevel) ? this._knots[k].level : maxLevel;
   }

   // computing dimensions
   const baseTitle =
      Navigator.miniKnot.titleBase + Navigator.miniKnot.titleDelta * maxLevel;
   this._computeDimension(tree, true, 0, -baseTitle, maxLevel);
   
   // set the dimensions and margins of the graph
   let margin = {top: 10, right: 10, bottom: 10, left: 10},
       width = tree.width,
       height = tree.height;
   
   // append the svg object to the body of the page
   this._navigationPanel.innerHTML =
      "<div id='navigation-tree' style='width:" +
      tree.width + " height:" + tree.height + "'></div>";
   let svg = d3.select("#navigation-tree")
     .append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
         .attr("transform",
             "translate(" + margin.left + "," + margin.top + ")");

   var root = d3.hierarchy(tree).sum(function(d){return 1});

   let gs = svg
      .selectAll("g")
      .data(root.descendants().filter(function(d){return (d.depth >= 1 && d.depth <= 2)}))
      .enter()
      .append("g");
   
   gs.append("rect")
      .attr("x", function (d) { return d.data.x; })
      .attr("y", function (d) { return d.data.y; })
      .attr("width",  function (d) { return d.data.width; })
      .attr("height", function (d) { return d.data.height; })
      .style("opacity", function(d){ return 0.1});

   gs.append("foreignObject")
     .attr("x", function (d) { return d.data.x; })
     .attr("y", function (d) { return d.data.y + d.data.titleSize; })
     .attr("id", function(d){ return d.data.id; })
     .attr("width", function (d) { return d.data.width; })
     .attr("height", function (d) { return d.data.height; });

   svg.selectAll("text")
      .data(root.descendants().filter(function(d){return d.depth>=1 && d.depth <= 2}))
      .enter()
      .append("text")
      .attr("id", function(d) {return "t_" + d.data.id})
      .attr("x", function(d){ return d.data.x + 5})
      .attr("y", function(d){ return d.data.y + 20})
      .text(function(d){ return d.data.title; })
      .attr("font-size", function(d) {return d.data.titleSize + "px"})
      .attr("fill", "black")
      .attr("cursor", "pointer")
      .on("click", function(d) {window.messageBus.ext.publish("knot/" + d.data.knotid + "/selected")})
      .on("mouseover", function(d) {
         let t = document.querySelector("#t_" + d.data.id);
         t.removeChild(t.firstChild);
         t.innerHTML = d.data.title + "[+]"})
      .on("mouseout", function(d) {
         let t = document.querySelector("#t_" + d.data.id);
         t.removeChild(t.firstChild);
         t.innerHTML = d.data.title});
   
   for (let kn in this._knots) {
      if (this._knots[kn].render) {
         let id = "#mini-" + kn.replace(/\./g, "_");
         let fo = document.querySelector(id);
         if (fo != null) {
            let iframe = await this._createMiniature(kn);
            fo.appendChild(iframe);
         }
      }
   }

   console.log(tree);

   this._drawGroups(tree, svg);

   this._drawLinks(tree, svg);
}

_computeDimension(knot, horizontal, x, y, titleLevel) {
   knot.x = x;
   knot.y = y;
   knot.titleSize = Navigator.miniKnot.titleBase +
                    Navigator.miniKnot.titleDelta * titleLevel;
   if (!knot.children) {
      knot.width = Navigator.miniKnot.width;
      knot.height = Navigator.miniKnot.height;
   } else {
      knot.width = 0;
      knot.height = 0;
      let shiftX = x + Navigator.miniKnot.paddingX;
      let shiftY = y + Navigator.miniKnot.paddingY + knot.titleSize;
         
      if (knot.level < 1) {
         for (let k in knot.children) {
            this._computeDimension(
               knot.children[k], !horizontal, shiftX, shiftY, titleLevel - 1);
            if (horizontal) {
               knot.width += knot.children[k].width;
               knot.height = (knot.children[k].height > knot.height)
                  ? knot.children[k].height
                  : knot.height;
               shiftX += knot.children[k].width + Navigator.miniKnot.marginX;
            } else {
               knot.height += knot.children[k].height;
               knot.width = (knot.children[k].width > knot.width)
                  ? knot.children[k].width
                  : knot.width;
               shiftY += knot.children[k].height + Navigator.miniKnot.marginY;
            }
         }
         if (horizontal)
            knot.width += (knot.children.length - 1) * Navigator.miniKnot.marginX;
         else
            knot.height += (knot.children.length - 1) * Navigator.miniKnot.marginY;
      } else if (knot.level < 2) {
         // compute all links in this level
         for (let kn in knot.children) {
            // build link (source, target) edges
            knot.children[kn].link = {};
            let content = this._knots[knot.children[kn].knotid].content;
            for (let c in content) {
               if (content[c].type == "option" || content[c].type == "divert") {
                  let target = -1;
                  for (let t = 0; t < knot.children.length && target == -1; t++)
                     if (content[c].target.indexOf(knot.children[t].knotid) > -1)
                        target = t;
                  if (target > -1)
                     knot.children[kn].link[content[c].target] = knot.children[target];
               }
            }
         }

         // order to define the topology
         let order = 0,
             nextOrder = 0;
         let sequence = [];
         for (let kn in knot.children) {
            if (knot.children[kn].order)
               order = knot.children[kn].order;
            else {
               order = nextOrder;
               knot.children[kn].order = nextOrder;
               nextOrder++;
            }
            for (let s in knot.children[kn].link)
               if (typeof knot.children[kn].link[s].order === "undefined")
                  knot.children[kn].link[s].order = order + 1;

            if (!sequence[order])
               sequence[order] = {width: 0,
                                  height: 0,
                                  subseq: [knot.children[kn]]};
            else
               sequence[order].subseq.push(knot.children[kn]);
         }

         // computes the block width/height
         knot.width = (horizontal) ? Navigator.miniKnot.marginX * (sequence.length - 1) : 0,
         knot.height = (horizontal) ? 0 : Navigator.miniKnot.marginY * (sequence.length - 1);
         for (let s in sequence) {
            for (let ss in sequence[s].subseq) {
               this._computeDimension(
                  sequence[s].subseq[ss], !horizontal, shiftX, shiftY, titleLevel - 1);
               if (horizontal) {
                  sequence[s].width = (sequence[s].subseq[ss].width > sequence[s].width)
                     ? sequence[s].subseq[ss].width : sequence[s].width;
                  sequence[s].height += sequence[s].subseq[ss].height;
               } else {
                  sequence[s].width += sequence[s].subseq[ss].width;
                  sequence[s].height = (sequence[s].subseq[ss].height > sequence[s].height)
                     ? sequence[s].subseq[ss].height : sequence[s].height;
               }
            }
            if (horizontal)
               sequence[s].height += Navigator.miniKnot.marginY * (sequence[s].subseq.length - 1);
            else
               sequence[s].width += Navigator.miniKnot.marginX * (sequence[s].subseq.length - 1);

            if (horizontal) {
               knot.width += sequence[s].width;
               knot.height = (sequence[s].height > knot.height) ? sequence[s].height : knot.height;
            } else {
               knot.width = (sequence[s].width > knot.width) ? sequence[s].width : knot.width;
               knot.height += sequence[s].height;
            }
         }

         // define positions acording to the precomputed sequence
         for (let s in sequence) {
            if (horizontal)
               shiftY = y + (knot.height - sequence[s].height) / 2;
            else
               shiftX = x + (knot.width - sequence[s].width) / 2;
            for (let ss in sequence[s].subseq) {
               this._computeDimension(
                  sequence[s].subseq[ss], !horizontal, shiftX, shiftY, titleLevel - 1);
               if (horizontal)
                  shiftY += sequence[s].subseq[ss].height + Navigator.miniKnot.marginY;
               else
                  shiftX += sequence[s].subseq[ss].width + Navigator.miniKnot.marginX;
            }
            if (horizontal)
               shiftX += sequence[s].width + Navigator.miniKnot.marginX;
            else
               shiftY += sequence[s].height + Navigator.miniKnot.marginY;
         }
      } else {
         // groups
         knot.width = Navigator.miniKnot.width;
         knot.height = Navigator.miniKnot.height +
                       Navigator.microKnot.height + Navigator.microKnot.marginY;
         if (knot.children)
            knot.id = knot.children[0].id;
      }
   }

   knot.width += Navigator.miniKnot.paddingX * 2;
   knot.height += Navigator.miniKnot.paddingY * 2 + knot.titleSize;
}

_drawGroups(knot, svg) {
   if (knot.level == 2 && knot.children) {
      for (let m = 0; m <= 3; m++)
         svg.append("rect")
            .attr("x", knot.x + Navigator.miniKnot.paddingX +
                       (Navigator.microKnot.width + Navigator.microKnot.marginX) * m)
            .attr("y", knot.y + knot.titleSize + Navigator.miniKnot.height +
                       Navigator.microKnot.marginY)
            .attr("width", Navigator.microKnot.width)
            .attr("height", Navigator.microKnot.height)
            .attr("stroke", "#444444")
            .attr("fill", "#76a7d7")
            .attr("stroke-width", "2");
   } else
      for (let kn in knot.children)
         this._drawGroups(knot.children[kn], svg);
}

_drawLinks(knot, svg) {
   if (knot.link)
      for (let l in knot.link)
         if (knot.order < knot.link[l].order)
            svg.append("line")
               .attr("x1", knot.x + (knot.width / 2))
               .attr("y1", knot.y + knot.height)
               .attr("x2", knot.link[l].x + (knot.link[l].width / 2))
               .attr("y2", knot.link[l].y)
               .attr("style", "stroke:rgb(0,0,0);stroke-width:3");
   for (let kn in knot.children)
      this._drawLinks(knot.children[kn], svg);
}

}

(function() {
   Navigator.miniKnot = {
      width: 200, // 16:9
      height: 112,
      marginX : 20,
      marginY : 20,
      paddingX: 3,
      paddingY: 3,
      titleBase: 10,
      titleDelta: 10
   };
   Navigator.microKnot = {
      width: 40,
      height: 24,
      marginX: 5,
      marginY: 5
   }
})();