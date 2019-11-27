class MetaPlayer {
   play(knot, state) {
      // <TODO> temporary - to avoid state in the metacase
      state.sessionCompleted();

      console.log("=== script");
      let script = [];
      this._addInstructions(knot.content, script);

      let first = null;
      if (script.length > 0) {
         first = script.shift();
         if (script.length > 0)
            state.metascriptRecord(script);
         console.log(first);
         console.log(script);
         DCCCompute.computeInstructionObj(first);
      }
   }

   _addInstructions(unity, script) {
      for (let un in unity)
         if (unity[un].type == "script")
            this._addInstructions(unity[un].content, script);
         else if (MetaPlayer.computable.includes(unity[un].type))
            script.push(this._transfer(unity[un]));
   }

   _transfer(element) {
      let copy = {
         type: element.type
      };
      for (let tf in MetaPlayer.transferFields[element.type])
         copy[MetaPlayer.transferFields[element.type][tf]] =
            element[MetaPlayer.transferFields[element.type][tf]];
      return copy;
   }
}

(function() {
   MetaPlayer.player = new MetaPlayer();

   MetaPlayer.computable = ["divert-script"];

   MetaPlayer.transferFields = {
      "divert-script": ["target", "parameter"]
   };
})();