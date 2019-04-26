/* Expression DCC
 ****************/
class DCCExpression extends DCCBase {
   constructor() {
     super();
   }
   
   async connectedCallback() {
     const result = await window.messageBus.ext.request("var/" + this.expression + "/get", "",
                                                        "var/" + this.expression);
     
     let template = document.createElement("template");
     template.innerHTML = 
        DCCExpression.templateElements.replace("[result]", result.message);
     
     this._shadow = this.attachShadow({mode: "open"});
     this._shadow.appendChild(template.content.cloneNode(true));
   }

   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return ["expression"];
   }

   get expression() {
      return this.getAttribute("expression");
   }
   
   set expression(newValue) {
      this.setAttribute("expression", newValue);
   }
}

(function() {
   DCCExpression.templateElements = 
   `<span id="presentation-dcc">[result]</span>`;
     
   DCCExpression.elementTag = "dcc-expression";
   customElements.define(DCCExpression.elementTag, DCCExpression);
})();