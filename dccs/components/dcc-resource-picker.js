/* Resource Selector DCC
  *******************/
class DCCResourcePicker extends DCCBase {
   constructor() {
      super();
      
      this._selectList = null;
      this._listWeb = null;
   }
   
   connectedCallback() {
      if (this.resource == null)
         this.resource = "resource";

      let templateHTML = 
         `<style>
            .dsty-border-selector {
               border-radius: 1px;
               box-shadow: 0px 0px 0px 20px rgba(0,0,0,0.5);
               margin: 15px;
            }
            .dsty-border {
               border: 1px solid black;
               border-radius: 5px;
               margin: 5px;
            }
            .dsty-selector {
               position: absolute;
               margin: auto;
               top: 0;
               right: 0;
               bottom: 0;
               left: 0;
               width: [width]px;
               height: [height]px;
               overflow: hidden;
               display: flex;
               background: white;
            }
            @media (orientation: landscape) {
               .dsty-selector {
                  flex-direction: row;
               }
            }
            @media (orientation: portrait) {
               .dsty-selector {
                  flex-direction: column;
               }
            }
            .dsty-selection-block {
               flex: 200px;
               max-height: 300px;
               display: flex;
               flex-direction: column;
            }
            .dsty-resource-list {
               flex: 50%;
            }
            .dsty-select-button {
               background-color: #383f4f;
               color: #e0e9ce;
               padding: 14px 25px;
               text-align: center;
               text-decoration: none;
               display: inline-block;
            }
            .dsty-select-button:hover {
               color: white;
               cursor: pointer;
            }
            .dsty-resource-preview {
               flex: 200px;
            }
            .dsty-resource {
               object-fit: contain;
               max-width: 100%;
               max-height: 100%;
            }
       </style>
       <div id="presentation-dcc" class="dsty-selector dsty-border-selector">
          <div class="dsty-selection-block">
             <select id="resource-list" size="10" class="dsty-resource-list dsty-border">
             </select>
             <div id="select-button" class="dsty-select-button">Select</div>
          </div>
          <div id="resource-preview" class="dsty-resource-preview dsty-border">
          </div>
       </div>`;
      
      const dialogSize = {
         width: 400,
         height: 300
      };
      
      // const dialogPos = Utils.tools.centralize(dialogSize.width, dialogSize.height); 
     
      /*
      let screen = {
         left: (window.screenLeft != undefined) ? window.screenLeft : window.screenX,
         top: (window.screenTop != undefined) ? window.screenTop : window.screenY,
         width: (window.innerWidth)
                   ? window.innerWidth
                   : (document.documentElement.clientWidth)
                      ? document.documentElement.clientWidth
                      : screen.width,
         height: (window.innerHeight)
                    ? window.innerHeight
                    : (document.documentElement.clientHeight)
                       ? document.documentElement.clientHeight
                       : screen.height
      };

      let systemZoom = screen.width / window.screen.availWidth;
      
      dialog.left = ((screen.width - dialog.width) / 2) / systemZoom + screen.left;
      dialog.top = ((screen.height - dialog.height) / 2) / systemZoom + screen.top;
      */
      
      // building the template
      const template = document.createElement("template");
      template.innerHTML = templateHTML
                              .replace("[width]", dialogSize.width)
                              .replace("[height]", dialogSize.height);
      let shadow = this.attachShadow({mode: "open"});
      shadow.appendChild(template.content.cloneNode(true));
      
      this._resourcePreview = shadow.querySelector("#resource-preview");
      
      let selectButton = shadow.querySelector("#select-button");
      this._notify = this._notify.bind(this);
      selectButton.addEventListener("click", this._notify);
      
      this._updatePreview = this._updatePreview.bind(this);
      this._listWeb = shadow.querySelector("#resource-list");
      this._showSelectList();
   }
   
   /* Properties
    **********/
    
    static get observedAttributes() {
       return ["preview", "resource"];
    }
   
    get preview() {
       let returnValue = this.hasAttribute("preview") && this.getAttribute("preview") != false;
       return returnValue;
    }
    
    set resource(newValue) {
       this.setAttribute("resource", newValue);
    }
    
    get resource() {
       return this.getAttribute("resource");
    }
    
    set preview(newValue) {
       this.setAttribute("preview", newValue);
    }

    addSelectList(selectList) {
      this._selectList = selectList;
      if (this._listWeb != null)
         this._showSelectList();
   }
   
   _showSelectList() {
      if (this._selectList != null) {
         // let imageFiles = DCCSystem.getImageFiles();
         let options = "";
         let selected = "' selected>";
         for (var sl in this._selectList) {
            options += "<option value='" + sl + selected +
                       sl + "</option>";
            selected = "'>";
         }
         this._listWeb.innerHTML = options;
         this._listWeb.addEventListener("change", this._updatePreview);
      }
      this._updatePreview();
   }
   
   _updatePreview() {
      if (this._selectList != null && this._listWeb != null)
         this._resourcePreview.innerHTML = "<img src='" + this._selectList[this._listWeb.value] + "' class='dsty-resource'>"; 
   }
   
   _notify() {
      window.messageBus.ext.publish("control/" + this.resource + "/selected",
                                    {sourceType: DCCResourcePicker.elementTag,
                                     selected: this._listWeb.value});
   }
}

(function() {
   DCCResourcePicker.editableCode = false;
   DCCResourcePicker.elementTag = "dcc-resource-picker";
   customElements.define(DCCResourcePicker.elementTag, DCCResourcePicker);
})();