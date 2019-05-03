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

      this.templateFamiliesList = this.templateFamiliesList.bind(this);
      MessageBus.ext.subscribe("template_family/*/get", this.templateFamiliesList);
      
      this.casesList = this.casesList.bind(this);
      MessageBus.ext.subscribe("data/case/*/list", this.casesList);
      
      this.modelsList = this.modelsList.bind(this);
      MessageBus.ext.subscribe("model/*/get", this.modelsList);
      this.newCase = this.newCase.bind(this);
      MessageBus.ext.subscribe("case/_temporary/new", this.newCase);
      this.loadCase = this.loadCase.bind(this);
      MessageBus.ext.subscribe("case/+/get", this.loadCase);
      this.saveCase = this.saveCase.bind(this);
      MessageBus.ext.subscribe("case/+/set", this.saveCase);
      this.renameCase = this.renameCase.bind(this);
      MessageBus.ext.subscribe("case/+/rename", this.renameCase);
      this.loadKnotCapsule = this.loadKnotCapsule.bind(this);
      MessageBus.ext.subscribe("capsule/knot/get", this.loadKnotCapsule);
      this.loadTemplate = this.loadTemplate.bind(this);
      MessageBus.ext.subscribe("template/+/get", this.loadTemplate);
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
   
   async templateFamiliesList() {
      const response = await fetch(DCCAuthorServer.serverAddress + "template-families-list", {
         method: "POST",
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      const families = jsonResponse.templateFamiliesList;
      let finalFamiliesList = {};
      for (var f in families)
         finalFamiliesList[families[f]] = "icons/mono-slide.svg";
      MessageBus.ext.publish("template_family/*", finalFamiliesList);
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
   
   async newCase() {
      const response = await fetch(DCCAuthorServer.serverAddress + "new-case", {
         method: "POST",
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      MessageBus.ext.publish("case/" + jsonResponse.caseName + "/set/status", "ok");
   }

   async loadCase(topic, message) {
      const caseId = MessageBus.extractLevel(topic, 2);
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this._token
          }
      }
      const response =
         await fetch(DCCAuthorServer.serverAddress + "case/" + caseId, header);
      const jsonResponse = await response.json();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             jsonResponse.markdown);
   }

   async saveCase(topic, message) {
      if (message.format == "markdown") {
         const caseName = MessageBus.extractLevel(topic, 2);
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
      }
   }

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

   async loadKnotCapsule(topic, message) {
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "text/html",
          }
      }
      const response = await fetch("./knot-capsule.html", header);
      let textResponse = await response.text();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             textResponse);
   }
   
   async loadTemplate(topic, message) {
      const templateCompleteName = MessageBus.extractLevel(topic, 2);
      const separator = templateCompleteName.indexOf("."); 
      const templateFamily = templateCompleteName.substring(0, separator);
      const templateName = templateCompleteName.substring(separator+1);
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "text/html",
          }
      }
      const response = await fetch("../themes/" + templateFamily + "/" + templateName +
                                   ".html", header);
      let textResponse = await response.text();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             textResponse);
   }
   
   async prepareCaseHTML(topic, templateFamily) {
      const caseName = MessageBus.extractLevel(topic, 2);
      const response = await fetch(DCCAuthorServer.serverAddress + "prepare-case-html", {
         method: "POST",
         body: JSON.stringify({"templateFamily": templateFamily,
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
