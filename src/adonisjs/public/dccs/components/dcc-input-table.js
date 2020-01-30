/**
 * Input Table DCC
 *****************/

class DCCInputTable extends DCCInput {
   constructor() {
      super();
      this.inputTyped = this.inputTyped.bind(this);
      this.inputChanged = this.inputChanged.bind(this);
   }
   
   connectedCallback() {
      if (!this.hasAttribute("rows"))
         this.rows = 2;
      if (!this.hasAttribute("cols"))
         if (this.hasAttribute("schema"))
            this.cols = this.schema.split(",").length;
         else
            this.cols = 2;

      super.connectedCallback();

      MessageBus.int.publish("var/" + this.variable + "/input/ready",
                             DCCInputTable.elementTag);
   }

   /*
    * Property handling
    */

   static get observedAttributes() {
      return DCCInput.observedAttributes.concat(
         ["rows", "cols", "schema"]);
   }

   get rows() {
      return this.getAttribute("rows");
   }
   
   set rows(newValue) {
      this.setAttribute("rows", newValue);
   }

   get cols() {
      return this.getAttribute("cols");
   }
   
   set cols(newValue) {
      this.setAttribute("cols", newValue);
   }
   
   get schema() {
      return this.getAttribute("schema");
   }
   
   set schema(newValue) {
      this.setAttribute("schema", newValue);
   }
   
   /* Event handling */
   
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
   
   /* Rendering */
   
   elementTag() {
      return DCCInputTable.elementTag;
   }
   
   externalLocationType() {
      return "input";
   }

   // _injectDCC(presentation, render) {
   async _renderInterface() {
      let templateElements =
      "<style> @import '" +
         Basic.service.themeStyleResolver("dcc-input-table.css") +
      "' </style>" +
      "<div id='presentation-dcc'>" +
         "[statement]" +
         "<table id='[variable]' class='[render]'>[content]</table>" +
      "</span>";

      // === pre presentation setup
      const statement =
         (this.hasAttribute("xstyle") && this.xstyle.startsWith("out"))
         ? "" : this._statement;

      let content = "";
      if (this.hasAttribute("schema")) {
         content += "<tr>";
         let sch = this.schema.split(",");
         for (let s of sch)
            content += "<th>" + s.trim() + "</th>";
         content += "</tr>";
      }
      for (let r = 1; r <= this.rows; r++) {
         content += "<tr>";
         console.log("cols: " + this.cols);
         for (let c = 1; c <= this.cols; c++)
            content += "<td><input type='text' id='" +
                       this.variable + "_" + r + "_" + c + "'></input></td>";
         content += "</tr>";
      }

      let html = templateElements
            .replace("[statement]", statement)
            .replace("[variable]", this.variable)
            .replace("[render]", this._renderStyle())
            .replace("[content]", content);
     
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
   DCCInputTable.elementTag = "dcc-input-table";
   DCCInputTable.editableCode = false;
   customElements.define(DCCInputTable.elementTag, DCCInputTable);
})();
