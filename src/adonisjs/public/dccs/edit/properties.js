/**
 * Properties Editor
 *
 * Edits properties according to the type.
 */

class Properties {
   constructor() {
      // this._author = author;

      /*
      this._panelDetails = document.querySelector("#properties-panel");
      this._panelDetailsButtons = document.querySelector("#properties-buttons");
      */

      this.applyPropertiesDetails = this.applyPropertiesDetails.bind(this);
      MessageBus.ext.subscribe("properties/apply/details",
         this.applyPropertiesDetails);
      this.applyPropertiesShort = this.applyPropertiesShort.bind(this);
      MessageBus.ext.subscribe("properties/apply/short",
         this.applyPropertiesShort);
   }

   attachPanelDetails(panel) {
      this._panelDetails = panel;
   }

   editKnotProperties(obj, knotId) {
      this._knotOriginalTitle = obj.title;
      this.editProperties(obj);
   }

   editElementProperties(knotContent, el, element, role) {
      console.log("=== parameter element");
      console.log(element);
      let obj = knotContent[el];
      if (this._knotOriginalTitle)
         delete this._knotOriginalTitle;
      const htmlProp = this.editProperties(obj);
      // <TODO> Provisory
      const svg = ["jacinto", "simple-svg"].
         includes(Basic.service.currentThemeFamily);
      switch (obj.type) {
         case "text": 
         case "text-block":
            this._editor = new EditDCCText(knotContent, el, element, svg);
            break;
         case "entity": 
            if (role)
               switch (role) {
                  case "text":
                  case "entity": this._editor = 
                                    new EditDCCText(knotContent, el, element, svg);
                                 break;
                  case "image":  this._editor = new EditDCCImage(obj, element);
                                 break;
               }
            else
               this._editor = new EditDCCText(knotContent, el, element, svg);
            break;
         case "option":
            if (obj.image)
               this._editor = new EditDCCImage(obj, element);
            else
               this._editor = new EditDCCPlain(obj, element, htmlProp);
            break;
      }
   }

   /*
    * Structure of the editable object
    */
   editProperties(obj) {
      this._objProperties = obj;

      const profile = Properties.elProfiles[obj.type];
      let seq = 1;
      let htmlD = "";
      let htmlS = "";
      for (let p in profile) {
         if (!profile[p].composite) {
            let html = this._editSingleProperty(
               profile[p], ((obj[p]) ? obj[p] : ""), seq);
            htmlD += html.details;
            if (profile[p].visual == "panel")
               htmlS += html.short;
            seq++;
         } else {
            for (let s in profile[p].composite) {
               html = this._editSingleProperty(
                  profile[p].composite[s],
                  ((obj[p] && obj[p][s]) ? obj[p][s] : ""), seq);
               htmlD += html.details;
               if (profile[p].visual == "panel")
                  htmlS += html.short;
               seq++;
            }
         }
      }
      this._panelDetails.innerHTML = htmlD;
      // this._panelDetailsButtons.style.display = "flex";
      return htmlS;
   }

   _editSingleProperty(property, value, seq) {
      if (property.type == "shortStrArray" && value.length > 0)
         value = value.join(",");
      else if (property.type == "variable") {
         value = (value.indexOf(".") == -1)
                  ? value : value.substring(value.lastIndexOf(".")+1);
         property.type = "shortStr";
      } else if (property.type == "select" &&
                 typeof property.options === "string") {
         switch (property.options) {
            case "selectVocabulary":
               property.options = Context.instance.listSelectVocabularies();
               break;
         }
      }
      let fields = null;
      if (property.type != "select")
         fields = Properties.fieldTypes[property.type]
                            .replace(/\[label\]/igm, property.label)
                            .replace(/\[value\]/igm, value);
      else {
         fields = Properties.fieldTypes.selectOpen
                            .replace(/\[label\]/igm, property.label);
         for (let o in property.options) {
            const opvalue = (typeof property.options[o] === "string")
                            ? property.options[o] : property.options[o][0];
            const oplabel = (typeof property.options[o] === "string")
                            ? property.options[o] : property.options[o][1];
            const selected = (value == opvalue) ? " selected" : "";
            fields += Properties.fieldTypes.selectOption
                                .replace(/\[opvalue\]/igm, opvalue)
                                .replace(/\[oplabel\]/igm, oplabel)
                                .replace(/\[selected\]/igm, selected);
         }
         fields += Properties.fieldTypes.selectClose;
      }

      return {details: fields.replace(/\[n\]/igm, seq + "_d"),
              short:   fields.replace(/\[n\]/igm, seq + "_s")};
   }

   /*
   clearProperties() {
      this._panelDetails.innerHTML = "";
      this._panelDetailsButtons.style.display = "none";
   }
   */

