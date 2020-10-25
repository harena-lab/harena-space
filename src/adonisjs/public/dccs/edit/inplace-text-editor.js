/* Editor for DCC Texts
  *********************/

function _harenaCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new HarenaUploadAdapter( loader, Basic.service.currentCaseId, DCCCommonServer.token );
    };
}

class EditDCCText extends EditDCC {
  constructor (knotContent, el, dcc, svg) {
    super(dcc, dcc.currentPresentation())
    this._knotContent = knotContent
    this._element = el
    this._editDCC = dcc
    this._textChanged = false
    this.handleConfirm = this.handleConfirm.bind(this)
    MessageBus.int.subscribe('control/editor/edit/confirm', this.handleConfirm)
    this.handleCancel = this.handleCancel.bind(this)
    MessageBus.int.subscribe('control/editor/edit/cancel', this.handleCancel)
    this._buildEditor(dcc.currentPresentation())
  }

  _buildEditor (dcc) {
    ClassicEditor.create(dcc,
      {
        extraPlugins: [_harenaCustomUploadAdapterPlugin],
        mediaEmbed: {
          extraProviders: [{
             name: 'extraProvider',
             url: /(^https:\/\/drive.google.com[\w/]*\/[^/]+\/)[^/]*/,
             html: match => '<iframe src="' + match[1] + 'preview" width="560" height="315"></iframe>'
           }]
         }
      } )
      .then( editor => {
        window.editor = editor;
        this._editor = editor;
        /*
        editor.editing.view.document.on( 'change:isFocused', ( evt, data, isFocused ) => {
          // console.log( `View document is focused: ${ isFocused }.` );
          if (!isFocused && this._textChanged) {
            this._textChanged = false
            this._updateTranslated()
          }
        } );
        */
        editor.model.document.on( 'change:data', () => {
          this._textChanged = true
        } );
      } )
      .catch( error => {
        console.error( 'There was a problem initializing the editor.', error );
    } );
  }

  async _updateTranslated () {
    const objSet = await this._translateContent(
      this._editor.getData(), this._knotContent[this._element].blockquote)

    // removes extra linefeeds
    if (objSet[objSet.length - 1].type == 'linefeed') { objSet.pop() }

    // redefines the sequence according to the new elements
    const seq = this._knotContent[this._element].seq
    const shift = objSet.length - 1
    for (let s = this._element + 1; s < this._knotContent.length; s++) { this._knotContent[s].seq += shift }

    // removes the previous element and insert the new one
    this._knotContent.splice(this._element, 1)
    for (let o = 0; o < objSet.length; o++) {
      objSet[o].seq = seq + o
      this._knotContent.splice(this._element + o, 0, objSet[o])
    }

  }

  handleConfirm() {
    this._updateTranslated()
    MessageBus.ext.publish('control/knot/update')
  }

  handleCancel() {
    MessageBus.ext.publish('control/knot/update')
  }

