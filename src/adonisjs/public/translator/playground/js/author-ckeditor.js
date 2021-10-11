/*
 * Versum Author Environment
 *
 * Authoring environment to test the Versum language.
 */

function _harenaCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new HarenaUploadAdapter( loader, Basic.service.currentCaseId, DCCCommonServer.token );
    };
}

class AuthorCKEditor {
  constructor () {
   	// MessageBus.page = new MessageBus(false)
    Basic.service.rootPath = '../../'
    DCCCommonServer.instance.local = true
  }

  start () {
    this.showHTML = this.showHTML.bind(this)
    this.showMarkdown = this.showMarkdown.bind(this)

    ClassicEditor.create(document.querySelector( '#editor' ),
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
      } )
      .catch( error => {
        console.error( 'There was a problem initializing the editor.', error );
    } );

    MessageBus.i.subscribe("control/html/example", this.showHTML);
    MessageBus.i.subscribe("control/markdown/example", this.showMarkdown);
  }

  showHTML () {
    document.querySelector('#results').value = editor.getData()
  }

  showMarkdown () {
    let mt = new showdown.Converter()
    mt.setFlavor('github')

    let html = editor.getData();

    let htmlTranslate = html
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
      console.log(tables)
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

    let mdTranslate = mt.makeMarkdown(htmlTranslate)

    mdTranslate = mdTranslate
      .replace(/!\[null\]\(([^")]+)"([^"]+)"\)/igm, '![$2]($1"$2")')

    // removing extra lines
    mdTranslate = mdTranslate
      .replace(/[ \t\n\r\f]*(\!\[[^\]]*\]\([^)]*\))[ \t\n\r\f]*/igm, '\n\n$1\n\n')
      .replace(/[ \t\n\r\f]*(<video><source src="[^"]+"><\/video>)[ \t\n\r\f]*/igm, '\n\n$1\n\n')
      .trim()

    document.querySelector('#results').value = html + '\n\n-----\n\n' + htmlTranslate +
                                                      '\n\n-----\n\n' + mdTranslate
  }
}

(function () {
  AuthorCKEditor.s = new AuthorCKEditor()
})()
