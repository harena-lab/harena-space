function _harenaCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new HarenaUploadAdapter(loader, Basic.service.currentCaseId, DCCCommonServer.token);
    };
}

class EditorPG {

buildEditor () {
  const presentation = document.querySelector('#editor-space')
  DecoupledEditor.create(presentation,
    {
      toolbar: ['annotatePatho', 'annotateEpi', 'annotateEti', 'annotateCli',
                'annotateLab', 'annotateDiff', 'annotateThera', 'annotateEncap',
                'annotateJar', 'annotateWrong'],
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

      if (CKEditorInspector)
        CKEditorInspector.attach( editor );

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

(function () {
  EditorPG.i = new EditorPG()
})()
