/**
 * Input DCC
 ***********/

class DCCInput extends DCCBlock {
   constructor() {
      super();
      this.inputTyped = this.inputTyped.bind(this);
      this.inputChanged = this.inputChanged.bind(this);
   }
   
   connectedCallback() {
      this._statement = (this.hasAttribute("statement"))
         ? this.statement : this.innerHTML;
      this.innerHTML = "";

      super.connectedCallback();
      
      MessageBus.ext.publish("var/" + this.variable + "/input/ready",
                             DCCInput.elementTag);
   }
   
   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return DCCBlock.observedAttributes.concat(
         ["statement", "variable", "itype", "rows", "vocabularies"]);
   }

   get statement() {
      return this.getAttribute("statement");
   }
   
   set statement(newValue) {
      this.setAttribute("statement", newValue);
   }
   
   get variable() {
      return this.getAttribute("variable");
   }
   
   set variable(newValue) {
      this.setAttribute("variable", newValue);
   }
   
   get itype() {
      return this.getAttribute("itype");
   }
   
   set itype(newValue) {
      this.setAttribute("itype", newValue);
   }

   get rows() {
      return this.getAttribute("rows");
   }
   
   set rows(newValue) {
      this.setAttribute("rows", newValue);
   }
   
   get vocabularies() {
      return this.getAttribute("vocabularies");
   }
   
   set vocabularies(newValue) {
      this.setAttribute("vocabularies", newValue);
   }

   /* Event handling */
   
   inputTyped() {
      MessageBus.ext.publish("var/" + this.variable + "/typed",
                                    {sourceType: DCCInput.elementTag,
                                     value: this._inputVariable.value});
   }

   inputChanged() {
      MessageBus.ext.publish("var/" + this.variable + "/changed",
                                    {sourceType: DCCInput.elementTag,
                                     value: this._inputVariable.value});
   }
   
   /* Rendering */
   
   elementTag() {
      return DCCInput.elementTag;
   }
   
   externalLocationType() {
      return "input";
   }

   // _injectDCC(presentation, render) {
   async _renderInterface() {
      // === pre presentation setup
      const statement =
         (this.hasAttribute("xstyle") && this.xstyle.startsWith("out"))
         ? "" : this._statement;

      let html;
      if (this.hasAttribute("rows") && this.rows > 1)
         html = DCCInput.templateElements.area
            .replace("[statement]", statement)
            .replace("[rows]", this.rows)
            .replace("[variable]", this.variable)
            .replace("[render]", this._renderStyle());
      else
         html = DCCInput.templateElements.text
            .replace("[statement]", statement)
            .replace("[variable]", this.variable)
            .replace("[render]", this._renderStyle())
            .replace("[itype]", (this.hasAttribute("itype")) ?
                                   " type='" + this.itype + "'" : "");
     
      // === presentation setup (DCC Block)
      let presentation;
      if (this.hasAttribute("xstyle") && this.xstyle.startsWith("out")) {
         await this._applyRender(this._statement, "innerHTML", "-text");
         presentation = await this._applyRender(html, "innerHTML");
      } else
         presentation = await this._applyRender(html, "innerHTML");

      // === post presentation setup
      const selector = "#" + this.variable.replace(/\./g, "\\.");
      this._inputVariable = presentation.querySelector(selector);
      this._inputVariable.addEventListener("input", this.inputTyped);
      this._inputVariable.addEventListener("change", this.inputChanged);
   }
}

(function() {
   // <TODO> temporary (size = 50)
   // <TODO> transfer the definition of font to CSS
   DCCInput.templateElements = {
      text: "[statement]<input type='text' id='[variable]' class='[render]' [itype] style='border-color:darkgray'></input>",
      area: "[statement]<textarea rows='[rows]' id='[variable]' class='[render]'></textarea>"
   };

   DCCInput.elementTag = "dcc-input";
   DCCInput.editableCode = false;
   customElements.define(DCCInput.elementTag, DCCInput);
})();
