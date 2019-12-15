/**
 * Cellular Space for DCCs
 */

class DCCCell extends DCCBase {
   connectedCallback() {
      if (this.type)
         MessageBus.page.publish("dcc/cell-type/register", this);
   }

   static get observedAttributes() {
      return DCCBase.observedAttributes.concat(
         ["type"]);
   }

   get type() {
      return this.getAttribute("type");
   }
   
   set type(newValue) {
      this.setAttribute("type", newValue);
   }

   get space() {
      return (this._space) ? this._space : null;
   }
   
   set space(newValue) {
      this._space = newValue;
   }

   createSVGElement(type, col, row) {
      let coordinates;
      if (this.space != null)
         coordinates = this.space.computeCoordinates(col, row);
      else
         coordinates = DCCSpaceCellular.computeDefaultCoordinates(col, row);
      let element = document.createElementNS("http://www.w3.org/2000/svg", type);
      element.setAttribute("x", coordinates.x);
      element.setAttribute("y", coordinates.y);
      element.setAttribute("width", coordinates.width);
      element.setAttribute("height", coordinates.height);
      return element;
   }
}

class DCCCellLight {
   constructor(dcc, element) {
      this.dcc = dcc;
      this.element = element;
   }

   get dcc() {
      return this._dcc;
   }
   
   set dcc(newValue) {
      this._dcc = newValue;
   }

   get element() {
      return this._element;
   }
   
   set element(newValue) {
      this._element = newValue;
   }
}

(function() {
   customElements.define("dcc-cell", DCCCell);
})();