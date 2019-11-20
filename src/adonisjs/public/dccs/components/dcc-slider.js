/**
 * Slider DCC
 ***********/

class DCCSlider extends DCCBlock {
   constructor() {
      super();
      this.inputChanged = this.inputChanged.bind(this);
   }
   
   connectedCallback() {
      this._statement = (this.hasAttribute("statement"))
         ? this.statement : this.innerHTML;
      this.innerHTML = "";
      if (!this.hasAttribute("min"))
         this.min = DCCSlider.defaultValueMin;
      if (!this.hasAttribute("max"))
         this.max = DCCSlider.defaultValueMax;
      if (!this.hasAttribute("value"))
         this.value = Math.round(this.min + this.max) / 2;

      super.connectedCallback();
      
      MessageBus.ext.publish("var/" + this.variable + "/input/ready",
                             DCCSlider.elementTag);
   }
   
   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return DCCBlock.observedAttributes.concat(
         ["statement", "variable", "value", "min", "max", "index"]);
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

   get value() {
      return this.getAttribute("value");
   }

   set value(newValue) {
      this.setAttribute("value", newValue);
   }

   get min() {
      return this.getAttribute("min");
   }

   set min(newValue) {
      this.setAttribute("min", newValue);
   }

   get max() {
      return this.getAttribute("max");
   }

   set max(newValue) {
      this.setAttribute("max", newValue);
   }

   get index() {
      return this.hasAttribute("index");
   }

   set index(hasIndex) {
      if (hasIndex)
         this.setAttribute("index", "");
      else
         this.removeAttribute("index");
   }

   /* Event handling */
   
   inputChanged() {
      if (this._inputIndex)
         this._inputIndex.innerHTML = this._inputVariable.value;
      MessageBus.ext.publish("var/" + this.variable + "/changed",
                                    {sourceType: DCCSlider.elementTag,
                                     value: this._inputVariable.value});
   }
   
   /* Rendering */
   
   elementTag() {
      return DCCSlider.elementTag;
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

      const index = (this.hasAttribute("index"))
         ? "<span id='" + this.variable + "-index'>" + this.value + "</span>"
         : "";

      let html = DCCSlider.templateElement
            .replace("[statement]", statement)
            .replace("[variable]", this.variable)
            .replace("[value]", this.value)
            .replace("[min]", this.min)
            .replace("[max]", this.max)
            .replace("[render]", this._renderStyle())
            .replace("[index]", index);
     
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
      this._inputVariable.oninput = this.inputChanged;
      if (this.hasAttribute("index"))
         this._inputIndex = presentation.querySelector(selector + "-index");
   }
}

(function() {
   DCCSlider.templateElement =
`[statement]&nbsp;
<div style="width:100%; display:flex; flex-direction:row">
   <span style="flex:initial">[index]&nbsp;</span>
   <input type="range" id="[variable]" min="[min]" max="[max]"
          value="[value]" class="[render]" style="flex:auto">
</div>`;

   DCCSlider.defaultValueMin = 0;
   DCCSlider.defaultValueMax = 100;

   DCCSlider.elementTag = "dcc-slider";
   customElements.define(DCCSlider.elementTag, DCCSlider);
})();
