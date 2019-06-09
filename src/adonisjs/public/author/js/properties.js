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

      this._propertiesPanel = document.querySelector("#properties-panel");
      this.applyProperties = this.applyProperties.bind(this);
      MessageBus.ext.subscribe("properties/apply", this.applyProperties);
   }

   editKnotProperties(obj, knotId) {
      this._knotOriginalTitle = obj.title;
      this.editProperties(obj);
   }

   editElementProperties(obj) {
      if (this._knotOriginalTitle)
         delete this._knotOriginalTitle;
      this.editProperties(obj);
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
      for (let p in profile) {
         let value = (obj[p]) ? obj[p] : "";
         if (profile[p].type == "ShortStrArray")
            value = obj[p].join(",");
         html += Properties.fieldTypes[profile[p].type]
                    .replace(/\[n\]/igm, seq)
                    .replace(/\[label\]/igm, profile[p].label)
                    .replace(/\[value\]/igm, value);
         seq++;
      }
      this._propertiesPanel.innerHTML = html + Properties.buttonApply;
   }

   async applyProperties() {
      if (this._objProperties) {
         const profile = Properties.elProfiles[this._objProperties.type];
         let seq = 1;
         for (let p in profile) {
            let field = this._propertiesPanel.querySelector("#pfield" + seq);
            switch (profile[p].type) {
               case "shortStr" : 
               case "text":
                  const value = field.value.trim();
                  if (value.length > 0)
                     this._objProperties[p] = value;
                  break;
               case "shortStrArray" :
                  const catStr = field.value.trim();
                  if (catStr.length > 0) {
                     let categories = catStr.split(",");
                     for (let c in categories)
                        categories[c] = categories[c].trim();
                      this._objProperties[p] = categories;
                  }
                  break;
               case "image":
                  // uploads the image
                  if (field.files[0]) {
                     const asset = await
                        MessageBus.ext.request("data/asset//new",
                             {file: field.files[0],
                              caseid: this._author.currentCaseId});
                     this._objProperties[p] = asset.message;
                  }
                  break;
            }
            seq++;
         }
         Translator.instance.updateElementMarkdown(this._objProperties);

         if (this._knotOriginalTitle && this._author) {
            this._author.knotRename(this._knotOriginalTitle,
                                    this._objProperties.title);
            delete this._knotOriginalTitle;
         }

         delete this._objProperties;
         MessageBus.ext.publish("control/knot/update");
     }
   }
}

(function() {

Properties.elProfiles = {
knot: {title: {type: "shortStr",
               label: "title"},
       categories: {type: "shortStrArray",
                    label: "categories"},
       level: {type: "shortStr",
               label: "level"}
      },
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
shortStrArray:
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

// <TODO> xstyle is provisory due to xstyle scope problems
Properties.buttonApply =
`<div class="control-button">
   <dcc-trigger xstyle="in" action="properties/apply" label="Apply" image="icons/icon-check.svg">
   </dcc-trigger>
</div>`;


})();