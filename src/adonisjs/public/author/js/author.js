/*
* Main Author Environment
*
* Main authoring environment, which presents the visual interface and
* coordinates the authoring activities.
*/

class AuthorManager {
   constructor() {
      MessageBus.page = new MessageBus(false);

      Basic.service.author = this;
      
      this._knotGenerateCounter = 2;
      
      // Translator.instance = new Translator();
      Translator.instance.authoringRender = true;

      this._compiledCase = null;
      this._knots = null;
      
      this._navigator = new Navigator(Translator.instance);
      
      this._currentThemeCSS = null;
      this.currentThemeFamily = "minimal";
      this._themeSVG = true;
      this._currentCaseId = null;
      this._knotSelected = null;
      this._htmlKnot = null;
      this._editor = null;

      // (1) render slide; (2) edit knot; (3) edit case
      this._renderState = 1;
      this._editingKnot = false;  // <TODO> unify with renderState
      
      this.controlEvent = this.controlEvent.bind(this);
      MessageBus.ext.subscribe("control/#", this.controlEvent);
      
      /*
      this.knotSelected = this.knotSelected.bind(this);
      MessageBus.ext.subscribe("knot/+/selected", this.knotSelected);

      this.groupSelected = this.groupSelected.bind(this);
      MessageBus.ext.subscribe("group/+/selected", this.groupSelected);
      */

      this._caseModified = false;

      window.onbeforeunload = function() {
         return (this._caseModified)
            ? "If you leave this page you will lose your unsaved changes." : null;
      }
   }
   
   /*
    * Properties
    */

   get currentThemeFamily() {
      return this._currentThemeFamily;
   }
   
   set currentThemeFamily(newValue) {
      Translator.instance.currentThemeFamily = newValue;
      this._currentThemeFamily = newValue;

      this._currentThemeCSS =
         Basic.service.replaceStyle(document, this._currentThemeCSS, newValue);
   }

