/**
 * Modifier: executes sequences of commands related to case modification.
 */

class Modifier {
  constructor () {
    this.modificationAction = this.modificationAction.bind(this)
    MessageBus.i.subscribe('modify/+/+', this.modificationAction)
  }

  get _compiledCase () {
    return AuthorManager.i.compiledCase
  }

  set _compiledCase (compiled) {
    AuthorManager.i.compiledCase = compiled
  }

  async modificationAction (topic, message) {
    let status = false
    this._actionTopic = topic
    this._actionMessage = message

    if (message == null)
      this._reportError('message.missing')
    else {
      let mfields = true
      if (Modifier.mandatoryFields[topic]) {
        for (let f of Modifier.mandatoryFields[topic])
          if (message[f] == null) {
            this._reportError('message.field.' + f + '.missing')
            mfields = false
          }
      }

      if (mfields) {
        switch (topic) {
          case 'modify/knot/create':
            status = await this.knotCreate(
              message.target, ((message.before) ? message.before : false),
              message.template)
            break
          case 'modify/knot/update':
            status = await this.knotUpdate(
              message.target, ((message.before) ? message.before : false),
              message.template, message.knotId.replace(/ /g, '_'))
            break
          case 'modify/artifact/insert':
            status = this.artifactInsert(
              message.knot.replace(/ /g, '_'), message.target, message.artifact,
              ((message.includeMany) ? message.includeMany : false),
              ((message.includeMissing) ? message.includeMissing : false),
              ((message.includeTitle) ? message.includeTitle : null))
            break
          case 'modify/formal/update':
            status = this.formalUpdate(
              message.knot.replace(/ /g, '_'), message.context,
              ((message.contextId) ? message.contextId : null),
              message.comments,
              ((message.includeMissing || message.includeAfter)
                ? message.includeMissing : false),
              ((message.includeAfter) ? message.includeAfter : null))
            break
        }
      }
    }

    MessageBus.i.publish(MessageBus.buildResponseTopic(topic, message), status)
  }

