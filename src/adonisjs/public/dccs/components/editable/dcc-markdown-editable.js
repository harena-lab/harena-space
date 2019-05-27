/* Image DCC Editable
 ********************/
function editableDCCMarkdown() {
   DCCMarkdown.prototype._editDCC = function() {
      console.log("content editable");
      this._presentation.contentEditable = true;
   };
}