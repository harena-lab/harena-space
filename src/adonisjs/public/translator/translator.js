/**
 * Translator of Case Notebooks
 *
 * Translates case notebook narratives (extension of markdown) to object representations and further to HTML.
 */
class Translator {
  constructor () {
    this.authoringRender = false

    this._markdownTranslator = new showdown.Converter()
    this._markdownTranslator.setFlavor('github')
  }

  /*
    * Properties
    */

  get authoringRender () {
    return this._authoringRender
  }

  set authoringRender (newValue) {
    this._authoringRender = newValue
  }

  get authorAttr () {
    return (this.authoringRender) ? ' author' : ''
  }

  get themeSettings () {
    return this._themeSettings
  }

  _authorAttrSub (superseq) {
    return (this.authoringRender && superseq == -1) ? ' author' : ''
  }

  _subSeq (superseq, seq) {
    return (superseq == -1) ? seq : superseq * 1000 + seq
  }

  /*
    * Proxy of Markdown functions
    */
  htmlToMarkdown (html) {
    return this._markdownTranslator.makeMarkdown(html)
  }

  /*
    * Compiles a markdown text to an object representation
    */
  async compileMarkdown (caseId, markdown) {
    const compiledCase = {
      id: caseId,
      knots: {},
      layers: {},
      slayers: {}
    }

    const layerBlocks = this._indexLayers(markdown, compiledCase)
    this._extractCaseMetadata(compiledCase)

    if (this._themeSettings) { delete this._themeSettings }
    if (compiledCase.theme) {
      const themeSt = await MessageBus.i.request(
        'data/theme_family/' + Basic.service.decomposeThemeFamily(compiledCase.theme).family.toLowerCase() +
        '/settings')
      if (themeSt != null) { this._themeSettings = themeSt.message }
    }

    this._indexKnots(layerBlocks[0], compiledCase)

    for (const kn in compiledCase.knots) {
      this._extractKnotAnnotations(compiledCase.knots[kn])
      this._compileKnotMarkdown(compiledCase.knots, kn)
    }

    // this._extractCaseMetadata(compiledCase);

    this._replicateImages(compiledCase)
    this._replicateInheritance(compiledCase)

    return compiledCase
  }

  /*
    * Index all layers
    */
  _indexLayers (markdown, compiledCase) {
    const layerBlocks = markdown.split(Translator.marksLayerTitle)

    let isStatic = false
    for (let lb = 1; lb < layerBlocks.length; lb += 2) {
      const layer = {
        _source: layerBlocks[lb + 1]
      }
      this._compileUnityMarkdown(layer)
      this._compileMerge(layer)
      const layerName = layerBlocks[lb].trim()
      if (layerName.toLowerCase() == 'template')
        isStatic = true
      if (isStatic)
        compiledCase.slayers[layerName] = layer
      else
        compiledCase.layers[layerName] = layer
    }

    return layerBlocks
  }

  _extractCaseMetadata (compiledCase) {
    let layers = compiledCase.layers
    let r = 1
    while (r < 3) {
      if (layers.Data) {
        let content = layers.Data.content
        for (const c in content) {
          if (content[c].type == 'field') {
            if (content[c].field == 'namespaces')
              Context.instance.addNamespaceSet(content[c].value)
            else if (Translator.globalFields.includes(content[c].field))
              compiledCase[content[c].field] = content[c].value
          }
        }
      }
      r++
      layers = compiledCase.slayers
    }
    if (compiledCase.layers.Flow || compiledCase.slayers.Flow)
      compiledCase.flow = (compiledCase.layers.Flow) ?
        compiledCase.layers.Flow.content : compiledCase.slayers.Flow.content
  }

  /*
    * Index all knots to guide references
    */
  _indexKnots (markdown, compiledCase) {
    const size = markdown.length
    const hasKnot = Translator.element.knot.mark.test(markdown)
    let mark = markdown

    if (!hasKnot) { mark = '# Initial Knot\n' + markdown }

    const knotCtx = []
    const knotBlocks = mark.split(Translator.marksKnotTitle)
    for (var kb = 1; kb < knotBlocks.length; kb += 2) {
      const transObj =
            this._knotMdToObj(knotBlocks[kb].match(Translator.element.knot.mark))
      transObj.render = true
      let label = transObj.title
      if (transObj.level == 1) { knotCtx[0] = { label: label, obj: transObj } }
      else {
        let upper = -1
        for (let l = transObj.level - 2; l >= 0 && upper == -1; l--) {
          if (knotCtx[l] != null) { upper = l }
        }

        if (upper != -1) {
          label = knotCtx[upper].label + '.' + label
          if (transObj.categories && !transObj.categories.includes('note'))
            knotCtx[upper].obj.render = false
        }
        knotCtx[transObj.level - 1] = { label: label, obj: transObj }
      }
      const knotId = label.replace(/ /g, '_')
      if (kb == 1)
        { compiledCase.start = knotId }
      else if (transObj.categories && transObj.categories.includes('start'))
        { compiledCase.start = knotId }
      if (compiledCase.knots[knotId]) {
        if (!compiledCase._error) { compiledCase._error = [] }
        compiledCase._error.push('Duplicate knots title: ' + label)
      } else {
        transObj._source = knotBlocks[kb] + knotBlocks[kb + 1]
        compiledCase.knots[knotId] = transObj
      }
    }
  }

  /*
    * Extract annotations of a single node
    */
  _extractKnotAnnotations (knot) {
    knot.annotations = []
    knot.contextIndex = {}
    let currentSet = knot.annotations

    let mdfocus = knot._source

    let uidWord = 1
    let uidContext = null
    let uidContextN = 0
    let uidWordContext = 1
    let formalOpen = null
    let insideContext = false
    let matchStart
    do {
      // look for the next nearest expression match
      matchStart = -1
      let selected = ''
      for (const mk in Translator.marksAnnotation) {
        const pos = mdfocus.search(Translator.marksAnnotation[mk])
        if (pos > -1 && (matchStart == -1 || pos < matchStart)) {
          selected = mk
          matchStart = pos
        }
      }

      if (matchStart > -1) {
        // count words before annotation - to buuild unique id
        const before = mdfocus.substring(0, matchStart).match(/([\w-]+)/g)
        const words = (before == null) ? 0 : before.length
        uidWord += words
        uidWordContext += words

        // translate the expression to an object
        const matchSize = mdfocus.match(Translator.marksAnnotation[selected])[0].length
        const toTranslate = mdfocus.substr(matchStart, matchSize)
        const match = Translator.marksAnnotation[selected].exec(toTranslate)

        const uid =
          (insideContext)
            ? (uidContext != null)
              ? uidContext + '_' + uidWordContext
              : 'w' + uidContextN + '_' + uidWordContext
            : 'w0_' + uidWord

        // hierarchical annotation building inside contexts
        switch (selected) {
          case 'context-open':
          case 'formal-open':
            const transObj = (selected == 'context-open')
              ? this._contextOpenMdToObj(match) : this._formalOpenMdToObj(match)
            let index = (transObj.context != null) ? transObj.context : ''
            if (transObj.namespace != null)
              index = transObj.namespace + ':' + index
            if (transObj.id != null)
              index += '@' + transObj.id
            if (index.length > 0) {
              if (!knot.contextIndex[index])
                knot.contextIndex[index] = transObj
              if (selected == 'formal-open')
                formalOpen = knot.contextIndex[index]
            }
            if (selected == 'context-open') {
              currentSet.push(transObj)
              currentSet = []
              transObj.annotations = currentSet
              uidContext = (transObj.id) ? transObj.id : null
              uidContextN++
              uidWordContext = 0
              insideContext = true
            }
            break
          case 'context-close':
            currentSet = knot.annotations
            uidContext = null
            insideContext = false
            break
          case 'formal-close':
            formalOpen = null
            break
          case 'annotation':
          case 'select':
            let obj = (selected == 'annotation')
              ? this._annotationMdToObj(match)
              : this._selectMdToObj(match)
            obj.id = uid
            currentSet.push(obj)
            const w = (obj.natural) ? obj.natural.complete : obj.expression
            const wc = w.match(/([\w-]+)/g).length
            uidWord += wc
            uidWordContext += wc
            break
        }

        if (matchStart + matchSize >= mdfocus.length)
          { matchStart = -1 }
        else
          { mdfocus = mdfocus.substring(matchStart + matchSize) }

      }
    } while (matchStart > -1)
  }

  /*
    * Compiles a single knot to an object representation
    */
  _compileKnotMarkdown (knotSet, knotId) {
    const knot = knotSet[knotId]

    if (knot.categories) { delete knot.categories }

    this._compileUnityMarkdown(knot)

    this._compileMerge(knot)

    this._compileContext(knotSet, knotId, knot.content)

    // this._compileCompose(compiledKnot);

    // delete knot._preparedSource;
  }

  /*
    * Compiles a single unity (layer, knot or free) to an object representation
    *   - free compilation has test purposes in the Translator Playground
    */
  _compileUnityMarkdown (unity) {
    unity.content = []
    let mdfocus = unity._source

    this._objSequence = 0
    this._conditionNext = -1

    let matchStart
    do {
      // look for the next nearest expression match
      matchStart = -1
      let selected = ''
      for (const mk in Translator.element) {
        const pos = mdfocus.search(Translator.element[mk].mark)
        if (pos > -1 && (matchStart == -1 || pos < matchStart)) {
          selected = mk
          matchStart = pos
        }
      }

      if (matchStart > -1) {
        // add a segment that does not match to any expression as type="text"
        if (matchStart > 0) {
          const submark = mdfocus.substring(0, matchStart)
          unity.content.push(this._initializeObject(
            this._textMdToObj(submark, true), submark))
        }

        // translate the expression to an object
        let matchSize =
          mdfocus.match(Translator.element[selected].mark)[0].length

        if (selected == 'literal') {
          const litClose = mdfocus.substr(matchStart + matchSize)
                                  .search(Translator.literalClose)
          matchSize = (litClose > -1)
            ? litClose - matchStart + matchSize + 3
            : mdfocus.length - matchStart + matchSize + 1
        }

        const toTranslate = mdfocus.substr(matchStart, matchSize)
        const transObj = this._initializeObject(
          this._mdToObj(selected,
            Translator.element[selected].mark.exec(toTranslate), toTranslate),
            toTranslate)

        // attach to a knot array (if it is a knot) or an array inside a knot
        if (selected == 'knot') {
          unity._sourceHead = toTranslate
          if (transObj.categories) { unity.categories = transObj.categories }
          this._defineCategorySettings(
            (transObj.categories) ? transObj.categories : null)
        } else { unity.content.push(transObj) }

        if (matchStart + matchSize >= mdfocus.length) {
          matchStart = -1
          mdfocus = ''
        } else { mdfocus = mdfocus.substring(matchStart + matchSize) }
      }
    } while (matchStart > -1)
    if (mdfocus.length > 0) {
      unity.content.push(
        this._initializeObject(this._textMdToObj(mdfocus), mdfocus))
    }
  }

  _defineCategorySettings (categories) {
    let focusCategory = null
    // when there is more than one category, priority in reverse order
    if (this._categorySettings) { delete this._categorySettings }

    if (categories != null && this._themeSettings != null) {
      let cat = categories.length - 1
      while (focusCategory == null && cat >= 0 &&
                !this._themeSettings[categories[cat]]) { cat-- }
      if (cat >= 0) { focusCategory = categories[cat] } else { focusCategory = 'knot' }
      if (this._themeSettings[focusCategory]) {
        this._categorySettings =
               this._themeSettings[focusCategory]
      }
    }
  }

  /*
   _compileText(textMd, compiledKnot) {
      if (/^\t| [\t ]/.test(textMd)) {
         let textLines = textMd.split(/\f|\r?\n/);
         let subordinatedMd = textLines[0];
         let line = 1;
         for (; line < textLines.length &&
                /^\t| [\t ]/.test(textLines[line]); line++)
            subordinatedMd += "\n" + textLines[line];
         compiledKnot.push(this._initializeObject(
            this._textMdToObj(subordinatedMd, true), subordinatedMd));
         if (line < textLines.length) {
            console.log("inserindo linha");
            compiledKnot.push(this._initializeObject(
               this._linefeedMdToObj(["\n\n"]), "\n\n"));
            let freeMd = textLines[line];
            line++;
            for (; line < textLines.length; line++)
               freeMd += "\n" + textLines[line];
            compiledKnot.push(this._initializeObject(
               this._textMdToObj(freeMd, false), freeMd));
         }
      } else
         compiledKnot.push(this._initializeObject(
            this._textMdToObj(textMd, false), textMd));
   }
   */

