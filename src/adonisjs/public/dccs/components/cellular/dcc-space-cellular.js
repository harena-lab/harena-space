/**
 * Cellular Space for DCCs
 */

class DCCSpaceCellular extends DCCBase {
   constructor() {
      super();
      this.cellTypeRegister = this.cellTypeRegister.bind(this);
      this.monitorRegister = this.monitorRegister.bind(this);
      this.stateNext = this.stateNext.bind(this);
      this.notify = this.notify.bind(this);
      
      this._cellTypes = {};
      this._monitors = {};
      this._stateTypes = [];
   }

   connectedCallback() {
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
      this.innerHTML = DCCSpaceCellular.svgTemplate
                         .replace(/\[cell-width\]/g, this.cellWidth + "px")
                         .replace(/\[cell-height\]/g, this.cellHeight + "px")
                         .replace(/\[width\]/g, this.cols * this.cellWidth + "px")
                         .replace(/\[height\]/g, this.rows * this.cellHeight + "px");
      this._cells = this.querySelector("#cells");

      if (!this._state && this._checkAllTypes())
         this._createIndividuals();

      MessageBus.page.subscribe("dcc/cell-type/register", this.cellTypeRegister);
      MessageBus.page.subscribe("dcc/monitor-cell/register", this.monitorRegister);
   }

   disconnectedCallback() {
      MessageBus.page.unsubscribe("dcc/cell-type/register", this.cellTypeRegister);
   }

   static get observedAttributes() {
      return DCCBase.observedAttributes.concat(
         ["cols", "rows", "cell-width", "cell-height"]);
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
      console.log("=== new state");
      console.log(this._state);
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

   _cloneState() {
      let clone = [];
      for (let row = 0; row < this._state.length; row++) {
         clone[row] = [];
         for (let col = 0; col < this._state[row].length; col++)
            clone[row][col] = this._state[row][col];
      }
      return clone;
   }

   monitorRegister(topic, monitor) {
      if (!this._monitors[monitor.oldSource])
         this._monitors[monitor.oldSource] = [monitor];
      else
         this._monitors[monitor.oldSource].push(monitor);
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
      let newState = this._cloneState();
      for (let r = 0; r < this._state.length; r++) {
         let row = this._state[r];
         for (let c = 0; c < row.length; c++) {
            let cell = row[c];
            if (cell != null && this._monitors[cell.dcc.type]) {
               let triggered = false;
               for (let m = 0; m < this._monitors[cell.dcc.type].length && !triggered; m++) {
                  let monitor = this._monitors[cell.dcc.type][m];
                  if (Math.random() <= monitor.decimalProbability) {
                     const neighbor = monitor.monitorNeighbors[
                        Math.ceil(Math.random() * monitor.monitorNeighbors.length)-1];
                     const nr = r + neighbor[0];
                     const nc = c + neighbor[1];
                     if (nr >= 0 && nr < this._state.length &&
                         nc >= 0 && nc < row.length) {
                        const expectedTarget = (newState[nr][nc] == null)
                           ? "_" : newState[nr][nc].dcc.type;
                        if (expectedTarget == monitor.oldTarget) {
                           triggered = true;
                           if (newState[nr][nc] == null ||
                               monitor.newTarget != newState[nr][nc].dcc.type) {
                              if (newState[nr][nc] != null)
                                 this._cells.removeChild(newState[nr][nc].element);
                              if (monitor.newTarget != "_") {
                                 newState[nr][nc] =
                                    this._cellTypes[monitor.newTarget].createIndividual(nc+1, nr+1);
                                 this._cells.appendChild(newState[nr][nc].element);
                              } else
                                 newState[nr][nc] = null;
                           }
                           if (this._state[r][c] == null ||
                               monitor.newSource != this._state[r][c].dcc.type) {
                              if (this._state[r][c] != null)
                                 this._cells.removeChild(this._state[r][c].element);
                              if (monitor.newSource != "_") {
                                 newState[r][c] =
                                    this._cellTypes[monitor.newSource].createIndividual(c+1, r+1);
                                 this._cells.appendChild(newState[r][c].element);
                              } else
                                 newState[r][c] = null;
                           }
                        }
                     }
                  }
               }
            }
         }
      }
      this._state = newState;
      console.log("=== new state");
      console.log(newState);
   }
}

(function() {
   DCCSpaceCellular.svgTemplate =
`<div width="[width]" height="[height]">
<svg width="[width]" height="[height]">
<def>
  <pattern id="cell-grid" width="[cell-width]" height="[cell-height]" patternUnits="userSpaceOnUse">
    <rect width="[cell-width]" height="[cell-height]"
     style="fill:rgb(255,255,200);stroke-width:2;stroke:rgb(100,100,100)"/>
  </pattern>
</def>
<rect fill="url(#cell-grid)" x="0" y="0" width="[width]" height="[height]"/>
<g id="cells"/>
</svg>
</div>`;

   DCCSpaceCellular.defaultCellDimensions = {width: 20, height: 20};

   customElements.define("dcc-space-cellular", DCCSpaceCellular);
})();