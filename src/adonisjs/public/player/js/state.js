/**
 * Maintains the state of the play during its execution.
 * 
 * State Object
 * {
 *   variables: {id: <variable name>, value: <variable value>},
 *   history: [<knot name>, ..., <knot name>]
 *   parameter: parameter object
 *   nextKnot: <integer> -- provisory
 *   completed: boolean
 * }
 *
 * MetaState Object
 * {
 *   script: {type: <instruction type>, }
 * }
 */

class PlayState {
   constructor() {
      this._state = {
         variables: {},
         history: [],
         parameter: null,
         nextKnot: 1,
         completed: false
      };

      this._metastate = {};
      
      this.variableGet = this.variableGet.bind(this);
      MessageBus.ext.subscribe("var/+/get", this.variableGet);
      this.variableSet = this.variableSet.bind(this);
      MessageBus.ext.subscribe("var/+/set", this.variableSet);
      this.variableSubGet = this.variableSubGet.bind(this);
      MessageBus.ext.subscribe("var/+/get/sub", this.variableSubGet);
   }

   /*
    * State Storage
    */
   _stateStore() {
      localStorage.setItem(PlayState.storeId, JSON.stringify(this._state));
   }

   _stateRetrieve() {
      let state = null;
      const stateS = localStorage.getItem(PlayState.storeId);
      if (stateS != null)
         state = JSON.parse(stateS);
      return (state == null || state.completed) ? null : state;
   }

   sessionRecord(userid, token) {
      this._state.userid = userid;
      this._state.token = token;
      this._stateStore();
   }

   sessionCompleted() {
      this._state.completed = true;
      this._stateStore();
   }

   pendingPlayCheck() {
      const state = this._stateRetrieve();
      return (state != null);
   }

   pendingPlayId() {
      const state = this._stateRetrieve();
      return (state != null && state.caseid != null) ? state.caseid : null;
   }

   pendingPlayRestore() {
      let currentKnot = null;
      this._state = this._stateRetrieve();
      if (this._state.history.length > 0)
         currentKnot = this._state.history[this._state.history.length-1];
      return currentKnot;
   }

   /*
    * Properties
    */

   get currentCase() {
      return this._state.caseid;
   }
   
   set currentCase(caseid) {
      this._state.caseid = caseid;
      this._stateStore();
   }

   get token() {
      return this._state.token;
   }

   get parameter() {
      return this._state.parameter;
   }
   
   set parameter(newValue) {
      this._state.parameter = newValue;
      this._stateStore();
   }

   /*
    * Scenario Variables
    */
   
   variableGet(topic, message) {
      let id = MessageBus.extractLevel(topic, 2);

      // tries to give a scope to the variable
      if (id != null && this._state.variables[id] == null) {
         const currentKnot = this.historyCurrent();
         if (currentKnot != null &&
             this._state.variables[currentKnot + "." + id] != null)
            id = currentKnot + "." + id;
      }

      if (id != null)
         MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                                this._state.variables[id]);
   }
   
   variableSubGet(topic, message) {
      const completeId = MessageBus.extractLevel(topic, 2);
      if (completeId != null) {
         let result = null;
         let id = completeId;
         while (this._state.variables[id] === undefined && id.indexOf(".") > -1)
            id = id.substring(id.indexOf(".")+1);
         if (this._state.variables[id])
            for (let v in this._state.variables[id])
               if (this._state.variables[id][v].content == message.body)
                  result = this._state.variables[id][v].state;
         MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                                result);
      }
   }

   variableSet(topic, value) {
      const id = MessageBus.extractLevel(topic, 2);
      if (id != null)
         this._state.variables[id] = value;
      this._stateStore();
   }

   /*
    * Navigation History
    */

   historyHasPrevious() {
      return (this._state.history.length > 1);
   }

   historyCurrent() {
      let current = null;
      if (this._state.history.length > 0)
         current = this._state.history[this._state.history.length-1];
      return current;
   }

   historyPrevious() {
      let previous = null;
      if (this.historyHasPrevious()) {
         this._state.history.pop();
         previous = this._state.history[this._state.history.length-1];
         this._stateStore();
      }
      return previous;
   }

   historyRecord(knot) {
      this._state.history.push(knot);
      this._stateStore();
   }

   /*
    * Next Knot Control (provisory)
    */
   nextKnot() {
      this._state.nextKnot++;
      this._stateStore();
      return this._state.nextKnot.toString();
   }

   /*
    * MetaState Storage
    */
   _metastateStore() {
      localStorage.setItem(
         PlayState.storeMetaId, JSON.stringify(this._metastate));
   }

   _metastateRetrieve() {
      const metastateS = localStorage.getItem(PlayState.storeMetaId);
      if (metastateS != null)
         this._metastate = JSON.parse(metastateS);
   }

   /*
    * MetaScript Management
    */

   metascriptRecord(script) {
      this._metastate.script = script;
      this._metastateStore();
   }

   metascriptNextInstruction() {
      let instruction = null;
      this._metastateRetrieve();
      if (this._metastate != null && this._metastate.script &&
          this._metastate.script.length > 0) {
         instruction = this._metastate.script.shift();
         this._metastateStore();
      }
      return instruction;
   }
}

(function() {
   PlayState.storeId = "harena-state";
   PlayState.storeMetaId = "harena-metastate";
})();