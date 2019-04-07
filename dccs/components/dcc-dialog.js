/**
 * Talk DCC
 * 
 * xstyle = out -> in the outer space it first looks for the specific name and then for the generic "character" name
 */
class DCCTalk extends DCCBase {
   constructor() {
      super();
      
      this._pendingRequests = 0;
      
      this.defineSequence = this.defineSequence.bind(this);
      this.defineXstyle = this.defineXstyle.bind(this);
      this._renderInterface = this._renderInterface.bind(this);
   }
   
   connectedCallback() {
      if (window.messageBus.page.hasSubscriber("dcc/request/talk-sequence")) {
         window.messageBus.page.subscribe("dcc/talk-sequence/" + this.id, this.defineSequence);
         window.messageBus.page.publish("dcc/request/talk-sequence", this.id);
         this._pendingRequests++;
      }
      if (!this.hasAttribute("xstyle") && window.messageBus.page.hasSubscriber("dcc/request/xstyle")) {
         window.messageBus.page.subscribe("dcc/xstyle/" + this.id, this.defineXstyle);
         window.messageBus.page.publish("dcc/request/xstyle", this.id);
         this._pendingRequests++;
      }
      this._checkRender();
   }
   
   defineSequence(topic, message) {
      window.messageBus.page.unsubscribe("dcc/talk-sequence/" + this.id, this.defineSequence);
      this.sequence = message;
      this._pendingRequests--;
      this._checkRender();
   }
   
   defineXstyle(topic, message) {
      window.messageBus.page.unsubscribe("dcc/xstyle/" + this.id, this.defineXstyle);
      this.xstyle = message;
      this._pendingRequests--;
      this._checkRender();
   }

   _checkRender() {
      if (this._pendingRequests == 0) {
         if (document.readyState === "complete")
            this._renderInterface();
         else
            window.addEventListener("load", this._renderInterface);
      }
   }
   
   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return ["sequence", "character", "speech", "xstyle"];
   }

   get sequence() {
      return this.getAttribute("sequence");
   }
   
   set sequence(newValue) {
      this.setAttribute("sequence", newValue);
   }
   
   get character() {
      return this.getAttribute("character");
   }
   
   set character(newValue) {
      this.setAttribute("character", newValue);
   }
   
   get speech() {
      return this.getAttribute("speech");
   }
   
   set speech(newValue) {
      this.setAttribute("speech", newValue);
   }
   
   get xstyle() {
      return this.getAttribute("xstyle");
   }
   
   set xstyle(newValue) {
      this.setAttribute("xstyle", newValue);
   }
  
   /* Rendering */
   
   _renderInterface() {
      if (this.hasAttribute("xstyle") && this.xstyle == "out") {
         let character = this._injectTalkElement("#talk-character");
         if (character != null)
            character.innerHTML = this.character;
            
         // <TODO> works for SVG but not for HTML
         let image = this._injectTalkElement("#talk-image");
         if (image != null)
            image.setAttributeNS("http://www.w3.org/1999/xlink", "href",
                  "images/" + this.character.replace(/ /igm, "_").toLowerCase() + ".png");
         
         if (this.hasAttribute("speech")) {
            let speech = this._injectTalkElement("#talk-speech");
            if (speech != null)
              speech.innerHTML = this.speech;
         }
      } else {
         let charImg = "images/" + this.character.toLowerCase()
                        .replace(/ /igm, "_") + ".png";
         let template = document.createElement("template");
         
         const speech = (this.hasAttribute("speech")) ? this.speech : "";
         template.innerHTML = DCCTalk.templateElements.replace("[image]",charImg)
                                                      .replace("[character]", this.character)
                                                      .replace("[speech]", speech);
         this._shadow = this.attachShadow({mode: "open"});
         this._shadow.appendChild(template.content.cloneNode(true));
         this._presentation = this._shadow.querySelector("#presentation-dcc");
      }
   }
   
   _injectTalkElement(prefix) {
      const charLabel = this.character.replace(/ /igm, "_").toLowerCase();
      
      // search sequence: by name, by number, generic
      let target = document.querySelector(prefix + "-" + charLabel);
      if (target == null && this.hasAttribute("sequence"))
         target = document.querySelector(prefix + "-" + this.sequence);
      if (target == null)
         target = document.querySelector(prefix);
      
      return target;
   }
}

class DCCDialog extends DCCBase {
   constructor() {
      super();
      this._sequence = 0;
      this.requestSequence = this.requestSequence.bind(this);
   }

   connectedCallback() {
      window.messageBus.page.subscribe("dcc/request/talk-sequence", this.requestSequence);
   }

   disconnectedCallback() {
      window.messageBus.page.unsubscribe("dcc/request/talk-sequence", this.requestSequence);
   }

   requestSequence(topic, message) {
      this._sequence++;
      window.messageBus.page.publish("dcc/talk-sequence/" + message, this._sequence);
   }
}

(function() {
   DCCTalk.templateStyle = 
      `<style>
           @media (orientation: landscape) {
             .dcc-talk-style {
               display: flex;
               flex-direction: row;
             }
           }
           
           @media (orientation: portrait) {
             .dcc-talk-style {
               display: flex;
               flex-direction: column;
             }
           }
         .dcc-character {
             flex-basis: 100px;
          }
          .dcc-speech {
             flex-basis: 100%;
          }
      </style>
      <div id="presentation-dcc" class="dcc-talk-style"></div>
      </div>`;
         
   DCCTalk.templateElements =
   `<div><img id='dcc-talk-character' src='[image]' title='[character]' width='100px'></div>
    <div><div id='dcc-talk-text' class='dcc-speech'>[speech]</div></div>`;
   
   DCCDialog.editableCode = false;
   customElements.define("dcc-dialog", DCCDialog);
   DCCTalk.editableCode = false;
   customElements.define("dcc-talk", DCCTalk);
})();