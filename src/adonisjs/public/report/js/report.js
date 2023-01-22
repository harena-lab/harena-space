class ReportManager {
  start () {
    this._report = this._report.bind(this)
    MessageBus.i.subscribe('report/update', this._report)
  }

  async _report () {
    const reportArea = document.querySelector('#report-area')

    let logger = await MessageBus.i.request('logger/list/get',
      {caseId: new URL(document.location).searchParams.get('id'),
       startingDateTime: new URL(document.location).searchParams.get('start'),
       endingDateTime: new URL(document.location).searchParams.get('end')})

    if (logger.message.error) {
      console.log('--- error')
      console.log(logger.message.error)
    } else {
      const logs = {}
      for (const l of logger.message.logs)
        logs[l.id] = l

      let html = '<table style="border: 2px solid darkgray"><tr>' +
                 '<th style="border: 2px solid darkgray">user</th>' +
                 '<th style="border: 2px solid darkgray">date/hour</th>' +
                 '<th style="border: 2px solid darkgray">answers</th>' +
                 '</tr>'
      const checked = document.getElementsByClassName('form-check-input')
      for (const c of checked) {
        if (c.checked) {
          const answers = JSON.parse(logs[c.value].log)
          html += '<tr><td style="border: 2px solid darkgray">' +
                  logs[c.value].username +
                  '</td><td style="border: 2px solid darkgray">' +
                  logs[c.value].created_at +
                  '</td><td style="border: 2px solid darkgray">' +
                  '<table style="border: 2px solid darkgray">' +
                  this._presentVariables(answers.variables) +
                  '</table></td></tr>'
        }
      }
      html += '</table>'
      document.querySelector('#report-area').innerHTML = html
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
      if ((typeof value[0] === 'string' || value[0] instanceof String) &&
          (value[0].endsWith(':false') || value[0].endsWith(':true'))) {
        let result = ''
        html += '<table>'
        for (const a in value) {
          const v = value[a].substring(value[a].lastIndexOf(':') + 1)
          html += '<tr><td style="border: 1px solid darkgray">' +
                  value[a].substring(0, value[a].lastIndexOf(':')) +
                  '<td style="border: 1px solid darkgray; color:' +
                  ((v == 'true') ? 'blue' : 'red') + '">' + v + '<td></tr>'
        }
        html += '</table>'
      } else {
        if (isNaN(value[0])) {
          html += '<table>'
          for (const a in value)
            html += '<tr><td style="border: 1px solid darkgray">' +
                    this._presentValue(value[a]) + '<td></tr>'
          html += '</table>'
        } else {
          html += '['
          for (const a in value)
            html += value[a] + ((a < value.length-1) ? ',' : '')
          html += ']'
        }
      }
    } else if (typeof value === 'object') {
      html += '<table>'
      for (const o in value)
        html += '<tr><td>' + o + ':</td>' +
                '<td style="border: 1px solid darkgray">' +
                this._presentValue(value[o]) + '<td></tr>'
      html += '</table>'
    } else if ((typeof value === 'string' || value instanceof String) &&
               (value.endsWith(':false') || value.endsWith(':true'))) {
      const v = value.substring(value.lastIndexOf(':') + 1)
      html = '<table><tr><td style="border: 1px solid darkgray">' +
             value.substring(0, value.lastIndexOf(':')) +
             '</td><td style="border: 1px solid darkgray; color:' +
             ((v == 'true') ? 'blue' : 'red') + '">' + v + '</td>' +
             '<tr></table>'
    } else
      html = ('' + value).replace(/\n/g, '<br>')
    return html
  }
}

(function () {
  ReportManager.i = new ReportManager()
})()
