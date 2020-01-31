/**
 * Input Choice and Option DCCs
 ******************************/

/**
 * Input Option DCC
 ******************/

class DCCInputOption extends DCCInput {
   constructor() {
      super();
      // this.inputTyped = this.inputTyped.bind(this);
      // this.inputChanged = this.inputChanged.bind(this);
   }
   
   connectedCallback() {
      this._parent = (this.hasAttribute("parent"))
         ? document.querySelector("#" + this.parent) : this.parentNode;

      if (this._parent != null) {
         if (!this.hasAttribute("variable") && this._parent.hasAttribute("variable"))
            this.variable = this._parent.variable;
        if (!this.hasAttribute("exclusive") && this._parent.hasAttribute("exclusive"))
            this.exclusive = this._parent.exclusive;
      }

      if (!this.hasAttribute("value"))
         this.value = this._statement.trim();

      super.connectedCallback();
      this.innerHTML = "";

      // <TODO> align with dcc-state-select
      MessageBus.int.publish("var/" + this.variable + "/subinput/ready",
                             {sourceType: DCCInputOption.elementTag,
                              content: this.value});
   }

   /*
    * Property handling
    */

   static get observedAttributes() {
      return DCCInput.observedAttributes.concat(
         ["parent", "exclusive"]);
   }

   get parent() {
      return this.getAttribute("parent");
   }
   
   set parent(newValue) {
      this.setAttribute("parent", newValue);
   }

   get exclusive() {
      return this.hasAttribute("exclusive");
   }

   set exclusive(isExclusive) {
      if (isExclusive)
         this.setAttribute("exclusive", "");
      else
         this.removeAttribute("exclusive");
   }

   /* Event handling */
   
   /*
   inputTyped() {
      this.changed = true;
      this.value = this._inputVariable.value;
      MessageBus.ext.publish("var/" + this.variable + "/typed",
                             {sourceType: DCCInputTyped.elementTag,
                              value: this.value});
   }

   inputChanged() {
      this.changed = true;
      this.value = this._inputVariable.value;
      MessageBus.ext.publish("var/" + this.variable + "/changed",
                             {sourceType: DCCInputTyped.elementTag,
                              value: this.value});
   }
   */
   
   /* Rendering */
   
   elementTag() {
      return DCCInputOption.elementTag;
   }
   
   externalLocationType() {
      return "input";
   }

   // _injectDCC(presentation, render) {
   async _renderInterface() {
      // === pre presentation setup
      // <TODO> review this sentence (copied from dcc-input-typed but not analysed)
      const statement =
         (this.hasAttribute("xstyle") && this.xstyle.startsWith("out"))
         ? "" : this._statement;

      let html = 
         "<input id='presentation-dcc' type='[exclusive]' name='[variable]' value='[value]'>[statement]</input><br>"
            .replace("[exclusive]", (this.hasAttribute("exclusive") ? "radio" : "checkbox"))
            .replace("[variable]", this.variable)
            .replace("[value]", this.value)
            .replace("[statement]", statement);
     
      // === presentation setup (DCC Block)
      let presentation;
      presentation = await this._applyRender(html, "innerHTML", "input");

      // === post presentation setup
      /*
      const selector = "#" + this.variable.replace(/\./g, "\\.");
      this._inputVariable = presentation.querySelector(selector);
      this._inputVariable.addEventListener("input", this.inputTyped);
      this._inputVariable.addEventListener("change", this.inputChanged);
      */
   }
}

/**
 * Input Choice DCC
 ******************/

class DCCInputChoice extends DCCInput {
   constructor() {
      super();
      // this.inputTyped = this.inputTyped.bind(this);
      // this.inputChanged = this.inputChanged.bind(this);
   }
   
   connectedCallback() {
      // <TODO> provisory (I must adjust the innerHTML = "" effect)
      super.connectedCallback();
      // this._statement = (this.hasAttribute("statement"))
      //    ? this.statement : "";

      // <TODO> align with dcc-state-select
      MessageBus.int.publish("var/" + this.variable + "/group_input/ready",
                             DCCInputChoice.elementTag);
   }

   /*
    * Property handling
    */

   static get observedAttributes() {
      return DCCInput.observedAttributes.concat(
         ["exclusive"]);
   }

   get exclusive() {
      return this.hasAttribute("exclusive");
   }

   set exclusive(isExclusive) {
      if (isExclusive)
         this.setAttribute("exclusive", "");
      else
         this.removeAttribute("exclusive");
   }

   /* Event handling */
   
   /*
   inputTyped() {
      this.changed = true;
      this.value = this._inputVariable.value;
      MessageBus.ext.publish("var/" + this.variable + "/typed",
                             {sourceType: DCCInputTyped.elementTag,
                              value: this.value});
   }

   inputChanged() {
      this.changed = true;
      this.value = this._inputVariable.value;
      MessageBus.ext.publish("var/" + this.variable + "/changed",
                             {sourceType: DCCInputTyped.elementTag,
                              value: this.value});
   }
   */
   
   /* Rendering */
   
   elementTag() {
      return DCCInputChoice.elementTag;
   }
   
   externalLocationType() {
      return "input";
   }

   // _injectDCC(presentation, render) {
   async _renderInterface() {
      // === pre presentation setup
      // <TODO> review this sentence (copied from dcc-input-typed but not analysed)
      const statement =
         (this.hasAttribute("xstyle") && this.xstyle.startsWith("out"))
         ? "" : this._statement;

      let html = 
         "<form><slot></slot></form>";
     
      // === presentation setup (DCC Block)
      let presentation;
      if (this.hasAttribute("xstyle") && this.xstyle.startsWith("out")) {
         await this._applyRender(this._statement, "innerHTML", "text");
         presentation = await this._applyRender(html, "innerHTML", "input");
      } else
         presentation = await this._applyRender(html, "innerHTML", "input");   

      // === post presentation setup
      /*
      const selector = "#" + this.variable.replace(/\./g, "\\.");
      this._inputVariable = presentation.querySelector(selector);
      this._inputVariable.addEventListener("input", this.inputTyped);
      this._inputVariable.addEventListener("change", this.inputChanged);
      */
   }
}

(function() {
   DCCInputOption.elementTag = "dcc-input-option";
   DCCInputOption.editableCode = false;
   customElements.define(DCCInputOption.elementTag, DCCInputOption);
   DCCInputChoice.elementTag = "dcc-input-choice";
   DCCInputChoice.editableCode = false;
   customElements.define(DCCInputChoice.elementTag, DCCInputChoice);
})();