  async _translateContent (editContent, blockquote) {
    let content = ''
    console.log('=== content')
    console.log(editContent)

    let htmlTranslate = editContent
      .replace(/<img([^>]*)title="([^"]*)"([^>]*)><figcaption>([^<]*)<\/figcaption>/igm,
               '<img$1title="$4"$3>')
      .replace(/<img([^>]*)><figcaption>([^<]*)<\/figcaption>/igm,
               '<img$1 title="$2">')
      .replace(/<figure class="image[^>]*style="width:([^;]*);">[^<]*<img([^>]*)><\/figure>/igm,
               '<figure><img$2 width="$1" height="$1"></figure>')
      .replace(/<figure class="image[^>]*>[^<]*<img([^>]*)><\/figure>/igm, '<img$1>')
      .replace(/<figure class="media"><oembed url="([^"]+)"><\/oembed><\/figure>/igm,
               '<video><source src="$1"></video>')
      .replace(/<figure[^>]*>/igm, '')
      .replace(/<\/figure[^>]*>/igm, '')

    if (htmlTranslate.includes('</table>')) {
      let tables = htmlTranslate.split('</table>')
      for (let tb in tables) {
        if (tb < tables.length - 1 && !tables[tb].includes('</thead>')) {
          tables[tb] = tables[tb].replace(/<tbody[^>]*>/im, '<thead>')
          const frp = tables[tb].indexOf('</tr>')
          tables[tb] = tables[tb].substring(0, frp).replace(/<td/igm, '<th')
                                                   .replace(/<\/td>/igm, '</th>') +
                       '</tr></thead>' + tables[tb].substring(frp + 5)
        }
      }
      htmlTranslate = tables.join('</table>')
    }

    let mt = new showdown.Converter()
    mt.setFlavor('github')
    let mdTranslate = mt.makeMarkdown(htmlTranslate)

    mdTranslate = mdTranslate
      .replace(/!\[null\]\(([^")]+)"([^"]+)"\)/igm, '![$2]($1"$2")')

    // removing extra lines
    mdTranslate = mdTranslate
      .replace(/[ \t\n\r\f]*(\!\[[^\]]*\]\([^)]*\))[ \t\n\r\f]*/igm, '\n\n$1\n\n')
      .replace(/[ \t\n\r\f]*(<video><source src="[^"]+"><\/video>)[ \t\n\r\f]*/igm, '\n\n$1\n\n')
      .trim()

    console.log('=== html')
    console.log(mdTranslate)
    const unity = { _source: mdTranslate }
    Translator.instance._compileUnityMarkdown(unity)
    Translator.instance._compileMerge(unity)
    if (blockquote != null) {
      for (const c of unity.content) {
        c.blockquote = true
        if (c.type == 'text-block') {
          for (const tb of c.content) { tb.blockquote = true }
        }
        Translator.instance.updateElementMarkdown(c)
      }
    }
    console.log('=== unity')
    console.log(unity)
    return unity.content
  }
}

  /*
  _buildEditor (selectOptions, oldDelta) {
    this._editDCC.parentNode.insertBefore(this._fetchEditorContainer(), this._editDCC.nextSibling)

    this._editor = this._buildEditorPanel()

    this._fetchEditorContainer().appendChild(this._editor)

    this._buildCKEditor(selectOptions, oldDelta)

    this._editElement.style.display = 'none'

  }

  _buildEditorPanel () {
    const editor = document.createElement('div')
    editor.style.position = 'sticky'
    if (this._svgDraw) {
      editor.innerHTML =
            EditDCCText.editorTemplate.svg
              .replace('[width]',
                this._transformViewportX(this._elementWrapperRect.width))
              .replace('[height]',
                this._transformViewportY(this._elementWrapperRect.height))
    } else {
      editor.innerHTML =
            EditDCCText.editorTemplate.html
    }
    const inplaceContent = editor.querySelector('#inplace-content')
    const elementStyle = window.getComputedStyle(this._editElement, null)
    const transferFont = ['font-size', 'font-family', 'font-weight']
    for (const tf of transferFont) { inplaceContent.style.setProperty(tf, elementStyle.getPropertyValue(tf)) }

    const par = this._editElement.querySelector('p')
    if (par != null) {
      const transferMargin = ['margin-top', 'margin-right',
        'margin-bottom', 'margin-left']
      const parStyle = window.getComputedStyle(par, null)
      const sty = document.createElement('style')
      let styStr = '#inplace-content p {'
      for (const tm of transferMargin) { styStr += tm + ':' + parStyle.getPropertyValue(tm) + ';' }
      styStr + '}'
      sty.innerHTML = styStr
      document.body.appendChild(sty)
    }

    return editor
  }

  // builds a Quill editor
  _buildCKEditor (selectOptions, oldDelta) {
    const inplaceContent = this._editor.querySelector('#inplace-content')
    if (!selectOptions) {
      Translator.instance.authoringRender = false
      let html = Translator.instance.markdownToHTML(
        Translator.instance.objToHTML(this._knotContent[this._element], -1))
      Translator.instance.authoringRender = true
      console.log('=== quill html')
      console.log(html)

      // add a prefix in the ids to avoid conflits with the original
      html = html.replace(/(<[^<]*(?=id)id=['"])([^'"]+['"][^>]*>)/igm,
        '$1ed_$2')

      console.log('=== html')
      console.log(html)
      inplaceContent.innerHTML = html
    }

    InlineEditor.create(inplaceContent)
      .then( editor => {
        window.editor = editor;
      } )
      .catch( error => {
        console.error( 'There was a problem initializing the editor.', error );
    } );

    this._editor.classList.add('w-100', 'inplace-editor')

  }

  _removeEditor () {
    // this._editorWrapper.removeChild(this._editorToolbar);
    const oldDelta = this._quill.getContents()
    this._removeToolbarPanel()
    this._editorWrapper.removeChild(this._editor)
    return oldDelta
  }

  async _handleConfirm () {

    const objSet = await this._translateContent(
      this._quill.getContents(), this._knotContent[this._element].blockquote)

    // removes extra linfeeds
    if (objSet[objSet.length - 1].type == 'linefeed') { objSet.pop() }

    // redefines the sequence according to the new elements
    const seq = this._knotContent[this._element].seq
    const shift = objSet.length - 1
    for (let s = this._element + 1; s < this._knotContent.length; s++) { this._knotContent[s].seq += shift }

    // removes the previous element and insert the new one
    this._knotContent.splice(this._element, 1)
    for (let o = 0; o < objSet.length; o++) {
      objSet[o].seq = seq + o
      this._knotContent.splice(this._element + o, 0, objSet[o])
    }

    MessageBus.ext.publish('control/knot/update')

    this._removeEditor()
  }

  _handleCancel () {
    MessageBus.ext.publish('control/knot/update')
    this._removeEditor()
  }

  async _translateContent (editContent, blockquote) {
    let content = ''
    console.log('=== content')
    console.log(editContent)
    for (const e in editContent.ops) {
      const ec = editContent.ops[e]
      if (ec.insert) {
        if (typeof ec.insert === 'string') {
          let md = ec.insert.replace(/\n/g, '\n\n')
          if (ec.attributes) {
            const attr = ec.attributes
            if (attr.bold) { md = '**' + md + '**' }
            if (attr.italic) { md = '*' + md + '*' }
            if (attr.script == 'sub') { md = '<sub>' + md + '</sub>' }
            if (attr.script == 'sup') { md = '<sup>' + md + '</sup>' }
            if (attr.link) { md = '[' + md + '](' + attr.link + ')' }
            if (attr.annotation || attr.select) {
              md = '{' + md + '}'
              if (attr.annotation && attr.annotation.length > 0) {
                md += '(' + attr.annotation
                  .replace(/\(/, '\(')
                  .replace(/\)/, '\)') + ')'
              }
              if (attr.select && attr.select.answer &&
                         attr.select.answer.length > 0) { md += '/' + attr.select.answer + '/' }
            }
            if (attr.align == 'center') {
              content = this._formatPreSegment(
                content, "<div align='center'>", '</div>')
              md = this._formatCurrent(md)
            }
            if (attr.list == 'bullet') {
              content = this._formatPreSegment(content, '* ', '')
              md = this._formatCurrent(md)
            }
          }
          content += md
        } else if (ec.insert.image) {
          let imageURL = ec.insert.image
          if (imageURL.startsWith('data:')) {
            const asset = await
            MessageBus.ext.request('data/asset//new',
              {
                b64: imageURL,
                caseid: Basic.service.currentCaseId
              })
            imageURL = asset.message
          }
          content += '![' +
                  ((ec.attributes && ec.attributes.alt) ? ec.attributes.alt : 'image') + '](' +
                  Basic.service.imageAbsoluteToRelative(imageURL) + ')\n'
        }
      }
    }
    content = content.trimEnd()
    content = content.replace(/[\n]+$/g, '') + '\n'
    console.log('=== html')
    console.log(content)
    const unity = { _source: content }
    Translator.instance._compileUnityMarkdown(unity)
    Translator.instance._compileMerge(unity)
    if (blockquote != null) {
      for (const c of unity.content) {
        c.blockquote = true
        if (c.type == 'text-block') {
          for (const tb of c.content) { tb.blockquote = true }
        }
        Translator.instance.updateElementMarkdown(c)
      }
    }
    console.log('=== unity')
    console.log(unity)
    return unity.content
  }

  _formatPreSegment (content, preform, posform) {
    let formated = content
    if (content.includes('\n')) {
      const cut = content.lastIndexOf('\n')
      formated = content.substring(0, cut + 1) + preform +
                    content.substring(cut + 1) + posform
    } else { formated = preform + content + posform }
    return formated
  }

  _formatCurrent (current) {
    let formated = current
    if (current.endsWith('\n')) { formated = current.substring(0, current.length - 1) }
    return formated
  }
}

(function () {
})()
*/