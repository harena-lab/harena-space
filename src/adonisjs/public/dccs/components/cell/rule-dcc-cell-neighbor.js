/* DCC Rule Cell Neighbor
  ***********************/

class RuleDCCCellNeighbor extends RuleDCCCell {
   connectedCallback() {
      if (!this.neighbors) this.neighbors = this.innerHTML.replace(/[ \r\n]/g, "");
      this.innerHTML = "";
      this._ruleNeighbors = this.buildNeighborList(this.neighbors);

      if (!this.hasAttribute("probability")) this.probability = "100";
      this._decimalProbability = parseInt(this.probability) / 100;
      if (!this.hasAttribute("transition"))
         this.transition = "?_>_?";
      else
         this._decomposeTransition(this.transition);
      MessageBus.page.publish("dcc/rule-cell/register", this);
   }

   buildNeighborList(map) {
      map = map.replace(/[ \r\n]/g, "");
      const size = Math.ceil(Math.sqrt(map.length));
      const shift = Math.floor((size-1)/2);
      let neighborList = [];
      for (let n = 0; n < map.length; n++)
         if (map[n] != "_")
            neighborList.push([Math.floor(n/size)-shift, n%size-shift]);
      return neighborList;
   }

   /* Properties
      **********/
   
   static get observedAttributes() {
      return RuleDCCCell.observedAttributes.concat(
         ["neighbors", "probability", "transition"]);
   }

   get neighbors() {
      return this.getAttribute("neighbors");
   }
   
   set neighbors(newValue) {
      this.setAttribute("neighbors", newValue);
   }

   get ruleNeighbors() {
      return this._ruleNeighbors;
   }

   get probability() {
      return this.getAttribute("probability");
   }

   set probability(newValue) {
      this.setAttribute("probability", newValue);
   }

   get decimalProbability() {
      return this._decimalProbability;
   }

   get transition() {
      return this.getAttribute("transition");
   }

   set transition(newValue) {
      this.setAttribute("transition", newValue);
      this._decomposeTransition(newValue);
   }

   _decomposeTransition(transition) {
      this._oldSource = transition[0];
      this._oldTarget = transition[1];
      this._newSource = transition[3];
      this._newTarget = transition[4];

      this._transMap = [
         (transition[3] == "_") ? 0
            : ((transition[3] == transition[0])
               ? 1 : ((transition[3] == transition[1] && transition[3] != transition[4]) ? 2 : 0)),
         (transition[4] == "_") ? 0
            : ((transition[4] == transition[0] && transition[4] != transition[3])
               ? 1 : ((transition[4] == transition[1]) ? 2 : 0))
      ];
      this._maintainSource = this._transMap.includes(1);
      this._maintainTarget = this._transMap.includes(2);

      console.log("=== transition map");
      console.log(this.transition);
      console.log(this._transMap);
      console.log(this._maintainSource);
      console.log(this._maintainTarget);
   }
}

