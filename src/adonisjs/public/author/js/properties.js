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
      this._propertiesButtons = document.querySelector("#properties-buttons");

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
         if (!profile[p].composite) {
            html += this._editSingleProperty(
               profile[p], ((obj[p]) ? obj[p] : ""), seq);
            seq++;
         } else {
            for (let s in profile[p].composite) {
               html += this._editSingleProperty(
                  profile[p].composite[s], ((obj[p] && obj[p][s]) ? obj[p][s] : ""), seq);
               seq++;
            }
         }
      }
      this._propertiesPanel.innerHTML = html;
      this._propertiesButtons.style.display = "flex";
   }

   _editSingleProperty(property, value, seq) {
      if (property.type == "ShortStrArray")
         value = value.join(",");
      return Properties.fieldTypes[property.type]
                 .replace(/\[n\]/igm, seq)
                 .replace(/\[label\]/igm, property.label)
                 .replace(/\[value\]/igm, value);
      /*
      let value = (obj[p]) ? obj[p] : "";
      if (profile[p].type == "ShortStrArray")
         value = obj[p].join(",");
      html += Properties.fieldTypes[profile[p].type]
                 .replace(/\[n\]/igm, seq)
                 .replace(/\[label\]/igm, profile[p].label)
                 .replace(/\[value\]/igm, value);
      */
   }

   clearProperties() {
      this._propertiesPanel.innerHTML = "";
      this._propertiesButtons.style.display = "none";
   }

   async applyProperties() {
      if (this._objProperties) {
         const profile = Properties.elProfiles[this._objProperties.type];
         let seq = 1;
         for (let p in profile) {
            if (!profile[p].composite) {
               const objProperty = await this._applySingleProperty(profile[p], seq);
               if (objProperty != null)
                  this._objProperties[p] = objProperty;
               seq++;
            } else {
               for (let s in profile[p].composite) {
                  const objProperty =
                     await this._applySingleProperty(profile[p].composite[s], seq);
                  if (objProperty != null &&
                      (typeof objProperty != "string" || objProperty.trim().length > 0)) {
                     if (!this._objProperties[p])
                        this._objProperties[p] = {};
                     this._objProperties[p][s] = objProperty;
                  }
                  seq++;
               }
            }
            console.log(this._objProperties[p]);
           /*
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
                              caseid: Basic.service.currentCaseId});
                     this._objProperties[p] = asset.message;
                  }
                  break;
            }
            seq++;
            */
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

   async _applySingleProperty(property, seq) {
      let objProperty = null;
      let field = this._propertiesPanel.querySelector("#pfield" + seq);
      switch (property.type) {
         case "shortStr" :
         case "text":
            const value = field.value.trim();
            if (value.length > 0)
               objProperty = value;
            break;
         case "shortStrArray" :
            const catStr = field.value.trim();
            if (catStr.length > 0) {
               let categories = catStr.split(",");
               for (let c in categories)
                  categories[c] = categories[c].trim();
               objProperty = categories;
            }
            break;
         case "image":
            // uploads the image
            if (field.files[0]) {
               const asset = await
                  MessageBus.ext.request("data/asset//new",
                       {file: field.files[0],
                        caseid: Basic.service.currentCaseId});
               objProperty = asset.message;
            }
            break;
      }
      return objProperty;
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
        },
talk: {character: {type: "shortStr",
                   label: "entity"},
       image: {
          composite: {
             alternative: {type: "shortStr",
                            label: "alternative"},
             path: {type:  "image",
                    label: "image"}
          }
       },
       speech: {type: "text",
                 label: "text"}
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
/*
Properties.buttonApply =
`<div class="control-button">
   <dcc-trigger xstyle="in" action="properties/apply" label="Apply" image="icons/icon-check.svg">
   </dcc-trigger>
</div>`;
*/

})();