  /*
    * Gives context to links and variables
    */
  _compileContext (knotSet, knotId, compiled) {
    let defaultInput = 1
    for (const c in compiled) {
      if (compiled[c].type == 'input') {
        if (compiled[c].variable == null) {
          compiled[c].variable = knotId + '.input' + defaultInput
          defaultInput++
        }
        if (compiled[c].variable.indexOf('.') == -1) {
          compiled[c].variable = knotId + '.' + compiled[c].variable
        }
        // <TODO> can be interesting this link in the future
        // compiled[c].variable = this.findContext(knotSet, knotId, compiled[c].variable);
        if (compiled[c].target) {
          compiled[c].contextTarget =
                  this._findTarget(knotSet, knotId, compiled[c].target)
        }
        if (compiled[c].options) {
          for (const o in compiled[c].options) {
            if (compiled[c].options[o].target != null) {
              compiled[c].options[o].contextTarget =
                        this._findTarget(knotSet, knotId,
                          compiled[c].options[o].target)
            }
          }
        }
      } else if (compiled[c].type == 'context-open' &&
                 compiled[c].input && compiled[c].input.indexOf('.') == -1) {
        compiled[c].input = knotId + '.' + compiled[c].input
      }
      // <TODO> can be interesting this link in the future
      // compiled[c].input = this.findContext(knotSet, knotId, compiled[c].input);
      else if (compiled[c].type == 'option' ||
               compiled[c].type == 'divert') {
        compiled[c].contextTarget =
               this._findTarget(knotSet, knotId, compiled[c].target)
      } else if (compiled[c].type == 'text-block')
        this._compileContext(knotSet, knotId, compiled[c].content)
      /*
         {
            let target = compiled[c].target.replace(/ /g, "_");
            let prefix = knotId;
            let lastDot = prefix.lastIndexOf(".");
            while (lastDot > -1) {
               prefix = prefix.substring(0, lastDot);
               if (knotSet[prefix + "." + target])
                  target = prefix + "." + target;
               lastDot = prefix.lastIndexOf(".");
            }
            compiled[c].contextTarget = target;
         } */
    }
  }

  _findTarget (knotSet, knotId, originalTarget) {
    let contextTarget = originalTarget
    if (originalTarget == '(default)') {
      // looks for a local default note
      const noteTarget = this.findContext(knotSet, knotId, knotId + ' Note')
      if (knotSet[noteTarget]) { contextTarget = noteTarget } else
      // otherwise considers a global note
      { contextTarget = this.findContext(knotSet, knotId, 'Note') }
    } else {
      contextTarget =
            this.findContext(knotSet, knotId, originalTarget)
    }
    return contextTarget
  }

  findContext (knotSet, knotId, originalTarget) {
    let target = originalTarget.replace(/ /g, '_')
    if (!Translator.reservedNavigation.includes(target.toLowerCase())) {
      let prefix = knotId + '.'
      let lastDot = prefix.lastIndexOf('.')
      while (lastDot > -1) {
        prefix = prefix.substring(0, lastDot)
        // for generic targets with # (dcc-input-choice), try to find the first
        if (knotSet[prefix + '.' + target.replace('#', '1')]) {
          target = prefix + '.' + target
        }
        lastDot = prefix.lastIndexOf('.')
      }
    }
    return target
  }

  /*
    * Merges text / subordinate fields and
    * adjusts the interpretation of line feeds
   */
  _compileMerge (unity) {
    const compiled = unity.content

    // first cycle - transforms blockquote elements in attributes
    for (let c = 0; c < compiled.length; c++) {
      if (compiled[c].type == 'blockquote') {
        if (c + 1 < compiled.length) {
          compiled[c + 1].blockquote = true
          compiled[c + 1]._source = compiled[c]._source + compiled[c + 1]._source
          compiled.splice(c, 1)
          c--
        }
      }
    }

    // second cycle - aggregates blockquoted linefeeds
    for (let c = 0; c < compiled.length - 1; c++) {
      if (compiled[c + 1].type == 'linefeed' && compiled[c + 1].blockquote &&
             compiled[c].type == 'linefeed' &&
             (compiled[c].blockquote || compiled[c].content.length == 1)) {
        compiled[c].blockquote = true
        compiled[c].content = compiled[c].content + compiled[c + 1].content
        compiled[c]._source = compiled[c]._source + compiled[c + 1]._source
        compiled.splice(c + 1, 1)
        c--
      }
    }

    // third cycle - define the identity of each item: field or list
    for (let c = 1; c < compiled.length; c++) {
      if (compiled[c].type == 'item') {
        let u = c - 1
        while (u >= 0 && (compiled[u].type == 'linefeed' ||
                   (Translator.element[compiled[u].type] &&
                    !Translator.element[compiled[u].type].subfield &&
                    compiled[u].subordinate))) { u-- }
        if (u >= 0 &&
                (Translator.element[compiled[u].type] &&
                 Translator.element[compiled[u].type].subfield)) {
          const field = {
            type: 'field',
            presentation: compiled[c].presentation,
            subordinate: compiled[c].subordinate,
            field: compiled[c].label,
            value: true,
            _source: compiled[c]._source
          }
          if (compiled[c].level) { field.level = compiled[c].level }
          compiled[c] = field
        } else {
          const markdown = {
            type: 'text',
            subordinate: compiled[c].subordinate,
            content: compiled[c].presentation,
            _source: compiled[c]._source
          }
          compiled[c] = markdown
        }
      }
    }

    // fourth cycle - aggregates texts, mentions, annotations, selects, images, and media
    let tblock
    let tblockSeq
    for (let c = 0; c < compiled.length; c++) {
      if (Translator.textBlockCandidate.includes(compiled[c].type)) {
        const pr = (c > 1 && compiled[c - 1].type == 'linefeed') ? c - 2 : c - 1
        const nx = (c + 2 < compiled.length && compiled[c + 1].type == 'linefeed')
          ? c + 2 : c + 1
        if (c == 0 || compiled[pr].type != 'text-block' ||
                (compiled[pr].type == 'text-block' &&
                 !this._equivalentSubQuote(compiled[c], compiled[pr]))) {
          // creates a new text-block
          if (nx < compiled.length &&
                   Translator.textBlockCandidate.includes(compiled[nx].type) &&
                   this._equivalentSubQuote(compiled[c], compiled[nx])) {
            tblockSeq = 1
            compiled[c].seq = 1
            tblock = this._initializeObject(
              {
                type: 'text-block',
                content: [compiled[c]]
              }, compiled[c]._source)
            if (compiled[c].subordinate) { tblock.subordinate = compiled[c].subordinate }
            if (compiled[c].blockquote) { tblock.blockquote = compiled[c].blockquote }
            compiled[c] = tblock
          }
        } else if (c > 0 &&
                   this._equivalentSubQuote(compiled[c], compiled[pr])) {
          // adds element and previous linefeed (if exists)
          for (let e = pr + 1; e <= c; e++) {
            tblockSeq++
            compiled[e].seq = tblockSeq
            if (compiled[e].type == 'linefeed') { compiled[e].render = true }
            tblock.content.push(compiled[e])
            tblock._source += compiled[e]._source
          }
          compiled.splice(pr + 1, c - pr)
          c -= c - pr
        }
      }
      if (c >= 0) { compiled[c].seq = c + 1 }
    }

    // fifith cycle - compute subordinated elements based on subordinators
    // <TODO> remove?
    for (let c = 1; c < compiled.length; c++) {
      const pr =
            (c > 1 && compiled[c - 1].type == 'linefeed') ? c - 2 : c - 1
      if (Translator.subordinatorElement.includes(compiled[pr].type)) { compiled[c].subordinate = true }
    }

    // sixth cycle - computes field hierarchy
    let lastRoot = null
    let lastField = null
    let lastFieldName = 'value'
    let lastLevel = 0
    let hierarchy = []
    let hierarchyName = []
    let levelHierarchy = []
    for (let c = 0; c < compiled.length; c++) {
      if (compiled[c].type == 'field') {
        if (lastRoot == null || !compiled[c].subordinate) {
          if (compiled[c].value == null) { compiled[c].value = {} }
          lastRoot = compiled[c]
          lastField = compiled[c]
          lastFieldName = 'value'
          lastLevel = compiled[c].level
          hierarchy = []
          hierarchyName = []
          levelHierarchy = []
        } else {
          while (lastField != null &&
                 compiled[c].level <= lastLevel) {
            lastField = hierarchy.pop()
            lastFieldName = hierarchyName.pop()
            lastLevel = levelHierarchy.pop()
          }
          if (lastField == null) {
            if (compiled[c].value == null) { compiled[c].value = {} }
            lastRoot = compiled[c]
            lastField = compiled[c]
            lastFieldName = 'value'
            lastLevel = compiled[c].level
            hierarchy = []
            hierarchyName = []
            levelHierarchy = []
          } else {
            if (typeof lastField[lastFieldName] !== 'object') {
               lastField[lastFieldName] = { value: lastField[lastFieldName] }
            }
            lastField[lastFieldName][compiled[c].field] =
                     (compiled[c].value == null) ? {} : compiled[c].value
            lastRoot._source += '\n' + compiled[c]._source
            hierarchy.push(lastField)
            hierarchyName.push(lastFieldName)
            levelHierarchy.push(lastLevel)
            lastField = lastField[lastFieldName]
            lastFieldName = compiled[c].field
            lastLevel = compiled[c].level
            compiled.splice(c, 1)
            c--
          }
        }
     } else if (compiled[c].type != 'linefeed') {
        lastRoot = null
        lastField = null
        lastFieldName = 'value'
        lastLevel = 0
        hierarchy = []
        hierarchyName = []
        levelHierarchy = []
     }
    }

    // seventh cycle - computes subordinate elements
    for (let c = 0; c < compiled.length; c++) {
      const pr = (c > 1 && compiled[c - 1].type == 'linefeed') ? c - 2 : c - 1
      // later blockquotes and subordinates (excluding knot subordinates)
      if ((c > 0 && (c > 1 || compiled[c - 1].type != 'linefeed')) &&
             (compiled[c].subordinate || compiled[c].blockquote) &&
             Translator.element[compiled[pr].type]) {
        let merge = false
        if (compiled[c].type == 'field' &&
                Translator.element[compiled[pr].type].subfield !== undefined &&
                Translator.element[compiled[pr].type].subfield) {
          if (compiled[c].field.indexOf('answers') > -1) {
            if (!compiled[pr].answers) { compiled[pr].answers = {} }
            let answerType = compiled[c].field.replace('answers', '').trim()
            if (answerType.length == 0) { answerType = 'untyped' }
            compiled[pr].answers[answerType] = { answers: compiled[c].value }
            if (compiled[c].target) { compiled[pr].answers[answerType].target = compiled[c].target }
          } else {
            let fieldName = compiled[c].field
            if (fieldName == 'type') { fieldName = 'subtype' }
            compiled[pr][fieldName] = compiled[c].value
          }
          merge = true
        } else if (compiled[c].type == 'image' &&
                       Translator.element[compiled[pr].type].subimage !== undefined &&
                       Translator.element[compiled[pr].type].subimage) {
          compiled[pr].image = {
            alternative: compiled[c].alternative,
            path: compiled[c].path
          }
          if (compiled[c].title) { compiled[pr].image.title = compiled[c].title }
          merge = true
        } else if ((compiled[c].type == 'text' ||
                        compiled[c].type == 'text-block') &&
                       Translator.element[compiled[pr].type].subtext !== undefined &&
                       compiled[pr][Translator.element[compiled[pr].type].subtext] == null &&
                       (compiled[c].subordinate || compiled[c].blockquote)) {
          compiled[pr][Translator.element[compiled[pr].type].subtext] =
                     compiled[c].content
          merge = true
        }
        if (merge) {
          compiled[pr]._source += '\n' + compiled[c]._source
          // transfers the linefeed of the last line of the block to the block
          compiled[pr].mergeLine =
                  Translator.element[compiled[c].type] &&
                  Translator.isLine.includes(compiled[c].type)
          const shift = c - pr
          compiled.splice(c - shift + 1, shift)
          c -= shift
        }
      }
      // manages elements subordinated to the knot
      else if ((c == 0 || (c == 1 && compiled[c - 1].type == 'linefeed')) &&
                  compiled[c].subordinate && compiled[c].type == 'image') {
        // console.log('=== image back')
        unity.background = {
          alternative: compiled[c].alternative,
          path: compiled[c].path
        }
        if (compiled[c].title) { unity.background.title = compiled[c].title }
        compiled[c].render = false
      }
      if (c >= 0) { compiled[c].seq = c + 1 }
    }

    // eighth cycle - aggregates options
    let optionGroup = null
    let subtype = null
    let prevsubor = null
    for (let c = 1; c < compiled.length; c++) {
      const pr = (c > 1 && compiled[c - 1].type == 'linefeed') ? c - 2 : c - 1
      if (compiled[c].type == 'option') {
        let stype = compiled[c].subtype
        let suborop = (compiled[c].subordinate) ? true : false
        if  (compiled[pr].type == 'input' && compiled[pr].subtype &&
             compiled[pr].subtype == 'choice' && compiled[pr].options == null) {
          subtype = stype
          prevsubor = suborop
          optionGroup = compiled[pr]
          optionGroup.options = {}
        } else if (compiled[pr].type == 'option' &&
                   compiled[c].subtype == subtype &&
                   suborop == prevsubor) {
          optionGroup = this._initializeObject(
            {
              type: 'input',
              subtype: 'choice',
              exclusive: true,
              shuffle: (subtype == '+'),
              options: {}
            }, compiled[pr]._source)
          if (compiled[pr].target)
            optionGroup.reveal = "button"
          this._transferOption(optionGroup.options, compiled[pr])
          compiled[pr] = optionGroup
        }
        if (optionGroup != null && compiled[c].subtype == subtype &&
            suborop == prevsubor) {
          this._transferOption(optionGroup.options, compiled[c])
          optionGroup._source += '\n' + compiled[c]._source
          if (compiled[c].target && !optionGroup.reveal)
            optionGroup.reveal = "button"
          const shift = c - pr
          compiled.splice(c - shift + 1, shift)
          c -= shift
        } else
          optionGroup = null
        subtype = stype
        prevsubor = suborop
      } else if (compiled[c].type != 'linefeed' ||
                 compiled[c].content.length > 1)
        optionGroup = null
      compiled[c].seq = c + 1
    }

    // ninth cycle - previous blockquotes for inputs
    for (let c = 0; c < compiled.length; c++) {
      const pr = (c > 1 && compiled[c - 1].type == 'linefeed') ? c - 2 : c - 1
      if (compiled[c].type == 'input' && compiled[pr].blockquote) {
        let content = compiled[pr].content
        let source = compiled[pr]._source

        if (compiled[pr].type == 'text-block') {
           content = ''
           source = ''
           for (let c of compiled[pr].content) {
              content += c.content
              source += c._source
           }
        }
        compiled[c][Translator.element[compiled[c].type].pretext] = content
        compiled[c]._source = source + '\n' + compiled[c]._source
        const shift = c - pr
        compiled.splice(pr, shift)
        c -= shift
      }
      if (c >= 0) { compiled[c].seq = c + 1 }
    }

    // tenth cycle - joins script sentences
    // <TODO> quite similar to text-block (join?)
    let script
    let scriptSeq
    for (let c = 0; c < compiled.length; c++) {
      if (Translator.scriptable.includes(compiled[c].type)) {
        const line = (Translator.isLine.includes(compiled[c].type))
          ? '\n' : ''
        /*
            const line = (Translator.element[compiled[c].type].line !== undefined &&
                          Translator.element[compiled[c].type].line)
                         ? "\n" : "";
            */
        if (c == 0 || compiled[c - 1].type != 'script') {
          if (c < compiled.length - 1 &&
                   Translator.scriptable.includes(compiled[c + 1].type)) {
            scriptSeq = 1
            compiled[c].seq = 1
            script = this._initializeObject(
              {
                type: 'script',
                content: [compiled[c]]
              }, compiled[c]._source + line)
            if (compiled[c].subordinate) {
              script.subordinate = compiled[c].subordinate }
            compiled[c] = script
          }
        } else {
          scriptSeq++
          compiled[c].seq = scriptSeq
          script.content.push(compiled[c])
          script._source += compiled[c]._source + line
          compiled.splice(c, 1)
          c--
        }
      }
      if (c >= 0) { compiled[c].seq = c + 1 }
    }

    this._compileMergeLinefeeds(compiled)

    // eleventh cycle - process and hide formal comments
    let inFormal = false
    let lastContext = null
    let lastId = null
    for (let c = 0; c < compiled.length; c++) {
      if (compiled[c].type == 'context-open') {
        lastContext = compiled[c].context
        lastId = (compiled[c].id) ? compiled[c].id : null
      }
      else if (compiled[c].type == 'formal-open') {
        inFormal = true
        if (lastContext != null && !compiled[c].context) {
          compiled[c].context = lastContext
          if (lastId != null)
            compiled[c].id = lastId
        }
      } else if (compiled[c].type == 'formal-close')
        inFormal = false
      else if (inFormal)
        compiled[c].render = false
    }

    // twelfth cycle - attach conditions to conditioned
    let inCondition = false
    for (let c = 0; c < compiled.length; c++) {
      const nx = (c+2 < compiled.length && compiled[c+1].type == 'linefeed')
                 ? c + 2 : c + 1
      if (((compiled[c].type != 'linefeed' && !compiled[c].subordinate) ||
          c+1 == compiled.length) && inCondition) {
        const pos = (compiled[c].subordinate) ? c+1 : c
        compiled.splice(pos, 0,
                        {type: 'condition-close',
                         seq: pos+1,
                         _source: ''})
        inCondition = false
      }
      if (compiled[c].type == 'condition') {
        if (compiled[nx].type == 'compute') {
          compiled[nx].condition = compiled[c].expression
          compiled[nx]._source = compiled[c]._source + compiled[c+1]._source +
            ((nx-c == 2) ? compiled[nx]._source : '')
          compiled.splice(c, nx-c)
        } else {
          compiled[c].type = 'condition-open'
          inCondition = true
        }
      }
      if (c >= 0) { compiled[c].seq = c + 1 }
    }

    // thirteenth cycle - update formal annotations
    // <TODO> provisory update of formal annotations - both processes will be merged
    let formalOpen = null
    for (let c = 0; c < compiled.length; c++) {
      switch (compiled[c].type) {
        case 'formal-open':
          let index = (compiled[c].context != null) ? compiled[c].context : ''
          if (compiled[c].namespace != null)
            index = compiled[c].namespace + ':' + index
          if (compiled[c].id != null)
            index += '@' + compiled[c].id
          if (index.length > 0)
            formalOpen = unity.contextIndex[index]
          break
        case 'field':
          if (formalOpen != null) {
            if  (!formalOpen.formal)
              formalOpen.formal = {}
            formalOpen.formal[compiled[c].field] = compiled[c].value
          }
          break
        case 'formal-close':
          formalOpen = null
          break
      }
    }
  }

