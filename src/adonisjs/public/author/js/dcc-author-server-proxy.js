/**
 * Server Proxy Component
 *
 * Component following the Digital Content Component (DCC) model responsible for acting
 * as a proxy between the authoring environment and the server.
 */

class DCCAuthorServer {
   constructor() {
      this.loadModule = this.loadModule.bind(this);
      MessageBus.ext.subscribe("data/module/+/get", this.loadModule);
      this.loadTemplate = this.loadTemplate.bind(this);
      MessageBus.ext.subscribe("data/template/+/get", this.loadTemplate);
      this.saveCase = this.saveCase.bind(this);
      MessageBus.ext.subscribe("data/case/+/set", this.saveCase);
      this.newCase = this.newCase.bind(this);
      MessageBus.ext.subscribe("data/case//new", this.newCase);

      this.themeFamiliesList = this.themeFamiliesList.bind(this);
      MessageBus.ext.subscribe("data/theme_family/*/list", this.themeFamiliesList);
      
      this.templatesList = this.templatesList.bind(this);
      MessageBus.ext.subscribe("data/template/*/list", this.templatesList);
      this.uploadArtifact = this.uploadArtifact.bind(this);
      MessageBus.ext.subscribe("data/asset//new", this.uploadArtifact);
      
      /*
      this.prepareCaseHTML = this.prepareCaseHTML.bind(this);
      MessageBus.ext.subscribe("case/+/prepare", this.prepareCaseHTML);
      this.saveKnotHTML = this.saveKnotHTML.bind(this);
      MessageBus.ext.subscribe("knot/+/set", this.saveKnotHTML);
      this.saveCaseObject = this.saveCaseObject.bind(this);
      MessageBus.ext.subscribe("case/+/set", this.saveCaseObject);
      */
   }
   
   // wrapper of the services

   async themeFamiliesList(topic, message) {
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "application/json",
          }
      }
      const response = await fetch("../themes/themes.json", header);
      let jsonResponse = await response.json();
      let busResponse = {};
      for (var t in jsonResponse)
         busResponse[jsonResponse[t].path] = {
            name: t,
            icon: "../themes/" + jsonResponse[t].path + "/images/" + jsonResponse[t].icon
         };
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             busResponse);
   }

   async templatesList(topic, message) {
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "application/json",
          }
      }
      const response = await fetch("../templates/templates.json", header);
      let jsonResponse = await response.json();
      let busResponse = {};
      for (var t in jsonResponse)
         if (jsonResponse[t].scope == message.scope)
            busResponse[jsonResponse[t].path] = {
               name: t,
               icon: "/templates/" + jsonResponse[t].icon
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
            "Authorization": "Bearer " + DCCCommonServer.instance.token
          },
          "body": JSON.stringify({name: message.name,
                                  source: message.source})
      };
      const response =
         await fetch(DCCCommonServer.managerAddressAPI + "case", header);
      const jsonResponse = await response.json();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             jsonResponse.uuid);
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
               "Authorization": "Bearer " + DCCCommonServer.instance.token
             },
             "body": JSON.stringify({name: message.name,
                                     source: message.source})
         };
         const response =
            await fetch(DCCCommonServer.managerAddressAPI + "case/" + caseId, header);
         const jsonResponse = await response.json();
         MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             jsonResponse.source);
      }
   }

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
   
   async loadTemplate(topic, message) {
      let templatePath = MessageBus.extractLevel(topic, 3).replace(".", "/");
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "GET",
         "headers": {
            "Content-Type": "text/plain",
          }
      }
      const response = await fetch("../templates/" + templatePath +
                                   ".md", header);
      let textResponse = await response.text();
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             textResponse);
   }

   async uploadArtifact(topic, message) {
      var data = new FormData();
      data.append("file", message.file);
      data.append("case_uuid", message.caseid);
      var header = {
         "async": true,
         "crossDomain": true,
         "method": "POST",
         "headers": {
            "Accept": "application/json",
            "cache-control": "no-cache",
            "Authorization": "Bearer " + DCCCommonServer.instance.token
          },
          "processData": false,
          "contentType": false,
          "mimeType": "multipart/form-data",
          "body": data
      };
      // console.log("file: " + message.file);
      // console.log("caseid: " + message.caseid);
      console.log(header);
      const response =
         await fetch(DCCCommonServer.managerAddressAPI + "artifact", header);
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             jsonResponse.filename);
   }

   /*
   async prepareCaseHTML(topic, themeFamily) {
      const caseName = MessageBus.extractLevel(topic, 2);
      const response = await fetch(DCCCommonServer.managerAddressAPI + "prepare-case-html", {
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
      
      const response = await fetch(DCCCommonServer.managerAddressAPI + "save-knot-html", {
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
         const response = await fetch(DCCCommonServer.managerAddressAPI + "save-case-script", {
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
   */
}

(function() {
   DCCAuthorServer.instance = new DCCAuthorServer();
})();