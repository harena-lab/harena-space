/* Expression DCC
 ****************/
class DCCExpression extends DCCVisual {
   constructor() {
     super();
   }
   
   async connectedCallback() {
      // <TODO> provisory solution due to message ordering
      this._updated = false;

      // <TODO> provisory - replace by a stronger expression representation
      this._variable = this.expression;
      if (this._variable.indexOf("[") > 0) {
         this._index = parseInt(
            this._variable.substring(this._variable.indexOf("[") + 1,
                                     this._variable.indexOf("]")));
         this._variable = this._variable.substring(0, this._variable.indexOf("["));
      }

      if (this.active) {
         this.variableUpdated = this.variableUpdated.bind(this);
         MessageBus.ext.subscribe(
            "var/" + this._variable + "/set", this.variableUpdated);

         // <TODO> provisory - overlaps with htracker.js and state.js
         //                    also monitors all messages
         this.stateChanged = this.stateChanged.bind(this);
         MessageBus.ext.subscribe("var/+/state_changed", this.stateChanged);
         this._stateValues = {};
      }

      DCCExpression.expressionCompile(this.expression);

      let result = await MessageBus.ext.request("var/" + this._variable + "/get");
      console.log("=== result field");
      console.log(result.message);
      if (result.message == null)
         result = ""
      else {
         if (this._index == null) {
            // <TODO> provisory unfold
            if (typeof result.message === "object") {
               let values = [];
               for (let v in result.message)
                  if (result.message[v].state == "+")
                     values.push(result.message[v].content)
               result = this._valuesToHTML(values);
            } else
               result = result.message;
         } else
            result = result.message[this._index-1];
      }

      // <TODO> provisory solution due to message ordering
      if (!this._updated)
        this.innerHTML = result;
      this._presentation = this;
      this._presentationIsReady();

      super.connectedCallback();
   }

   static expressionCompile(expression) {
      console.log("=== expression");
      console.log(expression);
      let compiled = [];
      let stack = [];
      let mdfocus = expression;
      let matchStart;
      do {
         matchStart = -1;
         let selected = "";
         for (let el in DCCExpression.element) {
            let pos = mdfocus.search(DCCExpression.element[el]);
            if (pos > -1 && (matchStart == -1 || pos < matchStart)) {
               selected = el;
               matchStart = pos;
            }
         }
         if (matchStart > -1) {
            let matchContent = mdfocus.match(DCCExpression.element[selected])[0];
            console.log("=== " + selected + ": " + matchContent);

            /*
            1 - number
            2 - arithmetic
            3 - variable
            4 - function
            */
            switch (selected) {
               case "number":
                  compiled.push([1, parseInt(matchContent)]);
                  break;
               case "arithmetic":
                  const pri = DCCExpression.precedence[matchContent];
                  while (stack.length > 0 && pri <= stack[stack.length-1][1])
                     compiled.push([2, stack.pop()[0]]);
                  stack.push([matchContent, pri]);
                  break;
               case "power":
                  stack.push([matchContent, DCCExpression.precedence(matchContent)]);
                  break;
               case "openParentheses":
                  stack.push([matchContent, 1]);
                  break;
               case "closeParentheses":
                  while (stack.length > 0 && stack[stack.length-1][0] != "(")
                     compiled.push([2, stack.pop()[0]]);
                  if (stack.length > 0) {
                     stack.pop();
                     if (stack.length > 0 && stack[stack.length-1][1] == 10)
                        compiled.push([4, stack.pop()[0]]);
                  }
                  break;
               case "variable":
                  compiled.push([3, matchContent]);
                  break;
               case "function":
                  stack.push([matchContent, 10]);
                  break;
            }

            let matchSize = matchContent.length;
            if (matchStart + matchSize >= mdfocus.length)
               matchStart = -1;
            else
               mdfocus = mdfocus.substring(matchStart + matchSize);
         }
      } while (matchStart > -1);
      console.log("=== stack");
      console.log(JSON.stringify(stack));
      const size = stack.length;
      for (let s = 0; s < size; s++) {
         let op = stack.pop();
         compiled.push([(op[1] == 10) ? 4 : 2, op[0]]);
      }
      console.log("=== stack");
      console.log(JSON.stringify(stack));
      console.log("=== compiled");
      console.log(compiled);
   }

   /*
    * Property handling
    */
   
   static get observedAttributes() {
      return DCCVisual.observedAttributes.concat(
         ["expression", "active"]);
   }

   get expression() {
      return this.getAttribute("expression");
   }
   
   set expression(newValue) {
      this.setAttribute("expression", newValue);
   }

   // defines if the display is activelly updated
   get active() {
      return this.hasAttribute("active");
   }

   set active(isActive) {
      if (isActive) {
         this.setAttribute("active", "");
      } else {
         this.removeAttribute("active");
      }
   }

   variableUpdated(topic, message) {
      // <TODO> provisory solution due to message ordering
      this._updated = true;

      if (this._index == null)
         this.innerHTML = message;
      else
         this.innerHTML = message[this._index-1];
   }

   stateChanged(topic, message) {
      const id = MessageBus.extractLevel(topic, 2);

      if (id.startsWith(this._variable)) {
         const subid = id.substring(this._variable.length + 1);

         if (message.state == "+")
            this._stateValues[subid] = message.value;
         else
            if (this._stateValues[subid] != null)
               delete this._stateValues[subid];

         this.innerHTML = this._valuesToHTML(this._stateValues);
      }
   }

   _valuesToHTML(values) {
      let html = "<ul>";
      for (let v in values)
         html += "<li>" + values[v] + "</li>";
      html += "</ul>";
      return html;
   }
}

(function() {
   DCCExpression.elementTag = "dcc-expression";
   customElements.define(DCCExpression.elementTag, DCCExpression);

   DCCExpression.precedence = {
      "-": 2,
      "+": 2,
      "/": 3,
      "*": 3,
      "^": 4
   }

   DCCExpression.element = {
      number: /([\d]*\.[\d]+)|([\d]+)/im,
      arithmetic: /[\+\-*/(]/im,
      power: /\^/im,
      openParentheses: /\(/im,
      closeParentheses: /\)/im,
      function: /[\w \t\.]+(?=\()/im,
      variable: /[\w \t\.]+(?!\()/im
   }
})();