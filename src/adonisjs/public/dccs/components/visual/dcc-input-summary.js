/* Markdown DCC
  *************/
class DCCInputSummary extends DCCVisual {
  async connectedCallback () {
    const summary = await this._request('input/summary')

    if (summary.message != null) {
      let html = '<table style="border: 2px solid darkgray">' +
                 this._presentVariables(summary.message) +
                 '</table></td></tr>'
      this.innerHTML = html
    }
  }

  _presentVariables (variables) {
    let html = ''
    let levels = []
    let max = 1
    for (const v in variables) {
      let lv = v.split('.')
      html += '<tr>'
      for (const l in lv) {
        if (levels[l] && levels[l] == lv[l]) {
          html += '<td style="border: 1px solid darkgray"></td>'
        } else {
          html += '<td style="border: 1px solid darkgray">' + lv[l] + '</td>'
          levels = lv.slice(0, l)
        }
        if (l == lv.length-1)
          html += '<td style="border: 1px solid darkgray">' +
                  this._presentValue(variables[v]) + '</td>'
      }
      html += '</tr>'
    }
    return html
  }

  _presentValue (value) {
    let html = ''
    if (Array.isArray(value)) {
      for (const a in value)
        html += this._presentValue(value[a]) + ((a < value.length-1) ? '; ' : '')
    } else if (typeof value === 'object') {
      html += '['
      const ov = Object.values(value)
      for (const o in ov)
        html += this._presentValue(ov[o]) + ((o < ov.length-1) ? ',' : '')
      html += ']'
    } else if (value.endsWith(':false') || value.endsWith(':true')) {
      const v = value.substring(value.lastIndexOf(':') + 1)
      html = value.substring(0, value.lastIndexOf(':')) +
             '<td style="border: 1px solid darkgray; color:' +
             ((v == 'true') ? 'blue' : 'red') + '">' + v + '</td>'
    } else
      html = value
    return html
  }
}

(function () {
  DCC.webComponent('dcc-input-summary', DCCInputSummary)
})()
