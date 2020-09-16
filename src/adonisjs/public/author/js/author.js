/*
 * Main Author Environment
 *
 * Main authoring environment, which presents the visual interface and
 * coordinates the authoring activities.
 */

class AuthorManager {
  constructor () {
    MessageBus.ext.externalized = false
    MessageBus.page = new MessageBus(false)

    Basic.service.host = this

    Translator.instance.authoringRender = true

    this._compiledCase = null
    this._knots = null

    this._navigator = new Navigator(Translator.instance)

    this._themeSVG = true
    this._knotSelected = null
    this._htmlKnot = null
    this._editor = null

    // (1) render slide; (2) edit knot; (3) edit case
    this._renderState = 1
    this._editingKnot = false // <TODO> unify with renderState

    this._floatingMenu = null
    this._templateNewKnot = null

    this.controlEvent = this.controlEvent.bind(this)
    MessageBus.ext.subscribe('control/#', this.controlEvent)

    this.updateSourceField = this.updateSourceField.bind(this)

    this._caseModified = false

    window.onbeforeunload = function () {
      return (this._caseModified)
        ? 'If you leave this page you will lose your unsaved changes.' : null
    }
  }

  /* <TODO>
      A commom code for shared functionalities between player and author
      ******/

  /*
   get currentThemeFamily() {
      return this._currentThemeFamily;
   }

   set currentThemeFamily(newValue) {
      Translator.instance.currentThemeFamily = newValue;
      this._currentThemeFamily = newValue;

      this._currentThemeCSS =
         Basic.service.replaceStyle(document, this._currentThemeCSS, newValue);
   }

   requestCurrentThemeFamily(topic, message) {
      MessageBus.ext.publish(MessageBus.buildResponseTopic(topic, message),
                             this.currentThemeFamily);
   }

   get currentCaseId() {
      return this._currentCaseId;
   }
   */

  get templatesCategories () {
    return (this._compiledCase.templates)
      ? this._compiledCase.templates.categories : null
  }

  /*
    *
    */

  async start () {
    const params = window.location.search.substr(1)

    let mode = null
    let caseid = null
    if (params != null && params.length > 0) {
      mode = params.match(/mode=([\w-]+)/i)
      mode = (mode == null) ? null : mode[1]
      caseid = params.match(/id=([\w-]+)/i)
      caseid = (caseid == null) ? null : caseid[1]
    }
    if (mode != null && mode.toLowerCase() === 'advanced') { document.querySelector('#advanced-mode').style.display = 'initial' }

    // build singletons
    Panels.start()
    // Properties.start(this);

    Properties.s.attachPanelDetails(
      document.querySelector('#properties-panel'),
      document.querySelector('#properties-buttons'),
      this
    )

    this._mainPanel = document.querySelector('#main-panel')
    this._navigationPanel = document.querySelector('#navigation-panel')
    this._knotPanel = document.querySelector('#knot-panel')
    this._messageSpace = document.querySelector('#message-space')

    // this._userid = await Basic.service.signin();

    /*
      const authorState = Basic.service.authorStateRetrieve();
      this._userid = authorState.userid;

      if (authorState.template) {
         Basic.service.authorPropertyRemove("template");
         this.caseNew(authorState.template.id);
      } else
         this._caseLoad(authorState.caseId);
      */
    if (caseid != null) { this._caseLoad(caseid) }

    /*
      document.querySelector("#btn-save-settings")
         .addEventListener("mousedown", this.updateSourceField);
      */

    /*
      document.querySelector("#settings-modal")
         .addEventListener("shown.bs.modal", this.updateSourceField);
      */
    $('#settings-modal').on('shown.bs.modal', this.updateSourceField)
    // this.caseLoadSelect();
  }