class RuleDCCCellPair extends RuleDCCCellNeighbor {
   computeRule(state, ncols, nrows, infinite, cells, cellTypes, vtypes, col, row, changed) {
      let triggered = false;
      if (Math.random() <= this._decimalProbability) {
         let nb = this._ruleNeighbors.slice();
         let ruleTriggered = false;
         while (nb.length > 0 && !ruleTriggered) {
            const neighbor = Math.floor(Math.random() * nb.length);
            let nr = row + nb[neighbor][0];
            let nc = col + nb[neighbor][1];
            nb.splice(neighbor, 1);
            if (infinite) {
               nr = (nr < 0) ? nrows - 1 : nr % nrows;
               nc = (nc < 0) ? ncols - 1 : nc % ncols;
            }
            if (nr >= 0 && nr < nrows &&
                nc >= 0 && nc < ncols) {
               const expectedTarget = (state[nr][nc] == null)
                  ? "_" : state[nr][nc].dcc.type;
               if (expectedTarget == this._oldTarget ||
                   ((this._oldTarget == "?" || this._oldTarget == "!") && expectedTarget != "_")) {
                  ruleTriggered = true;
                  triggered = true;

                  const valueTarget = (!"?!@".includes(this._newTarget)) ? this._newTarget
                     : ((this._newTarget == "@")
                        ? vtypes[Math.floor(Math.random() * vtypes.length)]
                        : ((this._oldSource == this._newTarget) ? 
                           state[row][col].dcc.type : expectedTarget));
                  const valueSource = (!"?!@".includes(this._newSource)) ? this._newSource
                     : ((this._newSource == "@")
                        ? vtypes[Math.floor(Math.random() * vtypes.length)]
                        : ((this._oldSource == this._newSource)
                           ? state[row][col].dcc.type : expectedTarget));

                  /*
                  if (this._newSource == "@" || this._newTarget == "@") {
                     console.log("=== transition");
                     console.log(this.transition);
                     console.log(this._transMap);
                     console.log(valueSource);
                     console.log(valueTarget);
                     console.log("maintain source: " + this._maintainSource);
                     console.log("maintain target: " + this._maintainTarget);
                  }
                  */

                  if (!this._maintainSource && state[row][col] != null && (nr != row || nc != col)){
                     cells.removeChild(state[row][col].element);
                     state[row][col] = null;
                  }
                  if (!this._maintainTarget && state[nr][nc] != null) {
                     cells.removeChild(state[nr][nc].element);
                     state[nr][nc] = null;
                  }

                  switch (this._transMap[1]) {
                     case 0:
                        if (valueTarget != "_") {
                           state[nr][nc] =
                              cellTypes[valueTarget].createIndividual(nc+1, nr+1);
                           cells.appendChild(state[nr][nc].element);
                        } else
                           state[nr][nc] = null;
                        changed[nr][nc] = true;
                        break;
                     case 1:
                        state[nr][nc] = state[row][col];
                        cellTypes[valueTarget].repositionElement(
                           state[row][col].element, nc+1 , nr+1);
                        changed[nr][nc] = true;
                        break;
                  }
                  /*
                  if (state[nr][nc] == null ||
                      valueTarget != state[nr][nc].dcc.type) {
                     if (state[nr][nc] != null)
                        cells.removeChild(state[nr][nc].element);
                     if (valueTarget != "_") {
                        state[nr][nc] =
                           cellTypes[valueTarget].createIndividual(nc+1, nr+1);
                        cells.appendChild(state[nr][nc].element);
                     } else
                        state[nr][nc] = null;
                     changed[nr][nc] = true;
                  }
                  */
                  if (nr != row || nc != col)
                     switch (this._transMap[0]) {
                        case 0:
                           if (valueSource != "_") {
                              state[row][col] =
                                 cellTypes[valueSource].createIndividual(col+1, row+1);
                              cells.appendChild(state[row][col].element);
                           } else
                              state[row][col] = null;
                           changed[row][col] = true;
                           break;
                        case 2:
                           state[row][col] = state[nr][nc];
                           cellTypes[valueSource].repositionElement(
                              state[nr][nc].element, col+1 , row+1);
                           changed[row][col] = true;
                           break;
                     }
                  /*
                  if ((state[row][col] == null ||
                       this._newSource != state[row][col].dcc.type) &&
                      (nr != row || nc != col)) {
                     if (state[row][col] != null)
                        cells.removeChild(state[row][col].element);
                     if (valueSource != "_") {
                        state[row][col] =
                           cellTypes[valueSource].createIndividual(col+1, row+1);
                        cells.appendChild(state[row][col].element);
                     } else
                        state[row][col] = null;
                     changed[row][col] = true;
                  }
                  */
               }
            }
         }
      }
      return triggered;
   }
}

class RuleDCCCellFlow extends RuleDCCCellNeighbor {
}

(function() {
   customElements.define("rule-dcc-cell-pair", RuleDCCCellPair);
})();