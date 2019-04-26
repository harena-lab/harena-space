/* Image Marker DCC
 ******************/
class DCCImageMarker extends DCCBase {
   constructor() {
      super();
      
      this._pendingRequests = 0;
      
      this._currentState = 0;
      this._stateVisible = false;
      
      /*
      this._showState = this._showState.bind(this);
      this._hideState = this._hideState.bind(this);
      this._changeState = this._changeState.bind(this);
      this.defineStates = this.defineStates.bind(this);
      */
      
      this.markerSpot = this.markerSpot.bind(this);
    }
    
    async connectedCallback() {
       /*
       this._presentation.addEventListener("mouseover", this._showState);
       this._presentation.addEventListener("mouseout", this._hideState);
       this._presentation.addEventListener("click", this._changeState);
       */
       
       // <TODO> limited: considers only one group per page
       /*
       this.completeId = this.id;  
       if (!this.hasAttribute("states") && window.messageBus.page.hasSubscriber("dcc/marker-states/request")) {
          this.context = await window.messageBus.page.request("dcc/marker-context/request", this.id, "dcc/marker-context/" + this.id);
          this.completeId = this.context.message + "." + this.id;

          window.messageBus.page.subscribe("dcc/marker-states/" + this.id, this.defineStates);
          window.messageBus.page.publish("dcc/marker-states/request", this.id);
          this._pendingRequests++;
       }
       
       this._checkRender();

       window.messageBus.ext.publish("var/" + this.completeId + "/subinput/ready",
                                     {sourceType: DCCStateSelector.elementTag,
                                      content: this.innerHTML});
                                      */
       
       this._renderInterface();
    }
    
    /*
    disconnectedCallback() {
       this._presentation.removeEventListener('mouseover', this._showState);
       this._presentation.removeEventListener('mouseout', this._hideState);
       this._presentation.removeEventListener('click', this._changeState);
    }

    defineStates(topic, message) {
       window.messageBus.page.unsubscribe("dcc/marker-states/" + this.id, this.defineStates);
       this.states = message;
       this._pendingRequests--;
       this._checkRender();
    }
    
    _checkRender() {
       if (this._pendingRequests == 0)
          this._renderInterface();
    }
    */
    
    /*
     * Property handling
     */
    
    static get observedAttributes() {
       return ["id", "label", "states", "colors"];
     }

    get id() {
       return this.getAttribute("id");
     }

    set id(newValue) {
       this.setAttribute("id", newValue);
    }

    get label() {
       return this.getAttribute("label");
     }

    set label(newValue) {
       this.setAttribute("label", newValue);
    }

    get coords() {
       return this.getAttribute("coords");
     }

    set coords(newValue) {
       this.setAttribute("coords", newValue);
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
    
    /* Rendering */

    _renderInterface() {
       window.messageBus.page.publish("dcc/marker-spot/set",
             {label: this.label, 
              coords: this.coords,
              handler: this.markerSpot});
       /*
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
      */
    }
    
    /* Event handling */
       
    markerSpot() {
       console.log("***** Spot *****");
    }
    
    /*
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
    */
}

/* Group Marker DCC
 ******************/
class DCCGroupMarker extends DCCBase {
   constructor() {
     super();
     this.requestContext = this.requestContext.bind(this); 
     this.requestStates = this.requestStates.bind(this);
     this.setMarkerSpot = this.setMarkerSpot.bind(this);
   }
   
   connectedCallback() {
      const templateHTML = DCCGroupMarker.templateElements.replace("[image]", this.image);

      // building the template
      let template = document.createElement("template");
      template.innerHTML = templateHTML;
      let shadow = this.attachShadow({mode: "open"});
      shadow.appendChild(template.content.cloneNode(true));
      
      this._imageG = shadow.querySelector("#imageG");
      
      /*
      this._image = shadow.querySelector("#image-src");
      this._imageMap = shadow.querySelector("#image-map");
      this._imageCanvas = shadow.querySelector("#image-canvas");
      this._canvas = this._imageCanvas.getContext("2d")
      */

      /*
      console.log("image width: " + this._image.clientWidth);
      console.log("image height: " + this._image.clientHeight);
      console.log("canvas width: " + this._imageCanvas.width);
      console.log("canvas height: " + this._imageCanvas.height);
      
      this._propX = this._image.clientWidth / this._imageCanvas.width;
      this._propY = this._image.clientHeight / this._imageCanvas.height;
      */
      
      window.messageBus.page.subscribe("dcc/marker-context/request", this.requestContext);
      window.messageBus.page.subscribe("dcc/marker-states/request", this.requestStates);
      window.messageBus.page.subscribe("dcc/marker-spot/set", this.setMarkerSpot);
      
      window.messageBus.ext.publish("var/" + this.context + "/group_input/ready",
            DCCGroupSelector.elementTag);
   }