   requestCurrentThemeFamily(topic, message) {
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             this.currentThemeFamily);
   }

   get currentCaseId() {
      return this._currentCaseId;
   }

   requestCurrentCaseId(topic, message) {
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             this.currentCaseId);
   }

   /*
    *
    */

   async start() {
      this._navigationPanel = document.querySelector("#navigation-panel");
      this._knotPanel = document.querySelector("#knot-panel");
      this._messageSpace = document.querySelector("#message-space");

      this._userid = await Basic.service.signin();

      this.caseLoadSelect();
   }

   /*
    * Redirects control/<entity>/<operation> messages
    */
   controlEvent(topic, message) {
      if (MessageBus.matchFilter(topic, "control/knot/+/selected"))
         this.knotSelected(topic, message);
      else if (MessageBus.matchFilter(topic, "control/group/+/selected"))
         this.groupSelected(topic, message);
      else switch (topic) {
         case "control/case/new":  this.caseNew();
                                   break;
         case "control/case/load": this.caseLoadSelect();
                                   break;
         case "control/case/save": this.caseSave();
                                   break;
         case "control/case/markdown": this.caseMarkdown();
                                       break;
         case "control/knot/new":  this.knotNew();
                                   break;
         case "control/knot/edit": this.knotEdit();
                                   break;
         case "control/knot/markdown": this.knotMarkdown();
                                       break;
         case "control/case/play": this.casePlay();
                                   break;
         case "control/config/edit": this.config();
                                     break;
         case "control/_current_theme_name/get":
            this.requestCurrentThemeFamily(topic, message);
            break;
         case "control/_current_case_id/get":
            this.requestCurrentCaseId(topic, message);
            break;
         case "control/knot/update": this.knotUpdate(message);
                                     break;
      }
   }
   
   /*
    * ACTION: control-load (1)
    */
   async caseLoadSelect() {
      const saved = await this.saveChangedCase();

      const cases = await MessageBus.ext.request("data/case/*/list",
                                                 {filterBy: "user",
                                                  filter: this._userid});
      const caseId = await DCCNoticeInput.displayNotice(
         "Select a case to load or start a new case.",
         "list", "Select", "New", cases.message);

      if (caseId == "New")
         this.caseNew();
      else
         this._caseLoad(caseId);
   }
   
   async saveChangedCase() {
      let decision = "No";

      if (this._caseModified) {
         decision = await DCCNoticeInput.displayNotice(
            "There are unsaved modifications in the case. Do you want to save?",
            "message", "Yes", "No");
         if (decision == "Yes")
            await this.caseSave();
      }

      return decision;
   }

   /*
    * ACTION: control-new
    */
   async caseNew() {
      this._temporaryCase = true;
      
      await this._themeSelect();
      let template = await this._templateSelect("case");

      const templateMd =
         await MessageBus.ext.request("data/template/" + template.replace("/", ".") + "/get");

      const caseId = await MessageBus.ext.request("data/case//new",
                                                  {format: "markdown",
                                                   name: "Untitled",
                                                   source: templateMd.message});
      this._caseLoad(caseId.message);
   }

   /*
    * ACTION: control-load (2)
    */
   async _caseLoad(caseId) {
      this._currentCaseId = caseId;
      const caseObj = await MessageBus.ext.request(
         "data/case/" + this._currentCaseId + "/get");
      this._currentCaseName = caseObj.message.name;
      await this._compile(caseObj.message.source);
      this._showCase();
   }
      
   async _compile(caseSource) {
      this._compiledCase = Translator.instance.compileMarkdown(this._currentCaseId,
                                                               caseSource);
      this._knots = this._compiledCase.knots;
      this.currentThemeFamily = this._compiledCase.theme;

      console.log(this._compiledCase);
   }

   async _showCase() {
      await this._navigator.mountTreeCase(this, this._compiledCase.knots);
      
      const knotIds = Object.keys(this._knots);
      let k = 0;
      while (k < knotIds.length && !this._knots[knotIds[k]].render)
         k++;
      
      MessageBus.ext.publish("control/knot/" + knotIds[k] + "/selected");
   }
   
   /*
    * ACTION: control-save
    */
   async caseSave() {
      if (this._currentCaseId != null && this._compiledCase != null) {
         this._checkKnotModification(this._renderState);

         if (this._temporaryCase) {
            const caseName =
               await DCCNoticeInput.displayNotice("Inform a name for your case:",
                                                  "input");
            this._currentCaseName = caseName;
            this._temporaryCase = false;
         }

         let md =Translator.instance.assembleMarkdown(this._compiledCase);
         const status = await MessageBus.ext.request("data/case/" + this._currentCaseId + "/set",
                                                     {name: this._currentCaseName,
                                                      format: "markdown",
                                                      source: md});
         
         console.log("Case saved! Status: " + status.message);

         this._messageSpace.innerHTML = "Saved";
         setTimeout(this._clearMessage, 2000);
         let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 2000);
         });
         let result = await promise;
         this._messageSpace.innerHTML = "";
      }
   }

   /*
    * ACTION: control/case/edit
    */
   async caseMarkdown() {
      const nextState = (this._renderState != 3) ? 3 : 1;
      if (this._renderState != 3) {
         this._originalMd = Translator.instance.assembleMarkdown(this._compiledCase);
         this._presentEditor(this._originalMd);
      } else {
         this._checkKnotModification(nextState);
         this._renderState = nextState;
         this._renderKnot();
      }
      this._renderState = nextState;
   }

   _presentEditor(source) {
      this._knotPanel.innerHTML = "<div id='editor-space' class='sty-editor'></div>";
      this._editor = new Quill("#editor-space", {
      });
      this._editor.insertText(0, source);
   }

   /*
    * Check if the knot was modified to update it
    */
   _checkKnotModification(nextState) {
      // (1) render slide; (2) edit knot; (3) edit case
      let modified = false;
      if (this._renderState == 2) {
         if (this._editor != null) {
            const editorText = this._retrieveEditorText();
            if (this._knots[this._knotSelected]._source != editorText) {
               modified = true;
               this._knots[this._knotSelected]._source = editorText;
               Translator.instance.extractKnotAnnotations(this._knots[this._knotSelected]);
               Translator.instance.compileKnotMarkdown(this._knots, this._knotSelected);
            }
         }
      } else if (this._renderState == 3) {
         if (this._editor != null) {
            const editorText = this._retrieveEditorText();
            if (!this._originalMd || this._originalMd != editorText) {
               modified = true;
               if (nextState != 3)
                  delete this._originalMd;
               this._compile(editorText);
               if (nextState == 3)
                  this._renderState = 1;
               this._showCase();
            }
         }
      }

      if (!this._caseModified)
        this._caseModified = modified;
      return modified;
   }
   
   _retrieveEditorText() {
      const editorText = this._editor.getText();
      return editorText.substring(0, editorText.length - 1);
   }

   async _templateSelect(scope) {
      const templateList = await MessageBus.ext.request("data/template/*/list",
                                                        {scope: scope});
      const template = await DCCNoticeInput.displayNotice(
         "Select a template for your knot.",
         "list", "Select", "Cancel", templateList.message);
      return template;
   }
   
   /*
    * ACTION: control-edit
    */
   async knotMarkdown() {
      if (this._knotSelected != null) {
         const nextState = (this._renderState != 2) ? 2 : 1;
         if (this._checkKnotModification(nextState))
            this._htmlKnot = await Translator.instance.generateHTML(
               this._knots[this._knotSelected]);
         this._renderState = nextState;
         this._renderKnot();
      }
   }

   async knotUpdate(message) {
      // console.log(message);
      if (this._knotSelected != null) {
         let updated = false;
         for (let el = 0; el < this._knots[this._knotSelected].content.length &&
                          !updated; el++) {
            let element = this._knots[this._knotSelected].content[el];
            if ("dcc" + element.seq == message.elementid) {
              updated = true;
              element._source = message.markdown;
              switch (element.type) {
                 case "text" : Translator.instance.textUpdate(element, message);
                               break;
                 case "image": Translator.instance.imageUpdate(element, message);
                               break;
              }
              // console.log(element);
            }
         }
         this._htmlKnot = await Translator.instance.generateHTML(
            this._knots[this._knotSelected]);
         this._renderKnot();
         document.querySelector("#trigger-knot-edit").image =
             "icons/icon-edit-knot.svg";
      }
   }
   
   /*
    * ACTION: control-play
    */
   async casePlay() {
      Translator.instance.newThemeSet();
      
      const htmlSet = Object.assign(
                         {"entry": {render: true},
                          "signin": {render: true},
                          "register": {render: true},
                          "report": {render: true}},
                         this._knots);
      const total = Object.keys(htmlSet).length;
      let processing = 0;
      for (let kn in htmlSet) {
         processing++;
         this._messageSpace.innerHTML = "Processed: " + processing + "/" + total;
         if (htmlSet[kn].render) {
            let finalHTML = "";
            if (processing > 4)
               finalHTML = await Translator.instance.generateHTMLBuffer(
                                                     this._knots[kn]);
               // finalHTML = await this._generateHTMLBuffer(kn);
            else 
               finalHTML = await Translator.instance.loadTheme(kn);
               // finalHTML = await this._loadTheme(this._currentThemeFamily, kn);
            finalHTML = (htmlSet[kn].categories && htmlSet[kn].categories.indexOf("note") >= 0)
               ? AuthorManager.jsonNote.replace("{knot}", finalHTML)
               : AuthorManager.jsonKnot.replace("{knot}", finalHTML);
            
            await MessageBus.ext.request("knot/" + kn + "/set",
                                                {caseId: this._currentCaseId,
                                                 format: "html",
                                                 source: finalHTML},
                                                "knot/" + kn + "/set/status");
         }
      }
      this._messageSpace.innerHTML = "Finalizing...";
      
      let caseJSON = Translator.instance.generateCompiledJSON(this._compiledCase);
      await MessageBus.ext.request("case/" + this._currentCaseId + "/set",
                                          {format: "json", source: caseJSON},
                                          "case/" + this._currentCaseId + "/set/status");
      
      this._messageSpace.innerHTML = "";
      
      Translator.instance.deleteThemeSet();
      window.open(dirPlay.message + "/html/index.html", "_blank");
   }
   
   /*
    * ACTION: config
    */
   async config() {
      this._themeSelect();
   }
   

   async _themeSelect() {
      const families = await MessageBus.ext.request("data/theme_family/*/list");
      this.currentThemeFamily = await DCCNoticeInput.displayNotice(
         "Select a theme to be applied.",
         "list", "Select", "Cancel", families.message);
      this._themeSVG = families.message[Translator.instance.currentThemeFamily].svg;
   }
   
   /*
    * ACTION: knot-selected
    */
   async knotSelected(topic, message) {
      if (this._miniPrevious)
         this._miniPrevious.classList.remove("sty-selected-knot");
      
      const knotid = MessageBus.extractLevel(topic, 3);

      const miniature = document.querySelector("#mini-" + knotid.replace(/\./g, "_"));

      miniature.classList.add("sty-selected-knot");
      
      this._miniPrevious = miniature;
            
      if (knotid != null) {
         if (this._knots[knotid].categories &&
             this._knots[knotid].categories.indexOf("expansion") > -1) {
            this._knotSelected = knotid;
            this.knotNew();
         } else {
            this._checkKnotModification(this._renderState);
            this._knotSelected = knotid;
            // this._htmlKnot = await this._generateHTML(this._knotSelected);
            this._htmlKnot = await Translator.instance.generateHTML(
                                     this._knots[this._knotSelected]);
            this._renderKnot();
         }
      }
    }
   
   /*
    * ACTION: control/knot/new
    */
   async knotNew() {
      let template = await this._templateSelect("knot");

      let markdown = await MessageBus.ext.request("data/template/" +
                           template.replace("/", ".") + "/get");
      
      while (this._knots["Knot_" + this._knotGenerateCounter])
         this._knotGenerateCounter++;
      const knotId = "Knot_" + this._knotGenerateCounter;
      const knotMd = "Knot " + this._knotGenerateCounter;
      this._knotGenerateCounter++;

      markdown = markdown.message.replace("_Knot_Name_", knotMd) + "\n";

      let newKnotSet = {};
      for (let k in this._knots) {
         if (k == this._knotSelected)
            newKnotSet[knotId] = {
               toCompile: true,
               _source: markdown
            };
         newKnotSet[k] = this._knots[k];
      }

      // <TODO> duplicated reference - improve it
      this._compiledCase.knots = newKnotSet;
      this._knots = newKnotSet;

      const md =Translator.instance.assembleMarkdown(this._compiledCase);
      this._compile(md);

      this._knotSelected = knotId;

      /*
      let newKnot = {type: "knot",
                     title: "Knot " + this._knotGenerateCounter,
                     level: 1,
                     render: true,
                     _source: "# Knot " + this._knotGenerateCounter + "\n\n"};
      this._knots[knotId] = newKnot;
      */

      // Translator.instance.extractKnotAnnotations(this._knots[knotId]);
      // Translator.instance.compileKnotMarkdown(this._knots, knotId);
      this._htmlKnot = await Translator.instance.generateHTML(this._knots[knotId]);
      await this._showCase();
      // await this._navigator.mountPlainCase(this, this._compiledCase.knots);
      MessageBus.ext.publish("control/knot/" + this._knotSelected + "/selected");
   }

    /*
     * ACTION: group-selected
     */
    async groupSelected(topic, message) {
      this.knotSelected(topic, message);
      const knotid = MessageBus.extractLevel(topic, 3);
      this._navigator.downTree(knotid);
    }

    knotEdit(topic, message) {
       if (!this._editingKnot) {
          document.querySelector("#trigger-knot-edit").image =
             "icons/icon-edit-knot-selected.svg";
          let dccs = document.querySelectorAll("*");
          for (let d = 0; d < dccs.length; d++)
             if (dccs[d].tagName.toLowerCase().startsWith("dcc-") &&
                 typeof dccs[d].editDCC === "function")
                dccs[d].editDCC();
       }
       else {
          document.querySelector("#trigger-knot-edit").image =
             "icons/icon-edit-knot.svg";
          this._renderKnot();
      }
      this._editingKnot = !this._editingKnot;
    }

   _renderKnot() {
      if (this._renderState == 1) {
         this._knotPanel.innerHTML = this._htmlKnot;
      } else
         this._presentEditor(this._knots[this._knotSelected]._source);
   }
}

(function() {
   AuthorManager.jsonKnot = "(function() { PlayerManager.player.presentKnot(`{knot}`) })();";
   AuthorManager.jsonNote = "(function() { PlayerManager.player.presentNote(`{knot}`) })();";
   
   AuthorManager.author = new AuthorManager();
})();