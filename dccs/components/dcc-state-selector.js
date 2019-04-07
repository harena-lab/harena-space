/* State Selector DCC
 ********************/
class DCCStateSelector extends DCCBase {
   constructor() {
     super();
     
     this._pendingRequests = 0;
     
     this._currentState = 0;
     this._stateVisible = false;
     
     // Without shadow - not working
     /*
     const text = this.innerHTML;
     this.innerHTML = DCCStateSelector.templateElements;
     this.querySelector("#presentation-text").innerHTML = text;
     this._presentation = this.querySelector("#presentation-dcc");
     this._presentationState = this.querySelector("#presentation-state");
     */
     
     let template = document.createElement("template");
     template.innerHTML = DCCStateSelector.templateElements;
     
     this._shadow = this.attachShadow({mode: "open"});
     this._shadow.appendChild(template.content.cloneNode(true));
     
     this._presentation = this._shadow.querySelector("#presentation-dcc");
     this._presentationState = this._shadow.querySelector("#presentation-state");

     
     this._showState = this._showState.bind(this);
     this._hideState = this._hideState.bind(this);
     this._changeState = this._changeState.bind(this);
     this.defineStates = this.defineStates.bind(this);
   }
   
   createdCallback() {
     this._renderInterface();
   }

   attributeChangedCallback(name, oldValue, newValue) {
     this._renderInterface();
   }
   
   async connectedCallback() {
      // <TODO> limited: considers only one group per page
      this.completeId = this.id;  
      if (!this.hasAttribute("states") && window.messageBus.page.hasSubscriber("dcc/request/selector-states")) {
         this.context = await window.messageBus.page.request("dcc/selector-context/request", this.id, "dcc/selector-context/" + this.id);
         this.completeId = this.context.message + "." + this.id;

         window.messageBus.page.subscribe("dcc/selector-states/" + this.id, this.defineStates);
         window.messageBus.page.publish("dcc/request/selector-states", this.id);
         this._pendingRequests++;
      }
      
      this._checkRender();

      window.messageBus.ext.publish("var/" + this.completeId + "/subinput/ready",
                                    {sourceType: DCCStateSelector.elementTag,
                                     content: this.innerHTML});
   }
   
   disconnectedCallback() {
      this._presentation.removeEventListener('mouseover', this._showState);
      this._presentation.removeEventListener('mouseout', this._hideState);
      this._presentation.removeEventListener('click', this._changeState);
   }

   defineStates(topic, message) {
      window.messageBus.page.unsubscribe("dcc/selector-states/" + this.id, this.defineStates);
      this.states = message;
      this._pendingRequests--;
      this._checkRender();
   }
   
   async _checkRender() {
      if (this._pendingRequests == 0) {
         const statesArr = this.states.split(",");
         if (this.hasAttribute("answer"))
            this._currentState = statesArr.indexOf(this.answer);
         else if (this.hasAttribute("player")) {
            let value = await window.messageBus.ext.request(
                  "var/" + this.player + "/get/sub", this.innerHTML, "var/" + this.player + "/sub");
            this._currentState = statesArr.indexOf(value.message);
         } else {
            this._presentation.addEventListener("mouseover", this._showState);
            this._presentation.addEventListener("mouseout", this._hideState);
            this._presentation.addEventListener("click", this._changeState);
         }

         this._renderInterface();
      }
   }
   
   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return ["id", "states", "colors", "answer", "player"];
    }

   get id() {
      return this.getAttribute("id");
    }

   set id(newValue) {
      this.setAttribute("id", newValue);
   }

   get states() {
     return this.getAttribute("states");
   }

   set states(newStates) {
     this.setAttribute("states", newStates);
   }

   get colors() {
     return this.getAttribute("colors");
   }

   set colors(newColors) {
     this.setAttribute("colors", newColors);
   }
   
   get answer() {
      return this.getAttribute("answer");
    }

   set answer(newValue) {
      this.setAttribute("answer", newValue);
   }
   
   get player() {
      return this.getAttribute("player");
    }

   set player(newValue) {
      this.setAttribute("player", newValue);
   }
   
   /* Rendering */

   _renderInterface() {
     if (this._presentation != null) {
       if (this._presentationState != null) {
          if (this._stateVisible && this.states != null) {
             const statesArr = this.states.split(",");
             this._presentationState.innerHTML = "[" + statesArr[this._currentState] + "]";
          } else
             this._presentationState.innerHTML = "";
       }
       this._presentation.className =
          DCCStateSelector.elementTag + "-template " +
          DCCStateSelector.elementTag + "-" + this._currentState + "-template";
     }
   }
   
   /* Event handling */
   
   _showState() {
     this._stateVisible = true;
     this._renderInterface();
   }
   
   _hideState() {
     this._stateVisible = false;
     this._renderInterface();
   }
   
   _changeState() {
     if (this.states != null) {
       const statesArr = this.states.split(",");
       this._currentState = (this._currentState + 1) % statesArr.length;
       window.messageBus.ext.publish("var/" + this.completeId + "/state_changed",
             {sourceType: DCCInput.elementTag,
              state: statesArr[this._currentState]});
     }
     this._renderInterface();
   }
   
}

/* Group Selector DCC
 ********************/
class DCCGroupSelector extends DCCBase {
   constructor() {
     super();
     this.requestContext = this.requestContext.bind(this); 
     this.requestStates = this.requestStates.bind(this);
  }
   
   connectedCallback() {
      window.messageBus.page.subscribe("dcc/selector-context/request", this.requestContext);
      window.messageBus.page.subscribe("dcc/request/selector-states", this.requestStates);
      
      window.messageBus.ext.publish("var/" + this.context + "/group_input/ready",
                                    DCCGroupSelector.elementTag);
   }

   disconnectedCallback() {
      window.messageBus.page.unsubscribe("dcc/selector-context/request", this.requestContext);
      window.messageBus.page.unsubscribe("dcc/request/selector-states", this.requestStates);
   }
   
   
   requestStates(topic, message) {
      window.messageBus.page.publish("dcc/selector-states/" + message, this.states);
   }   
   
   requestContext(topic, message) {
      window.messageBus.page.publish("dcc/selector-context/" + message, this.context);
   }
   
   /*
    * Property handling
    */

   static get observedAttributes() {
    return ["context", "states", "colors"];
   }

   get context() {
      return this.getAttribute("context");
    }

   set context(newValue) {
      this.setAttribute("context", newValue);
   }

   get states() {
     return this.getAttribute("states");
   }

    set states(newStates) {
     this.setAttribute("states", newStates);
   }

   get colors() {
     return this.getAttribute("colors");
   }

    set colors(newColors) {
     this.setAttribute("colors", newColors);
   }
}

(function() {

DCCStateSelector.templateElements = 
`<style>
   @import "css/dcc-state-selector.css"
</style>
<span id="presentation-dcc">
   <span id="presentation-text"><slot></slot></span>
   <span id="presentation-state"></span>
</span>`;
  
DCCStateSelector.elementTag = "dcc-state-selector";
customElements.define(DCCStateSelector.elementTag, DCCStateSelector);

DCCGroupSelector.elementTag = "dcc-group-selector";
customElements.define(DCCGroupSelector.elementTag, DCCGroupSelector);

})();