  /*
    * Redirects control/<entity>/<operation> messages
    */
  async controlEvent (topic, message) {
    if (MessageBus.matchFilter(topic, 'control/knot/selected')) {
      this.knotSelected(topic, message)
    } else if (MessageBus.matchFilter(topic, 'control/group/+/selected')) {
      this.groupSelected(topic, message)
    } else if (MessageBus.matchFilter(topic, 'control/element/+/selected')) {
      this.elementSelected(topic, message)
    } else if (MessageBus.matchFilter(topic, 'control/element/+/new')) {
      this.elementNew(topic)
    } else if (MessageBus.matchFilter(topic, 'control/element/+/new/unique')) {
      this.elementNewUnique(topic, message)
    } else if (MessageBus.matchFilter(topic, 'control/element/insert')) {
      this.elementInsert(message)
    } else {
      switch (topic) {
        case 'control/case/new': this.caseNew()
          break
        case 'control/case/load': this.caseLoadSelect()
          break
        case 'control/case/save': this.caseSave()
          break
        case 'control/case/markdown': this.caseMarkdown()
          break
        case 'control/case/play': this.casePlay()
          break
        case 'control/case/settings': await this.caseRename()
          break
        case 'control/knot/new': this.knotNew(message)
          break
        case 'control/knot/remove': this.knotRemove(message)
          break
        case 'control/knot/up': this.knotUp(message)
          break
        case 'control/knot/down': this.knotDown(message)
          break
        case 'control/knot/edit': this.knotEdit()
          break
        case 'control/knot/markdown': this.knotMarkdown()
          break
        case 'control/knot/rename': this.knotRename(message)
          break
        case 'control/element/selected/down':
          this.elementSelectedMove('next')
          break
        case 'control/element/selected/up':
          this.elementSelectedMove('previous')
          break
        case 'control/element/selected/delete': this.elementSelectedDelete()
          break
        case 'control/config/edit': this.config()
          break
        /*
         case "control/_current_theme_name/get":
            this.requestCurrentThemeFamily(topic, message);
            break;
         case "control/_current_case_id/get":
            this.requestCurrentCaseId(topic, message);
            break;
         */
        case 'control/knot/update': this.knotUpdate(message)
          break
        case 'control/leave/drafts': await this.caseSave()
        // window.location.href = 'draft.html';
          window.location.href = '/drafts'
          break
      }
    }
  }

  /*
    * ACTION: control-load (1)
    */
  async caseLoadSelect () {
    const saved = await this.saveChangedCase()

    const cases = await MessageBus.ext.request('data/case/*/list')
    // {user: this._userid});

    cases.message.sort(
      (a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1)

    const caseId = await DCCNoticeInput.displayNotice(
      'Select a case to load or start a new case.',
      'list', 'Select', 'New', cases.message)

    if (caseId === 'New') { this.caseNew() } else { this._caseLoad(caseId) }

    /*
      const sticky = document.querySelector("#sticky-top");
      if (sticky != null)
         sticky.classList.add("sticky-top");
      */
  }

  async saveChangedCase () {
    let decision = 'No'

    if (this._caseModified) {
      decision = await DCCNoticeInput.displayNotice(
        'There are unsaved modifications in the case. Do you want to save?',
        'message', 'Yes', 'No')
      if (decision == 'Yes') { await this.caseSave() }
    }

    return decision
  }

  /*
    * ACTION: control-new
    */
  async caseNew (template) {
    this._temporaryCase = true

    // await this._themeSelect();
    // let template = await this._templateSelect("case");

    const templateMd =
         await MessageBus.ext.request(
           'data/template/' + template.replace(/\//g, '.') + '/get')

    const caseId = await MessageBus.ext.request('data/case//new',
      {
        format: 'markdown',
        title: 'Untitled',
        source: templateMd.message
      })
    this._caseLoad(caseId.message)
  }

  /*
    * ACTION: control-load (2)
    */
  async _caseLoad (caseId) {
    Basic.service.currentCaseId = caseId
    const caseObj = await MessageBus.ext.request(
      'data/case/' + Basic.service.currentCaseId + '/get')

    this._currentCaseTitle = caseObj.message.title
    await this._compile(caseObj.message.source)
    this._showCase()
  }

  async _compile (caseSource) {
    this._compiledCase =
         await Translator.instance.compileMarkdown(Basic.service.currentCaseId,
           caseSource)

    this._knots = this._compiledCase.knots

    // Basic.service.currentThemeFamily = this._compiledCase.theme
    console.log('=== setting theme family')
    Basic.service.composedThemeFamily(this._compiledCase.theme)
    if (this._compiledCase.title) { this._currentCaseTitle = this._compiledCase.title }

    console.log('***** COMPILED CASE *****')
    console.log(this._compiledCase)
  }

  async _showCase (selectKnot) {
    await this._navigator.mountTreeCase(this, this._compiledCase.knots)

    let sk
    if (selectKnot != null) { sk = selectKnot } else {
      const knotIds = Object.keys(this._knots)
      let k = 0
      while (k < knotIds.length && !this._knots[knotIds[k]].render) { k++ }
      sk = knotIds[k]
    }

    MessageBus.ext.publish('control/knot/selected', sk)
  }

  /*
    * ACTION: control-save
    */
  async caseSave () {
    console.log('=== case save')
    document.getElementById('btn-save-draft').innerHTML = 'SAVING...'
    console.log(Basic.service.currentCaseId)
    console.log(this._compiledCase)
    if (Basic.service.currentCaseId != null && this._compiledCase != null) {
      this._checkKnotModification(this._renderState)

      /*
         if (this._temporaryCase) {
            const caseTitle =
               await DCCNoticeInput.displayNotice("Inform a title for your case:",
                                                  "input");
            this._currentCaseTitle = caseTitle;
            this._temporaryCase = false;
         }
         */

      const md = Translator.instance.assembleMarkdown(this._compiledCase)
      const status = await MessageBus.ext.request(
        'data/case/' + Basic.service.currentCaseId + '/set',
        { // title: this._currentCaseTitle,
          format: 'markdown',
          source: md
        })

      console.log('Case saved! Status: ' + status.message)

      Basic.service.authorPropertyStore('caseId', Basic.service.currentCaseId)

      this._messageSpace.innerHTML = 'Saved'
      setTimeout(this._clearMessage, 2000)
      const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve('done!'), 2000)
      })
      const result = await promise
      this._messageSpace.innerHTML = ''
      document.getElementById('btn-save-draft').innerHTML = 'SAVE'
    }
  }

