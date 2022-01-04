/**
 * Input Choice and Option DCCs
 ******************************/

/**
 * Input Option DCC
 ******************/

class DCCInputOption extends DCCInput {
  constructor () {
    super()
    this._variable = ''
    this.inputChanged = this.inputChanged.bind(this)
  }

  connectedCallback () {
    this._parent = (this.hasAttribute('parent'))
      ? document.querySelector('#' + this.parent)
      : (this.parentNode != null && this.parentNode.elementTag != null &&
            this.parentNode.elementTag() == DCCInputChoice.elementTag)
        ? this.parentNode : null

    super.connectedCallback()
    this.innerHTML = ''

    if (!this.hasAttribute('value')) { this.value = this._statement.trim() }

    // <TODO> align with dcc-state-select
    if (this._parent == null) {
      this._publish('input/ready/' + this._variable.replace(/\./g, '/'),
        {
          sourceType: DCCInputOption.elementTag,
          content: this.value
        })
    }
  }

  disconnectedCallback () {
    if (parent == null) { this._presentation.removeEventListener('change', this.inputChanged) }
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCInput.observedAttributes.concat(
      ['parent', 'exclusive', 'checked', 'topic', 'value', 'compute'])
  }

  get parent () {
    return this.getAttribute('parent')
  }

  set parent (newValue) {
    this.setAttribute('parent', newValue)
  }

  get exclusive () {
    return this.hasAttribute('exclusive')
  }

  set exclusive (isExclusive) {
    if (isExclusive) { this.setAttribute('exclusive', '') } else { this.removeAttribute('exclusive') }
  }

  get checked () {
    return this.hasAttribute('checked')
  }

  set checked (isExclusive) {
    if (isExclusive) { this.setAttribute('checked', '') } else { this.removeAttribute('checked') }
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this.setAttribute('topic', newValue)
  }

  get value () {
    return this.getAttribute('value')
  }

  set value (newValue) {
    this.setAttribute('value', newValue)
  }

  get compute () {
    return this.getAttribute('compute')
  }

  set compute (newValue) {
    this.setAttribute('compute', newValue)
  }

  /* Event handling */

  inputChanged () {
    this.changed = true
    this._publish('input/changed/' + this._variable.replace(/\./g, '/'),
      {
        sourceType: DCCInputOption.elementTag,
        value: this.value
      }, true)
  }

  /* Rendering */

  elementTag () {
    return DCCInputOption.elementTag
  }

  externalLocationType () {
    return 'input'
  }

  async _renderInterface () {
    if (this._parent == null) {
      // === pre presentation setup
      // <TODO> review this sentence (copied from dcc-input-typed but not analysed)
      const statement =
            (this._xstyle.startsWith('out'))
              ? '' : this._statement

      const html = (this.reveal && this.reveal == 'button')
        ? "<dcc-button id='[id]' xstyle='theme'[topic] label='[statement]' divert='round' message='[value]' variable='[variable]'></dcc-button>"
          .replace('[id]', varid + nop)
          .replace('[topic]', (this.topic ? ' topic ="' + this.topic + '"' : ''))
          .replace('[statement]', child._statement)
          .replace('[value]', child.value)
          .replace('[variable]', this._variable)
        : "<input id='presentation-dcc' type='[exclusive]' name='[variable]' value='[value]'[checked]>[statement]</input>"
          .replace('[exclusive]', (this.hasAttribute('exclusive') ? 'radio' : 'checkbox'))
          .replace('[variable]', this._variable)
          .replace('[value]', this.value)
          .replace('[statement]', statement)
          .replace('[checked]', this.hasAttribute('checked') ? ' checked' : '')

      // === presentation setup (DCC Block)
      let presentation = await this._applyRender(html, 'innerHTML', 'input')

      // === post presentation setup
      presentation.addEventListener('change', this.inputChanged)

      this._presentationIsReady()
    }
  }
}

/**
 * Input Choice DCC
 ******************/

class DCCInputChoice extends DCCInput {
  constructor () {
    super()
    this._options = []
    this._variable = ''
    this._editButtons = super.editButtons()
    this.inputChanged = this.inputChanged.bind(this)
  }

  async connectedCallback () {
    super.connectedCallback()

    // <TODO> To avoid recursivity -- improve
    if (!this.hasAttribute('statement')) { this._statement = null }
  }

  disconnectedCallback () {
    if (this._options != null) {
      for (const o of this._options) { o.removeEventListener('change', this.inputChanged) }
    }
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCInput.observedAttributes.concat(
      ['exclusive', 'shuffle', 'reveal', 'topic', 'export', 'import', 'max'])
  }

  get exclusive () {
    return this.hasAttribute('exclusive')
  }

  set exclusive (isExclusive) {
    if (isExclusive) { this.setAttribute('exclusive', '') } else { this.removeAttribute('exclusive') }
  }

