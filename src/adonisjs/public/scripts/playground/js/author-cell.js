/*
 * Main Author Environment
 *
 * Main authoring environment, which presents the visual interface and
 * coordinates the authoring activities.
 */

class AuthorCellManager {
   constructor() {
   	this.source = null;
   	this._playground = null;
   	this._editMode = true;
   	this._pĺaySpace = false;

   	MessageBus.page = new MessageBus(false);
      Basic.service.rootPath = "../../";
   }

   start() {
      this.switchEditor = this.switchEditor.bind(this);
      this.playSpace = this.playSpace.bind(this);
      this.stopSpace = this.stopSpace.bind(this);
      this.restartSpace = this.restartSpace.bind(this);

      MessageBus.ext.subscribe("control/editor/switch", this.switchEditor);
      MessageBus.ext.subscribe("control/space/play", this.playSpace);
      MessageBus.ext.subscribe("control/space/stop", this.stopSpace);
      MessageBus.ext.subscribe("control/space/restart", this.restartSpace);

      this._scriptsActive = true;

      let parameters = window.location.search.substr(1);
      if (parameters != null && parameters.length > 0) {
         const sourceMatch = parameters.match(/source=([\w-\/]+)/i);
         if (sourceMatch != null) {
            this.source = sourceMatch[1];
            let caseScript = document.createElement("script");
            caseScript.src = "gallery/" + this.source + ".js";
            document.head.appendChild(caseScript);
         }

         const scriptMatch = parameters.match(/mode=([\w-]+)/i);
         if (scriptMatch != null && scriptMatch[1] == "no-script")
            this._scriptsActive = false;
      }
      if (this._scriptsActive)
         document.querySelector("#action-panels").innerHTML = AuthorCellManager.scriptPanel;
      else
         document.querySelector("#action-panels").innerHTML = AuthorCellManager.noScriptPanel;
   }

   insertSource(name, types, blocks, source, buttonTypes) {
      if (this._scriptsActive) {
         ScriptBlocksCell.create(types);

         document.querySelector("#xml-toolbox").innerHTML =
             `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">` +
             blocks +
             `</xml>`;

         this._playground = Blockly.inject("script-panel",
            {media: "../../lib/blockly-07762ff/media/",
             toolbox: document.getElementById("toolbox")});
      }

      document.querySelector("#source-name").innerHTML = name;
      document.querySelector("#render-panel").innerHTML = source;
      document.querySelector("#types-panel").innerHTML = buttonTypes;

      this._updateVisibility();
   }

   _updateVisibility() {
      const states = (this._editMode)
         ? ["none","none","none","none","initial",
            (this._scriptsActive) ? "initial" : "none",
            "none","initial"]
         : ["initial","none","initial","initial","none","none","initial","none"];
      document.querySelector("#play-button").style.display = states[0];
      document.querySelector("#stop-button").style.display = states[1];
      document.querySelector("#restart-button").style.display = states[2];
      document.querySelector("#next-button").style.display = states[3];
      document.querySelector("#types-panel").style.display = states[4];
      document.querySelector("#script-panel").style.display = states[5];
      document.querySelector("#editor-button").style.display = states[6];
      document.querySelector("#execute-button").style.display = states[7];
   }

   async switchEditor() {
      MessageBus.ext.publish("timer/stop");
      this._editMode = !this._editMode;
      this._updateVisibility();

      if (this._editMode) {
	      if (this._playTriggered) {
	         this._playTriggered = false;
	         let decision = await DCCNoticeInput.displayNotice(
	            "Você quer retornar ao cenário original ou editar esse novo cenário que você está vendo?",
	            "message", "Voltar ao Original", "Este Cenário");
	         if (decision == "Voltar ao Original")
	         	MessageBus.ext.publish("state/reset");
	      }
	  } else {
        MessageBus.ext.publish("state/save");
        if (this._scriptsActive) {
           await MessageBus.page.request("dcc/rules/clear");
           document.querySelector("#rules-panel").innerHTML =
              Blockly.JavaScript.workspaceToCode(this._playground);
        }
	  }
   }

   playSpace() {
      document.querySelector("#play-button").style.display = "none";
      document.querySelector("#stop-button").style.display = "initial";
      this._playTriggered = true;
      MessageBus.ext.publish("timer/start");
   }

   stopSpace() {
      document.querySelector("#play-button").style.display = "initial";
      document.querySelector("#stop-button").style.display = "none";
      MessageBus.ext.publish("timer/stop");
   }

   restartSpace() {
      MessageBus.ext.publish("timer/stop");
      MessageBus.ext.publish("state/reset");
   }
}

(function() {
AuthorCellManager.instance = new AuthorCellManager();

AuthorCellManager.scriptPanel =
`<div class="d-flex col-6 flex-column align-items-stretch">
   <div>
      <div id="render-panel"></div>
      <div id="types-panel"></div>
   </div>
   <div id="rules-panel"></div>
</div>
<div class="d-flex col-6 flex-column align-items-stretch">
   <div id="script-panel" class="h-100 w-100"></div>
</div>`;

AuthorCellManager.noScriptPanel =
`<div class="d-flex col-6 flex-column align-items-stretch">
   <div id="render-panel"></div>
</div>
<div class="d-flex col-6 flex-column align-items-stretch">
   <div id="types-panel" class="h-100 w-100"></div>
   <div id="script-panel"></div>
   <div id="rules-panel"></div>
</div>`;

})();