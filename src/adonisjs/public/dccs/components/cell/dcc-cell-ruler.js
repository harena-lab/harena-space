/**
 * DCC Ruler Cell
 */

class DCCCellRuler extends DCCBase {
   constructor() {
      super();
      this.notify = this.notify.bind(this);
      this.cellClicked = this.cellClicked.bind(this);
      this.rulerMoved = this.rulerMoved.bind(this);
      this._state = 0;
      this._rulerSet = [];
   }

   connectedCallback() {
      MessageBus.page.publish("dcc/tool-cell/register", this);
   }

   static get observedAttributes() {
      return DCCBase.observedAttributes.concat(
         ["image"]);
   }

   get image() {
      return this.getAttribute("image");
   }
   
   set image(newValue) {
      this.setAttribute("image", newValue);
   }

   get space() {
      return this._space;
   }

   set space(newValue) {
      this._space = newValue;
   }

   notify(topic, message) {
      if (message.role)
        switch (message.role.toLowerCase()) {
          case "activate": this.activateRuler();
                           break;
          case "reset": this.resetRuler();
                        break;
      }
   }

   activateRuler() {
      if (this._space != null)
         this._space.cellGrid.addEventListener("click", this.cellClicked, false);
      this._state = 0;
   }

   resetRuler() {
      if (this._space != null)
         this._space.cellGrid.removeEventListener("click", this.cellClicked);
      let cells = this._space.cells;
      for (let rs of this._rulerSet) {
         cells.removeChild(rs.origin);
         cells.removeChild(rs.target);
         cells.removeChild(rs.ruler);
      }
      this._rulerSet = [];
   }

   cellClicked(event) {
      const cell = this._space.computeClickedCell(event.clientX, event.clientY);
      let element = DCCCell.createSVGElement("image", cell.row, cell.col, this._space);
      element.setAttribute("href", this.image);
      this._space.cells.appendChild(element);
      const mapped = this._space.mapCoordinatesToSpace(event.clientX, event.clientY);
      switch (this._state) {
         case 0: this._rulerOrigin = {
                    element: element,
                    x: mapped.x + (this._space.cellWidth / 2),
                    y: mapped.y + (this._space.cellHeight / 2),
                    row: cell.row,
                    col: cell.col};
                 this._space.cellGrid.addEventListener("mousemove", this.rulerMoved, false);
                 this._state = 1;
                 break;
         case 1: this._space.cellGrid.removeEventListener("mousemove", this.rulerMoved);
                 this._rulerTarget = {
                    element: element,
                    x: mapped.x + (this._space.cellWidth / 2),
                    y: mapped.y + (this._space.cellHeight / 2),
                    row: cell.row,
                    col: cell.col};
                 this.attachMeasures();
                 this._state = 0;
                 break;
      }
   }

   attachMeasures() {
      let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      this._space.cells.removeChild(this._currentLine);
      g.appendChild(this._currentLine);
      this._currentLine = null;
      let gt = document.createElementNS("http://www.w3.org/2000/svg", "g");
      gt.setAttribute("transform", "translate(" + 
          ((this._rulerTarget.x + this._rulerOrigin.x) / 2) + " " +
          ((this._rulerTarget.y + this._rulerOrigin.y) / 2) + ")");

      const scale = "scale(" + (1/this._space.scale) + " " + (1/this._space.scale) + ")";

      let content = 
         "desl. x: " + Math.abs(this._rulerTarget.col - this._rulerOrigin.col) +
         "; desl. y: " + Math.abs(this._rulerTarget.row - this._rulerOrigin.row) +
         "; desl. total: " + Math.sqrt(
                                (Math.pow((this._rulerTarget.row - this._rulerOrigin.row), 2) +
                                 Math.pow((this._rulerTarget.col - this._rulerOrigin.col), 2)));

      let textC = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textC.setAttribute("style", "stroke:white; stroke-width:0.6em");
      textC.setAttribute("transform", scale);
      textC.appendChild(document.createTextNode(content));

      let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("fill", "red");
      text.setAttribute("transform", scale);
      text.appendChild(document.createTextNode(content));

      gt.appendChild(textC);
      gt.appendChild(text);
      g.appendChild(gt);
      this._space.cells.appendChild(g);
      this._rulerSet.push({origin : this._rulerOrigin.element,
                           target: this._rulerTarget.element,
                           ruler: g});
   }

   rulerMoved(event) {
      if (this._currentLine != null)
         this._space.cells.removeChild(this._currentLine);
      this._currentLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const mapped = this._space.mapCoordinatesToSpace(event.clientX, event.clientY);
      this._currentLine.setAttribute("x1", this._rulerOrigin.x);
      this._currentLine.setAttribute("y1", this._rulerOrigin.y);
      this._currentLine.setAttribute("x2", mapped.x + (this._space.cellWidth / 2));
      this._currentLine.setAttribute("y2", mapped.y + (this._space.cellHeight / 2));
      this._currentLine.setAttribute("style",
         "stroke:rgb(255,0,0);stroke-width:" + (2 / this._space.scale));
      this._space.cells.appendChild(this._currentLine);
   }
}

(function() {
   customElements.define("dcc-cell-ruler", DCCCellRuler);
})();