/**
 * Case Comments
 *
 * Manages comments for each knot in a case.
 */

class Comments {
  static prepare (compiledCase, knotid) {
    if (Comments.i == null)
      Comments.i = new Comments()

    Comments.i.buildComments(compiledCase, knotid)
  }

  constructor() {
    this.activateComments = this.activateComments.bind(this)
    MessageBus.i.subscribe('control/comments/editor', this.activateComments)
    this.commentsConfirm = this.commentsConfirm.bind(this)
    MessageBus.i.subscribe('control/comments/edit/confirm',
                           this.commentsConfirm)
  }

  buildComments (compiledCase, knotid) {
    this._compiledCase = compiledCase
    this._knotid = knotid
    this._activated = false
  }

  get activated() {
    return this._activated
  }

  async activateComments () {
    console.log('************* activate comments')

    /*
    if (this._activated)
      MessageBus.i.unsubscribe('control/comments/edit/confirm',
                               this.commentsConfirm)
    */

    this._activated = true

    let content = this._compiledCase.knots[this._knotid].content

    console.log(this._knotid)
    console.log(content)

    let template = await this._loadTemplate(content)
    if (template == null)
      template = Comments.generalTemplate
    console.log('=== templated loaded')
    console.log(template)
    this._template = template
    // extract dependencies
    const dependencies = {}
    for (const c in template.contexts)
      if (template.contexts[c].dependency != null)
        for (const d of template.contexts[c].dependency)
          dependencies[d] = c

    this._collection = this._collectComments(content, template, dependencies)
    this._generateForm(template, this._collection)
  }

