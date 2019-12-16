/**
 * Cellular Space for DCCs
 */

class DCCSpaceCellular extends DCCBase {
   constructor() {
      super();
      this.cellTypeRegister = this.cellTypeRegister.bind(this);
      this.ruleRegister = this.ruleRegister.bind(this);
      this.stateNext = this.stateNext.bind(this);
      this.notify = this.notify.bind(this);
      
      this._cellTypes = {};
      this._rules = {};
      this._stateTypes = [];
   }

   connectedCallback() {
      this._infinite = this.infinite;

      this._stateStr = this.innerHTML.trim();

      for (let c of this._stateStr)
         if (![" ", "_", "\r", "\n"].includes(c) && !this._stateTypes.includes(c))
            this._stateTypes.push(c);

      if (this._stateStr.length > 0)
         this._stateStr = this._stateStr.split(/[\r\n]+/gm);

      if (!this.rows)
         this.rows = (this._stateStr.length > 0) ? this._stateStr.length : 10;
      if (!this.cols)
         if (this._stateStr.length > 0) {
            let maior = this._stateStr[0].length;
            for (let s in this._stateStr)
               maior = (this._stateStr[s].length > maior) ? this._stateStr[s].length : maior;
            this.cols = maior;
         } else
            this.cols = 10;

      if (!this.cellWidth) this.cellWidth = DCCSpaceCellular.defaultCellDimensions.width;
      if (!this.cellHeight) this.cellHeight = DCCSpaceCellular.defaultCellDimensions.height;

      if (!this.backgroundColor) this.backgroundColor = "#ffffc8";

      this.innerHTML = DCCSpaceCellular.svgTemplate
                         .replace(/\[cell-width\]/g, this.cellWidth + "px")
                         .replace(/\[cell-height\]/g, this.cellHeight + "px")
                         .replace(/\[width\]/g, this.cols * this.cellWidth + "px")
                         .replace(/\[height\]/g, this.rows * this.cellHeight + "px")
                         .replace(/\[background-color\]/g, this.backgroundColor)
                         .replace(/\[grid\]/g, (this.grid) ? ";stroke-width:2;stroke:#646464" : "");
      this._cells = this.querySelector("#cells");

      if (!this._state && this._checkAllTypes())
         this._createIndividuals();

      MessageBus.page.subscribe("dcc/cell-type/register", this.cellTypeRegister);
      MessageBus.page.subscribe("dcc/rule-cell/register", this.ruleRegister);
   }

   disconnectedCallback() {
      MessageBus.page.unsubscribe("dcc/cell-type/register", this.cellTypeRegister);
   }

   static get observedAttributes() {
      return DCCBase.observedAttributes.concat(
         ["label", "cols", "rows", "cell-width", "cell-height", "background-color", "grid",
          "infinite"]);
   }

   get label() {
      return this.getAttribute("label");
   }
   
   set label(newValue) {
      this.setAttribute("label", newValue);
   }

   get cols() {
      return this.getAttribute("cols");
   }
   
   set cols(newValue) {
      this.setAttribute("cols", newValue);
   }

   get rows() {
      return this.getAttribute("rows");
   }
   
   set rows(newValue) {
      this.setAttribute("rows", newValue);
   }

   get cellWidth() {
      return this.getAttribute("cell-width");
   }
   
   set cellWidth(newValue) {
      this.setAttribute("cell-width", newValue);
   }

   get cellHeight() {
      return this.getAttribute("cell-height");
   }
   
   set cellHeight(newValue) {
      this.setAttribute("cell-height", newValue);
   }

   get backgroundColor() {
      return this.getAttribute("background-color");
   }
   
   set backgroundColor(newValue) {
      this.setAttribute("background-color", newValue);
   }

   get grid() {
      return this.hasAttribute("grid");
   }

   set grid(hasGrid) {
      if (hasGrid)
         this.setAttribute("grid", "");
      else
         this.removeAttribute("grid");
   }

   get infinite() {
      return this.hasAttribute("infinite");
   }

   set infinite(isInfinite) {
      this._infinite = isInfinite; // faster performance duplicate
      if (hasGrid)
         this.setAttribute("grid", "");
      else
         this.removeAttribute("grid");
   }

   cellTypeRegister(topic, cellType) {
      cellType.space = this;
      this._cellTypes[cellType.type] = cellType;
      if (!this._state && this._checkAllTypes())
         this._createIndividuals();
   }

   _checkAllTypes() {
      let all = (this._stateTypes.length > 0) ? true : false;
      for (let s in this._stateTypes)
         if (!this._cellTypes[this._stateTypes[s]])
            all = false;
      return all;
   }