   async applyPropertiesDetails(topic, message) {
      this._applyProperties(topic, message, true);
   }

   async applyPropertiesShort(topic, message) {
      console.log("=== apply properties short");
      console.log(topic);
      console.log(message);
      this._applyProperties(topic, message, false);
   }

   async _applyProperties(topic, message, details) {
      console.log("=== this editor");
      console.log(JSON.stringify(this._editor));
      const sufix = (details) ? "_d" : "_s";
      const panel = (details)
         ? this._panelDetails : this._editor.editorExtended;
      console.log("=== this editor extended");
      console.log(this._editor.editorExtended);
      if (this._objProperties) {
         const profile = Properties.elProfiles[this._objProperties.type];
         let seq = 1;
         for (let p in profile) {
            console.log("=== trial");
            console.log(p);
            console.log(details);
            console.log(profile[p]);
            if (!profile[p].composite) {
               if (details || profile[p].visual == "panel") {
                  const objProperty =
                     await this._applySingleProperty(profile[p], seq, panel, sufix);
                  if (objProperty != null)
                     this._objProperties[p] = objProperty;
               }
               seq++;
            } else {
               for (let s in profile[p].composite) {
                  if (details || profile[p].visual == "panel") {
                     const objProperty = await this._applySingleProperty(
                        profile[p].composite[s], seq, panel, sufix);
                     if (objProperty != null &&
                         (typeof objProperty != "string" ||
                           objProperty.trim().length > 0)) {
                        if (!this._objProperties[p])
                           this._objProperties[p] = {};
                        this._objProperties[p][s] = objProperty;
                     }
                  }
                  seq++;
               }
            }
            // console.log(this._objProperties[p]);
         }

         Translator.instance.updateElementMarkdown(this._objProperties);

         if (this._knotOriginalTitle &&
             this._knotOriginalTitle != this._objProperties.title) {
            console.log("=== rename knot");
            console.log(this._knotOriginalTitle);
            /*
            this._author.knotRename(this._knotOriginalTitle,
                                    this._objProperties.title);
            */
            MessageBus.ext.publish("control/knot/rename",
                                   this._objProperties.title);
            delete this._knotOriginalTitle;
         }

         delete this._objProperties;
         MessageBus.ext.publish("control/knot/update");
         console.log("=== response");
         console.log(MessageBus.buildResponseTopic(topic, message));
         if (!details)
            MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message));
     }
   }

   async _applySingleProperty(property, seq, panel, sufix) {
      let objProperty = null;
      console.log("=== field");
      console.log("#pfield" + seq + sufix);
      let field =
         panel.querySelector("#pfield" + seq + sufix);
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
knot: {
   title: {type: "shortStr",
           label: "Title"},
   categories: {type: "shortStrArray",
                label: "Categories"},
   level: {type: "shortStr",
               label: "Level"}
},
text: {
//   content: {type: "text",
//             label: "text"}
},
image: {
   alternative: {type: "shortStr",
                 label: "label"},
   path: {type:  "image",
          label: "image"}
},
option: {
   label: {type: "shortStr",
           label: "Label",
           visual: "inline"},
   target: {type:  "shortStr",
            label: "Target",
            visual: "panel"}
},
entity: {
   entity: {type: "shortStr",
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
   },
input: {
   subtype: {type: "select",
             options: Translator.inputSubtype,
             label: "type"},
   variable: {type: "variable",
              label: "variable"},
   vocabularies: {type: "select",
                  options: "selectVocabulary",
                  label: "vocabularies"}
}
};

Properties.fieldTypes = {
shortStr:
`<div class="styp-field-row">
   <label class="styp-field-label">[label]</label>
   <input type="text" id="pfield[n]" class="styp-field-value" size="10" value="[value]">
</div>`,
text:
`<div class="styp-field-row">
   <label class="styp-field-label">[label]</label>
   <textarea style="height:100%" id="pfield[n]" class="styp-field-value" size="10">[value]</textarea>
</div>`,
shortStrArray:
`<div class="styp-field-row">
   <label for="pfield[n]" class="styp-field-label">[label]</label>
   <textarea style="height:100%" id="pfield[n]" class="styp-field-value" size="10">[value]</textarea>
</div>`,
image:
`<div class="styd-notice styd-border-notice">
   <label class="styp-field-label std-border" for="pfield[n]">[label]</label>
   <input type="file" id="pfield[n]" name="pfield[n]" class="styd-selector styp-field-value"
          accept="image/png, image/jpeg, image/svg">
</div>`,
selectOpen:
`<div class="styp-field-row">
   <div class="styp-field-label std-border">[label]</div>
   <select id='pfield[n]'>`,
selectOption:
`    <option value="[opvalue]"[selected]>[oplabel]</option>`,
selectClose:
`  </select>
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

Properties.s = new Properties();

})();