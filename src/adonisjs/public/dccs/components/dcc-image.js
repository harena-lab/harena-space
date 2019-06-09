/* Image DCC
  **********/
class DCCImage extends DCCVisual {
   connectedCallback() {
      this.innerHTML = "<img id='presentation-dcc' src='" +
                         Basic.service.imageResolver(this.image) + "'" +
                         ((this.hasAttribute("title"))
                            ? " alt='" + this.title + "'>"
                            : ">");
      this._presentation = this.querySelector("#presentation-dcc");
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
   /*
   activateEditDCC() {
      if (!DCCImage.editableCode) {
        editableDCCImage();
        DCCImage.editableCode = true;
      }
      this._activateEditDCC();

      this.editProperties = this.editProperties.bind(this);
      this._presentation.style.cursor = "pointer";
      this._presentation.addEventListener("click", this.editProperties);
   }

   editProperties() {
      // this._editImage();
      this._presentation.style.borderStyle = "dashed";
      this._presentation.style.borderWidth = "5px";
      this._presentation.style.borderColor = "blue";

      this._presentation.classList.add("styp-field-highlight");
      MessageBus.ext.publish("control/element/" + this.id + "/edit");
   }
   */
}

(function() {
   // DCCImage.editableCode = false;
   customElements.define("dcc-image", DCCImage);
})();