  get shuffle () {
    return this.hasAttribute('shuffle')
  }

  set shuffle (isShuffle) {
    if (isShuffle) { this.setAttribute('shuffle', '') } else { this.removeAttribute('shuffle') }
  }

  get max () {
    return parseInt(this.getAttribute('max'))
  }

  set max (newValue) {
    this.setAttribute('max', newValue)
  }

  get reveal () {
    return this.getAttribute('reveal')
  }

  set reveal (newValue) {
    this.setAttribute('reveal', newValue)
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this.setAttribute('topic', newValue)
  }

  get export () {
    return this.getAttribute('export')
  }

  set export (newValue) {
    this.setAttribute('export', newValue)
  }

  get export () {
    return this.hasAttribute('export')
  }

  set export (isExport) {
    if (isExport) { this.setAttribute('export', '') } else { this.removeAttribute('export') }
  }

  get import () {
    return this.getAttribute('import')
  }

  set import (newValue) {
    this.setAttribute('import', newValue)
  }

  /* Event handling */

  inputChanged (event) {
    let label = null
    const id = event.target.id
    let htmlLabels = document.getElementsByTagName('label')
    for (let l in htmlLabels) {
       if (htmlLabels[l].htmlFor == id) {
         label = htmlLabels[l].innerHTML
         break
       }
    }

    this.changed = true
    const value = (this.export)
                    ? {label: label, value: event.target.value}
                    : event.target.value
    if (this.exclusive) {
      this._value = value
      this._label = label
    } else if (this._value == null) {
      if (event.target.checked) {
        this._value = [value]
        this._label = [(label == null) ? '' : label]
      }
    } else {
      if (event.target.checked) {
        if (this.hasAttribute('max') && this._value.length == this.max) {
          event.target.checked = false
          this.changed = false
        } else {
          this._value.push(value)
          this._label.push((label == null) ? '' : label)
        }
      } else {
        let index = -1
        if (this.export) {
          for (const v in this._value)
            if (this._value[v].value == value.value) {
              index = v
              break
            }
        } else
          index = this._value.indexOf(value)
        if (index > -1) {
          this._value.splice(index, 1)
          this._label.splice(index, 1)
        }
      }
    }

    if (this.changed)
      this._publish('input/changed/' + this._variable.replace(/\./g, '/'),
        {
          sourceType: DCCInputChoice.elementTag,
          value: this._value,
          label: this._label
        }, true)
  }

  /* Rendering */

  elementTag () {
    return DCCInputChoice.elementTag
  }

  externalLocationType () {
    return 'input'
  }

