/* Editor for DCC Plain Texts
  ***************************/

class EditDCCPlain extends EditDCC {
   constructor(obj, element, htmlProp) {
      super(element);
      this._objProperties = obj;
      // this._commons = new EditDCC(element);
      // this._handleConfirm = this._handleConfirm.bind(this);
      // this._handleCancel = this._handleCancel.bind(this);
      this._buildEditor(htmlProp);
   }

   async _buildEditor(htmlProp) {
      this._buildToolbarPanel(EditDCCPlain.toolbarTemplate);
      this._editElement.contentEditable = true;
      let ep = await this._extendedPanel(
            EditDCCPlain.propertiesTemplate.replace("[properties]", htmlProp), false);
   }

   async _updateProperties() {
      if (this._imageField.files[0]) {
         const asset = await
            MessageBus.ext.request("data/asset//new",
                 {file: this._imageField.files[0],
                  caseid: Basic.service.currentCaseId});
         this._objProperties.image.path = asset.message;
      }
      MessageBus.ext.publish("properties/apply");
      this._editorWrapper.removeChild(this._editor);
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