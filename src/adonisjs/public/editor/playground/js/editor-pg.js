function _harenaCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new HarenaUploadAdapter(loader, Basic.service.currentCaseId, DCCCommonServer.token);
    };
}

class EditorPG {
  constructor () {
   	Basic.service.rootPath = '../../'
    DCCCommonServer.instance.local = true

    Translator.instance.authoringRender = true

    this._richToMarkdown = this._richToMarkdown.bind(this)
    MessageBus.i.subscribe('control/tomark/text', this._richToMarkdown)
    this._markdownToRich = this._markdownToRich.bind(this)
    MessageBus.i.subscribe('control/torich/text', this._markdownToRich)
  }

  buildEditor () {
    const presentation = document.querySelector('#editor-space')
    DecoupledEditor.create(presentation,
      {
        toolbar: {
          items: DecoupledEditor.defaultConfig.toolbar.items.concat(
                 ['annotatePatho', 'annotateEpi', 'annotateEti', 'annotateCli',
                  'annotateLab', 'annotateDiff', 'annotateProgn', 'annotateThera', '-',
                  'annotateEncap', 'annotateJar', 'annotateWrong']),
          shouldNotGroupWhenFull: true
        },
        extraPlugins: [_harenaCustomUploadAdapterPlugin],
        mediaEmbed: {
          extraProviders: [
             {
               name: 'googleProvider',
               url: /(^https:\/\/drive.google.com[\w/]*\/[^/]+\/)[^/]*/,
               html: match => '<iframe src="' + match[1] + 'preview" width="560" height="315"></iframe>'
             },
             {
               name: 'harenaProvider',
               url: /(^https?:\/\/(?:localhost|0\.0\.0\.0|(?:dev\.)?jacinto(?:-.)?\.harena\.org)(?::10020)?\/.*)/,
               html: match => '<video controls><source src="' + match[1] + '"></video>'
             }
           ]
        },
        harena: {
          confirm: 'control/editor/edit/confirm',
          cancel:  'control/editor/edit/cancel'
        }
      } )
      .then( editor => {
        const toolbarContainer = document.querySelector('#editor-toolbar')
        toolbarContainer.appendChild(editor.ui.view.toolbar.element)

        // if (CKEditorInspector != undefined)
        //   CKEditorInspector.attach(editor)

        window.editor = editor;
        this._editor = editor;

        editor.model.document.on( 'change:data', () => {
          this._textChanged = true
        } );
      } )
      .catch( error => {
        console.error( 'There was a problem initializing the editor.', error );
    } );
  }

  _richToMarkdown() {
    const md = RichEditor.i.richToMarkdown(this._editor.getData())
    document.querySelector('#conversion-results').value = md
  }

  async _markdownToRich() {
    const compiled = await Translator.instance.compileMarkdown(
      'test', document.querySelector('#conversion-results').value)
    let html = ''
    for (const knot in compiled.knots) {
      const mkHTML = await Translator.instance.generateHTML(compiled.knots[knot])
      html += mkHTML
    }
    this._editor.setData(html)
  }
}

(function () {
  EditorPG.i = new EditorPG()
})()
