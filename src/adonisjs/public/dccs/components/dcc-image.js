/* Image DCC
  **********/
class DCCImage extends DCCBase {
   connectedCallback() {
      this.innerHTML = "<div id='presentation-dcc'>" + this._imageHTML() + "</div>";
      this._presentation = this.querySelector("#presentation-dcc");
   }

   _imageHTML() {
      return "<img src='" + this.image + "'" +
                ((this.hasAttribute("alt"))
                   ? " alt='" + this.alt + "'>"
                   : ">");
   }
   
   /* Properties
      **********/
   
   static get observedAttributes() {
      return ["image", "alt"];
   }

   get image() {
      return this.getAttribute("image");
   }
   
   set image(newValue) {
      this.setAttribute("image", newValue);
   }
   
   get alt() {
      return this.getAttribute("alt");
   }
   
   set alt(newValue) {
      this.setAttribute("alt", newValue);
   }

   /* Editable Component */
   editDCC() {
      if (!DCCImage.editableCode) {
        editableDCCImage();
        DCCImage.editableCode = true;
      }
      this._editDCC();
   }
   
   editImage() {
      this._editImage();
   }
}

(function() {
   DCCImage.editableCode = false;
   customElements.define("dcc-image", DCCImage);
})();