  async updateSourceField () {
    this._checkKnotModification(this._renderState)
    const source = document.querySelector('#source')
    const md = Translator.instance.assembleMarkdown(this._compiledCase)
    console.log('=== source updated')
    console.log(source)
    console.log(md)
    source.value = md
  }

  /*
    * ACTION: control/case/edit
    */
  async caseMarkdown () {
    const nextState = (this._renderState != 3) ? 3 : 1
    if (this._renderState != 3) {
      this._originalMd = Translator.instance.assembleMarkdown(this._compiledCase)
      this._presentEditor(this._originalMd)
    } else {
      this._checkKnotModification(nextState)
      this._renderState = nextState
      this._renderKnot()
    }
    this._renderState = nextState
  }

  _presentEditor (source) {
    this._knotPanel.innerHTML = "<div class='sty-editor'>" +
                                     "<textarea class='sty-editor' id='editor-space'></textarea>" +
                                  '</div>'
    this._editor = document.querySelector('#editor-space')
    this._editor.value = source
    // this._editor = new Quill("#editor-space", {});
    /*
      this._editor.clipboard.addMatcher(Node.TEXT_NODE, function(node, delta) {
         return new Delta().insert(node.data);
      });
      */
    // this._editor.insertText(0, source);
  }

  /*
    * Check if the knot was modified to update it
    */
  _checkKnotModification (nextState) {
    // (1) render slide; (2) edit knot; (3) edit case
    let modified = false
    if (this._renderState === 2) {
      if (this._editor != null) {
        const editorText = this._retrieveEditorText()
        if (this._knots[this._knotSelected]._source !== editorText) {
          modified = true
          this._knots[this._knotSelected]._source = editorText
          Translator.instance.extractKnotAnnotations(this._knots[this._knotSelected])
          Translator.instance.compileKnotMarkdown(this._knots, this._knotSelected)
        }
      }
    } else if (this._renderState === 3) {
      if (this._editor != null) {
        const editorText = this._retrieveEditorText()
        if (!this._originalMd || this._originalMd !== editorText) {
          modified = true
          if (nextState != 3) { delete this._originalMd }
          this._compile(editorText)
          if (nextState == 3) { this._renderState = 1 }
          this._showCase()
        }
      }
    }

    if (!this._caseModified) { this._caseModified = modified }
    return modified
  }

  _retrieveEditorText () {
    return this._editor.value
    /*
      const editorText = this._editor.getText();
      return editorText.substring(0, editorText.length - 1);
      */
  }