  _transferOption(options, compiledItem) {
      options[compiledItem.label] = {
        target: (compiledItem.target)
          ? compiledItem.target : '(default)'
      }
      if (compiledItem.message) {
        options[compiledItem.label].message =
                 compiledItem.message
      }
      if (compiledItem.state) {
        options[compiledItem.label].state = compiledItem.state
        options[compiledItem.label].operation = compiledItem.operation
      }
      if (compiledItem.compute)
        options[compiledItem.label].compute = compiledItem.compute
  }

  // check if both are quoted or subordinated
  _equivalentSubQuote (content1, content2) {
    return ((content1.blockquote && content2.blockquote) ||
              ((content1.blockquote == null && content2.blockquote == null) &&
               ((content1.subordinate && content2.subordinate) ||
                (!content1.subordinate && !content2.subordinate))))
  }

  // merges texts separated by linefeeds and
  // removes extra linfefeeds when the element embeds it
  _compileMergeLinefeeds (compiled) {
    // const compiled = unity.content
    for (let c = 0; c < compiled.length; c++) {
      // <TODO> remove?
      /*
         if (c > 0) {
            const pr =
               (c > 1 && compiled[c-1].type == "linefeed") ? c-2 : c-1;
            if (Translator.subordinatorElement.includes(compiled[pr].type))
               compiled[c].subordinate = true;
         }
         */

      /*
         if (compiled[c].type == "linefeed") {
            if (c > 0 && compiled[c-1].type == "text" &&
                c < compiled.length-1 && compiled[c+1].type == "text" &&
                compiled[c-1].subordinate == compiled[c+1].subordinate) {
               compiled[c-1].content += compiled[c].content +
                                            compiled[c+1].content;
               compiled[c-1]._source += compiled[c]._source +
                                            compiled[c+1]._source;
               compiled.splice(c, 2);
               c--;
            } else if (c > 0 && compiled[c-1].type == "text-block" &&
                       c < compiled.length-1 &&
                       compiled[c+1].type == "text-block" &&
                       this._authoringRender) {
               compiled[c].render = true;
               compiled[c-1].content.push(compiled[c]);
               compiled[c-1].content = compiled[c-1].content
                                          .concat(compiled[c+1].content);
               for (let s in compiled[c-1].content)
                  compiled[c-1].content[s].seq = s;
               compiled[c-1]._source += compiled[c]._source +
                                            compiled[c+1]._source;
               compiled.splice(c, 2);
               c--;
            }
              else */
      // removes extra linefeeds when the element embeds it
      if (compiled[c].type == 'linefeed' &&
             (c == 0 ||
              // (compiled[c-1].type != "text" &&
              // compiled[c-1].type != "text-block" &&
              Translator.isLine.includes(compiled[c - 1].type))) {
        if (compiled[c].content.length > 1) {
          compiled[c].content = compiled[c].content.substring(1)
          compiled[c]._source = compiled[c]._source.substring(1)
        } else {
          compiled.splice(c, 1)
          c--
        }
      }
      if (c >= 0) { compiled[c].seq = c + 1 }
    }
    /*
      for (let c = 0; c < compiled.length; c++)
         if (compiled[c].type == "text-block")
            this._compileMergeLinefeeds(compiled[c]);
      */
  }

  /*
    * Joins inline elements in a composition
    */
  /*
   _compileCompose(compiledKnot) {

   }
   */

  /*
    * Replicates background and entity images
    */
  _replicateImages (compiledCase) {
    let lastBackground = null
    const entityImage = {}
    const knots = compiledCase.knots
    for (const k in knots) {
      if (knots[k].background) { lastBackground = knots[k].background } else if (lastBackground != null) { knots[k].background = lastBackground }
      for (const c in knots[k].content) {
        if (knots[k].content[c].type == 'entity') {
          if (knots[k].content[c].image) {
            entityImage[knots[k].content[c].entity] =
                     knots[k].content[c].image
          } else if (entityImage[knots[k].content[c].entity]) {
            knots[k].content[c].image =
                     entityImage[knots[k].content[c].entity]
          }
        }
      }
    }
  }

  /*
    * Replicates inherited content
    */
  _replicateInheritance (compiledCase) {
    const knots = compiledCase.knots
    for (const k in knots) {
      if (knots[k].inheritance) {
        const target = this.findContext(knots, k, knots[k].inheritance)
        if (knots[target]) {
          if (knots[target].categories) {
            if (!knots[k].categories)
              knots[k].categories = []
            for (let c of knots[target].categories)
              if (!['master', 'master_top', 'master_bottom'].includes(c))
                knots[k].categories.push(c)
            knots[k].categoriesInherited = knots[target].categories
          }
          let inherited = JSON.parse(JSON.stringify(knots[target].content))
          for (let ct of inherited)
            ct.inherited = true
          if (knots[target].categories &&
              knots[target].categories.includes('master_bottom'))
            knots[k].content = knots[k].content.concat(inherited)
          else
            knots[k].content = inherited.concat(knots[k].content)
          let seq = 1
          for (let c in knots[k].content) {
            knots[k].content[c].seq = seq
            seq++;
          }
        }

        // adjusting the context
        // <TODO> this solution is provisory as I am removing the context to add again

        // removing context
        const compiled = knots[k].content
        for (const c in compiled) {
          if (compiled[c].type == 'input') {
            compiled[c].variable =
                     compiled[c].variable.substring(compiled[c].variable.lastIndexOf('.') + 1)
          } else if (compiled[c].type == 'context-open' && compiled[c].input) {
            compiled[c].input =
                     compiled[c].input.substring(compiled[c].input.lastIndexOf('.') + 1)
          }
        }

        // reinserting context
        this._compileContext(knots, k, compiled)
      }
    }
  }

  _mdToObj (mdType, match, toTranslate) {
    let obj
    switch (mdType) {
      case 'knot' : obj = this._knotMdToObj(match); break
      case 'literal': obj = this._literalMdToObj(match, toTranslate); break
      case 'blockquote': obj = this._blockquoteMdToObj(match); break
      case 'image': obj = this._imageMdToObj(match); break
      case 'media': obj = this._mediaMdToObj(match); break
      case 'option' : obj = this._optionMdToObj(match); break
      case 'item' : obj = this._itemMdToObj(match); break
      case 'field' : obj = this._fieldMdToObj(match); break
      case 'divert-script' : obj = this._divertScriptMdToObj(match); break
      case 'divert' : obj = this._divertMdToObj(match); break
      case 'entity' : obj = this._entityMdToObj(match); break
      case 'mention': obj = this._mentionMdToObj(match); break
        // case "talk-open" : obj = this._talkopenMdToObj(match); break;
        // case "talk-close": obj = this._talkcloseMdToObj(match); break;
      case 'input' : obj = this._inputMdToObj(match); break
      case 'output' : obj = this._outputMdToObj(match); break
      case 'condition' : obj = this._conditionMdToObj(match); break
      case 'compute' : obj = this._computeMdToObj(match); break
        // <TODO> provisory: annotation recognition is duplicated to support code generation
      case 'annotation' : obj = this._annotationMdToObj(match); break
      case 'context-open' : obj = this._selctxopenMdToObj(match); break
      case 'context-close' : obj = this._selctxcloseMdToObj(match); break
      case 'formal-open' : obj = this._formalOpenMdToObj(match); break
      case 'formal-close' : obj = this._formalCloseMdToObj(match); break
      case 'select' : obj = this._selectMdToObj(match); break
      case 'linefeed': obj = this._linefeedMdToObj(match); break
      case 'component': obj = this._componentMdToObj(match); break
      case 'connection': obj = this._connectionMdToObj(match); break
    };
    return obj
  }

