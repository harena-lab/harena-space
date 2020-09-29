/*
 * Versum Author Environment
 *
 * Authoring environment to test the Versum language.
 */

class AuthorCKEditor {
  constructor () {
   	MessageBus.page = new MessageBus(false)
    Basic.service.rootPath = '../../'
    DCCCommonServer.instance.local = true
  }

  start () {
    this.showHTML = this.showHTML.bind(this)
    this.showMarkdown = this.showMarkdown.bind(this)
    ClassicEditor.create( document.querySelector( '#editor' ) )
      .then( editor => {
        window.editor = editor;
      } )
      .catch( error => {
        console.error( 'There was a problem initializing the editor.', error );
    } );

    MessageBus.ext.subscribe("control/html/example", this.showHTML);
    MessageBus.ext.subscribe("control/markdown/example", this.showMarkdown);
  }

  showHTML () {
    document.querySelector('#results').value = editor.getData()
  }

  showMarkdown () {
    let mt = new showdown.Converter()
    mt.setFlavor('github')

    let html = editor.getData();

    let htmlCK = html
      .replace(/<img[^>]*src="([^"]*)"><figcaption>([^<]*)<\/figcaption>/igm,
               '<img alt="$2" src="$1">')
      .replace(/<figure[^>]*style="width:([^;]*);">[^<]*<img([^>]*)><\/figure>/igm,
               '<figure><img$2 width="$1" height="$1"></figure>')
      .replace(/<figure[^>]*>[^<]*<img([^>]*)><\/figure>/igm, '<img$1>')
      .replace(/<figure[^>]*>/igm, '')
      .replace(/<\/figure[^>]*>/igm, '')

    document.querySelector('#results').value = html + '\n\n' + htmlCK +
                                               '\n\n' + mt.makeMarkdown(htmlCK)
  }
}

(function () {
  AuthorCKEditor.s = new AuthorCKEditor()
})()
