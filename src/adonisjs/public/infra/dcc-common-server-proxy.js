/**
 * 
 */

class DCCCommonServer {

   constructor() {
      this.userLogin = this.userLogin.bind(this);
      MessageBus.ext.subscribe("data/user/login", this.userLogin);
      this.loadCase = this.loadCase.bind(this);
      MessageBus.ext.subscribe("data/case/+/get", this.loadCase);
      this.loadTheme = this.loadTheme.bind(this);
      MessageBus.ext.subscribe("data/theme/+/get", this.loadTheme);
   }

   get token() {
      return this._token;
   }
   
   /*
    * Wrappers of the services
    * ************************
    */

   async userLogin(topic, message) {
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "POST",
         "headers": {
            "Content-Type": "application/json"
          },
          "body": JSON.stringify({"email": message.email,
                                  "password": message.password})
      }

      const response = await fetch(DCCCommonServer.serverAddress + "user/login", header);
      const jsonResponse = await response.json();
      const busResponse = {
         userid: jsonResponse.id,
         token: jsonResponse.token
      };
      this._token = jsonResponse.token;
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             busResponse);
   }

   async loadCase(topic, message) {
      const caseId = MessageBus.extractLevel(topic, 3);
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this._token
          }
      };
      const response =
         await fetch(DCCCommonServer.serverAddress + "case/" + caseId, header);
      const jsonResponse = await response.json();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             {name: jsonResponse.name,
                              source: jsonResponse.source});
   }

   async loadTheme(topic, message) {
      const themeCompleteName = MessageBus.extractLevel(topic, 3);
      const separator = themeCompleteName.indexOf("."); 
      const themeFamily = themeCompleteName.substring(0, separator);
      const themeName = themeCompleteName.substring(separator+1);
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "text/html",
          }
      }
      const response = await fetch("../themes/" + themeFamily + "/" + themeName +
                                   ".html", header);
      let textResponse = await response.text();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             textResponse);
   }
}

(function() {
   DCCCommonServer.instance = new DCCCommonServer();
})();