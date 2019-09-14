/**
 * Context Manager
 *
 */

class Context {
   async loadContext() {
       const ctxList = await MessageBus.int.request("data/context/*/list");
       this._contextList = ctxList.message;
   }

   listSelectVocabularies() {
      let list = [];
      for (let c in this._contextList)
         list.push([c, this._contextList[c].label]);
      return list;
   }
}

(function() {
   Context.instance = new Context();
   Context.instance.loadContext();
})();