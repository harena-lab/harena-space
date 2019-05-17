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
      MessageBus.ext.subscribe("var/+/get", this.variableGet);
      this.variableSet = this.variableSet.bind(this);
      MessageBus.ext.subscribe("var/+/set", this.variableSet);
      this.variableSubGet = this.variableSubGet.bind(this);
      MessageBus.ext.subscribe("var/+/get/sub", this.variableSubGet);
   }
   
   variableGet(topic, message) {
      const id = MessageBus.extractLevel(topic, 2);
      if (id != null)
         MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                                this._state.variables[id]);
      // MessageBus.ext.publish("var/" + id, this._state.variables[id]);
   }
   
   variableSubGet(topic, message) {
      // console.log("sub solicitado: " + topic + ";" + value);
      const id = MessageBus.extractLevel(topic, 2);
      if (id != null) {
         let result = null;
         if (this._state.variables[id])
            for (let v in this._state.variables[id])
               if (this._state.variables[id][v].content == message)
                  result = this._state.variables[id][v].state;
         // console.log("-- sub resultado: " + result);
         // MessageBus.ext.publish("var/" + id + "/sub", result);
         MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                                result);
      }
   }

   variableSet(topic, value) {
      const id = MessageBus.extractLevel(topic, 2);
      if (id != null)
         this._state.variables[id] = value;
      // console.log("Variables updated:");
      // console.log(this._state);
      // console.log("variable set " + id + " with " + value);
   }
}