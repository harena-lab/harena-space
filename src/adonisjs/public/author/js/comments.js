/**
 * Case Comments
 *
 * Manages comments for each knot in a case.
 */

/*
function _harenaCustomUploadAdapterPluginComments( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new HarenaUploadAdapter(loader, Basic.service.currentCaseId, DCCCommonServer.token);
    };
}
*/

class Comments {
  constructor (compiledCase, knotid) {
    this._compiledCase = compiledCase
    this._knotid = knotid
    this._activated = false
    this.activateComments = this.activateComments.bind(this)
    MessageBus.int.subscribe('control/comments/editor', this.activateComments)
  }

  get activated() {
    return this._activated
  }

  async activateComments () {
    console.log('************* activate comments')
    this._activated = true

    let content = this._compiledCase.knots[this._knotid].content

    const comments =
      content.findIndex(
        el => el.type == 'context-open' && el.context == 'comments')

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
        const tmpl = await MessageBus.ext.request(
          'data/template_comments/' +
          content[this._template].value.replace(/\//g, '.') + '/get')
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
            MessageBus.ext.publish('data/comments/get', content[c].value)
            break
          }
        }
      }
    }

    this.commentsConfirm = this.commentsConfirm.bind(this)
    MessageBus.ext.subscribe('control/comments/edit/confirm',
                             this.commentsConfirm)
   this.toggleRadioFindings()

    /*
    let cKnot = -1
    if (this._compiledCase != null && this._compiledCase.layers.Comments != null) {
      const comments = this._compiledCase.layers.Comments.content
      let cu = 0
      while (cu < comments.length && cKnot == -1) {
        if (comments[cu].type == 'context-open' && comments[cu].context == this._knotid)
          cKnot = cu
        cu++
      }

      if (cKnot != -1) {
        let html = '<hr><h3>Comments</h3>'
        cKnot++
        while (cKnot < comments.length && comments[cKnot].type != 'context-close') {
          html += Translator.instance.objToHTML(comments[cKnot])
          if (comments[cKnot].type == 'text')
            html += '<hr>'
          cKnot++
        }
        this._knotPos = cKnot
        // document.querySelector('#comments-display').innerHTML = html
      }
    }

    this.commentsConfirm = this.commentsConfirm.bind(this)
    MessageBus.int.subscribe('control/comments/edit/confirm', this.commentsConfirm)
    this.commentsCancel = this.commentsCancel.bind(this)
    MessageBus.int.subscribe('control/comments/edit/cancel', this.commentsCancel)

    let editorPanel = document.querySelector('#comments-editor')

    DecoupledEditor.create(editorPanel,
      {
        extraPlugins: [_harenaCustomUploadAdapterPluginComments],
        mediaEmbed: {
          extraProviders: [{
             name: 'extraProvider',
             url: / /,
             html: match => '<iframe src="' + match[1] + 'preview" width="560" height="315"></iframe>'
           }]
         },
         harena: {
           confirm: 'control/comments/edit/confirm',
           cancel:  'control/comments/edit/cancel'
         }
      } )
      .then( editor => {
        document.querySelector('#comments-toolbar').appendChild(editor.ui.view.toolbar.element)

        window.editor = editor;
        this._editor = editor;
        editor.model.document.on( 'change:data', () => {
          this._textChanged = true
        } );
      } )
      .catch( error => {
        console.error( 'There was a problem initializing the editor.', error );
    } );
    */
  }

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

  commentsConfirm(topic, message) {
    console.log('============')
    console.log('confirming comments')
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

    /*
    let comments = this._compiledCase.layers.Comments.content
    let seq = comments[this._knotPos].seq
    let linefeed1 = {
        type: 'linefeed',
        content: '\n\n',
        seq: seq
    }
    comments.splice(this._knotPos, 0, linefeed1)
    Translator.instance.updateElementMarkdown(linefeed1)

    const text = {
      type: 'text',
      content: this._editor.getData(),
      seq: seq+1
    }
    comments.splice(this._knotPos+1, 0, text)
    Translator.instance.updateElementMarkdown(text)

    let linefeed2 = {
        type: 'linefeed',
        content: '\n\n',
        seq: seq+2
    }
    comments.splice(this._knotPos+2, 0, linefeed2)
    Translator.instance.updateElementMarkdown(linefeed2)

    seq += 3
    for (let c = this._knotPos+3; c < comments.length; c++) {
      comments[c].seq = seq
      seq++
    }

    console.log('*** NEW LAYER ***')
    console.log(this._compiledCase.layers.Comments.content)
    */
  }

  close() {
    console.log('*** unsubscribed')
    MessageBus.int.unsubscribe('control/comments/editor', this.activateComments)
    if (this._activated)
      MessageBus.ext.unsubscribe('control/comments/edit/confirm',
                                 this.commentsConfirm)
  }
}
