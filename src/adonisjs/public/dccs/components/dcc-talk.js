/**
 * Talk DCC
 * 
 * xstyle = out -> in the outer space it first looks for the specific name and then for the generic "character" name
 */
class DCCTalk extends DCCBlock {
   constructor() {
      super();
      this._renderInterface = this._renderInterface.bind(this);
   }
   
   async connectedCallback() {
      this._speech = (this.hasAttribute("speech")) ? this.speech : this.innerHTML;
      this.innerHTML = "";

      super.connectedCallback();

      /*
      if (MessageBus.page.hasSubscriber("dcc/request/talk-sequence")) {
         let sequencem = await MessageBus.page.request("dcc/request/talk-sequence");
         this.sequence = sequencem.message;
      }
      
      if (!this.hasAttribute("xstyle") && MessageBus.page.hasSubscriber("dcc/request/xstyle")) {
         let stylem = await MessageBus.page.request("dcc/request/xstyle");
         this.xstyle = stylem.message;
      }

      if (document.readyState === "complete")
         this._renderInterface();
      else
         window.addEventListener("load", this._renderInterface);
      */
   }
   
   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return DCCVisual.observedAttributes.concat(
         ["sequence", "character", "speech", "xstyle"]);
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
   
   async _renderInterface() {
      if (this.hasAttribute("xstyle") && this.xstyle.startsWith("out")) {
         await this._applyRender(this.character,
                                 (this.xstyle == "out-image") ? "title" : "innerHTML",
                                 "");
         /*
         let character = this._injectTalkElement("#talk-character");
         if (character != null)
            character.innerHTML = this.character;
         */
            
         if (this.image)
            await this._applyRender(this.image, "image", "-image");
         // <TODO> works for SVG but not for HTML
         /*
         let image = this._injectTalkElement("#talk-image");
         if (image != null)
            image.setAttributeNS("http://www.w3.org/1999/xlink", "href",
                  "images/" + this.character.replace(/ /igm, "_").toLowerCase() + ".png");
         */
         
         if (this._speech)
            await this._applyRender(this._speech,
                                    (this.xstyle == "out-image") ? "title" : "innerHTML",
                                    "-text");
         /*
         this._presentation = this._injectTalkElement("#talk-speech");
         if (this._presentation != null)
            this._presentation.innerHTML = (this._speech) ? this._speech : "";
         */
      } else {
         let html = (this.hasAttribute("image"))
            ? DCCTalk.templateElements.image.replace("[image]", this.image) : "";
         html = html.replace("[alternative]",
            (this.hasAttribute("title")) ? " alt='" + this.title + "'" : "");
         html += DCCTalk.templateElements.text
            .replace("[character]", this.character)
            .replace("[speech]", ((this._speech) ? this._speech : ""));
         await this._applyRender(html, "innerHTML");
         /*
         let charImg = "images/" + this.character.toLowerCase()
                        .replace(/ /igm, "_") + ".png";
         let template = document.createElement("template");
         
         // const speech = (this.hasAttribute("speech")) ? this.speech : "";
         template.innerHTML = DCCTalk.templateElements
            .replace("[image]",charImg)
            .replace("[character]", this.character)
            .replace("[speech]", ((this._speech) ? this._speech : ""));
         this._shadow = this.attachShadow({mode: "open"});
         this._shadow.appendChild(template.content.cloneNode(true));
         this._presentation = this._shadow.querySelector("#presentation-dcc");
         */
      }
   }
   
   /*
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
   */

   /* Rendering */

   elementTag() {
      return DCCTalk.elementTag;
   }

   externalLocationType() {
      return "role";
   }
}

/*
 * <TODO> Its task was absorbed by dcc-styler.
 */
/*
class DCCDialog extends DCCBase {
   constructor() {
      super();
      this._sequence = 0;
      this.requestSequence = this.requestSequence.bind(this);
   }

   connectedCallback() {
      MessageBus.page.subscribe("dcc/request/talk-sequence", this.requestSequence);
   }

   disconnectedCallback() {
      MessageBus.page.unsubscribe("dcc/request/talk-sequence", this.requestSequence);
   }

   requestSequence(topic, message) {
      this._sequence++;
      // MessageBus.page.publish("dcc/talk-sequence/" + message, this._sequence);
      MessageBus.page.publish(MessageBus.buildResponseTopic(topic, message),
                              this._sequence);
   }
}
*/

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
         
   DCCTalk.templateElements = {
      image: "<div><img id='dcc-talk-character' src='[image]'[alternative] width='100px'></div>",
      text:  "<div><div id='dcc-talk-text' class='dcc-speech'>[speech]</div></div>"
   };
   
   // DCCDialog.editableCode = false;
   // customElements.define("dcc-dialog", DCCDialog);
   // DCCTalk.editableCode = false;

   DCCTalk.elementTag = "dcc-talk";
   customElements.define(DCCTalk.elementTag, DCCTalk);
})();