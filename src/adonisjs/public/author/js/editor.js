/**
 * Editor: executes sequences of commands related to editing.
 */

class Editor {
  constructor () {
    this.editAction = this.editAction.bind(this)
    MessageBus.i.subscribe('edit/+/+', this.editAction)
  }

  get _compiledCase () {
    return AuthorManager.i.compiledCase
  }

  set _compiledCase (compiled) {
    AuthorManager.i.compiledCase = compiled
  }

  async editAction (topic, message) {
    status = false
    this._actionTopic = topic
    this._actionMessage = message

    if (message == null)
      this._reportError('message.missing')
    else {
      let mfields = true
      if (Editor.mandatoryFields[topic]) {
        for (let f of Editor.mandatoryFields[topic])
          if (message[f] == null) {
            this._reportError('message.field.' + f + '.missing')
            mfields = false
          }
      }

      if (mfields) {
        switch (topic) {
          case 'edit/knot/create':
            status = await this.knotCreate(
              message.target, ((message.before) ? message.before : false),
              message.template)
            break
          case 'edit/knot/check-create':
            status = await this.knotCheckCreate(
              message.target, ((message.before) ? message.before : false),
              message.template, message.knotId)
            break
          case 'edit/artifact/insert':
            status = this.artifactInsert(
              message.knot, message.target, message.artifact,
              ((message.exclusive) ? message.exclusive : false),
              ((message.includeMissing) ? message.includeMissing : false))
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
      console.log('==== insert position')
      console.log(knotTarget)

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

  async knotCheckCreate (target, before, template, knotId) {
    let status = true
    if (this._compiledCase.knots[knotId] == null)
      status = this.knotCreate(target, before, template)
    return status
  }

  artifactInsert (knot, target, artifact, exclusive, includeMissing) {
    console.log('=== artifact insert')
    console.log(knot)
    console.log(target)
    console.log(artifact)
    status = false
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
              (!content[c].path || exclusive)) {
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
        if (replace)
          status = this.elementReplace(knot, targetEl, artifactObj)
        else {
          if (includeContext) {
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

  elementInsert (knot, position, element) {
    status = false
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
  Editor.i = new Editor()

  Editor.mandatoryFields = {
    'edit/knot/create': ['target', 'template'],
    'edit/knot/check-create': ['target', 'template', 'knotId'],
    'edit/artifact/insert': ['knot', 'target', 'artifact']
  }
})()
