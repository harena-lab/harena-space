const storePrefix = "casenote_";

class PlayerManager {
   static instance() {
      if (!PlayerManager._instance)
         PlayerManager._instance = new PlayerManager();
      return PlayerManager._instance;
   }
   
   constructor() {
      this._server = new DCCPlayerServer();
      this._tracker = new Tracker();
      this._state = new PlayState();
      this._history = [];
      
      this.controlEvent = this.controlEvent.bind(this);
      window.messageBus.ext.subscribe("control/#", this.controlEvent);
      this.navigateEvent = this.navigateEvent.bind(this);
      window.messageBus.ext.subscribe("knot/+/navigate", this.navigateEvent);
      
      // <TODO> temporary
      this.produceReport = this.produceReport.bind(this);
      window.messageBus.int.subscribe("/report/get", this.produceReport);
      
      /*
      this.inputEvent = this.inputEvent.bind(this);
      window.messageBus.ext.subscribe("input/#", this.inputEvent);
      */
      
      // tracking
      this.trackTyping = this.trackTyping.bind(this);
   }
   
   /*
    * Event handlers
    * **************
    */
   
   controlEvent(topic, message) {
      switch (topic) {
         case "control/register": this.register(); break;
         case "control/signin":   this.signIn(); break;
      }
   }
   
   navigateEvent(topic, message) {
      this.trackTrigger(message);
      // window.messageBus.ext.publish("checkout", message);
      if (this._currentKnot != null) {
         window.messageBus.ext.publish("control/input/submit"); // <TODO> provisory
         window.messageBus.ext.publish("knot/" + this._currentKnot + "/end");
      }
      switch (topic) {
         case "knot/</navigate": if (this._history.length > 0) {
                                           this._history.pop();
                                           const last = this._history[this._history.length - 1]; 
                                           this.loadKnot(last);
                                        }
                                        break;
         case "knot/<</navigate": this.startCase();
                                  const startKnot = this._server.getStartKnot();
                                  this._history.push(startKnot);
                                  this.loadKnot(startKnot);
                                  break;
         default: if (MessageBus.matchFilter(topic, "knot/+/navigate")) {
                     this._history.push(message);
                     this.loadKnot(message);
                  }
                  break;
      }
      /*
      switch (topic) {
         case "navigate/knot/previous": window.history.back();
                                        break;
         case "navigate/knot/start": window.open(this._server.getStartKnot().
                                       replace(/ /igm, "_") + ".html", "_self");
                                     break;
         case "navigate/trigger": window.open(message, "_self");
                                  break;
      }
      */
   }

   /*
   inputEvent(topic, message) {
      this._server.recordInput(topic.substring(6), message);
   } 
   */  
   
   startPlayer() {
      this._mainPanel = document.querySelector("#main-panel");
      
      this.loadKnot("entry");
   }
   
   loadKnot(knotName) {
      this._currentKnot = knotName;
      this._knotScript = document.createElement("script");
      this._knotScript.src = "knots/" + knotName + ".js";
      document.head.appendChild(this._knotScript);
      window.messageBus.ext.publish("knot/" + knotName + "/start");
   }
   
   presentKnot(knot) {
      window.messageBus.page = new MessageBus(false);
      
      this._mainPanel.innerHTML = knot;

      document.head.removeChild(this._knotScript);
      
      // <TODO> Improve the strategy
      if (this._currentKnot == "entry")
         this.startGame();
   }
   
   presentNote(knot) {
      const dimensions = Utils.tools.screenDimensions();
      // const coord = 
      //    Utils.tools.centralize(dimensions.width * .7, dimensions.height * .7);
      
      let div = document.createElement("div");
      
      div.style.position = "absolute";
      div.style.margin = "auto";
      div.style.top = 0;
      div.style.right = 0;
      div.style.bottom = 0;
      div.style.left = 0;
      div.style.width = (dimensions.width * .7) + "px";
      div.style.height = (dimensions.height * .7) + "px";
      
      div.innerHTML = knot;
      
      // console.log(div);
      
      this._mainPanel.appendChild(div);
   }
   