  /*
    * Produce a sequential stamp to uniquely identify each recognized object
    */
  _initializeObject (obj, submark) {
    obj._source = submark
    obj._modified = false
    this._objSequence++
    obj.seq = this._objSequence
    return obj
  }

  /*
    *
    */
  async generateHTML (knot) {
    this.newThemeSet()
    const finalHTML = await this.generateHTMLBuffer(knot)
    this.deleteThemeSet()
    return finalHTML
  }

  newThemeSet () {
    this._themeSet = {}
  }

  deleteThemeSet () {
    // <TODO> there is some synchronization problem - it is deleting before finishing
    // delete this._themeSet;
  }

  async generateHTMLBuffer (knot) {
    this._defineCategorySettings(
      (knot.categories) ? knot.categories : null)
    const themes = (knot.categories)
      ? knot.categories : ['knot']
    for (const tp in themes) {
      if (!Translator.markerCategories.includes(themes[tp]) &&
          !this._themeSet[themes[tp]]) {
        const templ = await
        this.loadTheme(themes[tp])
        if (templ != '') { this._themeSet[themes[tp]] = templ } else {
          if (!this._themeSet.knot) {
            this._themeSet.knot = await
            this._loadTheme('knot')
          }
          this._themeSet[themes[tp]] = this._themeSet.knot
        }
      }
    }
    let finalHTML = await this.generateKnotHTML(knot.content)
    const backPath = (knot.background !== undefined)
      ? Basic.service.imageResolver(knot.background.path) : ''
    const backAlt = (knot.background !== undefined) ? knot.background.alternative : ''
    for (let tp = themes.length - 1; tp >= 0; tp--) {
      if (!Translator.markerCategories.includes(themes[tp]))
        finalHTML = this._themeSet[themes[tp]]
          .replace(/{knot}/igm, finalHTML)
          .replace(/{background-path}/igm, backPath)
          .replace(/{background-alternative}/igm, backAlt)
    }
    return finalHTML
  }

  async loadTheme (themeName) {
    const themeObj = await MessageBus.i.request(
      'data/theme/' + Basic.service.currentThemeFamily.toLowerCase() +
            '.' + themeName.toLowerCase() + '/get', null, null, true)
    return themeObj.message
  }