  async _loadTemplate (content) {
    let template = null
    const commPos =
      content.findIndex(
        el => el.type == 'formal-open' && el.context == 'comments')
    if (commPos != -1) {
      console.log('=== commPos')
      console.log(commPos)
      let tmpl = null
      for (let t = commPos+1; t < content.length; t++)
        if (content[t].type == 'field' && content[t].field == 'template') {
          tmpl = content[t].value
          break
        }
      if (tmpl != null) {
        template = await MessageBus.i.request(
          'data/template_comments/' +
          tmpl.replace(/\//g, '.') + '/get',
          null, null, true)
        template = template.message
        console.log('=== template')
        console.log(template)
      }
    }

    return template
  }

  _collectComments (content, template, dependencies) {
    let collection = {
      comments: {}
    }
    let contexts = {}
    collection.contexts = contexts
    let insideFormal = null
    for (let el of content) {
      if (el.type == 'context-open') {
        const id = (el.id) ? el.id : el.context
        contexts[id] = {
          formal: false,
          context: el.context,
          comments: {}}
        if (el.id) contexts[id].id = el.id
      } else if (el.type == 'formal-open') {
        insideFormal = (el.id) ? el.id : el.context
        contexts[insideFormal] = {
          formal: true,
          context: el.context,
          comments: {}}
        if (el.id) contexts[insideFormal].id = el.id
      } else if (el.type == 'formal-close')
        insideFormal = null
      else if (insideFormal != null && el.type == 'field') {
        if (contexts[insideFormal].context == 'comments' &&
            el.field == template.property)
          collection.comments = el.value
        else if (template.contexts[contexts[insideFormal].context] &&
                 el.field == template.contexts[contexts[insideFormal].context].property)
          contexts[insideFormal].comments =
            Object.assign(contexts[insideFormal].comments, el.value)
      }
    }

    // add dependencies
    const lastPos = {}
    for (const c in contexts) {
      if (dependencies[contexts[c].context] != null)
        lastPos[dependencies[contexts[c].context]] = c
    }
    for (const l in lastPos) {
      if (!contexts[l]) {
        const newContexts = {}
        for (const c in contexts) {
          newContexts[c] = contexts[c]
          if (c == lastPos[l])
            newContexts[l] = {
              formal: false,
              context: l,
              comments: {},
              includeAfter: lastPos[l]}
        }
        collection.contexts = newContexts
      }
    }

    console.log('=== collected fields')
    console.log(collection)
    return collection
  }

  _generateForm (template, collection) {
    let htmlForm = this._blockToForm('', template, collection.comments)
    for (const c in collection.contexts) {
      const tmpl = template.contexts[collection.contexts[c].context]
      if (tmpl != null)
        htmlForm += this._blockToForm(c, tmpl, collection.contexts[c].comments)
    }

    document.querySelector('#comments-display').innerHTML =
      Comments.html.form.replace(/{form}/gm, htmlForm)
  }

  _blockToForm (context, blockTemplate, comments) {
    let htmlBlock = (blockTemplate.title == null) ? ''
      : Comments.html.section.replace(/{section_title}/gm, blockTemplate.title)
    for (const b of blockTemplate.blocks) {
      let count = 1
      let htmlItems = ''
      if (b.type == 'text')
        htmlItems += Comments.html.text
          .replace(/{item_property}/gm, context + '_._' + b.property)
          .replace(/{item_placeholder}/gm, (b.placeholder) ? b.placeholder : '')
          .replace(/{item_value}/gm, (comments[b.property]) ? comments[b.property] : '')
      else
        for (const a of b.comments) {
          htmlItems += Comments.html[b.type]
            .replace(/{item_title}/gm, a.title)
            .replace(/{item_property}/gm, context + '_._' + a.property)
            .replace(/{item_id}/gm, context + '_._' + a.property + count)
            .replace(/{item_value}/gm, a.value)
            .replace(/{checked}/gm,
              ((comments[a.property] && comments[a.property] == a.value)
                 ? 'checked' : ''))
          count++
        }
      htmlBlock += Comments.html.block
        .replace(/{block_title}/gm, b.title)
        .replace(/{block_description}/gm,
          (b.description) ? '<p>' + b.description + '</p>' : '')
        .replace(/{items}/gm, htmlItems)
    }
    return htmlBlock
  }

    /*
    if (comments != -1) {
      this._template = -1
      for (let c = comments+1;
           c < content.length && content[c].type != 'context-close'; c++) {
        if (content[c].type == 'field' && content[c].field == 'template') {
          this._template = c
          break
        }
      }
      if (this._template != -1) {
        const tmpl = await MessageBus.i.request(
          'data/template_comments/' +
          content[this._template].value.replace(/\//g, '.') + '/get', null, null, true)
        const form = '<form><dcc-dhtml subscribe="data/comments/get:update">' + tmpl.message +
                     '<end-dcc></end-dcc></dcc-dhtml>' +
                     '<dcc-submit label="COMMENT" xstyle="in" subscribe="control/comments/submit" topic="control/comments/edit/confirm" display="none"></dcc-submit></form>'
        document.querySelector('#comments-display').innerHTML = form

        this._comments = -1
        for (let c = this._template+1;
             c < content.length && content[c].type != 'context-close'; c++) {
          if (content[c].type == 'field' && content[c].field == 'comments') {
            this._comments = c
            console.log('=== publishing')
            console.log(content[c].value)
            MessageBus.i.publish('data/comments/get', content[c].value, true)
            break
          }
        }
      }
    }

    this.commentsConfirm = this.commentsConfirm.bind(this)
    MessageBus.i.subscribe('control/comments/edit/confirm',
                             this.commentsConfirm)
   this.toggleRadioFindings()
   */
  //}

  /*
  toggleRadioFindings(){

    const radioList = document.querySelectorAll(`input[id*="achados"][id$="1"]`)
    if(radioList){
      radioList.forEach(function(el) {

        if(el.hasAttribute('checked')){
          el.setAttribute('pastcheck','true')
          el.previousElementSibling.setAttribute('pastcheck','false')
        }else{
          el.setAttribute('pastcheck','false')
          el.previousElementSibling.setAttribute('pastcheck','true')
        }
        el.addEventListener("click", function(){

          if(el.getAttribute('pastcheck') == 'true'){
            el.previousElementSibling.checked = true
            el.previousElementSibling.setAttribute('pastcheck','true')
            el.setAttribute('pastcheck','false')
          }else if(el.getAttribute('pastcheck') == 'false'){
            el.checked = true
            el.previousElementSibling.setAttribute('pastcheck','false')
            el.setAttribute('pastcheck','true')
          }
        })
      })
    }
  }
  */

  commentsConfirm(topic, message) {
    console.log('=== comments confirm')

    for (const field in message.value) {
      const pos = field.indexOf('_._')
      const context = field.substring(0, pos)
      const property = field.substring(pos + 3)

      if (context.length == 0) {
        if (!this._collection.newComments)
          this._collection.newComments = {}
        this._collection.newComments[property] = message.value[field]
      } else {
        if (!this._collection.contexts[context].newComments)
          this._collection.contexts[context].newComments = {}
        this._collection.contexts[context].newComments[property] =
          message.value[field]
      }
    }

    console.log('=== new collection')
    console.log(this._collection)

    if (Object.keys(this._collection.comments).length > 0 ||
        this._collection.newComments) {
      let comments =
        (this._collection.newComments) ? this._collection.newComments : {}
      if (this._template.property) {
        const insideComments = comments
        comments = {}
        comments[this._template.property] = insideComments
      }
      MessageBus.i.publish('modify/formal/update',
        {knot: this._knotid,
         context: 'comments',
         comments: comments})
    }
    for (const c in this._collection.contexts) {
      const context = this._collection.contexts[c]
      if (this._template.contexts[context.context] &&
          (Object.keys(context.comments).length > 0 || context.newComments)) {
        const property =
          this._template.contexts[context.context].property
        const update = {
          knot: this._knotid,
          context: context.context,
          comments: (context.newComments) ? context.newComments : {},
          includeMissing: true }
        if (property) {
          const insideComments = update.comments
          update.comments = {}
          update.comments[property] = insideComments
        }
        if (context.id)
          update.contextId = context.id
        if (context.includeAfter)
          update.includeAfter = context.includeAfter
        console.log('=== formal/update')
        console.log(update)
        console.log(update.includeAfter)
        MessageBus.i.publish('modify/formal/update', update)
      }
    }
  }

    /*
    let content = this._compiledCase.knots[this._knotid].content
    let commentElement
    for (let v in message.value)
      if (typeof message.value[v] === 'string')
        message.value[v] = message.value[v].trim()
    if (this._comments > -1) {
      console.log('greater that -1')
      commentElement = content[this._comments]
      commentElement.value = message.value
    } else {
      commentElement = JSON.parse(JSON.stringify(Translator.objTemplates.field))
      commentElement.field = 'comments'
      commentElement.value = message.value
      let seq = content[this._template].seq + 1
      commentElement.seq = content[this._template].seq + 1
      console.log('=== comments template')
      console.log(commentElement)
      content.splice(this._template + 1, 0, commentElement)
      for (let c = this._template+2; c < content.length; c++) {
        seq++
        content[c].seq = seq
      }
      this._comments = this._template + 1
    }
    Translator.instance.updateElementMarkdown(commentElement)
  } */

  /*
  close() {
    MessageBus.i.unsubscribe('control/comments/editor', this.activateComments)
    if (this._activated)
      MessageBus.i.unsubscribe('control/comments/edit/confirm',
                                 this.commentsConfirm)
  }
  */
}

(function () {
Comments.generalTemplate =
{
 property: "general",
 blocks: [
  {
   "title": "Comentários",
   "type": "text",
   "property": "comments",
   "placeholder": "Digite seus comentários"
  }
 ],
 contexts: {}
}
Comments.html = {
form:
`<form>
  {form}
  <dcc-submit label="COMMENT" xstyle="in"  subscribe="control/comments/submit"
              topic="control/comments/edit/confirm" display="none">
  </dcc-submit>
  <hr>
  <div class="text-center">
    <dcc-button topic="control/case/save" label="GRAVAR COMENTÁRIOS" xstyle="theme"></dcc-button>
  </div>
<hr>
</form>`,
section:
`<hr>
<h3>{section_title}</h3>
<hr>`,
block:
`<h4 class="mt-1">{block_title}</h4>
<div class="bg-light border border-secondary rounded pl-2">{block_description}
{items}</div>`,
text:
`<textarea class="form-control" id="{item_property}" name="{item_property}"
  placeholder="{item_placeholder}">{item_value}</textarea>`,
radio:
`<div class="form-check">
  <input type="radio" id="{item_id}"
    name="{item_property}" value="{item_value}" class="form-check-input" {checked}>
  <label for="{item_id}" class="form-check-label">{item_title}</label>
</div>`,
'radio-h':
`<div class="form-check-inline">
  <input type="radio" id="{item_id}"
    name="{item_property}" value="{item_value}" class="form-check-input" {checked}>
  <label for="{item_id}" class="form-check-label">{item_title}</label>
</div>`,
checkbox:
`<div class="form-check">
  <input type="checkbox" id="{item_property}"
    name="{item_property}" value="{item_value}" class="form-check-input" {checked}>
  <label for="{item_property}" class="form-check-label">{item_title}</label>
</div>`}
})()
