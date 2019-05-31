/* Image DCC
  **********/
class DCCImage extends DCCBase {
   connectedCallback() {
      this.innerHTML = "<div id='presentation-dcc'>" + this._imageHTML() + "</div>";
      this._presentation = this.querySelector("#presentation-dcc");
   }

   _imageHTML() {
      return "<img src='" + Basic.service.imageResolver(this.image) + "'" +
                ((this.hasAttribute("title"))
                   ? " alt='" + this.title + "'>"
                   : ">");
   }
   
   /* Properties
      **********/
   
   static get observedAttributes() {
      return ["id", "image", "alternative", "title"];
   }

   get id() {
      return this.getAttribute("id");
   }
   
   set id(newValue) {
      this.setAttribute("id", newValue);
   }
   
   get image() {
      return this.getAttribute("image");
   }
   
   set image(newValue) {
      this.setAttribute("image", newValue);
   }
   
   get alternative() {
      return this.getAttribute("alternative");
   }
   
   set alternative(newValue) {
      this.setAttribute("alternative", newValue);
   }

   get title() {
      return this.getAttribute("title");
   }
   
   set title(newValue) {
      this.setAttribute("title", newValue);
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