  /*
    * Generate HTML in a single knot
    */
  generateKnotHTML (content, superseq) {
    const ss = (superseq) || -1
    this._lastCompute = null  // last element on the compute dependency chain
    let preDoc = ''
    let html = ''
    const preDocSet = ['text', 'text-block', 'script', 'field',
      'context-open', 'context-close', 'linefeed']
    if (content != null) {
      // produces a pretext with object slots to process markdown
      for (const kc in content) {
        preDoc += (preDocSet.includes(content[kc].type))
          ? this.objToHTML(content[kc], ss)
          : '@@' + content[kc].seq + '@@'
      }

      html = this.markdownToHTML(preDoc)

      // replaces the marks
      let current = 0
      let next = html.indexOf('@@')
      while (next != -1) {
        const end = html.indexOf('@@', next + 1)
        const seq = parseInt(html.substring(next + 2, end))
        while (current < content.length && content[current].seq < seq) { current++ }
        if (current >= content.length || content[current].seq != seq) {
          html = html.substring(0, next) + '[error in translation]' +
                 html.substring(end + 2)
          console.log('Error in finding seq: ' + seq)
        } else {
          html = html.substring(0, next) +
                 this.objToHTML(content[current], ss) +
                 html.substring(end + 2)
        }
        next = html.indexOf('@@')
      }

      html = html.replace(Translator.contextHTML.open,
        this._contextSelectHTMLAdjust)
      html = html.replace(Translator.contextHTML.close,
        this._contextSelectHTMLAdjust)

      html = html.replace(/<video><source src="(https:\/\/drive.google.com[\w/]*\/[^/]+\/)([^/]*)"><\/video>/igm,
                          '<figure class="media"><iframe src="$1preview" width="560" height="315"></iframe><oembed url="$1$2"></oembed></figure>')
                 .replace(/<video><source src="([^"]+)"><\/video>/igm,
                          '<figure class="media"><video controls><source src="$1"><\/video><oembed url="$1"></oembed></figure>')
    }
    return html
  }

  // converts markdown to HTML and adjusts a <dcc-markdown> wrong conversion
  markdownToHTML (markdown) {
    let html = this._markdownTranslator.makeHtml(markdown)

    html = html.replace(/<p><dcc-markdown id='dcc(\d+)'( author)?><\/p>/igm,
      "<dcc-markdown id='dcc$1'$2>")
      .replace(/<p><\/dcc-markdown><\/p>/igm, '</dcc-markdown>')

    return html
  }

  objToHTML (obj, superseq) {
    let html
    if ((obj.render !== undefined && !obj.render) ||
        (obj.inherited && this.authoringRender)) { html = '' } else {
      switch (obj.type) {
        case 'literal': html = this._literalObjToHTML(obj); break
        case 'blockquote': html = this._blockquoteObjToHTML(obj); break
        case 'text' : html = this._textObjToHTML(obj, superseq); break
        case 'text-block': html = this._textBlockObjToHTML(obj, superseq)
          break
        case 'script': html = this._scriptObjToHTML(obj, superseq)
          break
        case 'image' : html = this._imageObjToHTML(obj, superseq); break
        case 'media' : html = this._mediaObjToHTML(obj, superseq); break
        case 'option' : html = this._optionObjToHTML(obj); break
        case 'field' : html = this._fieldObjToHTML(obj); break
        case 'divert-script' :
          html = this._divertScriptObjToHTML(obj, superseq); break
        case 'divert' : html = this._divertObjToHTML(obj); break
        case 'entity' : html = this._entityObjToHTML(obj); break
        case 'mention': html = this._mentionObjToHTML(obj); break
        // case "talk-open" : html = this._talkopenObjToHTML(obj); break;
        // case "talk-close": html = this._talkcloseObjToHTML(obj); break;
        case 'input' : html = this._inputObjToHTML(obj); break
        case 'output' : html = this._outputObjToHTML(obj); break
        case 'condition-open': html = this._conditionOpenObjToHTML(obj); break
        case 'condition-close': html = this._conditionCloseObjToHTML(obj); break
        case 'compute' :
          html = this._computeObjToHTML(obj, superseq); break
        case 'context-open' : // html = this._selctxopenObjToHTML(obj); break;
        case 'context-close' : html = ''; break // html = this._selctxcloseObjToHTML(obj);
        case 'select' : html = this._selectObjToHTML(obj, superseq); break
        case 'annotation' : html = this._annotationObjToHTML(obj, superseq); break
        case 'linefeed' : html = this._linefeedObjToHTML(obj); break
        case 'component' : html = this._componentObjToHTML(obj); break
        case 'connection' : html = this._connectionObjToHTML(obj); break
      }
    }
    return html
  }

  generateCompiledJSON (compiledCase) {
    return '(function() { DCCPlayerServer.playerObj =' +
             JSON.stringify(compiledCase) + '})();'
  }

  /*
    * Put together all source fragments
    */
  assembleMarkdown (compiledCase, includeStatic) {
    let md = ''
    for (const kn in compiledCase.knots) {
      // toCompile indicates a part generated only with markdown (by newKnot)
      // and cannot inversely generate markdown
      if (compiledCase.knots[kn].toCompile) {
        md += compiledCase.knots[kn]._source
      } else {
        md += compiledCase.knots[kn]._sourceHead + '\n'
        const contentMd =
          this.contentToMarkdown(compiledCase.knots[kn].content)
        md += contentMd
        /*
        let newContent = 0
        for (const ct in compiledCase.knots[kn].content) {
          const content = compiledCase.knots[kn].content[ct]

          if (!content.inherited) {
            // linefeed of the merged block (if block), otherwise linefeed of the content
            md += content._source +
                        (((content.mergeLine === undefined &&
                           Translator.isLine.includes(content.type)) ||
                          (content.mergeLine !== undefined &&
                           content.mergeLine))
                          ? '\n' : '')
            newContent++
          }
        }
        if (newContent == 0)
        */
        /*
        if (contentMd.length > 0)
          md += '\n'
        */
      }
    }

    // <TODO> provisory
    if (compiledCase.layers) {
      for (const l in compiledCase.layers)
        md += Translator.markdownTemplates.layer.replace('[title]', l) +
              compiledCase.layers[l]._source

      if (includeStatic || !compiledCase.slayers.Template)
        for (const l in compiledCase.slayers)
          md += Translator.markdownTemplates.layer.replace('[title]', l) +
                compiledCase.slayers[l]._source
      else if (compiledCase.slayers.Template)
        md += Translator.markdownTemplates.layer.replace('[title]', 'Template') +
              compiledCase.slayers.Template._source
    }

    return md
  }

  contentToMarkdown (unityContent) {
    let md = ''
    for (const ct in unityContent) {
      const content = unityContent[ct]

      if (!content.inherited) {
        // linefeed of the merged block (if block), otherwise linefeed of the content
        md += content._source +
                    ((((content.mergeLine === undefined &&
                        Translator.isLine.includes(content.type)) ||
                       (content.mergeLine !== undefined &&
                        content.mergeLine)) &&
                        (content._source.length < 1 ||
                         content._source[content._source.length-1] != '\n'))
                      ? '\n' : '')
      }
    }
    if (md.length < 1 || md[md.length-1] != '\n')
      md += '\n\n'
    else if (md.length < 2 || md[md.length-2] != '\n')
      md += '\n'
    return md
  }

  /*
    * Updates the markdown of an element according to its object representation
    */
  updateElementMarkdown (element) {
    // switch instead array to avoid binds
    switch (element.type) {
      case 'knot': element._sourceHead = this._knotObjToMd(element)
        // element._source = element._sourceHead;
        break
      case 'text': element._source = this._textObjToMd(element)
        break
      case 'text-block':
        element._source = ''
        for (const sub of element.content) {
          this.updateElementMarkdown(sub)
          element._source += sub._source
        }
        break
      case 'linefeed': element._source = this._linefeedObjToMd(element)
        break
      case 'image': element._source = this._imageObjToMd(element)
        break
      case 'media': element._source = this._mediaObjToMd(element)
        break
      case 'option': element._source = this._optionObjToMd(element)
        break
      case 'field': element._source = this._fieldObjToMd(element)
        break
      case 'entity': element._source = this._entityObjToMd(element)
        break
      case 'input': element._source = this._inputObjToMd(element)
        break
      case 'context-open': element._source = this._contextOpenObjToMd(element)
        break
      case 'context-close': element._source = this._contextCloseObjToMd(element)
        break
      case 'formal-open': element._source = this._formalOpenObjToMd(element)
        break
      case 'formal-close': element._source = this._formalCloseObjToMd(element)
        break
    }
  }

  /*
    * Adjusts the HTML generated to avoid trapping the constext select tag in a paragraph
    */
  _contextSelectHTMLAdjust (matchStr, insideP) {
    return insideP
  }

  /*
   * Extracts the title of the first knot (to be used in templates conversion)
   */
  extractKnotTitle (knotMd) {
    const knotObj = this._knotMdToObj(Translator.element.knot.mark.exec(knotMd))
    return knotObj.title
  }

  /*
   * Knot Md to Obj
   */
  _knotMdToObj (matchArray) {
    const knot = {
      type: 'knot'
    }

    knot.unity = (matchArray[5] != null || matchArray[6] != null)

    if (matchArray[2] != null) { knot.title = matchArray[2].trim() } else { knot.title = matchArray[7].trim() }

    if (matchArray[3] != null) {
      knot.categories = matchArray[3].split(',')
    } else if (matchArray[8] != null) {
      knot.categories = matchArray[8].split(',')
    }
    if (knot.categories) {
      for (const c in knot.categories) { knot.categories[c] = knot.categories[c].trim() }
    }

    // moves special categories to the beggining of the list
    if (knot.categories != null) {
      for (const sc in Translator.specialCategories) {
        const cat = knot.categories.indexOf(Translator.specialCategories[sc])
        if (cat >= 0) {
          const category = knot.categories[cat]
          knot.categories.splice(cat, 1)
          knot.categories.unshift(category)
        }
      }
    }

    if (matchArray[4] != null) { knot.inheritance = matchArray[4].trim() }
    else if (matchArray[9] != null) { knot.inheritance = matchArray[9].trim() }

    if (matchArray[1] != null) { knot.level = matchArray[1].trim().length } else
    if (matchArray[10][0] == '=') { knot.level = 1 } else { knot.level = 2 }

    return knot
  }

  /*
    * Knot Obj to Md
    */
  _knotObjToMd (obj) {
    let categories = obj.categories
    if (obj.categories && obj.categoriesInherited)
      categories = obj.categories.filter(c => !obj.categoriesInherited.includes(c))
    return Translator.markdownTemplates.knot
      .replace('[level]', '#'.repeat(obj.level))
      .replace('[unity]', ((obj.unity) ? ' ' + '#'.repeat(obj.level) : ''))
      .replace('[title]', obj.title)
      .replace('[categories]',
        (categories)
          ? ' (' + categories.join(',') + ')' : '')
      .replace('[inheritance]',
        (obj.inheritance)
          ? ': ' + obj.inheritance : '')
  }

  /*
    * Text Raw to Obj
    */
  _literalMdToObj (matchArray, toTranslate) {
    return {
      type: 'literal',
      subtype: matchArray[2],
      delimiter: matchArray[1],
      content: toTranslate.substring(matchArray[0].length,
                                     toTranslate.length - 3)
    }
  }

  /*
    * Text Obj to HTML
    */
  _literalObjToHTML (obj) {
    let result = obj.content
    if (this.authoringRender)
      result = Translator.htmlTemplatesEditable.text
        .replace('[seq]', obj.seq)
        .replace('[author]', this._authorAttrSub(obj.seq))
        .replace('[content]', obj.content)
    return result
  }

  /*
    * Blockquote Md to Obj
    */
  _blockquoteMdToObj (matchArray) {
    return {
      type: 'blockquote',
      content: matchArray[0],
      blockquote: true
    }
  }

  /*
    * Blockquote Obj to HTML
    */
  _blockquoteObjToHTML (obj) {
    return obj.content
  }

  /*
    * Text Raw to Obj
    */
  _textMdToObj (markdown) {
    return {
      type: 'text',
      subordinate: /^\t|^ [\t ]/.test(markdown),
      content: markdown
    }
  }

  /*
    * Text Obj to HTML
    */
  _textObjToHTML (obj, superseq) {
    let result = obj.content
    if (this.authoringRender && superseq == -1)
      result = Translator.htmlTemplatesEditable.text
        .replace('[seq]', this._subSeq(superseq, obj.seq))
        .replace('[author]', this._authorAttrSub(superseq))
        .replace('[content]', obj.content)
    return result
  }

  _textObjToMd (obj) {
    let content = obj.content
    if (obj.blockquote) {
      const blockRegex = /^[ \t]*>[ \t]*/i
      const lines = content.split('\n')
      for (const l in lines) {
        if (!blockRegex.test(lines[l])) { lines[l] = '> ' + lines[l] }
      }
      content = lines.join('\n')
    }
    return content
  }

  /*
    * Text Block Obj to HTML
    */
  _textBlockObjToHTML (obj, superseq) {
    const html = Translator.htmlTemplates.textBlock
      .replace('[seq]', this._subSeq(superseq, obj.seq))
      .replace('[author]', this._authorAttrSub(superseq))
      .replace('[content]', this.generateKnotHTML(obj.content,
        this._subSeq(superseq, obj.seq)))
    return html
  }

  /*
    * Script Obj to HTML
    */
  _scriptObjToHTML (obj, superseq) {
    const html = Translator.htmlTemplates.script
      .replace('[seq]', this._subSeq(superseq, obj.seq))
      .replace('[author]', this._authorAttrSub(superseq))
      .replace('[content]', this.generateKnotHTML(obj.content,
        this._subSeq(superseq, obj.seq)))
    return html
  }

  /*
    * Line feed Md to Obj
    */
  _linefeedMdToObj (matchArray) {
    return {
      type: 'linefeed',
      content: matchArray[0],
      render: false
    }
  }

  /*
    * Line feed Obj to HTML
    */
  _linefeedObjToHTML (obj) {
    return (obj.render) ? obj.content : ''
  }

  /*
    * Line feed Obj to Markdown
    */
  _linefeedObjToMd (obj) {
    let result = obj.content
    if (obj.blockquote) {
      const lf = obj.content.match(/\r?\n/gm)
      result = lf.join('>')
    }
    return result
  }

  /*
    * Image Md to Obj
    */
  _imageMdToObj (matchArray) {
    const image = {
      type: 'image',
      subordinate:
            !!((matchArray[1][0] === '\t' || matchArray[1].length > 1)),
      alternative: matchArray[2].trim(),
      path: matchArray[3].trim()
    }
    if (matchArray[4] != null) { image.width = matchArray[4]}
    if (matchArray[5] != null) { image.height = matchArray[5]}
    if (matchArray[6] != null) { image.title = matchArray[6].trim() }
    return image
  }

  /*
    * Image Obj to HTML
    */
  _imageObjToHTML (obj, superseq) {
    /*
      const aRender = (authorRender)
         ? authorRender : this.authoringRender;
      */
    let result
    if (this.authoringRender && superseq == -1) {
      result = Translator.htmlTemplatesEditable.image
        .replace('[seq]', obj.seq)
        .replace('[author]', this._authorAttrSub(superseq))
        .replace('[path]', obj.path)
        .replace('[alternative]', obj.alternative)
        .replace('[title]', (obj.title)
          ? " title='" + obj.title + "'" : '')
    } else {
      let resize = ''
      if (obj.width || obj.height)
        resize = ' style="' +
          ((obj.width) ? 'width:' + obj.width + ';' : '') +
          ((obj.height && obj.height != obj.width) ? 'height:' + obj.height : '') + '"'
      result = Translator.htmlTemplates.image
        .replace('[path]', Basic.service.imageResolver(obj.path))
        .replace('[imgresized]', (resize != '') ? ' image_resized' : '')
        .replace('[alt]', (obj.title)
          ? ' alt="' + obj.title + '"' : '')
        .replace('[resize]', resize)
        .replace('[caption]', (obj.title)
          ? '<figcaption>' + obj.title + '</figcaption>' : '')
    }
    return result
  }

  _imageObjToMd (obj) {
    let resize = ''
    if (obj.width || obj.height)
      resize = ' =' +
        ((obj.width) ? obj.width : '') + 'x' +
        ((obj.height) ? obj.height : '')
    return Translator.markdownTemplates.image
      .replace('{alternative}', obj.alternative)
      .replace('{path}', obj.path)
      .replace('{resize}', resize)
      .replace('{title}',
        (obj.title) ? ' "' + obj.title + '"' : '')
  }

  /*
   * Media Md to Obj
   */
  _mediaMdToObj (matchArray) {
    const media = {
      type: 'media',
      subtype: matchArray[1].trim()
    }
    if (matchArray[2] != null) { media.path = matchArray[2].trim() }
    return media
  }

  /*
   * Media Obj to HTML
   */
  _mediaObjToHTML (obj, superseq) {
    let result
    if (this.authoringRender && superseq == -1) {
      result = Translator.htmlTemplatesEditable.media
        .replace('[seq]', obj.seq)
        .replace('[author]', this._authorAttrSub(superseq))
        .replace(/\[subtype\]/g, obj.subtype)
        .replace('[source]', (obj.path)
          ? ' source="' + obj.path + '"' : '')
    } else {
      let resize = ''
      result = Translator.htmlTemplates.media
        .replace(/\[subtype\]/g, obj.subtype)
        .replace('[source]', (obj.path)
          ? '<source src="' + Basic.service.imageResolver(obj.path) + '">' : '')
    }
    return result
  }

  _mediaObjToMd (obj) {
    return Translator.markdownTemplates.media
      .replace(/\[subtype\]/g, obj.subtype)
      .replace('[source]', obj.path)
  }

  classifyArtifactType (filepath) {
    let type = ''
    const extension = filepath.substring(filepath.lastIndexOf('.') + 1)
    for (let ext in Translator.extension)
      if (Translator.extension[ext].includes(extension)) {
        type = ext
        break
      }
    return type
  }

  /*
    * Context Open Md to Obj
    */
  _contextOpenMdToObj (matchArray) {
    const context = {
      type: 'context',
    }
    if (matchArray[1] != null) { context.namespace = matchArray[1].trim() }
    if (matchArray[2] != null) { context.context = matchArray[2].trim() }
    if (matchArray[3] != null) { context.id = matchArray[3].trim() }
    if (matchArray[4] != null) { context.property = matchArray[4].trim() }
    if (matchArray[5] != null) { context.value = matchArray[5].trim() }

    return context
  }

  _contextOpenObjToMd (obj) {
    let property = ''
    if (obj.property) {
      property = '/' + obj.property
      if (obj.value)
        property += ' ' + obj.value
      property += '/'
    }
    return Translator.markdownTemplates['context-open']
      .replace('[namespace]', (obj.namespace) ? obj.namespace + ':' : '')
      .replace('[context]', obj.context)
      .replace('[id]', (obj.id) ? '@' + obj.id : '')
      .replace('[property-value]', property)
  }

  /*
    * Context Close Md to Obj
    */
  _contextCloseMdToObj (matchArray) {
  }

  _contextCloseObjToMd (obj) {
    return Translator.markdownTemplates['context-close']
  }

  /*
    * Annotation Md to Obj
    */
  _annotationMdToObj (matchArray) {
    const annotation = {
      type: 'annotation',
      natural: this._annotationInsideMdToObj(
        Translator.marksAnnotationInside.exec(matchArray[1].trim()))
    }

    if (matchArray[2] != null) {
      annotation.formal = this._annotationInsideMdToObj(
        Translator.marksAnnotationInside.exec(matchArray[2].trim()))
    }

    if (matchArray[3] != null) { annotation.value = matchArray[3].trim() }

    return annotation
  }

  /*
    * Annotation Inside Md to Obj
    */
  _annotationInsideMdToObj (matchArray) {
    const inside = {
      complete: matchArray[0]
    }

    if (matchArray[1] != null) { inside.namespace = matchArray[1].trim() }
    if (matchArray[2] != null) { inside.expression = matchArray[2].trim() }
    if (matchArray[3] != null) { inside.specification = matchArray[3].trim() }
    if (matchArray[4] != null) { inside.rate = matchArray[4].trim() }

    return inside
  }

  /*
    * Annotation Obj to HTML
    */
  _annotationObjToHTML (obj, superseq) {
    return (this.authoringRender)
      ? Translator.htmlTemplates.annotation
        .replace('[seq]', this._subSeq(superseq, obj.seq))
        .replace('[author]', this._authorAttrSub(superseq))
        .replace('[annotation]',
          (obj.formal) ? " annotation='" + obj.formal.complete + "'" : '')
        .replace('[content]', obj.natural.complete)
      : obj.natural.complete
  }

  /*
    * Option Md to Obj
    */
  _optionMdToObj (matchArray) {
    /*
      const divertMap = {
         "->":  "forward",
         "<->": "round",
         "(-)": "enclosed"
      };
      */

    const option = {
      type: 'option',
      subordinate: /^\t|^ [\t ]/.test(matchArray[0])
    }

    option.subtype = (matchArray[1] != null) ? matchArray[1].trim() : '_'

    if (matchArray[2] != null) { option.label = matchArray[2].trim() }
    /*
      if (matchArray[3] != null)
         option.rule = matchArray[3].trim();
      */
    if (matchArray[3] != null) { option.divert = matchArray[3].trim() }
    if (matchArray[4] != null) { option.target = matchArray[4].trim() }
    if (matchArray[5] != null) { option.message = matchArray[5].trim() }

    // <TODO> backwards compatibility -- remove in the future?
    if (matchArray[6] != null)
      { option.operation = matchArray[6].trim() }
    else if (matchArray[8] != null)
      { option.operation = matchArray[8].trim() }
    if (matchArray[7] != null) { option.state = matchArray[7].trim() }

    // compute element inside option
    if (matchArray[9] != null)
      option.compute = matchArray[9].trim()
    //  option.compute = this._computeMdToObj(['', matchArray[9], matchArray[10], matchArray[11]], true)

    return option
  }

  /*
    * Option Obj to HTML
    */
  _optionObjToHTML (obj) {
    const optionalImage = ''
    // <TODO> Temporary
    /*
      const optionalImage = (obj.rule == null) ?
         " image='images/" + display.toLowerCase().replace(/ /igm, "-") + ".svg'" :
         "";
      */

    let label
    if (obj.label) { label = obj.label } else {
      label = obj.target
      const lastDot = label.lastIndexOf('.')
      if (lastDot > -1) { label = label.substr(lastDot + 1) }
    }

    const option = Translator.htmlTemplates.option
      .replace('[seq]', obj.seq)
      .replace('[author]', this.authorAttr)
      .replace('[target]', this._transformNavigationMessage(obj.contextTarget))
      .replace('[display]', label)
      .replace('[divert]',
        (obj.divert == null) ? '' : " divert='" + obj.divert + "'")
      .replace('[message]',
        (obj.message == null) ? '' : " message='" + obj.message + "'")
      .replace('[image]', optionalImage)
      .replace('[connect]',
        (obj.compute == null) ? '' :
           Translator.htmlSubTemplates.compute.connect
             .replace('[seq]', obj.seq))
      .replace('[compute]',
        (obj.compute == null) ? '' :
           Translator.htmlSubTemplates.compute.component
             .replace('[seq]', obj.seq)
             .replace('[expression]', obj.compute))
      .replace(
        '[show]', (this._conditionNext == obj.seq) ? ' display="none"' : '')

      /*
      console.log('=== button')
      console.log(option)
      */

      if (this._conditionNext == obj.seq)
        this._conditionNext = -1

      return option
  }

  _transformNavigationMessage (target) {
    let message
    const lower = target.toLowerCase()
    if (Translator.reservedNavigation.includes(lower)) {
      message = Translator.navigationMap[lower] }
    else if (lower.startsWith('variable.'))
      message = 'knot/navigate/=/' + target.substring(9).replace(/\./g, '/')
    else
      message = 'knot/navigate/' + target.replace(/\./g, '/')
    return message
  }

  _optionObjToMd (obj) {
    let state = ''
    if (obj.state && obj.operation)
      state = ' ' + ((obj.operation == ">") ? '>' : '') + '((' + obj.state + '))' + ((obj.operation == "?") ? '?' : '')
    return Translator.markdownTemplates.option
      .replace('{subtype}', (obj.subtype == '_') ? '' : obj.subtype + ' ')
      .replace('{label}', (obj.label) ? obj.label : '')
      .replace('{divert}', obj.divert)
      .replace('{target}', obj.target)
      .replace('{message}', (obj.message) ? '"' + obj.message + '"' : '')
      .replace('{state}', state)
  }

  /*
    * Field Md to Obj
    */
  _fieldMdToObj (matchArray) {
    const field = {
      type: 'field',
      presentation: matchArray[0],
      subordinate:
            !!((matchArray[1][0] === '\t' || matchArray[1].length > 1)),
      field: matchArray[2].trim()
    }
    if (field.field[0] == "'") {
      field.field = field.field.substring(1, field.field.length-1)
      field.quotes = true
    }
    if (matchArray[3] != null) {
      field.value = matchArray[3].trim()
    } else if (matchArray[4] != null) {
      field.value = matchArray[4].trim()
    }
    if (Translator.fieldSet.includes(field.field) && field.value) {
      field.value = field.value.split(',')
      for (const fv in field.value) { field.value[fv] = field.value[fv].trim() }
    }
    if (matchArray[5] != null) { field.target = matchArray[5].trim() }
    if (field.subordinate) { field.level = this._computeLevel(matchArray[1]) }
    return field
  }

  _computeLevel (indent) {
    let level = 0
    let space = 0
    for (const c in indent) {
      if (indent[c] === '\t') { level++ } else {
        space++
        if (space > 1) {
          level++
          space = 0
        }
      }
    }
    return level
  }

  /*
    * Field Obj to HTML
    */
  _fieldObjToHTML (obj) {
    return obj.presentation
  }

  _fieldObjToMd (obj) {
    let level = 0
    let fieldObj = {}
    fieldObj[obj.field] = obj.value
    return this._visitFields(fieldObj, 0)
  }

  _visitFields (fields, level) {
    let md = ''
    const spaces = ' '.repeat(level)
    for (let f in fields) {
      md += spaces + "* " + ((f.quotes) ? "'" : '') + f + ((f.quotes) ? "'" : '') + ': '
      if (typeof fields[f] === 'object')
        md += '\n' + this._visitFields(fields[f], level+2)
      else if (typeof fields[f] === 'string')
        md += "'" + fields[f].replace(/'/gm, '"') + "'\n"
      else md += fields[f] + '\n'
    }
    return md
  }

  _itemMdToObj (matchArray) {
    const item = {
      type: 'item',
      presentation: matchArray[0],
      subordinate:
            !!((matchArray[1][0] === '\t' || matchArray[1].length > 1)),
      label: matchArray[2].trim()
    }
    if (item.label[0] == "'") {
      item.label = item.label.substring(1, item.label.length-1)
      item.quotes = true
    }
    if (item.subordinate) { item.level = this._computeLevel(matchArray[1]) }
    return item
  }

  /*
    * Divert Script Md to Obj
    */
  _divertScriptMdToObj (matchArray) {
    const sentence = {
      type: 'divert-script',
      target: matchArray[4].trim()
    }

    if (matchArray[1] != null) {
      sentence.condition = {
        variable: matchArray[1].trim(),
        operator: matchArray[2].trim(),
        value: matchArray[3].trim()
      }
    }

    if (matchArray[5] != null) { sentence.parameter = { parameter: matchArray[5].trim() } }

    return sentence
  }

  /*
    * Divert Script Obj to HTML
    */
  _divertScriptObjToHTML (obj) {
    return Translator.htmlTemplates['divert-script']
      .replace('[target]', obj.target)
      .replace('[parameter]', (obj.parameter)
        ? '"' + obj.parameter.parameter + '"' : '')
  }

  /*
    * Divert Md to Obj
    */
  _divertMdToObj (matchArray) {
    const label = (matchArray[1]) ? matchArray[1].trim() : matchArray[2].trim()
    const target = (matchArray[4]) ? matchArray[4].trim() : matchArray[5].trim()
    return {
      type: 'divert',
      label: label,
      divert: matchArray[3].trim(),
      target: target
    }
  }

  /*
    * Divert Obj to HTML
    */
  _divertObjToHTML (obj) {
    return Translator.htmlTemplates.divert
      .replace('[seq]', obj.seq)
      .replace('[author]', this.authorAttr)
      .replace('[divert]', this.divert)
      .replace('[target]',
        this._transformNavigationMessage(obj.contextTarget))
      .replace('[display]', obj.label)
  }

  /*
    * Entity Md to Obj
    */
  _entityMdToObj (matchArray) {
    const entity = {
      type: (this.authoringRender && this._categorySettings &&
                this._categorySettings.entity == 'flat')
        ? 'mention' : 'entity',
      entity: (matchArray[1] != null) ? matchArray[1].trim()
        : matchArray[2].trim()
    }
    /*
      if (matchArray[3] != null)
         entity.speech = matchArray[3].trim();
      */

    return entity
  }

  _fieldCategorySetting (field) {
    let setting = 'undefined'
    if (this._categorySettings) {
      if (this._categorySettings[field]) { setting = this._categorySettings[field] } else if (this._categorySettings[Translator.genericFieldType]) { setting = this._categorySettings[Translator.genericFieldType] }
    }
    return setting
  }

  /*
    * Entity Obj to HTML
    */
  _entityObjToHTML (obj) {
    let path = ''
    let alternative = ''
    let title = ''
    if (obj.image) {
      path = " image='" + Basic.service.imageResolver(obj.image.path) + "'"
      alternative = " alternative='" + obj.image.alternative + "'"
      if (obj.image.title) { title = " title='" + obj.image.title + "'" }
    }
    const setting = this._fieldCategorySetting('entity')
    const template = (setting == 'flat')
      ? Translator.htmlFlatTemplates : Translator.htmlTemplates
    let text = (obj.text == null)
      ? '' : ((Array.isArray(obj.text))
        ? this.generateKnotHTML(obj.text) : obj.text)
    text = text.replace(/^<p>(.*)<\/p>$/im, '$1')
    return template.entity
      .replace('[seq]', obj.seq)
      .replace('[author]', this.authorAttr)
      .replace('[entity]', obj.entity)
      .replace('[text]', text)
      .replace('[image]', path)
      .replace('[alternative]', alternative)
      .replace('[title]', title)
  }

  _entityObjToMd (obj) {
    let entity = Translator.markdownTemplates.entity
      .replace('{entity}', obj.entity)
    if (obj.text) { entity += '\n  ' + obj.text }
    if (obj.image) { entity += '\n  ' + this._imageObjToMd(obj.image) }

    return entity
  }

  /*
    * Mention Md to Obj
    */
  _mentionMdToObj (matchArray) {
    return {
      type: 'mention',
      entity: (matchArray[1] != null) ? matchArray[1].trim()
        : matchArray[2].trim()
    }
  }

  /*
    * Mention Obj to HTML
    */
  _mentionObjToHTML (obj) {
    return Translator.htmlTemplates.mention
      .replace('[seq]', obj.seq)
      .replace('[author]', this.authorAttr)
      .replace('[entity]', obj.entity)
  }

  /*
    * Talk Open Md to Obj
    */
  /*
   _talkopenMdToObj(matchArray) {
      let result = {
         type: "talk-open",
         character: matchArray[1].trim()
      };
      if (matchArray[2] != null) {
         result.image = {
            alternative:  matchArray[2].trim(),
            path: matchArray[3].trim()
         };
         if (matchArray[4] != null)
            result.image.title = matchArray[4].trim();
      }
      return result;
   }
   */

  /*
    * Talk Open Obj to HTML
    */
  /*
   _talkopenObjToHTML(obj) {
      return Translator.htmlTemplates["talk-open"]
         .replace("[seq]", obj.seq)
         .replace("[author]", this.authorAttr)
         .replace("[character]", obj.character)
         .replace("[image]",
            (obj.image) ? " image='" + obj.image.path + "' alt='" : "")
         .replace("[alt]",
            (obj.image && obj.image.title)
               ? " alt='" + obj.title + "'" : "");
   }
   */

  /*
    * Talk Close Md to Obj
    */
  /*
   _talkcloseMdToObj(matchArray) {
      return {
         type: "talk-close"
      };
   }
   */

  /*
    * Talk Close Obj to HTML
    */
  /*
   _talkcloseObjToHTML(obj) {
      return Translator.htmlTemplates["talk-close"];
   }
   */

  /*
    * Input Md to Obj
    */
  _inputMdToObj (matchArray) {
    return {
      type: 'input',
      variable: matchArray[1].trim().replace(/ /igm, '_')
    }
  }

  /*
    * Input Obj to HTML
    */
  _inputObjToHTML (obj) {
    // core attributes are not straight mapped
    const coreAttributes = ['seq', 'author', 'type', 'subtype', 'text',
      'show', 'options', 'target', 'contextTarget',
      '_source', '_modified', 'mergeLine']
    const subtypeMap = {
      short: 'input-typed',
      text: 'input-typed',
      'group select': 'group-select',
      slider: 'slider',
      table: 'input-table',
      choice: 'input-choice'
    }
    const subtype = (obj.subtype)
      ? subtypeMap[obj.subtype] : subtypeMap.short

    let statement =
      (obj.text) ?
         this._markdownTranslator.makeHtml(obj.text)
           .replace(/<\/p>/igm, '<br>')
           .replace(/<p>/igm, '')
           : ''

    if (subtype == 'input-choice' && obj.options) {
      statement += '<br>'
      for (const op in obj.options) {
        let choice = Translator.htmlTemplates.choice
          .replace('[option]', op)
          .replace('[seq]', obj.seq)
        if (typeof obj.options[op] === 'string') {
          choice = choice.replace('[topic]', '')
                         .replace('[value]', 'value="' + obj.options[op] + '"')
                         .replace('[compute]', '')
        } else if (typeof obj.options[op] === 'boolean') {
          choice = choice.replace('[topic]', '')
                         .replace('[value]', 'value="' + op + '"')
                         .replace('[compute]', '')
        } else {
          choice = choice.replace('[topic]',
            ((obj.options[op].contextTarget == null) ? '' :
              "topic='" + this._transformNavigationMessage(obj.options[op].contextTarget) + "' "))
            .replace('[value]',
              ((obj.options[op].message) ? 'value="' + obj.options[op].message + '"' : ''))
            .replace('[compute]',
              (obj.options[op].compute == null) ? '' : ' compute="' + obj.options[op].compute + '"')
        }
        statement += choice
      }
    }

    // <TODO> provisory - weak strategy (only one per case)
    let answer = ''
    if (this._playerInputShow || this.authoringRender) {
      if (this._playerInputShow == '#answer' || this.authoringRender)
        { answer = " answer='" + obj.value + "'" }
      else
        { answer = " player='" + this._playerInputShow + "'" }
    }

    let extraAttr = ''
    for (const atr in obj) {
      if (!coreAttributes.includes(atr) && obj[atr] != 'false' && obj[atr]) {
        extraAttr += ' ' + atr +
                         ((obj[atr] == 'true') ? '' : "='" + obj[atr] + "'")
      }
    }
    if (obj.subtype == 'text') { extraAttr += ' rows="5"' }
    if (obj.contextTarget)
      extraAttr +=
        " topic='" + this._transformNavigationMessage(obj.contextTarget) + "'"

    const input = Translator.htmlTemplates.input
      .replace(/\[dcc\]/igm, subtype)
      .replace('[seq]', obj.seq)
      .replace('[author]', this.authorAttr)
      .replace('[variable]', obj.variable)
      .replace('[statement]', statement)
      .replace('[extra]', extraAttr)
      .replace(
        '[show]', (this._conditionNext == obj.seq) ? ' display="none"' : '')

    if (this._conditionNext == obj.seq)
      this._conditionNext = -1

    if (obj.subtype == 'group select') {
      // <TODO> weak strategy -- improve
      // indicates how related selects will behave
      this._playerInputShow = null
      if (obj.show) {
        if (obj.show == 'answer')
          this._playerInputShow = '#answer'
        else
          this._playerInputShow = obj.variable
      }
    }

    return input
  }

  /*
    * Input Obj to Md
    */
  _inputObjToMd (obj) {
    // core attributes are not straight mapped
    let coreAttributes = ['seq', 'author', 'variable', 'type', 'subtype',
      'text', 'options',
      '_source', '_modified', 'mergeLine']

    let md = ''
    let stm = ''
    if (obj.text) {
      const lines = obj.text.split('\n')
      stm = '> ' + lines.join('\n> ') + '\n'
    }

    let hasTarget = (obj.target) ? true : false
    if (!hasTarget && obj.subtype == 'choice')
      for (const op in obj.options)
        if (obj.options[op].target) {
          hasTarget = true
          break
        }

    /*
    if (obj.subtype == 'choice' && obj.exclusive == true &&
        obj.shuffle == true) {
    */

    if (obj.subtype == 'choice' && hasTarget) {
      // check extra options to explicit input
      coreAttributes = coreAttributes.concat(['exclusive', 'shuffle'])
      let extraAttr = ''
      for (const atr in obj) {
        if (!coreAttributes.includes(atr))
          extraAttr += this._mdSubField(atr, obj[atr])
        }
      const variable = obj.variable.substring(obj.variable.lastIndexOf('.') + 1)
      if (extraAttr.length > 0 || !variable.match(/input[\d]+/))
        md = Translator.markdownTemplates.input
          .replace('{statement}', stm)
          .replace('{variable}', variable)
          .replace('{subtype}',
            (obj.subtype) ? this._mdSubField('type', obj.subtype) : '')
          .replace('{extra}', extraAttr) + '\n'
      else
        md = stm
      let first = true
      for (const op in obj.options) {
        if (!first) { md += '\n' }
        first = false
        const option = obj.options[op]
        let state = ''
        if (option.state && option.operation)
          state = ' ' + ((option.operation == ">") ? '>' : '') + '((' + option.state + '))' + ((option.operation == "?") ? '?' : '')
        md += Translator.markdownTemplates.choice
          .replace('{bullet}', (obj.shuffle) ? '+' : '*')
          .replace('{label}', op)
          .replace('{target}',
            (option.target && option.target != '(default)')
              ? option.target : '')
          .replace('{message}',
            (option.message ? '"' + option.message + '"' : ''))
          .replace("{state}", state)
      }
    } else {
      let extraAttr = ''
      for (const atr in obj) {
        if (!coreAttributes.includes(atr)) { extraAttr += this._mdSubField(atr, obj[atr]) } else if (atr == 'options') {
          extraAttr += '\n  * options:'
          for (const p in obj[atr]) { extraAttr += "\n    * '" + p + "': " + obj[atr][p] }
        }
      }

      // <TODO> provisory - removing the context of variable to save
      md = Translator.markdownTemplates.input
        .replace('{statement}', stm)
        .replace('{variable}', obj.variable.substring(obj.variable.lastIndexOf('.') + 1))
        .replace('{subtype}',
          (obj.subtype) ? this._mdSubField('type', obj.subtype) : '')
        .replace('{extra}', extraAttr)
    }

    return md
  }

  _mdSubField (label, value) {
    return (value == null || value.length == 0) ? ''
      : '\n  * ' + label + ': ' + value
  }

  /*
    * Output Md to Obj
    */
  _outputMdToObj (matchArray) {
    const output = {
      type: 'output',
      variable: matchArray[1].trim().replace(/ /igm, '_')
    }
    if (matchArray[2] != null) { output.index = parseInt(matchArray[2].trim()) }
    if (matchArray[3] != null) { output.variant = matchArray[3].trim() }
    return output
  }

  /*
    * Output Obj to HTML
    */
  _outputObjToHTML (obj) {
    return Translator.htmlTemplates.output
      .replace('[seq]', obj.seq)
      .replace('[author]', this.authorAttr)
      .replace('[variable]', obj.variable)
      .replace('[index]', (obj.index != null) ? '[' + obj.index + ']' : '')
      .replace('[variant]', (obj.variant != null) ? ' ' + obj.variant : '')
  }

  /*
   * Condition Md to Obj
   */
  _conditionMdToObj (matchArray) {
    const condition = {
      type: 'condition',
      expression: matchArray[1].trim()
    }

    return condition
  }

  /*
   * Condition Open Obj to HTML
   */
  _conditionOpenObjToHTML (obj) {
    return (this.authoringRender) ? '' :
      Translator.htmlTemplates.conditionOpen
        .replace(/\[seq\]/gm, obj.seq)
        .replace('[condition]', obj.expression)
        .replace('[dependency]',
          (this._lastCompute != null)
            ? (' dependency="' + this._lastCompute + '"') : '')
  }

  /*
   * Condition Close Obj to HTML
   */
  _conditionCloseObjToHTML (obj) {
    return (this.authoringRender) ? '' : Translator.htmlTemplates.conditionClose
  }

  /*
   * Compute Md to Obj
   */
  _computeMdToObj (matchArray) {
    const compute = {
      type: 'compute',
      subordinate: /^\t|^ [\t ]/.test(matchArray[0]),
      expression: matchArray[1].trim()
    }

    if (matchArray[2] != null) compute.conditional = true

    return compute

    /*
    let sentence = {}

    if (!withoutType)
      sentence.type = 'compute'

    sentence.operator = matchArray[2]
    sentence.value = matchArray[3].trim()

    if (matchArray[1] != null) { sentence.variable = matchArray[1].trim() }

    return sentence
    */
  }

  /*
    * Compute Obj to HTML
    */
  _computeObjToHTML (obj) {
    let compute
    const dependency = (this._lastCompute != null)
      ? (' dependency="' + this._lastCompute + '"') : ''
    const condition = (obj.condition != null)
      ? (' condition="' + obj.condition + '"') : ''
    if (obj.conditional) {
      const timer = obj.expression.match(/timer[ \t]*=[ \t]*(\d+)/im)
      if (timer != null && timer[1]) {
        compute = Translator.htmlTemplates.timer
          .replace('[cycles]', timer[1])
          .replace(/\[to\]/igm, (obj.seq+1))
      } else {
        compute = Translator.htmlTemplates.compute
          .replace('[seq]', obj.seq)
          .replace('[expression]', obj.expression)
          .replace('[condition]', condition)
          .replace('[dependency]', dependency)
          .replace('[connect]', ' connect="true:dcc' + (obj.seq+1) +
                   ':style/display/initial"')
        compute += Translator.htmlTemplates.compute
          .replace('[seq]', obj.seq)
          .replace('[expression]', obj.expression)
          .replace('[condition]', condition)
          .replace('[dependency]', dependency)
          .replace('[connect]', ' connect="false:dcc' + (obj.seq+1) +
                   ':style/display/none"')
      }
      this._conditionNext = obj.seq + 1
    } else
      compute = Translator.htmlTemplates.compute
                  .replace('[seq]', obj.seq)
                  .replace('[expression]', obj.expression)
                  .replace('[condition]', condition)
                  .replace('[dependency]', dependency)
                  .replace('[connect]', '')
    this._lastCompute = 'dcc' + obj.seq
    return compute
  }

  /*
    * Select Context Open Md to Obj
    */
  _selctxopenMdToObj (matchArray) {
    const context = {
      type: 'context-open'
    }

    if (matchArray[1] != null) { context.namespace = matchArray[1].trim() }
    if (matchArray[2] != null) { context.context = matchArray[2].trim() }
    if (matchArray[3] != null) { context.id = matchArray[3].trim() }
    if (matchArray[4] != null) { context.property = matchArray[4].trim() }
    if (matchArray[5] != null) { context.value = matchArray[5].trim() }

    // <TODO> weak strategy -- improve
    // this._currentInputContext = context.context;

    return context
  }

  /*
    * Select Context Open Obj to HTML
    */
  _selctxopenObjToHTML (obj) {
    const input = (obj.input != null) ? " input='" + obj.input + "'" : ''

    return Translator.htmlTemplates.selctxopen.replace('[seq]', obj.seq)
      .replace('[author]', this.authorAttr)
      .replace('[context]', obj.context)
      .replace('[input]', input)
  }

  /*
    * Select Context Close Md to Obj
    */
  _selctxcloseMdToObj (matchArray) {
    return {
      type: 'context-close'
    }
  }

  /*
    * Select Context Close Obj to HTML
    */
  _selctxcloseObjToHTML (obj) {
    return Translator.htmlTemplates.selctxclose
  }

  /*
   * Formal Context Open Md to Obj
   */
  _formalOpenMdToObj (matchArray) {
    let formal = {
      type: 'formal-open',
      render: false
    }
    if (matchArray[1] != null) { formal.namespace = matchArray[1].trim() }
    if (matchArray[2] != null) { formal.context = matchArray[2].trim() }
    if (matchArray[3] != null) { formal.id = matchArray[3].trim() }
    return formal
  }

  _formalOpenObjToMd (obj) {
    return Translator.markdownTemplates['formal-open']
      .replace(/{namespace}/, (obj.namespace) ? obj.namespace + ':' : '')
      .replace(/{context}/, (obj.context) ? obj.context : '')
      .replace(/{id}/, (obj.id) ? '@' + obj.id : '')
  }

  /*
   * Formal Context Close Md to Obj
   */
  _formalCloseMdToObj (matchArray) {
    return {
      type: 'formal-close',
      render: false
    }
  }

  _formalCloseObjToMd (obj) {
    return Translator.markdownTemplates['formal-close']
  }

  /*
    * Select Md to Obj
    */
  _selectMdToObj (matchArray) {
    const select = {
      type: 'select',
      expression: matchArray[1].trim()
    }
    if (matchArray[3] != null) { select.value = matchArray[3].trim() }

    // <TODO> weak strategy -- improve
    /*
      if (this._currentInputContext) {
         if (this._lastSelectContext == "answer")
            select.present = "answer";
         else if (this._lastSelectContext == "player")
            select.present = this._lastSelectEvaluation;
      }
      */
    return select
  }

  /*
    * Select Obj to HTML
    */
  _selectObjToHTML (obj, superseq) {
    let answer = ''
    if (this._playerInputShow || this.authoringRender) {
      if (this._playerInputShow == '#answer' || this.authoringRender) { answer = " answer='" + obj.value + "'" } else { answer = " player='" + this._playerInputShow + "'" }
    }

    return Translator.htmlTemplates.select
      .replace('[seq]', this._subSeq(superseq, obj.seq))
      .replace('[author]', this._authorAttrSub(superseq))
      .replace('[expression]', obj.expression)
      .replace('[answer]', answer)
  }

  _componentMdToObj (matchArray) {
    const dcc = matchArray[1].trim()

    const component = {
      type: 'component',
      dcc:  (dcc.includes('dcc-')) ? dcc : 'dcc-' + dcc
    }

    let df = 'content'
    if (Translator.componentMap[dcc]) {
      const map = Translator.componentMap[dcc]
      component.dcc = map.dcc
      if (map.default) df = map.default
    }

    if (matchArray[2]) component.id = matchArray[2]

    /* extracts attributes */
    if (matchArray[3]) {
      let content = matchArray[3]
      const vertical = /^\r?\n/.test(content)
      const regex = (vertical)
        ? /^[ \t]*[\+\*][ \t]+([\w-]+)[ \t]*(?::[ \t]*([^\n\r\f]+))?$/im
        : /(?:^|;)[ \t]*([\w-]+)[ \t]*(?::[ \t]*(?:"([^"]*)"|([^"][^;]*)))?/i
      if (regex.test(content)) {
        component.attributes = {}
        let field = null
        do {
          field = content.match(regex)
          if (field != null) {
            component.attributes[field[1]] =
              (field[3]) ? field[3] : ((field[2]) ? field[2] : true)
            content = content.substring(0, field.index) +
                      content.substring(field.index + field[0].length)
          }
        } while (field != null)
      }

      /* the remaining is content */
      content = content.trim()
      if (content.length > 0) {
        if (!vertical && content.startsWith('"'))
          content = content.substring(1, content.length-1)
        if (df == 'content')
          component.content = content.trim()
        else {
          if (!component.attributes) component.attributes = {}
          component.attributes[df] = content.trim()
            .replace(/^\r?\n/, '')
            .replace(/\r?\n$/, '')
            .replace(/\r?\n[ \t]*/g, ';')
        }
      }
    }

    return component
  }

  _componentObjToHTML (obj) {
    let at = ''
    if (obj.attributes) {
      for (const a in obj.attributes)
        at += ' ' + a +
          ((obj.attributes[a] === true) ? '' : '="' + obj.attributes[a] + '"')
    }
    return Translator.htmlTemplates.component
      .replace(/\[dcc\]/g, obj.dcc)
      .replace('[id]', (obj.id) ? obj.id : 'dcc'+obj.seq)
      .replace('[content]', (obj.content) ? obj.content : '')
      .replace('[attr]', at)
  }

  _connectionMdToObj (matchArray) {
    const connection = {
      type: 'connection',
      trigger: matchArray[2].trim(),
      to: matchArray[4].trim()
    }
    if (matchArray[1]) connection.from = matchArray[1].trim()
    if (matchArray[3]) connection.map = matchArray[3].trim()

    return connection
  }

  _connectionObjToHTML (obj) {
    return (obj.from)
      ? Translator.htmlTemplates.connection
          .replace('[from]', obj.from)
          .replace('[trigger]', obj.trigger)
          .replace('[to]', obj.to)
          .replace('[map]', (obj.map) ? ' topic="' + obj.map + '"' : '')
      : Translator.htmlTemplates.subscribe
          .replace('[trigger]', obj.trigger)
          .replace('[to]', obj.to)
          .replace('[map]', (obj.map) ? ' map="' + obj.map + '"' : '')
  }
}

