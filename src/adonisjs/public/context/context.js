/**
 * Context Manager
 *
 */

class Context {
   constructor() {
      this._namespaces = {};
   }

   async loadContextIndex() {
      const ctxIndex = await MessageBus.int.request("data/context/*/list");
      this._contextIndex = ctxIndex.message;
   }

   // <TODO> filter only select vocabularies of the context
   listSelectVocabularies() {
      let list = [];
      for (let c in this._contextIndex)
         list.push([c, this._contextIndex[c].label]);
      return list;
   }

   async loadContext(uri) {
      let context =
         await MessageBus.int.request("data/context/" +
            this._contextIndex[uri].label + "/get",
            this._contextIndex[uri].resource);
      return JSON.parse(context.message);
   }

   async loadContextNS(namespace) {
      let context = null;
      
   }

   addNamespace(namespace, uri) {
      this._namespaces[namespace] = uri;
   }

   addNamespaceSet(namespaceSet) {
      for (let n in namespaceSet)
         this._namespaces[n] = namespaceSet[n];
   }
}

(function() {
   Context.instance = new Context();
   Context.instance.loadContextIndex();
})();