   disconnectedCallback() {
      window.messageBus.page.unsubscribe("dcc/marker-context/request", this.requestContext);
      window.messageBus.page.unsubscribe("dcc/marker-states/request", this.requestStates);
      window.messageBus.page.unsubscribe("dcc/marker-spot/set", this.setMarkerSpot);
   }
   
   
   requestStates(topic, message) {
      window.messageBus.page.publish("dcc/marker-states/" + message, this.states);
   }   
   
   requestContext(topic, message) {
      window.messageBus.page.publish("dcc/marker-context/" + message, this.context);
   }
   
   /*
    * Property handling
    */

   static get observedAttributes() {
    return ["image", "context", "states", "colors"];
   }

   get image() {
      return this.getAttribute("image");
    }

   set image(newValue) {
      this.setAttribute("image", newValue);
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
   
   /* Event handling */
   setMarkerSpot(topic, message) {
      let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      let coordsArr = message.coords.split(",");
      let x1 = parseInt(coordsArr[0]),
          y1 = parseInt(coordsArr[1]),
          x2 = parseInt(coordsArr[2]),
          y2 = parseInt(coordsArr[3]);
      rect.setAttributeNS(null, 'x', x1);
      rect.setAttributeNS(null, 'y', y1);
      rect.setAttributeNS(null, 'width', x2-x1);
      rect.setAttributeNS(null, 'height', y2-y1);
      rect.addEventListener("mouseover", message.handler);
      this._imageG.appendChild(rect);

      /*
      let area = document.createElement("area");
      area.alt = message.label;
      area.title = message.label;
      area.coords = message.coords;
      area.shape = "rect";
      area.addEventListener("mouseover", message.handler);
      this._imageMap.appendChild(area);
      
      console.log(area.coords);
      
      let coordsArr = message.coords.split(",");
      let x1 = parseInt(coordsArr[0]),
          y1 = parseInt(coordsArr[1]),
          x2 = parseInt(coordsArr[2]),
          y2 = parseInt(coordsArr[3]);
      this._canvas.rect(x1, y1, x2-x1, y2-y1);
      this._canvas.stroke();
      */
   }
}

(function() {

DCCImageMarker.elementTag = "dcc-image-marker";
customElements.define(DCCImageMarker.elementTag, DCCImageMarker);

DCCGroupMarker.templateElements =
  `<svg width="1600" height="1000">
   <g id="imageG">
    <image
       y="0"
       x="0"
       id="image4598"
       xlink:href="[image]"
       preserveAspectRatio="xMidYMid"
       height="1000"
       width="1600" />
    <rect
       id="rect10"
       width="1600"
       height="1000"
       x="0"
       y="0"
       style="opacity:0.08399999;fill:#0000ff;stroke-width:0.89027536" />
  </g>
  </svg>`;

/*
DCCGroupMarker.templateElements =
  `<style>
      .outsideWrapper{ 
          position: absolute;
          width:100%; top:0px; bottom:0px; 
          margin:20px 60px; 
          border:1px solid blue;}
      .insideWrapper{ 
          width:100%; height:100%; 
          position:relative;}
      .coveredImage{ 
          width:100%; height:100%; 
          position:absolute; top:0px; left:0px;
      }
      .coveringCanvas{ 
          width:100%; height:100%; 
          position:absolute; top:0px; left:0px;
          background-color: rgba(255,0,0,.1);
      }
   </style>
   <div class="outsideWrapper">
    <div class="insideWrapper">
        <img id="image-src" class="coveredImage" src="[image]" usemap="#imagemap">
        <canvas id="image-canvas" class="coveringCanvas"></canvas>
    </div>
   </div>
   <map id="image-map" name="imagemap" class="image-spot"></map>`;
*/

DCCGroupMarker.elementTag = "dcc-group-marker";
customElements.define(DCCGroupMarker.elementTag, DCCGroupMarker);

// <canvas id="image-canvas" class="coveringCanvas"></canvas>

})();