(function () {
  Translator.marksLayerTitle = /^[ \t]*\_{3,}((?:.(?!\_{3,}))*.)\_{3,}[ \t]*$/igm
  Translator.marksKnotTitle = /((?:^[ \t]*(?:#+)[ \t]*(?:[^\( \t\n\r\f][^\(\n\r\f]*)(?:\((?:\w[\w \t,]*)\))?(?:\:[ \t]*[^\(\n\r\f][^\(\n\r\f\t]*)?[ \t]*#*[ \t]*$)|(?:^[ \t]*(?:[^\( \t\n\r\f][^\(\n\r\f]*)(?:\((?:\w[\w \t,]*)\))?(?:\:[ \t]*[^\(\n\r\f][^\(\n\r\f\t]*)?[ \t]*[\f\n\r][\n\r]?(?:==+|--+)$))/igm

  Translator.fragment = {
    expression: '([\\w+\\-*/=:<>\\.\\(\\) \\t]+)(\\?)?',
    option: '^[ \\t]*([\\+\\*])[ \\t]+((?:[^<\\n\\r\\f]|<(?!-))*)?((?:(?:(?:&lt;)|<)?-(?:(?:&gt;)|>))|(?:\\(-\\)))[ \\t]*([^">~\\n\\r\\f(]+)(?:"([^"\\n\\r\\f]*)")?[ \\t]*(?:(\\>)?\\(\\(([^)]*)\\)\\))?(\\?)?[ \\t]*'
  }

  Translator.fragment.compute = '~[ \\t]*' + Translator.fragment.expression

  Translator.element = {
    literal: {
      mark: /(~~~|```)[ \t]*([^\n]*)$/im
    },
    knot: {
      mark: /(?:^[ \t]*(#+)[ \t]*([^\( \t\n\r\f\:#][^\(\n\r\f\:#]*)(?:\((\w[\w \t,]*)\))?[ \t]*(?:\:[ \t]*([^\(\n\r\f#][^\(\n\r\f\t#]*))?[ \t]*(#+)?[ \t]*$)|^(?:(==+|--+)[\f\n\r][\n\r]?)?(?:[ \t]*([^\( \t\n\r\f\:][^\(\n\r\f\:]*)(?:\((\w[\w \t,]*)\))?[ \t]*(?:\:[ \t]*([^\(\n\r\f][^\(\n\r\f\t]*))?[ \t]*[\f\n\r][\n\r]?(==+|--+)$)/im,
      subfield: true,
      subimage: true
    },
    blockquote: {
      mark: /^[ \t]*>[ \t]*/im
    },
    image: {
      mark: /([ \t]*)!\[([^\]\n\r\f]*)\]\(<?([\w:.\/\?&#\-~]+)>?[ \t]*(?:=(\d*(?:\.\d+[^x \t"\)])?)(?:x(\d*(?:\.\d+[^ \t"\)])?))?)?[ \t]*(?:"([\w ]*)")?\)/im,
      inline: true
    },
    media: {
      mark: /<(video|audio)(?:[^>]*)?>(?:<source src="([^"]+)">)?<\/(?:video|audio)>/im
    },
    field: {
      mark: /^([ \t]*)(?:[\+\*])[ \t]+((?:[\w.\/\?&#\-][\w.\/\?&#\- \t]*)|(?:'[^']*')[ \t]*):[ \t]*([^&>\n\r\f'][^&>\n\r\f]*)?(?:'([^']*)')?(?:-(?:(?:&gt;)|>)[ \t]*([^\(\n\r\f]+))?$/im,
      subfield: true,
      subimage: true,
      subtext: 'value'
    },
    item: {
      mark: /^((?:  |\t)[ \t]*)(?:[\+\*])[ \t]+((?:[\w.\/\?&#\-][\w.\/\?&#\- \t]*)|(?:'[^']*')[ \t]*)$/im,
      subtext: 'value'
    },
    option: {
      mark: new RegExp(Translator.fragment.option +
                       '(?:' + Translator.fragment.compute + ')?[ \\t]*$', 'im')
      // mark: /^[ \t]*([\+\*])[ \t]+([^&<> \t\n\r\f][^&<>\n\r\f]*)?((?:(?:(?:&lt;)|<)?-(?:(?:&gt;)|>))|(?:\(-\)))[ \t]*([^">\n\r\f(]+)(?:"([^"\n\r\f]*)")?[ \t]*(?:(\>)?\(\(([^)]*)\)\))?(\?)?[ \t]*$/im
    },
    'divert-script': {
      mark: /^[ \t]*(?:\(([\w\.]+)[ \t]*(==|>|<|>=|<=|&gt;|&lt;|&gt;=|&lt;=)[ \t]*((?:"[^"\n\r\f]+")|(?:\-?\d+(?:\.\d+)?)|(?:[\w\.]+))\)[ \t]*)?-(?:(?:&gt;)|>)[ \t]*([^"\n\r\f]+)(?:"([^"\n\r\f]+)")?[ \t]*$/im
    },
    divert: {
      mark: /(?:([^&<> \t\n\r\f][^&<> \t\n\r\f]*)|"([^"]+)")(?:[ \t])*((?:(?:(?:&lt;)|<)?-(?:(?:&gt;)|>))|(?:\(-\)))[ \t]*(?:(\w[\w.]*)|"([^"]*)")/im,
      inline: true
    },
    entity: {
      mark: /@(?:(\w[\w \t]*)|"([\w \t]*)")(?::[ \t]*)?$/im,
      subfield: true,
      subimage: true,
      subtext: 'text'
    },
    mention: {
      mark: /@(?:(\w+)|"([\w \t]*)")/im,
      inline: true
    },
    input: {
      mark: /^\?[ \t]+([^\t\n\r\f]+)$/im,
      subfield: true,
      subimage: true,
      pretext: 'text'
    },
    output: {
      mark: /\^([\w \t\.]+)(?:\[([\w \t]+)\])?(?:\(([\w \t]+)\))?\^/im,
      inline: true
    },
    condition: {
      mark: new RegExp('\\$[ \\t]*\\(' + Translator.fragment.expression + '\\)[ \\t]*', 'im')
    },
    compute: {
      mark: new RegExp('[ \\t]*' + Translator.fragment.compute + '$', 'im')
    },
    'context-open': {
      mark: /\{\{(?:([^\:\n\r\f]+)\:)?([\w \t\+\-\*\."=%]+)?(?:@(\w+))?(?:\/((?:\w+\:)?\w+)(?:[ \t]+((?:\w+\:)?\w+))?\/)?$/im
    },
    'context-close': { mark: /^[ \t]*\}\}/im },
    'formal-open': {
      mark: /\(\((?:([^\:\n\r\f]+)\:)?([\w \t\+\-\*\."=%]+)?(?:@(\w+))?$/im
    },
    'formal-close': { mark: /^[ \t]*\)\)/im },
    select: {
      mark: /\{([^\}\n\r\f]+)\}(?:\(([^\)\n\r\f]+)\))?(?:\/([^\/\n\r\f]+)\/)/im,
      inline: true
    },
    annotation: {
      mark: /(?<!\{)\{(?!\{)([^\}\n\r\f]+)\}(?:\(([^\)\n\r\f]+)\))?/im,
      inline: true
    },
    linefeed: {
      mark: /[\f\n\r]+/im,
      inline: true
    },
    component: {
      mark: /\[[ \t]*([^|\]]+)(?:(?:\|[ \t]*([^\]]+))?[ \t]*\]\[\[((?:[^\]]*(?:\][^\]]+)*)+)\]\]|\|[ \t]*([^\]]+)[ \t]*\](?:\[\[((?:[^\]]*(?:\][^\]]+)*)+)\]\])?)/im
    },
    connection: {
      mark: /(?:\[([^\]]+)\])?[ \t]*=([^|=]+)(?:\|([^=]+))?=>[ \t]*\[([^\]]+)\]/im
    }
  }

  Translator.literalClose = /(~~~|```)/im

  Translator.marksAnnotation = {
    'context-open': Translator.element['context-open'].mark,
    'context-close': Translator.element['context-close'].mark,
    'formal-open': Translator.element['formal-open'].mark,
    'formal-close': Translator.element['formal-close'].mark,
    select: Translator.element.select.mark,
    annotation: Translator.element.annotation.mark
  }

  Translator.marksAnnotationInside =
    /(?:([^\:\n\r\f]+)\:)?([^=\n\r\f]+)(?:=([\w \t%]*)(?:\/([\w \t%]*))?)?/im

  // Categories that do not have a correspondent theme
  Translator.markerCategories = ['start', 'end', 'division', 'master',
                                 'master_top', 'master_bottom', 'branch']

  // <TODO> this is a different approach indicating characteristic by type
  // (homogenize?)
  Translator.subordinatorElement = ['entity']
  Translator.isLine = ['knot', 'field', 'item', 'option', 'divert-script', 'entity', 'input',
    'compute', 'context-open']
  Translator.textBlockCandidate = ['select', 'annotation', 'text', 'mention',
    'image', 'media', 'output', 'divert']
  Translator.scriptable = ['compute', 'divert-script']

  Translator.fieldSet = ['vocabularies', 'answers', 'states', 'labels']

  Translator.inputSubtype = ['short', 'text', 'group select', 'table']

  Translator.globalFields = ['theme', 'title', 'role', 'templates', 'generators', 'artifacts']

  Translator.reservedNavigation = ['case.next', 'knot.start',
    'knot.previous', 'knot.next',
    'flow.next', 'session.close']
  Translator.navigationMap = {
    'case.next': 'case/navigate/>',
    'knot.start': 'knot/navigate/<<',
    'knot.previous': 'knot/navigate/<',
    'knot.next': 'knot/navigate/>',
    'flow.next': 'flow/navigate/>',
    'session.close': 'session/close'
  }

  Translator.componentMap = {
    '~': {
      dcc: 'dcc-compute',
      default: 'expression'
    },
    '*': {
      dcc: 'dcc-button',
      default: 'label'
    },
    '^': {
      dcc: 'dcc-expression',
      default: 'expression'
    },
    '?': {
      dcc: 'dcc-input-typed',
      default: 'variable'
    }
  }

  // Translator.specialCategories = ["start", "note"];

  Translator.contextHTML = {
    open: /<p>(<dcc-group-select(?:[^>]*)?>)<\/p>/igm,
    close: /<p>(<\/dcc-group-select>)<\/p>/igm
  }

  Translator.defaultVariable = 'points'

  Translator.genericFieldType = 'generic'

  Translator.extension = {
    image: ['png', 'jpg', 'jpeg', 'png'],
    video: ['mpg', 'mpeg', 'mp4', 'webm'],
    audio: ['mp3']
  }

  Translator.instance = new Translator()
})()
