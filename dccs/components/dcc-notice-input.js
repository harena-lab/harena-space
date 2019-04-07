/* Notice Input DCC
  *****************/
class DCCNoticeInput extends DCCBase {
   constructor() {
      super();
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
          <input id="input" class="dsty-input dsty-border"[display]></input>
          <div id="submit-button" class="dsty-submit-button">[button]</div>
       </div>`;
      
      const dialogSize = {
         width: 400,
         height: 250
      };
      
      if (!this.hasAttribute("button"))
         this.button = (this.hasAttribute("input")) ? "Submit" : "Ok";
      
      const displayInput = (this.hasAttribute("input")) ? "" : " style='display:none'";

      // building the template
      const template = document.createElement("template");
      template.innerHTML = templateHTML
                              .replace("[width]", dialogSize.width)
                              .replace("[height]", dialogSize.height)
                              .replace("[text]", this.text)
                              .replace("[display", displayInput)
                              .replace("[button]", this.button);
      this._shadow = this.attachShadow({mode: "open"});
      this._shadow.appendChild(template.content.cloneNode(true));
      
      this._inputField = this._shadow.querySelector("#input");
      
      const submitButton = this._shadow.querySelector("#submit-button");
      this._notify = this._notify.bind(this);
      submitButton.addEventListener("click", this._notify);
   }
   
   /* Properties
    **********/
    
    static get observedAttributes() {
       return ["text", "input", "button"];
    }
   
    get text() {
       return this.getAttribute("text");
    }
    
    set text(newValue) {
       this.setAttribute("text", newValue);
       if (this._shadow != null) {
          this._shadow.querySelector("#text").innerHTML = newValue;
       }
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

   _notify() {
      window.messageBus.ext.publish("var/" + this.input + "/set",
                                    {sourceType: DCCNoticeInput.elementTag,
                                     input: this._inputField.value});
   }
}

(function() {
   DCCNoticeInput.editableCode = false;
   DCCNoticeInput.elementTag = "dcc-notice-input";
   customElements.define(DCCNoticeInput.elementTag, DCCNoticeInput);
})();