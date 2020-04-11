/* Editor for DCC Plain Texts
  ***************************/

class EditDCCPlain extends EditDCC {
   constructor(obj, field, dcc, htmlProp) {
      super(dcc);
      this._objProperties = obj;
      this._objField = field;
      this._buildEditor(htmlProp);
   }

   async _buildEditor(htmlProp) {
      this._originalEdit = this._editElement.innerHTML;
      this._editElement.contentEditable = true;
      let ep = await this._extendedPanel(
            EditDCCPlain.propertiesTemplate.replace("[properties]", htmlProp), false);
      this._editElement.contentEditable = false;
      if (ep.clicked == "confirm") {
         this._objProperties[this._objField] =
            this._editElement.innerHTML.trim().replace(/<br>$/i, "");
         console.log("=== new obj");
         console.log(this._objField);
         console.log(this._objProperties);
         await MessageBus.ext.request("properties/apply/short");
      } else {
         this._editElement.innerHTML = this._originalEdit;
         this._editDCC.reactivateAuthor();
      }
      this._removeExtendedPanel();
   }
}

(function() {

EditDCCPlain.propertiesTemplate =
`<div class="annotation-bar">Properties
   <div class="annotation-buttons">
      <div id="ext-confirm" style="width:24px">` +
          EditDCC.buttonConfirmSVG + "</div>" +
`      <div id="ext-cancel" style="width:28px">` +
          EditDCC.buttonCancelSVG + "</div>" +
`   </div>
</div>
<div class="styp-properties-panel">[properties]</div>`;

})();