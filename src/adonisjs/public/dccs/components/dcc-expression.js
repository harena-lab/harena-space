/* Expression DCC
 ****************/
class DCCExpression extends DCCVisual {
   constructor() {
     super();
   }
   
   async connectedCallback() {
      // <TODO> provisory solution due to message ordering
      this._updated = false

      // <TODO> provisory - replace by a stronger expression representation
      let variable = this.expression;
      if (variable.indexOf("[") > 0) {
         this._index = parseInt(
            variable.substring(variable.indexOf("[") + 1, variable.indexOf("]")));
         variable = variable.substring(0, variable.indexOf("["));
      }

      if (this.active) {
         this.variableUpdated = this.variableUpdated.bind(this);
         MessageBus.ext.subscribe(
            "var/" + variable + "/set", this.variableUpdated);
      }

      let result = await MessageBus.ext.request("var/" + variable + "/get");
      if (this._index == null)
         result = result.message;
      else
         result = result.message[this._index-1];

      // <TODO> provisory solution due to message ordering
      if (!this._updated)
        this.innerHTML = result;

      super.connectedCallback();
   }

   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return DCCVisual.observedAttributes.concat(
         ["expression", "active"]);
   }

   get expression() {
      return this.getAttribute("expression");
   }
   
   set expression(newValue) {
      this.setAttribute("expression", newValue);
   }

   // defines if the displey is activelly updated
   get active() {
      return this.hasAttribute("active");
   }

   set active(isActive) {
      if (isActive) {
         this.setAttribute("active", "");
      } else {
         this.removeAttribute("active");
      }
   }

   variableUpdated(topic, message) {
      // <TODO> provisory solution due to message ordering
      this._updated = true;

      if (this._index == null)
         this.innerHTML = message;
      else
         this.innerHTML = message[this._index-1];
   }
}

(function() {
   DCCExpression.elementTag = "dcc-expression";
   customElements.define(DCCExpression.elementTag, DCCExpression);
})();