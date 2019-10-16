class DraftManager {
   async start() {
      const authorState = Basic.service.authorStateRetrieve();

      console.log(authorState);

      this._boxesPanel = document.querySelector("#case-boxes");
      this._draftSelect(authorState.userid);
   }

   async _draftSelect(userid) {
      const cases = await MessageBus.ext.request("data/case/*/list",
                                                 {filterBy: "user",
                                                  filter: userid});

      const cl = cases.message;
      for (let c in cl) {
         let cid = "i" + cl[c].id.replace(/-/ig, "_");
         let template = document.createElement("template");
         template.innerHTML = DraftManager.caseBox
            .replace("[id]", cid)
            // .replace("[icon]", cl[c].icon)
            .replace("[title]", cl[c].name);
            // .replace("[description]", cl[c].description);
         this._boxesPanel.appendChild(template.content.cloneNode(true));
         let box = this._boxesPanel.querySelector("#" + cid);
         box.addEventListener("click",
               function(){
                  let cid = this.id.replace(/_/ig, "-");
                  cid = cid.substring(1);
                  Basic.service.authorCaseStore(cid);
                  window.location.href = 'author.html';
               }
            );
      }
   }
}

(function() {
DraftManager.instance = new DraftManager();

DraftManager.caseBox =
`<div class="d-flex h-100 flex-column draft-author-case-container">
   <div class="draft-case-image w-100 h-50"></div>
   <div class="draft-case-title">[title]</div>
   <div class="draft-author-description">Brief description of the case.</div>
   <div class="d-flex">
      <div id="[id]" class="author-case-buttons">EDIT</div>
      <div class="author-case-buttons">PREVIEW</div>
      <div class="author-case-buttons">DELETE</div>
   </div>
</div>`;

})();