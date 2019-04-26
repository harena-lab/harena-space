/**
 * Maintains the state of the play during its execution.
 * 
 * State Object
 * {
 *   variables = {id: <variable name>, value: <variable value>}
 * }
 */

class PlayState {
   constructor() {
      this._state = {
        variables: {}
      };
      
      this.variableGet = this.variableGet.bind(this);
      window.messageBus.ext.subscribe("var/+/get", this.variableGet);
      this.variableSet = this.variableSet.bind(this);
      window.messageBus.ext.subscribe("var/+/set", this.variableSet);
      this.variableSubGet = this.variableSubGet.bind(this);
      window.messageBus.ext.subscribe("var/+/get/sub", this.variableSubGet);
   }
   
   variableGet(topic, value) {
      const id = MessageBus.extractLevel(topic, 2);
      if (id != null)
         window.messageBus.ext.publish("var/" + id, this._state.variables[id]);
   }
   
   variableSubGet(topic, value) {
      // console.log("sub solicitado: " + topic + ";" + value);
      const id = MessageBus.extractLevel(topic, 2);
      if (id != null) {
         let result = null;
         if (this._state.variables[id])
            for (let v in this._state.variables[id])
               if (this._state.variables[id][v].content == value)
                  result = this._state.variables[id][v].state;
         // console.log("-- sub resultado: " + result);
         window.messageBus.ext.publish("var/" + id + "/sub", result);
      }
   }

   variableSet(topic, value) {
      const id = MessageBus.extractLevel(topic, 2);
      if (id != null)
         this._state.variables[id] = value;
      // console.log("Variables updated:");
      // console.log(this._state);
   }
}