/* Image DCC
  **********/
class DCCImage extends DCCBase {
   connectedCallback() {
      const templateHTML = "<div id='presentation-dcc'><img src='" + this.image + "'" +
                              ((this.hasAttribute("alt"))
                                 ? " alt='" + this.alt + "'>"
                                 : "></div>");

      // building the template
      const template = document.createElement("template");
      template.innerHTML = templateHTML;
      let shadow = this.attachShadow({mode: "open"});
      shadow.appendChild(template.content.cloneNode(true));
      
      this._presentation = shadow.querySelector("#presentation-dcc");
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