  async _renderInterface () {
    // === pre presentation setup

    // check for imported items
    let imp = null
    if (this.hasAttribute('import') &&
        this._hasSubscriber('var/get/' + this.import.replace(/\./g, '/'), true)) {
      const mess = await this._request('var/get/' + this.import.replace(/\./g, '/'),
                                       null, null, true)
      if (mess.message != null)
        imp = (mess.message.body != null)
          ? mess.message.body : mess.message
    }

    let item = []
    const varid = this._variable.replace(/\./g, '_')
    const integral =
      (!this.hasAttribute('reveal') || this.reveal == 'integral') && !this.shuffle
    let nop = 0

    if (imp == null) {  // process inner elements
       // Fetch all the children that are not defined yet
      const undefinedOptions = this.querySelectorAll(':not(:defined)')

      const promises = [...undefinedOptions].map(option => {
        return customElements.whenDefined(option.localName)
      })
      // Wait for all the options be ready
      await Promise.all(promises)

      // <TODO> review this sentence (copied from dcc-input-typed but not analysed)
      /*
        const statement =
           (this.hasAttribute("xstyle") && this.xstyle.startsWith("out"))
           ? "" : this._statement;
        */

      let child = this.firstChild
      // const html = []
      let tgt = 1
      let inStatement = true
      let statement = ''
      while (child != null) {
        if (child.tagName &&
            child.tagName.toLowerCase() == DCCInputOption.elementTag &&
            (imp == null || imp.includes(child._statement))) {
          nop++
          item.push({
            type: 'option',
            id: nop,
            topic: (child.topic)
                    ? child.topic
                    : ((this.topic) ? this.topic.replace('#', tgt) : null),
            statement: child._statement,
            value: (child.value == 'false' || child.value == 'true')
                     ? child._statement + ':' + child.value
                     : ((this.export)
                        ? ((child.value == child._statement)
                           ? nop
                           : child.value)
                        : child.value),
            checked: child.hasAttribute('checked') ? ' checked' : '',
            compute: child.compute
          })
          tgt++
          inStatement = false
        } else {
          const element = (child.nodeType == 3) ?
            child.textContent : child.outerHTML
          if (inStatement && this._statement == null)
            statement += element
          else if (integral && element.length > 0)
            item.push ({
              type: 'html',
              html: element
            })
        }
        child = child.nextSibling
      }
      if (statement.length > 0) { this._statement = statement }
    } else {  // process imported elements
      console.log('=== imported elements')
      console.log(imp)
      for (const i in imp) {
        let tp, st, vl
        if (typeof imp[i] === 'string' || imp[i] instanceof String) {
          tp = parseInt(i)+1
          st = imp[i]
          vl = imp[i]
        } else {
          tp = imp[i].value
          st = imp[i].label
          vl = imp[i].value
        }
        item.push({
          type: 'option',
          id: parseInt(i)+1,
          topic: ((this.topic) ? this.topic.replace('#', tp) : null),
          statement: st,
          value: vl,
          checked: ''
        })
      }
    }

    this.innerHTML = ''

    // === presentation setup (DCC Block)
    if (this._statement != null) {
      let stm = this._statement
      if (this.hasAttribute('statement')) stm = '<p>' + stm + '</p>'
      await this._applyRender('<div id="presentation-dcc">' + stm + '</div>',
        'innerHTML', 'text', 'presentation-dcc', false)
    }

    const shuffle = this.shuffle && !this.author
    if (shuffle) item = this._shuffle(item)

    // transform items in HTML
    nop = 0
    for (let it of item) {
      if (it.type == 'html') {
        await this._applyRender('<span id="presentation-dcc">' +
          it.html + '</span>', 'innerHTML', 'input', 'presentation-dcc', false)
      }
      else {
        let template = (this.reveal && this.reveal == 'button')
          ? DCCInputOption.template.button : DCCInputOption.template.choice
        let element = template
          .replace('[id]', varid + '_' + it.id)
          .replace('[exclusive]',
            (this.hasAttribute('exclusive') ? 'radio' : 'checkbox'))
          .replace('[topic]', (it.topic != null) ? ' topic ="' + it.topic + '"' : '')
          .replace('[variable]', this._variable)
          .replace('[statement]', it.statement)
          .replace('[value]', it.value)
          .replace('[checked]', it.checked)
          .replace('[connect]', (it.compute == null) ? '' :
            ' connect="click:presentation-dcc-[id]-compute:compute/update"'
              .replace('[id]', it.id))
          .replace('[compute]', (it.compute == null) ? '' :
            DCCInputOption.template.compute
              .replace('[id]', it.id)
              .replace('[expression]', it.compute))
          .replace('[author]', (this.author) ? ' disabled' : '')
        nop++
        let presentation =
          await this._applyRender(
            element, 'innerHTML', 'item_' + nop,
            'presentation-dcc-' + varid + '_' + it.id, false)
        presentation.addEventListener('change', this.inputChanged)
        this._options.push(presentation)
        if (this.reveal == null || this.reveal != 'button') {
          element = DCCInputOption.template.label
            .replace(/\[id\]/g, varid + '_' + it.id)
            .replace('[statement]', it.statement) +
            ((this.reveal) ?
              ((this.reveal == 'vertical') ? '<br>' :
               (this.reveal == 'horizontal' && nop < item.length)
                 ? '&nbsp;&nbsp;|&nbsp;&nbsp;' : '') : '')
          await this._applyRender(
            element, 'innerHTML', 'item_' + nop,
            'presentation-dcc-' + varid + '_' + it.id + '-label', false)
        } else
          this._editButtons['item_' + nop] = [DCCVisual.editDCCExpand]
      }
    }

    this._presentationIsReady()

    // <TODO> align with dcc-state-select
    this._publish('input/ready/</' + this._variable.replace(/\./g, '/'),
      DCCInputChoice.elementTag)
  }

  _shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }
    return array
  }

  editButtons () {
    return this._editButtons
  }

  editExpandListener() {}
}

(function () {
  DCCInputOption.elementTag = 'dcc-input-option'
  DCCInputOption.editableCode = false
  customElements.define(DCCInputOption.elementTag, DCCInputOption)
  DCCInputChoice.elementTag = 'dcc-input-choice'
  DCCInputChoice.editableCode = false
  customElements.define(DCCInputChoice.elementTag, DCCInputChoice)

  DCCInputOption.template = {
    button:
      '<dcc-button id="presentation-dcc-[id]" location="#in"' +
        '[topic] label="[statement]" divert="round" ' +
        'message="[value]" variable="[variable]"[connect]>' +
      '</dcc-button>[compute]',
    choice:
      '<input id="presentation-dcc-[id]" type="[exclusive]" ' +
        'name="[variable]" value="[value]"[checked][author]>',
    label:
      '<label id="presentation-dcc-[id]-label" for="presentation-dcc-[id]" ' +
        'class="dcc-input-choice-theme-label">' +
        '[statement]</label>',
    compute:
      '<dcc-compute id="presentation-dcc-[id]-compute" ' +
        'expression="[expression]"></dcc-compute>'
  }
})()
