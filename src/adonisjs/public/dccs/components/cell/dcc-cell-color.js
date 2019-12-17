/**
 * Static Cell Color
 */

class DCCCellColor extends DCCCell {
   static get observedAttributes() {
      return DCCBase.observedAttributes.concat(
         ["color"]);
   }

   get color() {
      return this.getAttribute("color");
   }
   
   set color(newValue) {
      this.setAttribute("color", newValue);
   }

   createIndividual(col, row) {
      let element = this.createSVGElement("rect", col, row);
      element.setAttribute("style", "fill:" + this.color);
      return new DCCCellLight(this, element);
   }
}

(function() {
   customElements.define("dcc-cell-color", DCCCellColor);
})();