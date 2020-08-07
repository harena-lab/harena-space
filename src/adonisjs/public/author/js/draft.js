class DraftManager {
   async start() {
      let mode = window.location.search.substr(1);
      if (mode != null && mode.length > 0) {
         const md = mode.match(/mode=([\w-]+)/i);
         mode = (md == null) ? null : md[1];
      } else
         mode = null;
      let advanced =
         (mode != null && mode.toLowerCase() == "advanced") ? true : false;

      this.deleteCase = this.deleteCase.bind(this);
      MessageBus.int.subscribe("control/case/delete", this.deleteCase);

      if (advanced) {
         this.downloadCase = this.downloadCase.bind(this);
         MessageBus.int.subscribe("control/case/download", this.downloadCase);
      }

      const authorState = Basic.service.authorStateRetrieve();

      this._boxesPanel = document.querySelector("#case-boxes");
      this._draftSelect(authorState.userid, advanced);
   }

   async _draftSelect(userid, advanced) {
      const cases = await MessageBus.ext.request("data/case/*/list",
                                                 {user: userid});

      const cl = cases.message;
      for (let c in cl) {
         let template = document.createElement("template");
         const html = DraftManager.caseBox
            .replace("[download]", (advanced) ? DraftManager.caseDownload : "");
         template.innerHTML = html
            .replace(/\[id\]/ig, cl[c].id)
            // .replace("[icon]", cl[c].icon)
            .replace("[title]", cl[c].title);
            // .replace("[description]", cl[c].description);
         this._boxesPanel.appendChild(template.content.cloneNode(true));
         let editButton = this._boxesPanel.querySelector("#e" + cl[c].id);
         let previewButton = this._boxesPanel.querySelector("#p" + cl[c].id);
         let deleteButton = this._boxesPanel.querySelector("#d" + cl[c].id);
         let downloadButton = (advanced)
            ? this._boxesPanel.querySelector("#w" + cl[c].id) : null;
         editButton.addEventListener("click",
            function() {
               Basic.service.authorPropertyStore("caseId", this.id.substring(1));
               window.location.href = "http://0.0.0.0:10010/author/author.html";
            }
         );
         previewButton.addEventListener("click",
            function(){
               Basic.service.authorPropertyStore("caseId", this.id.substring(1));
               window.location.href = "../player/index.html?caseid=" +
                                      this.id.substring(1) +
                                      "&preview";
            }
         );
         deleteButton.addEventListener("click",
            function() {
               MessageBus.int.publish("control/case/delete", this.id.substring(1));
            }
         );
         if (advanced)
            downloadButton.addEventListener("click",
               function() {
                  MessageBus.int.publish("control/case/download", this.id.substring(1));
               }
            );
      }
   }

   async deleteCase(topic, message) {
      const decision =
         await DCCNoticeInput.displayNotice(
            "Are you sure that you want to delete this case? (write yes or no)",
            "input");
      if (decision.toLowerCase() == "yes")
         await MessageBus.ext.request("data/case/" + message + "/delete");
      const box = this._boxesPanel.querySelector("#b" + message);
      this._boxesPanel.removeChild(box);
   }

   async downloadCase(topic, message) {
      const caseObj = await MessageBus.ext.request(
         "data/case/" + message + "/get");
      Basic.service.downloadFile(
         caseObj.message.source, caseObj.message.title + ".md");
   }
}

(function() {
DraftManager.instance = new DraftManager();

DraftManager.caseBox =
`<div id="b[id]" class="d-flex h-100 flex-column draft-author-case-container">
   <div class="draft-case-image w-100 h-50"></div>
   <div class="draft-case-title">[title]</div>
   <div class="draft-author-description">Brief description of the case.</div>
   <div class="d-flex">
      <div id="e[id]" class="author-panel-button">EDIT</div>
      <div id="p[id]" class="author-panel-button">PREVIEW</div>
      <div id="d[id]" class="author-panel-button">DELETE</div>[download]
   </div>
</div>`;

DraftManager.caseDownload =
`
      <div id="w[id]" class="author-panel-button">DOWNLOAD</div>`;

})();