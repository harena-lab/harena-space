/* DCC Rule Cell Expression
  *************************/

class RuleDCCCellExpression extends RuleDCCTransition {
   connectedCallback() {
      super.connectedCallback();

      this._compiled = null;
      if (this.hasAttribute("expression"))
         this._compiled = DCCExpression.compileExpression(this.expression, false);
   }

   /* Properties
      **********/
   
   static get observedAttributes() {
      return RuleDCCTransition.observedAttributes.concat(["expression"]);
   }

   get expression() {
      return this.getAttribute("expression");
   }

   set expression(newValue) {
      this.setAttribute("expression", newValue);
      this._decomposeTransition(newValue);
   }

   /* Methods
      *******/
   computeRule(spaceState, row, col) {
      let cstate = spaceState.state[row][col];
      
      // transfers cell position to variables
      if (!cstate.properties)
         cstate.properties = {};
      if (!cstate.properties.x0) {
         cstate.properties.x0 = col;
         cstate.properties.y0 = row;
         cstate.properties.x = col;
         cstate.properties.y = row;
      }

      const varRole = DCCExpression.role["variable"];
      if (this._compiled != null) {
         // sets variable values
         for (let c of this._compiled)
            if (c[0] == varRole) {
               if (RuleDCCCellExpression.internalVar.includes(c[1]))
                  c[3] = cstate.properties[c[1]];
            }

         
      }
   }
}

(function() {
   RuleDCCCellExpression.internalVar = ["x", "y", "x0", "y0"]
})();