  async _templateSelect (scope, filter) {
    const templatesScope = await MessageBus.ext.request('data/template/*/list',
      { scope: scope })

    let templateList = templatesScope.message
    if (filter != null) {
      templateList = []
      for (const ts of templatesScope.message) {
        if (filter.includes(ts.id)) { templateList.push(ts) }
      }
    }
    for (const tl of templateList) { tl.icon = Basic.service.imageResolver(tl.icon) }
    const template = await DCCNoticeInput.displayNotice(
      'Select a template for your knot.',
      'list', 'Select', 'Cancel', templateList)
    return (template == 'Cancel') ? null : template
  }

  /*
    * ACTION: knot-selected
    */
  async knotSelected (topic, message) {
    // this._removeFloatingMenu();
    // let knotid = MessageBus.extractLevel(topic, 3);
    const knotid =
         (message == null || message === '') ? this._knotSelected : message
    if (knotid != null) {
      /*
         console.log("=== miniatureF");
         console.log("#mini-" + knotid.replace(/\./g, "_"));
         const miniatureF =
            document.querySelector("#mini-" + knotid.replace(/\./g, "_"));
         let miniature = miniatureF.getElementsByTagName("div")[0];
         */

      // context menu
      /*
         if (knotid == this._knotSelected) {
            // looks for a template considering the current categories
            this._templateNewKnot = null;
            if (this._knots[knotid].categories &&
                this._compiledCase.templates &&
                this._compiledCase.templates.categories) {
               const templateCats = Object.keys(
                  this._compiledCase.templates.categories);
               this._templateNewKnot = [];
               for (let cat of this._knots[knotid].categories)
                  if (templateCats.includes(cat) &&
                      !this._templateNewKnot.includes(
                        this._compiledCase.templates.categories[cat]))
                     this._templateNewKnot.push(
                        this._compiledCase.templates.categories[cat]);
               // deduplicate
               // this._templateNewKnot =
               //    this._templateNewKnot.filter(
               //       (item, pos) => c.indexOf(item) === pos);
               if (this._templateNewKnot.length == 0)
                  this._templateNewKnot = null;
            }
            const extra =
               ((this._templateNewKnot == null) ? "" :
                  "<dcc-button topic='control/knot/new' label='Add' xstyle='in'>" +
                        "</dcc-button>") +
               "<dcc-button topic='control/knot/remove' label='Remove' xstyle='in'>" +
                     "</dcc-button>";

            // Properties.s.editKnotProperties(this._knots[this._knotSelected],
            //                                 this._knotSelected, miniature, extra);
            if (this._templateNewKnot != null) {
               const miniBox = miniature.getBoundingClientRect();
               this._buildFloatingMenu(miniBox.left, miniBox.top,
                  "<dcc-button topic='control/knot/new' label='Add' xstyle='in'>" +
                  "</dcc-button>");
            }
         } else {
         */
      /*
         if (this._miniPrevious)
            this._miniPrevious.classList.remove("sty-selected-knot");
         miniature.classList.add("sty-selected-knot");
         this._miniPrevious = miniature;
         */

      /*
         if (this._knots[knotid].categories &&
             this._knots[knotid].categories.indexOf("expansion") > -1) {
            this._knotSelected = knotid;
            this.knotNew();
         } else {
         */
      this._checkKnotModification(this._renderState)
      this._knotSelected = knotid
      this._htmlKnot = await Translator.instance.generateHTML(
        this._knots[this._knotSelected])
      this._renderKnot()
      // this._collectEditableDCCs();
      delete this._elementSelected
    }
  }

  // <TODO> no use - remove?
  /*
   _buildFloatingMenu(left, top, html) {
      this._removeFloatingMenu();
      this._floatingMenu = document.createElement("div");
      this._floatingMenu.classList.add("sty-menu-floating");
      this._floatingMenu.innerHTML = html;
      const mainBox = this._mainPanel.getBoundingClientRect();
      this._floatingMenu.style.left = (left - mainBox.left) + "px";
      this._floatingMenu.style.top = (top - mainBox.top) + "px";
      this._mainPanel.appendChild(this._floatingMenu);
   }
   */

  /*
   _removeFloatingMenu() {
      if (this._floatingMenu != null) {
         this._mainPanel.removeChild(this._floatingMenu);
         this._floatingMenu = null;
      }
   }
   */

  /*
    * ACTION: group-selected
    */
  async groupSelected (topic, message) {
    this.knotSelected(topic, message)
    const knotid = MessageBus.extractLevel(topic, 3)
    this._navigator.downTree(knotid)
  }

