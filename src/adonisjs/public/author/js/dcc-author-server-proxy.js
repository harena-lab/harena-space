/**
 * Server Proxy Component
 *
 * Component following the Digital Content Component (DCC) model responsible for acting
 * as a proxy between the authoring environment and the server.
 */

class DCCAuthorServer {
   constructor() {
      this.templateFamiliesList = this.templateFamiliesList.bind(this);
      window.messageBus.ext.subscribe("template_family/*/get", this.templateFamiliesList);
      this.casesList = this.casesList.bind(this);
      window.messageBus.ext.subscribe("case/*/get", this.casesList);
      this.modelsList = this.modelsList.bind(this);
      window.messageBus.ext.subscribe("model/*/get", this.modelsList);
      this.newCase = this.newCase.bind(this);
      window.messageBus.ext.subscribe("case/_temporary/new", this.newCase);
      this.loadCase = this.loadCase.bind(this);
      window.messageBus.ext.subscribe("case/+/get", this.loadCase);
      this.saveCase = this.saveCase.bind(this);
      window.messageBus.ext.subscribe("case/+/set", this.saveCase);
      this.renameCase = this.renameCase.bind(this);
      window.messageBus.ext.subscribe("case/+/rename", this.renameCase);
      this.loadKnotCapsule = this.loadKnotCapsule.bind(this);
      window.messageBus.ext.subscribe("capsule/knot/get", this.loadKnotCapsule);
      this.loadTemplate = this.loadTemplate.bind(this);
      window.messageBus.ext.subscribe("template/+/get", this.loadTemplate);
      this.prepareCaseHTML = this.prepareCaseHTML.bind(this);
      window.messageBus.ext.subscribe("case/+/prepare", this.prepareCaseHTML);
      this.saveKnotHTML = this.saveKnotHTML.bind(this);
      window.messageBus.ext.subscribe("knot/+/set", this.saveKnotHTML);
      this.saveCaseObject = this.saveCaseObject.bind(this);
      window.messageBus.ext.subscribe("case/+/set", this.saveCaseObject);
   }
   
   // wrapper of the services
   
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
      window.messageBus.ext.publish("template_family/*", finalFamiliesList);
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
      window.messageBus.ext.publish("model/*", finalModelsList);
   }

   async casesList() {
      const response = await fetch(DCCAuthorServer.serverAddress + "cases-list", {
         method: "POST",
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      const cases = jsonResponse.casesList;
      let finalCasesList = {};
      for (var c in cases)
         finalCasesList[cases[c]] = "icons/mono-slide.svg";
      window.messageBus.ext.publish("case/*", finalCasesList);
   }
   
   async newCase() {
      const response = await fetch(DCCAuthorServer.serverAddress + "new-case", {
         method: "POST",
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      window.messageBus.ext.publish("case/" + jsonResponse.caseName + "/set/status", "ok");
   }

   async loadCase(topic) {
      const caseName = MessageBus.extractLevel(topic, 2);
      if (caseName != "*") {
         const response = await fetch(DCCAuthorServer.serverAddress + "load-case", {
            method: "POST",
            body: JSON.stringify({"caseName": caseName}),
            headers:{
              "Content-Type": "application/json"
            }
         });
         const jsonResponse = await response.json();
         window.messageBus.ext.publish("case/" + caseName, jsonResponse.caseMd);
      }
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
         window.messageBus.ext.publish("case/" + caseName + "/version", jsonResponse.versionFile);
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
      window.messageBus.ext.publish("case/" + oldName + "/rename/status", jsonResponse.status);
   }

   async loadKnotCapsule() {
      const response = await fetch(DCCAuthorServer.serverAddress + "load-capsule", {
         method: "POST",
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      window.messageBus.ext.publish("capsule/knot", jsonResponse.capsule);
   }

   async loadTemplate(topic) {
      const templateCompleteName = MessageBus.extractLevel(topic, 2);
      const separator = templateCompleteName.indexOf("."); 
      const templateFamily = templateCompleteName.substring(0, separator);
      const templateName = templateCompleteName.substring(separator+1);
      const response = await fetch(DCCAuthorServer.serverAddress + "load-template", {
         method: "POST",
         body: JSON.stringify({"templateFamily": templateFamily,
                               "templateName": templateName}),
         headers:{
           "Content-Type": "application/json"
         }
      });
      const jsonResponse = await response.json();
      window.messageBus.ext.publish("template/" + templateCompleteName, jsonResponse.template);
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
      window.messageBus.ext.publish("case/" + caseName + "/prepare/directory", jsonResponse.directory);
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
      window.messageBus.ext.publish("knot/" + knotId + "/set/status", jsonResponse.status);
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
         window.messageBus.ext.publish("case/" + caseId + "/set/status", jsonResponse.status);
      }
   }
}
