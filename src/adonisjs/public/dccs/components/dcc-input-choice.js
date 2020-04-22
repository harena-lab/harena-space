/**
 * Input Choice and Option DCCs
 ******************************/

/**
 * Input Option DCC
 ******************/

class DCCInputOption extends DCCInput {
   constructor() {
      super();
      this.inputChanged = this.inputChanged.bind(this);
   }
   
   connectedCallback() {
      this._parent = (this.hasAttribute("parent"))
         ? document.querySelector("#" + this.parent)
         : (this.parentNode != null && this.parentNode.elementTag != null &&
            this.parentNode.elementTag == DCCInputChoice.elementTag)
           ? this.parentNode : null;

      super.connectedCallback();
      this.innerHTML = "";

      if (!this.hasAttribute("value"))
         this.value = this._statement.trim();

      // <TODO> align with dcc-state-select
      if (this._parent == null && this.hasAttribute("variable"))
         MessageBus.int.publish("var/" + this.variable + "/input/ready",
                                {sourceType: DCCInputOption.elementTag,
                                 content: this.value});
   }

   disconnectedCallback() {
      if (parent == null)
         this._presentation.removeEventListener("change", this.inputChanged);
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
   
   inputChanged() {
      this.changed = true;
      MessageBus.ext.publish("var/" + this.variable + "/changed",
                             {sourceType: DCCInputOption.elementTag,
                              value: this.value});
   }
   
   /* Rendering */
   
   elementTag() {
      return DCCInputOption.elementTag;
   }
   
   externalLocationType() {
      return "input";
   }

   // _injectDCC(presentation, render) {
   async _renderInterface() {
      if (this._parent == null) {
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
         this._presentation = await this._applyRender(html, "innerHTML", "input");

         // === post presentation setup
         this._presentation.addEventListener("change", this.inputChanged);

         this._presentationIsReady();
      }
   }
}

/**
 * Input Choice DCC
 ******************/

class DCCInputChoice extends DCCInput {
   constructor() {
      super();
      this._options = [];
      this.inputChanged = this.inputChanged.bind(this);
   }
   
   connectedCallback() {
      // Fetch all the children that are not defined yet
      let undefinedOptions = this.querySelectorAll(':not(:defined)');

      let promises = [...undefinedOptions].map(option => {
        return customElements.whenDefined(option.localName);
      });

      // Wait for all the options be ready
      Promise.all(promises).then(() => {
         let options = this.querySelectorAll(DCCInputOption.elementTag);
         for (let o of options)
            this._options.push({value: o.value, statement: o._statement});
         super.connectedCallback();
      });

      // <TODO> align with dcc-state-select
      MessageBus.int.publish("var/" + this.variable + "/group_input/ready",
                             DCCInputChoice.elementTag);
   }

   disconnectedCallback() {
      if (this._options != null)
         for (let o of this._options)
            if (o.presentation != null)
               o.presentation.removeEventListener("change", this.inputChanged);
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
   
   inputChanged(event) {
      this.changed = true;
      MessageBus.ext.publish("var/" + this.variable + "/changed",
                             {sourceType: DCCInputChoice.elementTag,
                              value: event.target.value});
   }
   
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

      let html = "<div id='presentation-dcc'>";
      let v = 1;
      for (let o of this._options) {
         html +=
         "<input id='[id]' type='[exclusive]' name='[variable]' value='[value]'>[statement]</input><br>"
               .replace("[id]", this.variable + v)
               .replace("[exclusive]",
                  (this.hasAttribute("exclusive") ? "radio" : "checkbox"))
               .replace("[variable]", this.variable)
               .replace("[value]", o.value)
               .replace("[statement]", o.statement);
         v++;
      }
      html += "</div>";

      // === presentation setup (DCC Block)
      let presentation;
      if (this.hasAttribute("xstyle") && this.xstyle.startsWith("out")) {
         await this._applyRender(this._statement, "innerHTML", "text");
         presentation = await this._applyRender(html, "innerHTML", "input");
      } else
         presentation = await this._applyRender(html, "innerHTML", "input");

      // === post presentation setup
      if (presentation != null) {
         v = 1;
         for (let o of this._options) {
            let op = presentation.querySelector("#" + this.variable + v);
            if (op != null) {
               op.addEventListener("change", this.inputChanged);
               o.presentation = op;
            }
            v++;
         }
      }

      this._presentationIsReady();
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
