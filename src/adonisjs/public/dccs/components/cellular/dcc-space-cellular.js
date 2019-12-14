/**
 * Cellular Space for DCCs
 */

class DCCSpaceCellular extends DCCBase {
   constructor() {
      super();
      this.cellTypeRegister = this.cellTypeRegister.bind(this);
      this.monitorRegister = this.monitorRegister.bind(this);
      
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
                         .replace(/\[cell-width\]/g, this.cellWidth)
                         .replace(/\[cell-height\]/g, this.cellHeight)
                         .replace("[width]", this.cols * this.cellWidth)
                         .replace("[height]", this.rows * this.cellHeight);
      this._cells = this.querySelector("#cells");

      console.log("=== check all types");
      console.log(this._checkAllTypes());
      if (this._checkAllTypes())
         this._createIndividuals();

      MessageBus.page.subscribe("dcc/cell-type/register", this.cellTypeRegister);
      MessageBus.page.subscribe("dcc/monitor-dcc-cell/register", this.monitorRegister);
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
      console.log("=== type");
      console.log(cellType.type);
      console.log("=== check all types");
      console.log(this._checkAllTypes());
      if (this._checkAllTypes())
         this._createIndividuals();
   }

   monitorRegister(topic, monitor) {
   }

   _checkAllTypes() {
      let all = (this._stateTypes.length > 0) ? true : false;
      for (let s in this._stateTypes)
         if (!this._cellTypes[this._stateTypes[s]])
            all = false;
      return all;
   }

   _createIndividuals() {
      if (this._stateStr.length > 0) {
         this._state = [];
         for (let r in this._stateStr) {
            let row = [];
            for (let c = 0; c < this._stateStr[r].length; c++) {
               if (this._cellTypes[this._stateStr[r][c]]) {
                  const individual =
                     this._cellTypes[this._stateStr[r][c]].createIndividual(c+1, parseInt(r)+1);
                  console.log("=== individual");
                  console.log(individual);
                  this._cells.appendChild(individual.element);
                  row.push(individual);
               }
               else
                  row.push(null);
            }
            this._state.push(row);
         }
      }
   }

   computeCoordinates(col, row) {
      console.log("col, row");
      console.log(col + "," + row);
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
}

(function() {
   DCCSpaceCellular.svgTemplate =
`<svg width="100%" height="100%">
<def>
  <pattern id="cell-grid" width="[cell-width]" height="[cell-height]" patternUnits="userSpaceOnUse">
    <rect width="[cell-width]" height="[cell-height]"
     style="fill:rgb(255,255,200);stroke-width:2;stroke:rgb(100,100,100)"/>
  </pattern>
</def>
<rect fill="url(#cell-grid)" x="0" y="0" width="[width]" height="[height]"/>
<g id="cells"/>
</svg>`;

   DCCSpaceCellular.defaultCellDimensions = {width: 20, height: 20};

   customElements.define("dcc-space-cellular", DCCSpaceCellular);
})();