  async knotCreate (target, before, template) {
    let status = false
    if ((target == '' && this._checkKnots()) ||
        this._checkKnot(target)) {
      let knots = this._compiledCase.knots

      let knotTarget = target
      const knotIds = Object.keys(knots)
      if (target == '') {
        let previous = ''
        for (let k in knots) {
          if (knots[k].categories != null &&
              knots[k].categories.includes('end')) {
            knotTarget = previous
            break
          }
          previous = k
        }
        if (knotTarget == '')
          knotTarget = knotIds[knotIds.length-1]
      } else {
        // inserts before a knot in the same level o
        const level = knots[knotTarget].level
        let kt = knotIds.indexOf(knotTarget) + 1
        while (kt < knotIds.length &&
               knots[knotIds[kt]].level > level)
          kt++
        knotTarget = knotIds[kt-1]
      }

      let markdown = await MessageBus.i.request('data/template/' +
                              template.replace(/\//g, '.') + '/get',
                              null, null, true)
      markdown = markdown.message

      const templateTitle = Translator.instance.extractKnotTitle(markdown)
      let ktitle = templateTitle

      let kn =0
      if (!ktitle.includes('_knot_number_') &&
          knots[ktitle.replace(/ /g, '_')] != null) {
        ktitle += ' _knot_number_'
        kn = 1
      }

      let knotId
      do {
        kn++
        knotId = ktitle.replace('_knot_number_', kn).replace(/ /g, '_')
      } while (knots[knotId] != null)
      const knotMd = ktitle.replace('_knot_number_', kn)

      markdown = markdown.replace(templateTitle, knotMd) + '\n'

      const newKnotSet = {}
      for (const k in knots) {
        newKnotSet[k] = knots[k]
        if (k == knotTarget) {
          newKnotSet[knotId] = {
            toCompile: true,
            _source: markdown
          }
        }
      }

      // <TODO> duplicated reference - improve it
      this._compiledCase.knots = newKnotSet

      const md = Translator.instance.assembleMarkdown(
        this._compiledCase, true)

      await this._caseCompile(md)

      this._recordOperation('knot', 'create',
        {knotId: knotId,
         template: template})

      status = true
    }

    return status
  }

  async knotUpdate (target, before, template, knotId) {
    let status = true
    if (this._compiledCase.knots[knotId] == null)
      status = this.knotCreate(target, before, template)
    return status
  }

  artifactInsert (knot, target, artifact, includeMany,
                  includeMissing, includeTitle) {
    console.log('=== artifact insert')
    console.log(knot)
    console.log(target)
    console.log(artifact)
    console.log(includeMany)
    console.log(includeMissing)
    console.log(includeTitle)
    let status = false
    if (this._checkKnotContent(knot)) {
      let content = this._compiledCase.knots[knot].content
      let targetEl = -2
      let replace = false
      let includeContext = false
      let c = 0
      const artifactType = Translator.instance.classifyArtifactType(artifact)
      const artifactSuperType = (artifactType == 'image') ? 'image' : 'media'
      while (c < content.length && targetEl < 0) {
        if (content[c].type == 'context-open' &&
            content[c].context == target)
          targetEl = -1
        if (targetEl == -1) {
          if (content[c].type == artifactSuperType &&
              (!content[c].path || !includeMany)) {
            targetEl = c
            replace = true
          } else if (content[c].type == 'context-close')
            targetEl = c - 1
        }
        c++
      }
      if (targetEl < 0 && includeMissing) {
        targetEl = content.length
        includeContext = true
      }
      if (targetEl >= 0) {
        let artifactObj = {type: artifactSuperType,
                           path: artifact}
        if (artifactSuperType == 'image')
          artifactObj.alternative = target
        else
          artifactObj.subtype = artifactType
        console.log('=== replace?')
        console.log(replace)
        if (replace)
          status = this.elementReplace(knot, targetEl, artifactObj)
        else {
          if (includeContext) {
            this.elementInsert(knot, targetEl,
              {type: 'linefeed',
               content: '\n'})
            targetEl++
            if (includeTitle != null) {
              this.elementInsert(knot, targetEl,
                {type: 'text',
                 content: includeTitle})
              this.elementInsert(knot, targetEl+1,
                {type: 'linefeed',
                 content: '\n\n'})
              targetEl += 2
            }
            this.elementInsert(knot, targetEl,
              {type: 'context-open',
               context: target})
            targetEl++
          }
          status = this.elementInsert(knot, targetEl, artifactObj)
          if (includeContext)
            this.elementInsert(knot, targetEl+1,
              {type: 'context-close'})
        }
      } else
        this._reportError('content.target.invalid')
    }
    return status
  }

  formalUpdate (knot, context, contextId, comments,
                includeMissing, includeAfter) {
    console.log('=== starting formal update')
    console.log(context)
    console.log(includeAfter)
    let status = false
    if (this._checkKnotContent(knot)) {
      let lastContext = null
      let lastContextId = null
      let lastFormal = null
      let contextPos = -1
      let contextInclude = -1
      let hasFormal = false
      const content = this._compiledCase.knots[knot].content
      for (let e = 0; e < content.length && !hasFormal; e++) {
        let el = content[e]
        if (el.type == 'context-open') {
          lastContext = el.context
          lastContextId = el.id
        } else if (el.type == 'context-close') {
          if (lastContext == context && contextPos == -1 &&
              (contextId == null ||
                (lastContextId != null && lastContextId == contextId)))
            contextPos = e
          else if (includeAfter != null && lastContext == includeAfter)
            contextInclude = e
        } else if (el.type == 'formal-open') {
          lastFormal = el.context
          if (el.context == context &&
              (contextId == null || (el.id != null && el.id == contextId))) {
            contextPos = e
            hasFormal = true
          }
        } else if (el.type == 'formal-close' && includeAfter != null &&
                   lastFormal == includeAfter)
          contextInclude = e
      }
      console.log('=== formal positions')
      console.log(context)
      console.log(contextId)
      console.log(contextPos)
      console.log(contextInclude)
      console.log(hasFormal)
      console.log('--- include after')
      console.log(includeAfter)

      if (!hasFormal) {
        contextPos =
          (contextPos > -1) ? contextPos + 1 :
          (contextInclude > -1) ? contextInclude + 1 : content.length

        this.elementInsert(knot, contextPos,
          {type: 'linefeed',
           content: '\n'})
        let formalOpen = {type: 'formal-open',
                          context: context,
                          render: false}
        if (contextId != null) formalOpen.id = contextId
        this.elementInsert(knot, contextPos+1, formalOpen)
        this.elementInsert(knot, contextPos+2,
          {type: 'linefeed',
           content: '\n',
           render: false})
        this.elementInsert(knot, contextPos+3, {
          type: 'formal-close',
          render: false
        })
        this.elementInsert(knot, contextPos+4,
          {type: 'linefeed',
           content: '\n'})
      }

      for (const c in comments)
        this.formalCommentUpdate(knot, contextPos, c, comments[c])
    }

    return status
  }

  /*
   * Updates a comment inside a formal
   *   position: position of the formal open
   */
  formalCommentUpdate (knot, position, property, value) {
    console.log('=== formal comment update')
    let status = false
    if (this._checkKnotContentPosition(knot, position, true)) {
      if (property == null)
        this._reportError('formal.comment.property.missing')
      else if (value == null)
        this._reportError('formal.comment.value.missing')
      else {
        const content = this._compiledCase.knots[knot].content
        let p = position + 1
        while (p < content.length &&
               (content[p].type != 'field' || content[p].field != property) &&
               (content[p].type != 'formal-close'))
          p++
        if (p < content.length) {
          if (content[p].type != 'formal-close') {
            if (typeof value === 'object' && !Array.isArray(value) &&
                Object.keys(value).length == 0)
              this.elementDelete(knot, p)
            else {
              const newField = JSON.parse(JSON.stringify(content[p]))
              newField.value = value
              this.elementReplace(knot, p, newField)
            }
          } else
            this.elementInsert(knot, p,
              {type: 'field',
               field: property,
               value: value,
               render: false})
        }
      }
    }
  }

  elementInsert (knot, position, element) {
    let status = false
    if (this._checkKnotContentPosition(knot, position, true)) {
      if (element == null)
        this._reportError('element.insert.missing')
      else {
        let content = this._compiledCase.knots[knot].content
        let seq = (content[position] && content[position].seq)
          ? content[position].seq
          : (content[position-1].seq) ? content[position-1].seq + 1 : 0
        content.splice(position, 0, element)
        if (seq > 0) {
          for (let s = position; s < content.length; s++) {
            content[s].seq = seq
            seq++
          }
        }
        Translator.instance.updateElementMarkdown(element)
        this._recordOperation('element', 'insert',
          {knot: knot,
           position: position,
           element: element})
        MessageBus.i.publish('control/knot/update', null, true)
        status = true
      }
    }
    return status
  }

  elementReplace (knot, position, element) {
    status = false
    if (this._checkKnotContentPosition(knot, position, true)) {
      if (element == null)
        this._reportError('element.replace.missing')
      else {
        let content = this._compiledCase.knots[knot].content
        if (content[position].seq)
          element.seq = content[position].seq
        content[position] = element
        Translator.instance.updateElementMarkdown(element)
        this._recordOperation('element', 'replace',
          {knot: knot,
           position: position,
           element: element})
        MessageBus.i.publish('control/knot/update', null, true)
        status = true
      }
    }
    return status
  }

  elementDelete (knot, position) {
    status = false
    if (this._checkKnotContentPosition(knot, position, true)) {
      this._compiledCase.knots[knot].content.splice(position, 1)
      this._recordOperation('element', 'delete',
        {knot: knot,
         position: position})
      MessageBus.i.publish('control/knot/update', null, true)
    }
    return status
  }

  _checkCompiled () {
    if (this._compiledCase == null)
      this._reportError('compiled.missing')
    return (this._compiledCase != null)
  }

  _checkKnots () {
    let check = false
    if (this._checkCompiled()) {
      if (this._compiledCase.knots != null)
        check = true
      else
        this._reportError('knots.missing')
    }
    return check
  }

  _checkKnot (knot) {
    let check = false
    if (this._checkKnots()) {
      if (knot == null)
        this._reportError('knot.id.missing')
      else if (this._compiledCase.knots[knot])
        check = true
      else
        this._reportError('knot.invalid')
    }
    return check
  }

  _checkKnotContent (knot) {
    let check = false
    if (this._checkKnot(knot)) {
      if (this._compiledCase.knots[knot].content)
        check = true
      else
        this._reportError('content.missing')
    }
    return check
  }

  _checkKnotContentPosition (knot, position, insert) {
    let check = false
    if (this._checkKnotContent(knot)) {
      if (this._compiledCase.knots[knot].content[position] ||
          (insert && this._compiledCase.knots[knot].content[position-1]))
        check = true
      else
        this._reportError('content.position.invalid')
    }
    return check
  }

  async _caseCompile (caseSource) {
    this._compiledCase =
         await Translator.instance.compileMarkdown(Basic.service.currentCaseId,
           caseSource)
    Basic.service.composedThemeFamily(this._compiledCase.theme)
  }

  _reportError (error) {
    console.log('=== error in edit action')
    console.log(error)
    console.log(this._actionTopic)
    console.log(this._actionMessage)
  }

  _recordOperation (target, operation, details) {
    console.log('=== record action')
    console.log('  - target: ' + target)
    console.log('  - operation: ' + operation)
    console.log(details)
  }
}
(function () {
  Modifier.i = new Modifier()

  Modifier.mandatoryFields = {
    'modify/knot/create': ['target', 'template'],
    'modify/knot/update': ['target', 'template', 'knotId'],
    'modify/artifact/insert': ['knot', 'target', 'artifact'],
    'modify/formal/update': ['knot', 'context', 'comments']
  }
})()
