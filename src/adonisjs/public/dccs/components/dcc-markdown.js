/* Markdown DCC
  *************/
class DCCMarkdown extends DCCBase {
   connectedCallback() {
      this._content = this.innerHTML;
      this.innerHTML = "<div id='presentation-dcc'>" + this._content + "</div>";
      this._presentation = this.querySelector("#presentation-dcc");
   }

   /* Properties
      **********/
   
   static get observedAttributes() {
      return ["id"];
   }

   get id() {
      return this.getAttribute("id");
   }
   
   set id(newValue) {
      this.setAttribute("id", newValue);
   }

   /* Editable Component */
   editDCC() {
      if (!DCCImage.editableCode) {
        editableDCCMarkdown();
        DCCMarkdown.editableCode = true;
      }
      this._editDCC();
   }
}

(function() {
   DCCMarkdown.editableCode = false;
   customElements.define("dcc-markdown", DCCMarkdown);
})();