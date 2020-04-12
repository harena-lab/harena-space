/**
 * Base for all visual components
 */

class DCCVisual extends DCCBase {
   constructor() {
      super();
      this.selectListener = this.selectListener.bind(this);
   }

   static get observedAttributes() {
      return DCCBase.observedAttributes;
   }

   connectedCallback() {
      this.checkActivateAuthor();
   }

   checkActivateAuthor() {
      if (this.author && this._presentation)
         this._activateAuthorPresentation(this._presentation);
   }

   _activateAuthorPresentation(presentation) {
      presentation.style.cursor = "pointer";
      presentation.dccid = this.id;
      presentation.addEventListener("click", this.selectListener);
   }

   // ignores role argument
   edit() {
      this._editPresentation(this._presentation);
   }

   _editPresentation(presentation) {
      presentation.removeEventListener("click", this.selectListener);
      presentation.style.cursor = "default";
      if (presentation.style.border)
         this._originalBorderStyle = presentation.style.border;
      presentation.style.border = DCCVisual.selectedBorderStyle;
   }

   reactivateAuthor() {
      this._reactivateAuthorPresentation(this._presentation);
   }

   _reactivateAuthorPresentation(presentation) {
      if (this._originalBorderStyle) {
         presentation.style.border = this._originalBorderStyle;
         delete this._originalBorderStyle;
      } else
         presentation.style.border = "none";
      this._activateAuthorPresentation(presentation);
   }

   selectListener(event) {
      MessageBus.ext.publish("control/element/" + this.id + "/selected");
   }

   currentPresentation() {
      return (this._presentation) ? this._presentation : null;
   }

   _storePresentation(presentation) {
      this._presentation = presentation;
   }
}

class DCCMultiVisual extends DCCVisual {
   constructor() {
      super();
      this.selectListener = this.selectListener.bind(this);
      this._presentationSet = [];
   }

   _storePresentation(presentation, role) {
      super._storePresentation(presentation);
      if (presentation != null) {
         if (role)
            presentation.subRole = role;
         this._presentationSet.push(presentation);
      }
   }

   checkActivateAuthor() {
      if (this.author)
         for (let pr of this._presentationSet)
            this._activateAuthorPresentation(pr);
   }

   selectListener(event) {
      console.log("=== event");
      console.log(event);
      if (event.target.subRole)
         MessageBus.ext.publish(
            "control/element/" + event.target.dccid + "/selected", event.target.subRole);
      else
         MessageBus.ext.publish(
            "control/element/" + event.target.dccid + "/selected");
   }

   edit(role) {
      for (let pr of this._presentationSet)
         if (pr.subRole == role) {
            this._editedPresentation = pr;
            this._editPresentation(pr);
         }
   }

   reactivateAuthor() {
      console.log("=== reactivate");
      console.log(this._editedPresentation);
      if (this._editedPresentation) {
         this._reactivateAuthorPresentation(this._editedPresentation);
         delete this._editedPresentation;
      }
   }

   currentPresentation() {
      return (this._editedPresentation) ? this._editedPresentation : null;
   }
}

(function() {
   DCCVisual.selectedBorderStyle = "3px dashed #000000";
})();