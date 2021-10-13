/**
 * Context Manager
 *
 */

class Context {
  constructor () {
    this._namespaces = {}
  }

  async loadContextIndex () {
    const ctxIndex = await MessageBus.i.request('data/context/*/list')
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
    const uri = this.resolveNS(id)
    const resource =
         await MessageBus.i.request('data/context/' +
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
    let nf = null
    for (const ns in this._namespaces) {
      if (uri.startsWith(this._namespaces[ns]) &&
             (nf == null || this._namespaces[ns].length > this._namespaces[nf].length)) { nf = ns }
    }
    return (nf == null) ? uri : uri.replace(this._namespaces[nf], nf + ':')
  }

  addNamespace (namespace, uri) {
    this._namespaces[namespace] = uri
  }

  addNamespaceSet (namespaceSet) {
    for (const n in namespaceSet) { this._namespaces[n] = namespaceSet[n] }
  }

  toRDF (compiled) {
    let rdf = Context.namespaces
    if (compiled != null && compiled.knots) {
      for (let k in compiled.knots)
        rdf += this._rdfAnnotations(compiled.knots[k].annotations)
    }
    return rdf
  }

  _rdfAnnotations (annotations, context) {
    let rdf = ''

    let ctx = {
      namespace: ''
    }
    if (context != null) {
      ctx.namespace = (context.namespace) ? context.namespace + ':' : ''
      ctx.context = (context.context) ? context.namespace + ':' + context.context : null
      ctx.property = context.property
      ctx.value = context.value
    }

    if (annotations) {
      for (let an of annotations)
        if (an.type == 'context')
          rdf += this._rdfAnnotations(an.annotations, an)
        else if (an.type == 'annotation' || an.type == 'select') {
          const ws = ((an.natural) ? an.natural.complete : an.expression)
            .replace(/["]/g, '\\"')
          const wl = ws.match(/([\w-]+)/g)
          const n = an.id.lastIndexOf('_')
          const prefix = an.id.substring(0, n+1)
          const sufixInitial = parseInt(an.id.substring(n+1))
          let sufix = sufixInitial
          let idchain = "id:" + prefix + sufix
          if (wl.length > 1) {
            idchain = 'id:'
            for (let w of wl) {
              idchain += ((idchain == 'id:') ? '' : '_') + prefix + sufix
              sufix++
            }
            rdf += idchain + ' rdfs:label "' + ws + '" .\n'
            sufix = sufixInitial
          }
          if (an.formal) {
            const formal = (an.formal.complete.includes(':'))
              ? an.formal.complete : ctx.namespace + an.formal.complete
            rdf += idchain + ' owl:sameAs ' + formal + ' .\n'
          }
          if (an.value) {
            if (ctx.value)
              rdf += idchain + ' ' + an.value + ' ' + ctx.value + ' .\n'
            else if (ctx.property)
              rdf += idchain + ' ' + ctx.property + ' "' + an.value + '" .\n'
          }
          if (ctx.context != null)
            rdf += idchain + ' versum:context ' + ctx.context + ' .\n'
          for (let w of wl) {
            rdf += 'id:' + prefix + sufix + ' rdfs:label "' + w + '" .\n'
            if (wl.length > 1)
              rdf += idchain + ' versum:hasPart id:' + prefix + sufix + ' .\n'
            sufix++
          }
        }
    }
    return rdf
  }
}

(function () {
  Context.namespaces =
`@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix id: <http://purl.org/versum/id/> .
@prefix versum: <http://purl.org/versum/> .
@prefix mesh: <http://id.nlm.nih.gov/mesh/> .
@prefix evidence: <http://purl.org/versum/evidence/> .

`

  Context.instance = new Context()
  Context.instance.loadContextIndex()
})()
