/* Expression DCC
 ****************/
class DCCExpression extends DCCVisual {
   constructor() {
     super();
   }
   
   async connectedCallback() {
      // <TODO> provisory solution due to message ordering
      this._updated = false;

      // <TODO> provisory - replace by a stronger expression representation
      this._variable = this.expression;
      if (this._variable.indexOf("[") > 0) {
         this._index = parseInt(
            this._variable.substring(this._variable.indexOf("[") + 1,
                                     this._variable.indexOf("]")));
         this._variable = this._variable.substring(0, this._variable.indexOf("["));
      }

      if (this.active) {
         this.variableUpdated = this.variableUpdated.bind(this);
         MessageBus.ext.subscribe(
            "var/" + this._variable + "/set", this.variableUpdated);

         // <TODO> provisory - overlaps with htracker.js and state.js
         //                    also monitors all messages
         this.stateChanged = this.stateChanged.bind(this);
         MessageBus.ext.subscribe("var/+/state_changed", this.stateChanged);
         this._stateValues = {};
      }

      let result = await MessageBus.ext.request("var/" + this._variable + "/get");
      console.log("=== result field");
      console.log(result.message);
      if (result.message == null)
         result = ""
      else {
         if (this._index == null) {
            // <TODO> provisory unfold
            if (typeof result.message === "object") {
               let values = [];
               for (let v in result.message)
                  if (result.message[v].state == "+")
                     values.push(result.message[v].content)
               result = this._valuesToHTML(values);
            } else
               result = result.message;
         } else
            result = result.message[this._index-1];
      }

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

   // defines if the display is activelly updated
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

   stateChanged(topic, message) {
      const id = MessageBus.extractLevel(topic, 2);

      if (id.startsWith(this._variable)) {
         const subid = id.substring(this._variable.length + 1);

         if (message.state == "+")
            this._stateValues[subid] = message.value;
         else
            if (this._stateValues[subid] != null)
               delete this._stateValues[subid];

         this.innerHTML = this._valuesToHTML(this._stateValues);
      }
   }

   _valuesToHTML(values) {
      let html = "<ul>";
      for (let v in values)
         html += "<li>" + values[v] + "</li>";
      html += "</ul>";
      return html;
   }
}

(function() {
   DCCExpression.elementTag = "dcc-expression";
   customElements.define(DCCExpression.elementTag, DCCExpression);
})();