   _createIndividuals() {
      this._state = this._createEmptyState();
      if (this._stateStr.length > 0) {
         for (let r in this._stateStr) {
            for (let c = 0; c < this._stateStr[r].length; c++) {
               if (this._cellTypes[this._stateStr[r][c]]) {
                  this._state[r][c] =
                     this._cellTypes[this._stateStr[r][c]].createIndividual(c+1, parseInt(r)+1);
                  this._cells.appendChild(this._state[r][c].element);
               }
            }
         }
      }
   }

   _createEmptyState() {
      let state = [];
      for (let r = 0; r < this.rows; r++) {
         let row = [];
         for (let c = 0; c < this.cols; c++)
            row.push(null);
         state.push(row);
      }
      return state;
   }

   _changeControl() {
      let control = [];
      for (let row = 0; row < this._state.length; row++) {
         control[row] = [];
         for (let col = 0; col < this._state[row].length; col++)
            control[row][col] = false;
      }
      return control;
   }

   ruleRegister(topic, rule) {
      if (!this._rules[rule.oldSource])
         this._rules[rule.oldSource] = [rule];
      else
         this._rules[rule.oldSource].push(rule);
   }

   computeCoordinates(col, row) {
      return {
         x: (col-1) * this.cellWidth,
         y: (row-1) * this.cellHeight,
         width : this.cellWidth,
         height: this.cellHeight
      };
   }

   static computeDefaultCoordinates(col, row) {
      return {
         x: col *  DCCSpaceCellular.defaultCellDimensions.width,
         y: row * DCCSpaceCellular.defaultCellDimensions.height,
         width : DCCSpaceCellular.defaultCellDimensions.width,
         height: DCCSpaceCellular.defaultCellDimensions.height
      };
   }

   notify(topic, message) {
      if (message.role) {
         switch (message.role.toLowerCase()) {
            case "next": this.stateNext(); break;
         }
      }
   }

   stateNext() {
      let changed = this._changeControl();
      const nrows = this._state.length;
      for (let r = 0; r < nrows; r++) {
         let row = this._state[r];
         let ncols = row.length;
         for (let c = 0; c < ncols; c++) {
            let cell = row[c];
            if (cell != null && !changed[r][c] && this._rules[cell.dcc.type]) {
               let triggered = false;
               for (let m = 0; m < this._rules[cell.dcc.type].length && !triggered; m++) {
                  let rule = this._rules[cell.dcc.type][m];
                  if (Math.random() <= rule.decimalProbability) {
                     const neighbor = rule.ruleNeighbors[
                        Math.ceil(Math.random() * rule.ruleNeighbors.length)-1];
                     let nr = r + neighbor[0];
                     let nc = c + neighbor[1];
                     if (this._infinite) {
                        nr = (nr < 0) ? nrows - 1 : nr % nrows;
                        nc = (nc < 0) ? ncols - 1 : nc % ncols;
                     }
                     if (nr >= 0 && nr < nrows &&
                         nc >= 0 && nc < ncols) {
                        const expectedTarget = (this._state[nr][nc] == null)
                           ? "_" : this._state[nr][nc].dcc.type;
                        if (expectedTarget == rule.oldTarget) {
                           triggered = true;
                           if (this._state[nr][nc] == null ||
                               rule.newTarget != this._state[nr][nc].dcc.type) {
                              if (this._state[nr][nc] != null)
                                 this._cells.removeChild(this._state[nr][nc].element);
                              if (rule.newTarget != "_") {
                                 this._state[nr][nc] =
                                    this._cellTypes[rule.newTarget].createIndividual(nc+1, nr+1);
                                 this._cells.appendChild(this._state[nr][nc].element);
                              } else
                                 this._state[nr][nc] = null;
                              changed[nr][nc] = true;
                           }
                           if (this._state[r][c] == null ||
                               rule.newSource != this._state[r][c].dcc.type) {
                              if (this._state[r][c] != null)
                                 this._cells.removeChild(this._state[r][c].element);
                              if (rule.newSource != "_") {
                                 this._state[r][c] =
                                    this._cellTypes[rule.newSource].createIndividual(c+1, r+1);
                                 this._cells.appendChild(this._state[r][c].element);
                              } else
                                 this._state[r][c] = null;
                              changed[r][c] = true;
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   }
}

(function() {
   DCCSpaceCellular.svgTemplate =
`<div width="[width]" height="[height]">
<svg width="[width]" height="[height]">
<def>
  <pattern id="cell-grid" width="[cell-width]" height="[cell-height]" patternUnits="userSpaceOnUse">
    <rect width="[cell-width]" height="[cell-height]"
     style="fill:[background-color][grid]"/>
  </pattern>
</def>
<rect fill="url(#cell-grid)" x="0" y="0" width="[width]" height="[height]"/>
<g id="cells"/>
</svg>
</div>`;

   DCCSpaceCellular.defaultCellDimensions = {width: 20, height: 20};

   customElements.define("dcc-space-cellular", DCCSpaceCellular);
})();