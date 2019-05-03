/**
 * Case Navigator
 *
 * Concentrates routines related to navigation throughout a case.
 * It shows a visual map of knots and enables to visually access and edit them.
 */

class Navigator {

constructor() {
   this._retracted = true;

   this.expandClicked = this.expandClicked.bind(this);
   MessageBus.ext.subscribe("control/navigator/expand", this.expandClicked);
   this.retractClicked = this.retractClicked.bind(this);
   MessageBus.ext.subscribe("control/navigator/retract", this.retractClicked);
   this.upTree = this.upTree.bind(this);
   MessageBus.ext.subscribe("control/group/up", this.upTree);
}

async expandClicked(topic, message) {
   document.querySelector("#navigation-block").style.flex = "80%";
   this._knotPanel.style.flex = "20%";
   this._retracted = false;
   this._presentTreeCase();
   document.querySelector("#button-expand").style.display = "none";
   document.querySelector("#button-retract").style.display = "initial";
}

async retractClicked(topic, message) {
   document.querySelector("#navigation-block").style.flex = "20%";
   this._knotPanel.style.flex = "80%";
   this._retracted = true;
   this._presentTreeCase();
   document.querySelector("#button-expand").style.display = "initial";
   document.querySelector("#button-retract").style.display = "none";
}

async downTree(knotid) {
   const newRoot = this._searchTree(this._tree, knotid);
   if (newRoot != null) {
      this._treeStack.push(this._tree);
      this._tree = {level: newRoot.level - 1, children: [newRoot]};
      this._innerTree = newRoot.level - 1;
      this._presentTreeCase();
   }
}

async upTree() {
   this._tree = this._treeStack.pop();
   this._innerTree = this._tree.level;
   this._presentTreeCase();
}

_searchTree(current, knotid) {
   let result = null;
   if (current.knotid == knotid)
      result = current;
   else if (current.children) {
      for (let kn = 0; kn < current.children.length && result == null; kn++) {
         const r = this._searchTree(current.children[kn], knotid);
         if (r != null)
            result = r;
      }
   }
   return result;
}

async mountTreeCase(author, knots) {
   this._author = author;
   this._knots = knots;
   this._navigationPanel = document.querySelector("#navigation-panel");
   this._knotPanel = document.querySelector("#knot-panel");
   
   this._capsule = await MessageBus.ext.request("capsule/knot/get");
   
   this._navigationPanel.innerHTML = "";
   
   // building the visual tree
   this._tree = {level: 0, children: []};
   let current = this._tree;
   let levelStack = [];
   let previousKnot = null;
   this._maxLevel = 0;
   for (let k in this._knots) {
      // <TODO> transfer the pointer of the node?
      if (!this._knots[k].categories ||
          this._knots[k].categories.indexOf("note") == -1) {
         let newKnot = {id: k.replace(/\./g, "_"),
                        knotid: k,
                        title: this._knots[k].title,
                        level: this._knots[k].level,
                        render: this._knots[k].render,
                        note: false};

         // transform notes in children
         if (newKnot.render) {
            let content = this._knots[k].content;
            for (let c in content) {
               if (content[c].type == "option" || content[c].type == "divert") {
                  const noteKnot = this._knots[content[c].target];
                  if (noteKnot && noteKnot.categories &&
                      noteKnot.categories.indexOf("note") > -1) {
                     let newNoteKnot = {
                        id: content[c].target.replace(/\./g, "_"),
                        knotid: content[c].target,
                        title: noteKnot.title,
                        level: newKnot.level + 1,
                        render: noteKnot.render,
                        note: true
                     };
                     if (!newKnot.children)
                        newKnot.children = [newNoteKnot];
                     else
                        newKnot.children.push(newNoteKnot);
                     this._maxLevel = (newNoteKnot.level > this._maxLevel)
                         ? newNoteKnot.level : this._maxLevel;
                  }
               }
            }            
         }

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
      this._maxLevel = (this._knots[k].level > this._maxLevel)
                         ? this._knots[k].level : this._maxLevel;
   }

   // this._baseLevel = 0;
   this._innerTree = 0;

   this._treeStack = [];
   this._presentTreeCase();
}

async _presentTreeCase() {
   // computing dimensions
   const baseTitle =
      Navigator.miniKnot[this._retracted].titleBase +
      Navigator.miniKnot[this._retracted].titleDelta * this._maxLevel;
   this._computeDimension(this._tree, true, 0, -baseTitle, this._maxLevel);
   
   // set the dimensions and margins of the graph
   let margin = {top: 10, right: 0, bottom: 10, left: 0},
       width = this._tree.width,
       height = this._tree.height;
   
   // append the svg object to the body of the page
   let navTree =
      "<div id='navigation-tree' style='width:" +
      this._tree.width + " height:" + this._tree.height + "'></div>";

   if (this._treeStack.length > 0)
      navTree =
         "<dcc-trigger action='control/group/up' label='Up' " +
           "image='icons/icon-back.svg' xstyle='sty-tree-button'></dcc-trigger>" +
         navTree;

   this._navigationPanel.innerHTML = navTree;

   let svg = d3.select("#navigation-tree")
     .append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
         .attr("transform",
             "translate(" + margin.left + "," + margin.top + ")");

   var root = d3.hierarchy(this._tree).sum(function(d){return 1});

   let gs = svg
      .selectAll("g")
      .data(root.descendants().filter(function(d){return (d.depth >= 1 && d.depth <= 2)}))
      .enter()
      .append("g");
   
   // knot square
   gs.append("rect")
      .attr("id", function(d){ return "kmini-" + d.data.id; })
      .attr("x", function (d) { return d.data.x; })
      .attr("y", function (d) { return d.data.y; })
      .attr("width",  function (d) { return d.data.width; })
      .attr("height", function (d) { return d.data.height; })
      .style("opacity", function(d){ return 0.1});

   // area inside the knot square to insert the miniature HTML
   gs.append("foreignObject")
     .attr("id", function(d){ return "mini-" + d.data.id; })
     .attr("x", function (d) { return d.data.x; })
     .attr("y", function (d) { return d.data.y + d.data.titleSize; })
     .attr("width", function (d) { return d.data.width; })
     .attr("height", function (d) { return d.data.height; });

   // knot title
   svg.selectAll("text")
      .data(root.descendants().filter(function(d){return d.depth>=1 && d.depth <= 2}))
      .enter()
      .append("text")
      .attr("id", function(d) {return "t_" + d.data.id})
      .attr("x", function(d){ return d.data.x + 5})
      .attr("y", function(d){ return d.data.y + d.data.titleSize})
      .text(function(d){ return d.data.title; })
      .attr("font-size", function(d) {return d.data.titleSize + "px"})
      .attr("fill", "black")
      .attr("cursor", "pointer")
      .on("click", function(d) {MessageBus.ext.publish("knot/" + d.data.knotid + "/selected")})
      .on("mouseover", function(d) {
         let t = document.querySelector("#t_" + d.data.id);
         t.removeChild(t.firstChild);
         t.innerHTML = d.data.title + "[+]"})
      .on("mouseout", function(d) {
         let t = document.querySelector("#t_" + d.data.id);
         t.removeChild(t.firstChild);
         t.innerHTML = d.data.title});
   
   this._drawMiniatures(this._tree, svg);
   this._drawGroups(this._tree, svg);
   this._drawLinks(this._tree, svg);
}

_computeDimension(knot, horizontal, x, y, titleLevel) {
   knot.x = x;
   knot.y = y;
   knot.titleSize = Navigator.miniKnot[this._retracted].titleBase +
                    Navigator.miniKnot[this._retracted].titleDelta * titleLevel;
   if (!knot.children) {
      knot.width = Navigator.miniKnot[this._retracted].width;
      knot.height = Navigator.miniKnot[this._retracted].height;
   } else {
      knot.width = 0;
      knot.height = 0;
      let shiftX = x + Navigator.miniKnot[this._retracted].paddingX;
      let shiftY = y + Navigator.miniKnot[this._retracted].paddingY + knot.titleSize;
         
      if (knot.level - this._innerTree == 0) {
         for (let k in knot.children) {
            this._computeDimension(
               knot.children[k], !horizontal, shiftX, shiftY, titleLevel - 1);
            if (horizontal && !this._retracted) {
               knot.width += knot.children[k].width;
               knot.height = (knot.children[k].height > knot.height)
                  ? knot.children[k].height
                  : knot.height;
               shiftX += knot.children[k].width + Navigator.miniKnot[this._retracted].marginX;
            } else {
               knot.height += knot.children[k].height;
               knot.width = (knot.children[k].width > knot.width)
                  ? knot.children[k].width
                  : knot.width;
               shiftY += knot.children[k].height + Navigator.miniKnot[this._retracted].marginY;
            }
         }
         if (horizontal && !this.retracted)
            knot.width += (knot.children.length - 1) * Navigator.miniKnot[this._retracted].marginX;
         else
            knot.height += (knot.children.length - 1) * Navigator.miniKnot[this._retracted].marginY;
      } else if (knot.level - this._innerTree == 1) {
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
         let sequence = [];
         let order = 0,
             nextOrder = 0;
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
         knot.width = (horizontal) ? Navigator.miniKnot[this._retracted].marginX * (sequence.length - 1) : 0,
         knot.height = (horizontal) ? 0 : Navigator.miniKnot[this._retracted].marginY * (sequence.length - 1);
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
               sequence[s].height += Navigator.miniKnot[this._retracted].marginY * (sequence[s].subseq.length - 1);
            else
               sequence[s].width += Navigator.miniKnot[this._retracted].marginX * (sequence[s].subseq.length - 1);

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
                  shiftY += sequence[s].subseq[ss].height + Navigator.miniKnot[this._retracted].marginY;
               else
                  shiftX += sequence[s].subseq[ss].width + Navigator.miniKnot[this._retracted].marginX;
            }
            if (horizontal)
               shiftX += sequence[s].width + Navigator.miniKnot[this._retracted].marginX;
            else
               shiftY += sequence[s].height + Navigator.miniKnot[this._retracted].marginY;
         }
      } else {
         // groups
         knot.width = Navigator.miniKnot[this._retracted].width;
         knot.height = Navigator.miniKnot[this._retracted].height +
                       Navigator.microKnot[this._retracted].height + Navigator.microKnot[this._retracted].marginY;
         // if (knot.children)
         //   knot.id = knot.children[0].id;
      }
   }

