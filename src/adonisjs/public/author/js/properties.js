/**
 * Properties Editor
 *
 * Edits properties according to the type.
 */

class Properties {
   static start(author) {
      Properties.s = new Properties(author);
   }

   constructor(author) {
      this._author = author;

      this._objProperties = null;

      this._propertiesPanel = document.querySelector("#properties-panel");
      this.applyProperties = this.applyProperties.bind(this);
      MessageBus.ext.subscribe("properties/apply", this.applyProperties);
   }

   /*
    * Structure of the editable object
    * 
    */
   editProperties(obj) {
      this._objProperties = obj;

      const profile = Properties.elProfiles[obj.type];
      let seq = 1;
      let html = "";
      for (let p in profile)
         if (obj[p]) {
            html += Properties.fieldTypes[profile[p].type].replace(/\[n\]/igm, seq)
                                                          .replace(/\[label\]/igm, profile[p].label)
                                                          .replace(/\[value\]/igm, obj[p]);
            seq++;
         }
      this._propertiesPanel.innerHTML = html + Properties.buttonApply;
   }

   async applyProperties() {
      if (this._objProperties != null) {
         const profile = Properties.elProfiles[this._objProperties.type];
         let seq = 1;
         for (let p in profile) {
            let field = this._propertiesPanel.querySelector("#pfield" + seq);
            switch (profile[p].type) {
               case "shortStr" : 
               case "text":      this._objProperties[p] = field.value;
                                 break;
               case "image": // uploads the image
                             const asset = await
                                MessageBus.ext.request("data/asset//new",
                                   {file: field.files[0],
                                    caseid: this._author.currentCaseId});
                             this._objProperties[p] = asset.message;
                             break;
            }
            seq++;
         }
         Translator.instance.updateElementMarkdown(this._objProperties);

         this._objProperties = null;
         MessageBus.ext.publish("control/knot/update");
     }
   }
}

(function() {

Properties.elProfiles = {
text: {content: {type: "text",
                 label: "text"}
       },
image: {alternative: {type: "shortStr",
                      label: "label"},
        path: {type:  "image",
               label: "image"}
       },
option: {label: {type: "shortStr",
                 label: "label"},
         target: {type:  "shortStr",
                  label: "target"}
        }
};

Properties.fieldTypes = {
shortStr:
`<div class="styp-field-row">
   <div class="styp-field-label std-border">[label]</div>
   <input type="text" id="pfield[n]" class="styp-field-value" size="10" value="[value]">
</div>`,
text:
`<div class="styp-field-row">
   <textarea rows="5" id="pfield[n]" class="styp-field-value" size="10">[value]</textarea>
</div>`,
image:
`<div class="styd-notice styd-border-notice">
   <label class="styp-field-label std-border" for="pfield[n]">[label]</label>
   <input type="file" id="pfield[n]" name="pfield[n]" class="styd-selector styp-field-value"
          accept="image/png, image/jpeg, image/svg">
</div>`
};

Properties.buttonApply =
`<div class="control-button">
   <dcc-trigger action="properties/apply" label="Apply" image="icons/icon-check.svg">
   </dcc-trigger>
</div>`;


})();