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
         this._activateAuthorPresentation(this._presentation, this);
   }

   _activateAuthorPresentation(presentation, listener) {
      presentation.style.cursor = "pointer";
      presentation.dccid = this.id;
      presentation.addEventListener("click", listener.selectListener);
   }

   // ignores role argument
   edit() {
      this._editPresentation(this._presentation, this);
   }

   _editPresentation(presentation, listener) {
      presentation.removeEventListener("click", listener.selectListener);
      presentation.style.cursor = "default";
      if (presentation.style.border)
         this._originalBorderStyle = presentation.style.border;
      presentation.style.border = DCCVisual.selectedBorderStyle;
   }

   reactivateAuthor() {
      this._reactivateAuthorPresentation(this._presentation, this);
   }

   _reactivateAuthorPresentation(presentation, listener) {
      if (this._originalBorderStyle) {
         presentation.style.border = this._originalBorderStyle;
         delete this._originalBorderStyle;
      } else
         presentation.style.border = "none";
      this._activateAuthorPresentation(presentation, listener);
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
      this._presentationSet = [];
   }

   _storePresentation(presentation, role) {
      super._storePresentation(presentation);
      if (presentation != null)
         this._presentationSet.push(
            new PresentationDCC(presentation, this.id, role));
         /*
         if (role)
            presentation.subRole = role;
         */
   }

   checkActivateAuthor() {
      if (this.author)
         for (let pr of this._presentationSet)
            this._activateAuthorPresentation(pr._presentation, pr);
   }

   edit(role) {
      for (let pr of this._presentationSet)
         if (pr._role == role) {
            this._editedPresentation = pr;
            this._editPresentation(pr._presentation, pr);
         }
   }

   reactivateAuthor() {
      console.log("=== reactivate");
      console.log(this._editedPresentation);
      if (this._editedPresentation) {
         this._reactivateAuthorPresentation(this._editedPresentation._presentation,
                                            this._editedPresentation);
         delete this._editedPresentation;
      }
   }

   currentPresentation() {
      return (this._editedPresentation) ? this._editedPresentation._presentation : null;
   }
}

// manages individual in multiple visual DCCs
class PresentationDCC {
   constructor(presentation, id, role) {
      this._presentation = presentation;
      this._id = id;
      if (role)
         this._role = role;
      this.selectListener = this.selectListener.bind(this);
   }

   selectListener() {
      if (this._role)
         MessageBus.ext.publish(
            "control/element/" + this._id + "/selected", this._role);
      else
         MessageBus.ext.publish(
            "control/element/" + this._id + "/selected");
   }
}

(function() {
   DCCVisual.selectedBorderStyle = "3px dashed #000000";
})();