  /*
   * ACTION: control/knot/new
   */
  async knotNew (message) {
    let template = (message != null) ? message.template : null

    if (template == null) { template = await this._templateSelect('knot', this._templateNewKnot) }

    if (template != null) {
      const knotTarget =
            (message != null && message.knotid != null)
              ? message.knotid : this._knotSelected

      let markdown = await MessageBus.ext.request('data/template/' +
                              template.replace(/\//g, '.') + '/get')

      let last = 1
      for (const k in this._knots) {
        const kNumber = k.search(/Knot_[\d]+$/)
        if (kNumber >= 0) {
          const n = parseInt(k.substring(kNumber + 5))
          last = (n > last) ? n : last
        }
      }
      last++

      const knotId = 'Knot_' + last
      const knotMd = 'Knot_' + last

      markdown = markdown.message.replace('_Knot_Name_', knotMd) + '\n'

      const newKnotSet = {}
      for (const k in this._knots) {
        newKnotSet[k] = this._knots[k]
        if (k == knotTarget) {
          newKnotSet[knotId] = {
            toCompile: true,
            _source: markdown
          }
        }
      }

      // <TODO> duplicated reference - improve it
      this._compiledCase.knots = newKnotSet
      this._knots = newKnotSet

      const md = Translator.instance.assembleMarkdown(this._compiledCase)
      await this._compile(md)

      let newSelected = null
      const kl = Object.keys(this._knots)
      const ki = kl.indexOf(knotTarget)
      if (ki > -1 && ki + 1 < kl.length) { newSelected = kl[ki + 1] }

      await this._showCase(newSelected)
    }
  }

  async knotRemove (message) {
    const knotTarget =
            (message != null && message.knotid != null)
              ? message.knotid : this._knotSelected
    const newKnotSet = {}
    for (const k in this._knots) {
      if (k != knotTarget) { newKnotSet[k] = this._knots[k] }
    }
    this._compiledCase.knots = newKnotSet
    this._knots = newKnotSet
    await this._navigator.mountTreeCase(this, this._knots)
  }

  async knotUp (message) {
    const knotTarget =
            (message != null && message.knotid != null)
              ? message.knotid : this._knotSelected
    const newKnotSet = {}
    let previousId = null
    let previousKnot = null
    let swapped = false
    for (const k in this._knots) {
      if (k == knotTarget) {
        newKnotSet[k] = this._knots[k]
        swapped = true
      } else {
        if (previousId != null) { newKnotSet[previousId] = previousKnot }
        previousId = k
        previousKnot = this._knots[k]
      }
    }
    if (swapped) {
      newKnotSet[previousId] = previousKnot
      this._compiledCase.knots = newKnotSet
      this._knots = newKnotSet
      await this._navigator.mountTreeCase(this, this._knots)
    }
  }

  async knotDown (message) {
    const knotTarget =
            (message != null && message.knotid != null)
              ? message.knotid : this._knotSelected
    const newKnotSet = {}
    let previousId = null
    let previousKnot = null
    let toSwap = false
    let swapped = false
    for (const k in this._knots) {
      if (toSwap) {
        toSwap = false
        newKnotSet[k] = this._knots[k]
        swapped = true
      } else {
        if (previousId != null) { newKnotSet[previousId] = previousKnot }
        previousId = k
        previousKnot = this._knots[k]
      }
      if (k == knotTarget) { toSwap = true }
    }
    if (swapped) {
      newKnotSet[previousId] = previousKnot
      this._compiledCase.knots = newKnotSet
      this._knots = newKnotSet
      await this._navigator.mountTreeCase(this, this._knots)
    }
  }

  _renderKnot () {
    if (this._renderState == 1) {
      this._knotPanel.innerHTML = this._htmlKnot
    } else {
      this._presentEditor(this._knots[this._knotSelected]._source)
    }
  }

  _collectEditableDCCs () {
    const elements = this._knotPanel.querySelectorAll('*')
    this._editableDCCs = {}
    for (let e = 0; e < elements.length; e++) {
      if (elements[e].tagName.toLowerCase().startsWith('dcc-')) // {
      { this._editableDCCs[elements[e].id] = elements[e] }
    }
  }

  elementSelected (topic, message) {
    const dccId = MessageBus.extractLevel(topic, 3)

    this._collectEditableDCCs()

    const elSeq = parseInt(dccId.substring(3))
    let el = -1
    for (el = 0; el < this._knots[this._knotSelected].content.length &&
                   this._knots[this._knotSelected].content[el].seq != elSeq; el++)
    /* nothing */;

    if (el != -1) {
      /*
         const presentationId = (message == null) ? null : message.presentationId;
         let dcc = (presentationId != null)
            ? this._editableDCCs[presentationId]
            : this._editableDCCs[dccId];
         */
      let dcc = this._editableDCCs[dccId]
      const element = this._knots[this._knotSelected].content[el]
      /*
         console.log("=== element properties");
         console.log(element);
         console.log("presentation-dcc-" + message);
         console.log(Object.keys(this._editableDCCs));
         */
      // check if there is an option (trigger) element inside an input dcc
      /*
         let roleEdit = message;
         if (element.type == "input" && element.subtype == "choice" &&
             element.exclusive && message != "text" &&
             this._editableDCCs["presentation-dcc-" + message]) {
            dcc = this._editableDCCs["presentation-dcc-" + message];
            roleEdit = null;
            console.log("=== new dcc");
            console.log(dcc);
         }
         this._elementSelected = el;
         */

      if (this._previousEditedDCC) { this._previousEditedDCC.reactivateAuthor() }

      const role = (message != null) ? message.role : null

      // dcc.edit((presentationId != null) ? null : role);
      dcc.edit(role)

      this._previousEditedDCC = dcc

      // check for a dcc inside a dcc
      const presentationId = (message == null) ? null : message.presentationId
      dcc = (presentationId != null)
        ? this._editableDCCs[presentationId] : dcc

      Properties.s.editElementProperties(
        this._knots, this._knotSelected, el, dcc, role)
    }
  }

  // creates an element if there is no element of the same type
  elementNewUnique (topic, message) {
    const elementType = MessageBus.extractLevel(topic, 3)
    let exists = false
    for (const el of this._knots[this._knotSelected].content) {
      if (el.type == elementType &&
             (message == null || message.subtype == null ||
              el.subtype == message.subtype)) { exists = true }
    }
    if (!exists) { this.elementNew(topic, message) }
  }

  elementNew (topic, message) {
    const elementType = MessageBus.extractLevel(topic, 3)
    const newElement = (message == null)
      ? Translator.objTemplates[elementType] : message
    newElement.seq = this._knots[this._knotSelected].content[
      this._knots[this._knotSelected].content.length - 1].seq + 1
    this._knots[this._knotSelected].content.push(newElement)
    Translator.instance.updateElementMarkdown(newElement)
    MessageBus.ext.publish('control/knot/update')
  }

  elementInsert (message) {
    const newElement = message
    newElement.seq = this._knots[this._knotSelected].content[
      this._knots[this._knotSelected].content.length - 1].seq + 1
    this._knots[this._knotSelected].content.push(newElement)
    Translator.instance.updateElementMarkdown(newElement)
    MessageBus.ext.publish('control/knot/update')
  }

  elementSelectedMove (position) {
    if (this._elementSelected && this._elementSelected > 0) {
      const contentSel = this._knots[this._knotSelected].content
      const elSel = this._elementSelected

      // finding the next nonblank node
      let pos
      if (position = 'previous') { pos = (contentSel[elSel - 1].type == 'linefeed') ? elSel - 2 : elSel - 1 } else { pos = (contentSel[elSel + 1].type == 'linefeed') ? elSel + 2 : elSel + 1 }

      // exchanging sequence ids
      const elSeq = contentSel[elSel].seq
      contentSel[elSel].seq = contentSel[pos].seq
      contentSel[pos].seq = elSeq

      // swapping nodes
      const element = contentSel[elSel]
      contentSel[elSel] = contentSel[pos]
      contentSel[pos] = element

      this.knotUpdate()
    }
  }

  elementSelectedDelete () {
    if (this._elementSelected && this._elementSelected > 0) {
      this._knots[this._knotSelected].content
        .splice(this._elementSelected, 1)
      this.knotUpdate()
    }
  }

  async knotUpdate () {
    if (this._knotSelected != null) {
      this._htmlKnot = await Translator.instance.generateHTML(
        this._knots[this._knotSelected])
      this._renderKnot()
      // this._collectEditableDCCs();
    }
  }

  knotRename (newTitle) {
    const last = this._knotSelected.lastIndexOf('.')
    const newIndex = this._knotSelected.substring(0, last + 1) +
                       newTitle.replace(/ /g, '_')

    const newKnotSet = {}
    for (const k in this._knots) {
      if (k == this._knotSelected) { newKnotSet[newIndex] = this._knots[k] } else { newKnotSet[k] = this._knots[k] }
    }

    // <TODO> duplicated reference - improve it
    this._compiledCase.knots = newKnotSet
    this._knots = newKnotSet

    const md = Translator.instance.assembleMarkdown(this._compiledCase)
    this._compile(md)
    this._showCase()

    /*
      let mini =document.querySelector("#t_" + previousTitle.replace(/ /g, "_"));
      mini.setAttribute("id", "#t_" + newTitle.replace(/ /g, "_"));
      mini.removeChild(mini.firstChild);
      // let element = document.createElementNS("http://www.w3.org/2000/svg", "text");
      mini.appendChild(document.createTextNode(newTitle));
      */

    this._knotSelected = newIndex
  }

  /*
    * ACTION: control-edit
    */
  async knotMarkdown () {
    if (this._knotSelected != null) {
      const nextState = (this._renderState != 2) ? 2 : 1
      if (this._checkKnotModification(nextState)) {
        this._htmlKnot = await Translator.instance.generateHTML(
          this._knots[this._knotSelected])
      }
      this._renderState = nextState
      this._renderKnot()
    }
  }

  /*
    * ACTION: control-play
    */
  async casePlay () {
    Translator.instance.newThemeSet()

    const htmlSet = Object.assign(
      {
        entry: { render: true },
        signin: { render: true },
        register: { render: true },
        report: { render: true }
      },
      this._knots)
    const total = Object.keys(htmlSet).length
    let processing = 0
    for (const kn in htmlSet) {
      processing++
      this._messageSpace.innerHTML = 'Processed: ' + processing + '/' + total
      if (htmlSet[kn].render) {
        let finalHTML = ''
        if (processing > 4) {
          finalHTML = await Translator.instance.generateHTMLBuffer(
            this._knots[kn])
        }
        // finalHTML = await this._generateHTMLBuffer(kn);
        else { finalHTML = await Translator.instance.loadTheme(kn) }
        // finalHTML = await this._loadTheme(this._currentThemeFamily, kn);
        finalHTML = (htmlSet[kn].categories && htmlSet[kn].categories.indexOf('note') >= 0)
          ? AuthorManager.jsonNote.replace('{knot}', finalHTML)
          : AuthorManager.jsonKnot.replace('{knot}', finalHTML)

        await MessageBus.ext.request('knot/' + kn + '/set',
          {
            caseId: Basic.service.currentCaseId,
            format: 'html',
            source: finalHTML
          },
          'knot/' + kn + '/set/status')
      }
    }
    this._messageSpace.innerHTML = 'Finalizing...'

    const caseJSON = Translator.instance.generateCompiledJSON(this._compiledCase)
    await MessageBus.ext.request('case/' + Basic.service.currentCaseId + '/set',
      { format: 'json', source: caseJSON },
      'case/' + Basic.service.currentCaseId + '/set/status')

    this._messageSpace.innerHTML = ''

    Translator.instance.deleteThemeSet()
    window.open(dirPlay.message + '/html/index.html', '_blank')
  }

  async caseRename () {
    const caseTitle =
         await DCCNoticeInput.displayNotice('Inform a new title for your case:',
           'input')
    if (caseTitle.length > 0) { this._currentCaseTitle = caseTitle }
  }

  /*
    * ACTION: config
    */
  async config () {
    this._themeSelect()
  }

  async _themeSelect () {
    const families = await MessageBus.ext.request('data/theme_family/*/list')
    Basic.service.currentThemeFamily = await DCCNoticeInput.displayNotice(
      'Select a theme to be applied.',
      'list', 'Select', 'Cancel', families.message)
    const themeObj = families.message.find(function (s) { return s.id == this },
      Basic.service.currentThemeFamily)
    this._themeSVG = themeObj.svg
    // this._themeSVG = families.message[Translator.instance.currentThemeFamily].svg;
  }
}

(function () {
  AuthorManager.jsonKnot = '(function() { PlayerManager.player.presentKnot(`{knot}`) })();'
  AuthorManager.jsonNote = '(function() { PlayerManager.player.presentNote(`{knot}`) })();'

  AuthorManager.author = new AuthorManager()
})()
