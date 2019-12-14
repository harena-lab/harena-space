/* DCC Monitor
  ************/

class MonitorDCCCell extends HTMLElement {
   connectedCallback() {
      if (!this.neighbors) this.neighbors = this.innerHTML.replace(/[ \r\n]/g, "");
      if (!this.hasAttribute("probability")) this.probability = "100";
      if (!this.hasAttribute("new-source")) this.newSource = "_";
      if (!this.hasAttribute("old-target")) this.oldTarget = "_";
      if (this.parentNode && this.parentNode.type) {
         if (!this.hasAttribute("new-target")) this.newTarget = this.parentNode.oldTarget;
         MessageBus.page.publish("dcc/monitor-dcc-cell/register", this);
      }
   }

   /* Properties
      **********/
   
   static get observedAttributes() {
      return DCCVisual.observedAttributes.concat(
         ["neighbors", "probability", "new-source", "old-target", "new-target"]);
   }

   get neighbors() {
      return this.getAttribute("neighbors");
   }
   
   set neighbors(newValue) {
      this.setAttribute("neighbors", newValue);
   }

   get probability() {
      return this.getAttribute("probability");
   }

   set probability(newValue) {
      this.setAttribute("probability", newValue);
   }

   get newSource() {
      return this.getAttribute("new-source");
   }
   
   set newSource(newValue) {
      this.setAttribute("new-source", newValue);
   }

   get oldTarget() {
      return this.getAttribute("old-target");
   }
   
   set oldTarget(newValue) {
      this.setAttribute("old-target", newValue);
   }

   get newTarget() {
      return this.getAttribute("new-target");
   }
   
   set newTarget(newValue) {
      this.setAttribute("new-target", newValue);
   }
}

(function() {
   customElements.define("monitor-dcc-cell", MonitorDCC);
})();