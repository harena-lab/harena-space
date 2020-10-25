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
    DecoupledEditor.create(dcc,
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
        const toolbarContainer = document.querySelector('#toolbar-editor')
        toolbarContainer.appendChild( editor.ui.view.toolbar.element );

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
    this._removeToolbarPanel()
    MessageBus.ext.publish('control/knot/update')
  }

  handleCancel() {
    this._removeToolbarPanel()
    MessageBus.ext.publish('control/knot/update')
  }

  _removeToolbarPanel() {
    document.querySelector('#toolbar-editor').innerHTML = ''
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