   knot.width += Navigator.miniKnot[this._retracted].paddingX * 2;
   knot.height += Navigator.miniKnot[this._retracted].paddingY * 2 + knot.titleSize;
}

async _drawMiniatures(knot) {
   if (!knot.children || (knot.level - this._innerTree == 2 && knot.children)) {
      let id = "#mini-" + knot.id.replace(/\./g, "_");
      let fo = document.querySelector(id);
      if (fo != null) {
         let krender = (knot.render) ? knot : knot.children[0];
         let miniature = await this._createMiniature(knot, krender);
         fo.appendChild(miniature);
      }
   } else if (knot.children)
      for (let kn in knot.children)
         this._drawMiniatures(knot.children[kn]);
}

async _createMiniature(knot, krender) {
   let miniature = document.createElement("div");
   miniature.classList.add("sty-navigation-knot");
   miniature.innerHTML = "<dcc-trigger action='" +
                           ((knot.children) ? "group/" : "knot/") +
                           knot.knotid + "/selected' " +
                           "xstyle='sty-navigation-knot-cover' label = ''>";

   let htmlKnot = await this._author._generateHTML(krender.knotid);
   let iframe = document.createElement('iframe');
   iframe.width = Navigator.miniKnot[this._retracted].width;
   iframe.height = Navigator.miniKnot[this._retracted].height;
   iframe.srcdoc = this._capsule.message.replace(/{width}/g, Navigator.miniKnot[this._retracted].width)
                                        .replace(/{height}/g, Navigator.miniKnot[this._retracted].height-6)
                                        .replace("{knot}", htmlKnot);
   miniature.appendChild(iframe);

   return miniature;
}