   /*
    * Registry related operations
    * ***************************
    */
   
   startGame() {
      this._history = [];
      
      this._server.resetRunningCase();
      let currentUser = this._server.getCurrentUser();
      if (currentUser == null)
         document.querySelector("#signin-register").style.display = "flex";
      else {
         let userId = document.querySelector("#user-id");
         userId.innerHTML = userId.innerHTML + currentUser;
         let profile = this._server.getProfile(currentUser);
         let userName = document.querySelector("#user-name");
         userName.innerHTML = userName.innerHTML + profile.name;
         document.querySelector("#signed-user").style.display = "initial";
      }
    }
   
   register() {
      let userId = document.querySelector("#idInput").value;
      let userName = document.querySelector("#nameInput").value;
      let userAge = document.querySelector("#ageInput").value;
      let invalidId = document.querySelector("#invalid-id");
      let answerAll = document.querySelector("#answer-all");

      if (userId.trim().length >0 && userName.trim().length > 0 && parseInt(userAge) > 0) {
         let users = this._server.getUsers();
         if (users.ids.indexOf(userId) > -1) {
             invalidId.style.display = "initial";
             answerAll.style.display = "none";
         } else {
             let profile = {id: userId,
                            name: userName,
                            age: userAge,
                            cases: []};
             this._server.setProfile(profile);
             invalidId.style.display = "none";
             answerAll.style.display = "none";
             document.querySelector("#signed-user").style.display = "initial";
             document.querySelector("#registration-form").style.display = "none";
             this._server.setCurrentUser(userId);
         }
      } else {
          invalidId.style.display = "none";
          answerAll.style.display = "initial";
      }
   }
   
   signIn() {
      var userId = document.querySelector("#idInput").value;

      if (this._server.getUsers().ids.indexOf(userId) > -1) {
          var profile = this._server.getProfile(userId);
          var userName = document.querySelector("#user-name");
          userName.innerHTML = userName.innerHTML + profile.name;
          document.querySelector("#request-id").style.display = "none";
          document.querySelector("#invalid-id").style.display = "none";
          document.querySelector("#signed-user").style.display = "initial";
          this._server.setCurrentUser(userId);
      } else
          document.querySelector("#invalid-id").style.display = "initial";
   }
   
   /*
    * Start the tracking record of a case
    */
   startCase() {
      // <TODO> this._runningCase is provisory
      const runningCase = this._server.generateRunningCase();
      
      // console.log("************* Running case");
      // console.log(runningCase);
      
      window.messageBus.ext.defineRunningCase(runningCase);
   }
   
   /*
    * Tracking player
    * ***************
    */
   
   trackTrigger(trigger) {
      this._server.trackRoute("#nav:" + trigger);
   }
   
   startTrackTyping(variable) {
      window.messageBus.ext.subscribe("/" + variable + "/typed", this.trackTyping);
   }
   
   trackTyping(topic, message) {
      console.log("track typing: " + message.value);
   }
   
   // <TODO> provisory
   
   produceReport(topic, message) {
      console.log("report...");
      const server = this._server;
      
      let output = {
         currentUser: server.getCurrentUser(),
         runningCase: server.getRunningCasekey(),
         users: {}
      }
      
      const users = server.getUsers();
      for (let u in users.ids) {
         let profile = server.getProfile(users.ids[u]);
         if (profile != null) {
            profile.caseTracks = {};
            for (let c in profile.cases)
                profile.caseTracks[profile.cases[c]] = server.getCaseInstance(profile.cases[c]);
         }
         output.users[users.ids[u]] = profile;
      }
      
      window.messageBus.int.publish("/report", {caseobj: server.getPlayerObj(),
                                                result: output});
   }   
}