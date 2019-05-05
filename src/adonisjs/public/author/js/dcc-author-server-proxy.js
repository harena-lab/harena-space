/**
 * Server Proxy Component
 *
 * Component following the Digital Content Component (DCC) model responsible for acting
 * as a proxy between the authoring environment and the server.
 */

class DCCAuthorServer {
   constructor() {
      this.userLogin = this.userLogin.bind(this);
      MessageBus.ext.subscribe("data/user/login", this.userLogin);
      this.casesList = this.casesList.bind(this);
      MessageBus.ext.subscribe("data/case/*/list", this.casesList);
      this.loadCase = this.loadCase.bind(this);
      MessageBus.ext.subscribe("data/case/+/get", this.loadCase);
      this.loadModule = this.loadModule.bind(this);
      MessageBus.ext.subscribe("data/module/+/get", this.loadModule);
      this.loadTheme = this.loadTheme.bind(this);
      MessageBus.ext.subscribe("data/theme/+/get", this.loadTheme);
      this.loadTemplate = this.loadTemplate.bind(this);
      MessageBus.ext.subscribe("data/template/+/get", this.loadTemplate);
      this.saveCase = this.saveCase.bind(this);
      MessageBus.ext.subscribe("data/case/+/set", this.saveCase);
      this.newCase = this.newCase.bind(this);
      MessageBus.ext.subscribe("data/case//new", this.newCase);

      this.themeFamiliesList = this.themeFamiliesList.bind(this);
      MessageBus.ext.subscribe("data/theme_family/*/list", this.themeFamiliesList);
      
      this.modelsList = this.modelsList.bind(this);
      MessageBus.ext.subscribe("data/template/*/get", this.modelsList);
      // this.renameCase = this.renameCase.bind(this);
      // MessageBus.ext.subscribe("case/+/rename", this.renameCase);
      this.prepareCaseHTML = this.prepareCaseHTML.bind(this);
      MessageBus.ext.subscribe("case/+/prepare", this.prepareCaseHTML);
      this.saveKnotHTML = this.saveKnotHTML.bind(this);
      MessageBus.ext.subscribe("knot/+/set", this.saveKnotHTML);
      this.saveCaseObject = this.saveCaseObject.bind(this);
      MessageBus.ext.subscribe("case/+/set", this.saveCaseObject);
   }
   
   // wrapper of the services

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
      console.log(header);

