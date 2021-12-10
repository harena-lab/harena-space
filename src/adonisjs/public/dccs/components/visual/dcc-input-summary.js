/* Markdown DCC
  *************/
class DCCInputSummary extends DCCVisual {
  async connectedCallback () {
    const summary = await this._request('input/summary')

    if (summary.message != null) {
      let html = '<table style="border: 2px solid darkgray">'

      for (const v in summary.message)
        html += '<tr>' +
              '<td style="border: 1px solid darkgray">' +
              v +
              '</td><td style="border: 1px solid darkgray">' +
              summary.message[v] +
              '</td></tr>'
      html += '</table></td></tr>'
      this.innerHTML = html
    }
  }
}

(function () {
  DCC.webComponent('dcc-input-summary', DCCInputSummary)
})()