_drawGroups(knot, svg) {
   if (knot.level - this._innerTree == 2 && knot.children) {
      for (let m = 0; m <= 3; m++)
         svg.append("rect")
            .attr("x", knot.x + Navigator.miniKnot[this._retracted].paddingX +
                       (Navigator.microKnot[this._retracted].width + Navigator.microKnot[this._retracted].marginX) * m)
            .attr("y", knot.y + knot.titleSize + Navigator.miniKnot[this._retracted].height +
                       Navigator.microKnot[this._retracted].marginY)
            .attr("width", Navigator.microKnot[this._retracted].width)
            .attr("height", Navigator.microKnot[this._retracted].height)
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
      true: {
         width: 100, // 16:9
         height: 56,
         marginX : 10,
         marginY : 10,
         paddingX: 2,
         paddingY: 2,
         titleBase: 5,
         titleDelta: 5
      },
      false: {
         width: 200, // 16:9
         height: 112,
         marginX : 20,
         marginY : 20,
         paddingX: 3,
         paddingY: 3,
         titleBase: 10,
         titleDelta: 10
      }
   };
   Navigator.microKnot = {
      true: {
         width: 20,
         height: 12,
         marginX: 3,
         marginY: 3
      },
      false: {
         width: 40,
         height: 24,
         marginX: 5,
         marginY: 5
      }
   };
})();