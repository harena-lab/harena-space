/*
 * Versum Author Environment
 *
 * Authoring environment to test the Versum language.
 */

class AuthorVersumManager {
   constructor() {
   	MessageBus.page = new MessageBus(false);
      Basic.service.rootPath = "../../";
      DCCCommonServer.instance.local = true;
   }

   start() {
      this.translate = this.translate.bind(this);
      this.updateVisibility = this.updateVisibility.bind(this);

      MessageBus.ext.subscribe("control/translate/example", this.translate);
      MessageBus.ext.subscribe("var/output/changed", this.updateVisibility);
   }

   async translate(topic, message) {
      Translator.instance.authoringRender = false;

      Basic.service.currentThemeFamily = "zombie";
      DCCCommonServer.instance.local = true;

      let compiled = await Translator.instance.compileMarkdown(
                                   "test", document.querySelector("#editor").value);
      document.querySelector("#object-results").value = JSON.stringify(compiled, null, 3);
      let html = "";
      for (let knot in compiled.knots) {
         let mkHTML = await Translator.instance.generateKnotHTML(compiled.knots[knot].content);
         html += mkHTML;
      }
      document.querySelector("#html-panel").value = html;
      document.querySelector("#render-panel").innerHTML = html;
   }

   updateVisibility(topic, message) {
      for (let si in AuthorVersumManager.stateId) {
         let s = document.querySelector("#" + AuthorVersumManager.stateId[si] + "-block");
         if (s != null)
            s.style.display =
               (AuthorVersumManager.stateVis[message.value][si] == 0) ? "none" : "initial";
      }
   }
}

(function() {
AuthorVersumManager.stateId = ["versum", "object", "html", "rendered"];

AuthorVersumManager.stateVis = {
   "versum-object":   [1, 1, 0, 0],
   "versum-html":     [1, 0, 1, 0],
   "versum-rendered": [1, 0, 0, 1],
   "object-html":     [0, 1, 1, 0],
   "object-rendered": [0, 1, 0, 1]
};

AuthorVersumManager.s = new AuthorVersumManager();
})();