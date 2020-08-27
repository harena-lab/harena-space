/**
 * Context Manager
 *
 */

class Context {
  constructor () {
    this._namespaces = {}
  }

  async loadContextIndex () {
    const ctxIndex = await MessageBus.int.request('data/context/*/list')
    this._contextIndex = ctxIndex.message
  }

  // <TODO> filter only select vocabularies of the context
  listSelectVocabularies () {
    const list = []
    console.log('=== namespaces')
    console.log(this._namespaces)
    for (const c in this._contextIndex) { list.push([this.toNS(c), this._contextIndex[c].label]) }
    console.log('=== list')
    console.log(list)
    return list
  }

  async loadResource (id) {
    console.log('=== id')
    console.log(id)
    const uri = this.resolveNS(id)
    console.log('=== uri')
    console.log(uri)
    console.log(this._contextIndex)
    const resource =
         await MessageBus.int.request('data/context/' +
            this._contextIndex[uri].label + '/get',
         this._contextIndex[uri].resource)
    return JSON.parse(resource.message)
  }

  resolveNS (id) {
    let nf = null
    for (const ns in this._namespaces) {
      if (id.startsWith(ns + ':')) { nf = ns }
    }
    return (nf == null) ? id : id.replace(nf + ':', this._namespaces[nf])
  }

  toNS (uri) {
    console.log('=== uri')
    console.log(uri)
    let nf = null
    for (const ns in this._namespaces) {
      if (uri.startsWith(this._namespaces[ns]) &&
             (nf == null || this._namespaces[ns].length > this._namespaces[nf].length)) { nf = ns }
    }
    console.log('=== nf')
    console.log(nf)
    return (nf == null) ? uri : uri.replace(this._namespaces[nf], nf + ':')
  }

  addNamespace (namespace, uri) {
    this._namespaces[namespace] = uri
  }

  addNamespaceSet (namespaceSet) {
    for (const n in namespaceSet) { this._namespaces[n] = namespaceSet[n] }
  }
}

(function () {
  Context.instance = new Context()
  Context.instance.loadContextIndex()
})()