      const response = await fetch(DCCAuthorServer.serverAddress + "user/login", header);
      const jsonResponse = await response.json();
      const busResponse = {
         userid: jsonResponse.id,
         token: jsonResponse.token
      };
      this._token = jsonResponse.token;
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             busResponse);
   }
   
   async themeFamiliesList() {
      const response = await fetch(DCCAuthorServer.serverAddress + "theme-families-list", {
         method: "POST",
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      const families = jsonResponse.themeFamiliesList;
      let finalFamiliesList = {};
      for (var f in families)
         finalFamiliesList[families[f]] = "icons/mono-slide.svg";
      MessageBus.ext.publish("theme_family/*", finalFamiliesList);
   }

   async modelsList() {
      const response = await fetch(DCCAuthorServer.serverAddress + "models-list", {
         method: "POST",
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      const models = jsonResponse.modelsList;
      let finalModelsList = {};
      for (var f in models)
         finalModelsList[models[f]] = "icons/mono-slide.svg";
      MessageBus.ext.publish("model/*", finalModelsList);
   }

   async casesList(topic, message) {
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "POST",
         "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this._token
          },
          "body": JSON.stringify({"filterBy": "user",
                                  "filter": message.filter})
      }
      const response = await fetch(DCCAuthorServer.serverAddress + "case/list", header);
      const jsonResponse = await response.json();
      let busResponse = {};
      for (var c in jsonResponse)
         busResponse[jsonResponse[c].id] = {
            name: jsonResponse[c].name,
            icon: "icons/mono-slide.svg"
         };
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             busResponse);
   }
   
   async newCase(topic, message) {
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "POST",
         "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this._token
          }
      };
      const response =
         await fetch(DCCAuthorServer.serverAddress + "case/new", header);
      const jsonResponse = await response.json();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             jsonResponse.id);

      /*
      const response = await fetch(DCCAuthorServer.serverAddress + "new-case", {
         method: "POST",
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      MessageBus.ext.publish("case/" + jsonResponse.caseName + "/set/status", "ok");
      */
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
         await fetch(DCCAuthorServer.serverAddress + "case/" + caseId, header);
      const jsonResponse = await response.json();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             {name: jsonResponse.name,
                              source: jsonResponse.source});
   }

   async saveCase(topic, message) {
      if (message.format == "markdown") {
         const caseId = MessageBus.extractLevel(topic, 3);
         var header = {
            "async": true,
            "crossDomain": true,
            "method": "PUT",
            "headers": {
               "Content-Type": "application/json",
               "Authorization": "Bearer " + this._token
             },
             "body": JSON.stringify({name: message.name,
                                     source: message.source})
         };
         const response =
            await fetch(DCCAuthorServer.serverAddress + "case/" + caseId, header);
         const jsonResponse = await response.json();
         MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             jsonResponse.source);

         /*
         const response = await fetch(DCCAuthorServer.serverAddress + "save-case", {
            method: "POST",
            body: JSON.stringify({"caseName": caseName,
                                  "caseText": message.source}),
            headers:{
              "Content-Type": "application/json"
            }
         });
         const jsonResponse = await response.json();
         MessageBus.ext.publish("case/" + caseName + "/version", jsonResponse.versionFile);
         */
      }
   }

   /*
   async renameCase(topic, message) {
      const oldName = MessageBus.extractLevel(topic, 2);
      const response = await fetch(DCCAuthorServer.serverAddress + "rename-case", {
         method: "POST",
         body: JSON.stringify({"oldName": oldName,
                               "newName": message.newName}),
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      MessageBus.ext.publish("case/" + oldName + "/rename/status", jsonResponse.status);
   }
   */

   async loadModule(topic, message) {
      const moduleName = MessageBus.extractLevel(topic, 3);
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "text/html",
          }
      }
      const response = await fetch("../modules/" + moduleName + ".html", header);
      let textResponse = await response.text();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             textResponse);
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

   async loadTemplate(topic, message) {
      const templateCompleteName = MessageBus.extractLevel(topic, 3);
      const separator = templateCompleteName.indexOf("."); 
      const templateFamily = templateCompleteName.substring(0, separator);
      const templateName = templateCompleteName.substring(separator+1);
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "text/plain",
          }
      }
      const response = await fetch("../templates/" + templateFamily + "/" + templateName +
                                   ".md", header);
      let textResponse = await response.text();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             textResponse);
   }
   
   async prepareCaseHTML(topic, themeFamily) {
      const caseName = MessageBus.extractLevel(topic, 2);
      const response = await fetch(DCCAuthorServer.serverAddress + "prepare-case-html", {
         method: "POST",
         body: JSON.stringify({"themeFamily": themeFamily,
                               "caseName": caseName}),
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      MessageBus.ext.publish("case/" + caseName + "/prepare/directory", jsonResponse.directory);
   }

   async saveKnotHTML(topic, message) {
      const knotId = MessageBus.extractLevel(topic, 2);
      
      const response = await fetch(DCCAuthorServer.serverAddress + "save-knot-html", {
         method: "POST",
         body: JSON.stringify({"caseName": message.caseId,
                               "knotFile": knotId + ".js",
                               "knotHTML": message.source}),
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      MessageBus.ext.publish("knot/" + knotId + "/set/status", jsonResponse.status);
   }

   async saveCaseObject(topic, message) {
      if (message.format == "json") {
         const caseId = MessageBus.extractLevel(topic, 2);
         
         // <TODO> change the name of the service
         const response = await fetch(DCCAuthorServer.serverAddress + "save-case-script", {
            method: "POST",
            body: JSON.stringify({"caseName": caseId,
                                  "scriptFile": "case.js",
                                  "scriptJS": message.source}),
            headers:{
              "Content-Type": "application/json"
            }
         });
         const jsonResponse = await response.json();
         MessageBus.ext.publish("case/" + caseId + "/set/status", jsonResponse.status);
      }
   }
}
