/**
 * Case Comments
 *
 * Manages comments for each knot in a case.
 */

function _harenaCustomUploadAdapterPluginComments( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new HarenaUploadAdapter(loader, Basic.service.currentCaseId, DCCCommonServer.token);
    };
}

class Comments {
  constructor (compiledCase, knotid) {
    this._compiledCase = compiledCase
    this._knotid = knotid
    this.activateEditor = this.activateEditor.bind(this)
    MessageBus.int.subscribe('control/comments/editor', this.activateEditor)
  }

  activateEditor () {
    let editorPanel = document.querySelector('#comments-editor')

    DecoupledEditor.create(editorPanel,
      {
        extraPlugins: [_harenaCustomUploadAdapterPluginComments],
        mediaEmbed: {
          extraProviders: [{
             name: 'extraProvider',
             url: /(^https:\/\/drive.google.com[\w/]*\/[^/]+\/)[^/]*/,
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
  }
}