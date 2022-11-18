/**
 * Rich Editor
 *
 */
class RichEditor {

  richToMarkdown (editContent) {
    let content = ''

    console.log('=== edit content')
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

    // changing bullets from - to +
    mdTranslate = mdTranslate
      .replace(/^-[ \t]/igm, '* ')

    mdTranslate = mdTranslate.replace(/<br>/igm, '\n')

    // removing non printable special characters
    mdTranslate = mdTranslate.replace(/\u200B/gm, '')

    console.log('=== markdown translate')
    console.log(htmlTranslate)

    return mdTranslate
  }
}

(function () {
  RichEditor.i = new RichEditor()
})()
