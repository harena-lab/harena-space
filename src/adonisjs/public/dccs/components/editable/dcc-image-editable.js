/* Image DCC Editable
 ********************/
function editableDCCImage() {
   DCCImage.prototype._editImage = function() {
      this._presentation.removeEventListener("click", this._editImage);
      this._presentation.innerHTML =
      `<label for="selImage">Choose a picture:</label>
       <input type="file" id="selImage" name="selImage"
              accept="image/png, image/jpeg, image/svg">`;
   };
   
   DCCImage.prototype._editDCC = function() {
      this._editImage = this._editImage.bind(this);
      this._presentation.addEventListener("click", this._editImage);
      this._presentation.style.cursor = "pointer";
   };

}