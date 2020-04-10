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
      this._originalEdit = this._editElement.innerHTML;
      this._editElement.contentEditable = true;
      let ep = await this._extendedPanel(
            EditDCCPlain.propertiesTemplate.replace("[properties]", htmlProp), false);
      this._editElement.contentEditable = false;
      console.log("=== ep");
      console.log(ep);
      if (ep.clicked == "confirm")
         await MessageBus.ext.request("properties/apply/short");
      else
         this._editElement.innerHTML = this._originalEdit;
      this._removeExtendedPanel();
   }

   /*
   async _handleConfirm() {
      this._editElement.contentEditable = false;
      MessageBus.ext.publish("properties/apply/short");
   }

   async _handleCancel() {
      this._editElement.contentEditable = false;
      this._editElement.contentEditable.innerHTML = this._originalEdit;
   }
   */
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