/* Notice Input DCC
  *****************/
class DCCNoticeInput extends DCCBase {
   constructor(text, input, itype, button, buttonb) {
      super();

      if (text)
        this.text = text;
      if (input)
        this.input = input;
      if (itype)
        this.itype = itype;
      if (button)
        this.button = button;
      if (buttonb)
        this.buttonb = buttonb;
   }
   
   connectedCallback() {
      let templateHTML = 
         `<style>
            .dsty-border-notice {
               border-radius: 1px;
               box-shadow: 0px 0px 0px 20px rgba(0,0,0,0.5);
               margin: 15px;
            }
            .dsty-border {
               border: 1px solid black;
               border-radius: 5px;
               margin: 5px;
            }
            .dsty-notice {
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
               flex-direction: column;
            }
            .dsty-text {
               flex: 100px;
               min-height: 50px;
               max-height: 300px;
            }
            .dsty-input {
               flex: 50px;
               min-height: 30px;
               max-height: 50px;
            }
            .dsty-submit-button {
               background-color: #383f4f;
               color: #e0e9ce;
               padding: 14px 25px;
               text-align: center;
               text-decoration: none;
               display: inline-block;
            }
            .dsty-submit-button:hover {
               color: white;
               cursor: pointer;
            }
       </style>
       <div id="presentation-dcc" class="dsty-notice dsty-border-notice">
          <div id="text" class="dsty-text dsty-border">[text]</div>
          <input id="input" class="dsty-input dsty-border"[display-input][itype]></input>
          <div id="submit-button-a" class="dsty-submit-button">[button-a]</div>
          <div id="submit-button-b" class="dsty-submit-button"[display-buttonb]>[button-b]</div>
       </div>`;
      
      const dialogSize = {
         width: 400,
         height: 250
      };
      
      if (!this.hasAttribute("button"))
         this.button = (this.hasAttribute("input")) ? "Submit" : "Ok";
      const labelButtonB = (this.hasAttribute("buttonb")) ? this.buttonb : "";
      
      const displayInput = (this.hasAttribute("input")) ? "" : " style='display:none'";
      const displayButtonB = (this.hasAttribute("buttonb")) ? "" : " style='display:none'";

      const displayType = (this.hasAttribute("itype")) ? " type='" + this.itype + "'" : "";

      // building the template
      const template = document.createElement("template");
      template.innerHTML = templateHTML
                              .replace("[width]", dialogSize.width)
                              .replace("[height]", dialogSize.height)
                              .replace("[text]", this.text)
                              .replace("[display-input]", displayInput)
                              .replace("[display-buttonb]", displayButtonB)
                              .replace("[button-a]", this.button)
                              .replace("[button-b]", labelButtonB)
                              .replace("[itype]", displayType);
      this._shadow = this.attachShadow({mode: "open"});
      this._shadow.appendChild(template.content.cloneNode(true));
      
      this._inputField = this._shadow.querySelector("#input");
      
      this._submitButtonA = this._shadow.querySelector("#submit-button-a");
      this._submitButtonB = this._shadow.querySelector("#submit-button-b");
   }
   
   /* Properties
    **********/
    
    static get observedAttributes() {
       return ["text", "input", "button", "buttonb", "itype"];
    }
   
    get text() {
       return this.getAttribute("text");
    }
    
    set text(newValue) {
       this.setAttribute("text", newValue);
       if (this._shadow != null)
          this._shadow.querySelector("#text").innerHTML = newValue;
    }

    get input() {
       return this.getAttribute("input");
    }
    
    set input(newValue) {
       this.setAttribute("input", newValue);
    }

    get button() {
       return this.getAttribute("button");
    }
    
    set button(newValue) {
       this.setAttribute("button", newValue);
    }

    get buttonb() {
       return this.getAttribute("buttonb");
    }
    
    set buttonb(newValue) {
       this.setAttribute("buttonb", newValue);
    }

    get itype() {
       return this.getAttribute("itype");
    }
    
    set itype(newValue) {
       this.setAttribute("itype", newValue);
       if (this._inputField != null)
          this._inputField.setAttribute("type", newValue);
    }

    async presentNotice() {
       document.body.appendChild(this);

       let promise = new Promise((resolve, reject) => {
          const callback = function(button) { resolve(button); };
          this._submitButtonA.onclick = function(e) {
             callback(this.button);
          };
          this._submitButtonB.onclick = function(e) {
             callback(this.buttonb);
          };
       });

       const buttonClicked = await promise;
       document.body.removeChild(this);

       return (this.hasAttribute("input"))
                 ? this._inputField.value
                 : buttonClicked;
   }

   /*
   _notifyA() {
      MessageBus.ext.publish("var/" + this.input + "/set",
                                    {sourceType: DCCNoticeInput.elementTag,
                                     input: this._inputField.value});
   }

   _notifyB() {
      MessageBus.ext.publish("var/" + this.input + "/set",
                                    {sourceType: DCCNoticeInput.elementTag,
                                     input: this._inputField.value});
   }
   */

   static async displayNotice(text, input, itype, button, buttonb) {
      const noticeDialog = new DCCNoticeInput(text, input, itype, button, buttonb);
      const value = await noticeDialog.presentNotice();
      return value;
   }
}

(function() {
   DCCNoticeInput.editableCode = false;
   DCCNoticeInput.elementTag = "dcc-notice-input";
   DCCNoticeInput.dialogCount = 1;
   customElements.define(DCCNoticeInput.elementTag, DCCNoticeInput);
})();