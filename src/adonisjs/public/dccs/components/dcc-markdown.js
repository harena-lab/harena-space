/* Markdown DCC
  *************/
class DCCMarkdown extends DCCBase {
   connectedCallback() {
      this._content = this.innerHTML;
      this.innerHTML = "<div id='presentation-dcc'>" + this._content + "</div>";
      this._presentation = this.querySelector("#presentation-dcc");
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