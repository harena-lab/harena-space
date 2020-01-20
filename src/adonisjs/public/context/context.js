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

   async loadResource(id) {
      console.log("=== id");
      console.log(id);
      const uri = this.resolveNS(id);
      console.log("=== uri");
      console.log(uri);
      console.log(this._contextIndex);
      let resource =
         await MessageBus.int.request("data/context/" +
            this._contextIndex[uri].label + "/get",
            this._contextIndex[uri].resource);
      return JSON.parse(resource.message);
   }

   resolveNS(id) {
      let nf = null;
      console.log("=== namespaces");
      console.log(this._namespaces);
      for (let ns in this._namespaces)
         if (id.startsWith(ns + ":"))
            nf = ns;
      return (nf == null) ? id : id.replace(nf + ":", this._namespaces[nf]);
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