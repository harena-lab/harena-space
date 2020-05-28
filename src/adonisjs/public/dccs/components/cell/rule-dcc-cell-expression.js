/* DCC Rule Cell Expression
  *************************/

class RuleDCCCellExpression extends RuleDCCTransition {
   connectedCallback() {
      super.connectedCallback();

      this._rounds = 0;
      if (!this.hasAttribute("time-rate"))
         this.timeRate = 1;

      this._compiled = null;
      if (this.hasAttribute("expression"))
         this._compiled = DCCExpression.compileStatementSet(this.expression.toLowerCase());

      MessageBus.page.publish("dcc/rule-cell/register", this);
   }

   /* Properties
      **********/
   
   static get observedAttributes() {
      return RuleDCCTransition.observedAttributes.concat(["expression", "time-rate"]);
   }

   get expression() {
      return this.getAttribute("expression");
   }

   set expression(newValue) {
      this.setAttribute("expression", newValue);
      this._decomposeTransition(newValue);
   }

   get timeRate() {
      return this.getAttribute("time-rate");
   }

   set timeRate(newValue) {
      this.setAttribute("time-rate", newValue);
   }

   /* Methods
      *******/
   notify(topic, message) {
      if (message.role) {
         switch (message.role.toLowerCase()) {
            case "time-rate": this.timeRate = message.body.value; break;
            case "time-mili": this.timeRate = 1 / message.body.value; break;
         }
      }
   }

   computeRule(spaceState, row, col) {
      this._rounds++;
      
      let cstate = spaceState.state[row][col];
      
      // transfers cell position to variables
      if (!cstate.properties)
         cstate.properties = {};
      if (cstate.properties.x0 == null) {
         cstate.properties.x0 = col;
         cstate.properties.y0 = row;
         cstate.properties.x = col;
         cstate.properties.y = row;
      }

      cstate.properties.t = this._rounds * this.timeRate;

      // console.log("=== cstate");
      // console.log(cstate);

      const varRole = DCCExpression.role["variable"];
      let triggered = false;
      if (this._compiled != null) {
         // sets variable values
         for (let l of this._compiled) {
            for (let c of l[1])
               if (c[0] == varRole) {
                  if (RuleDCCCellExpression.internalVar.includes(c[1]))
                     c[2] = cstate.properties[c[1]];
               }
            // console.log("=== state");
            // console.log(JSON.stringify(l[1]));
            if (RuleDCCCellExpression.internalVar.includes(l[0]))
               cstate.properties[l[0]] = DCCExpression.computeExpression(l[1]);
            // console.log("=== computed ");
            // console.log(l[0]);
            // console.log(JSON.stringify(l[1]));
         }
         let nr = Math.round(cstate.properties.y);
         let nc = Math.round(cstate.properties.x)
         if (nr >= 0 && nr < spaceState.nrows &&
             nc >= 0 && nc < spaceState.ncols)
            triggered = this._computeTransition(spaceState, row, col, nr, nc);
         else {
            const difr = nr - row;
            const difc = nc - col;
            if (nr < 0 || nr >= spaceState.nrows) {
               nr = (nr < 0) ? 0 : spaceState.nrows - 1;
               nc = col + (difc / difr) * (nr - row);
            } else {
               nc = (nc < 0) ? 0 : spaceState.ncols - 1;
               nr = row + (difr / difc) * (nc - col);
            }
            console.log("=== nr e nc");
            console.log(nr);
            console.log(nc);
            if (nr >= 0 && nr < spaceState.nrows &&
                nc >= 0 && nc < spaceState.ncols)
               triggered = this._computeTransition(spaceState, row, col, nr, nc);
         }
      }
      return triggered;
   }
}

(function() {
   RuleDCCCellExpression.internalVar = ["x", "y", "x0", "y0", "t"];
   customElements.define("rule-dcc-cell-expression", RuleDCCCellExpression);
})();