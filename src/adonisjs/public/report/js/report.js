class ReportManager {
  start () {
    this._report = this._report.bind(this)
    MessageBus.i.subscribe('report/update', this._report)
    this._download = this._download.bind(this)
    MessageBus.i.subscribe('report/download', this._download)
  }

  async _requestLogger () {
    const logger = await MessageBus.i.request('logger/list/get',
      {caseId: new URL(document.location).searchParams.get('id'),
       startingDateTime: new URL(document.location).searchParams.get('start'),
       endingDateTime: new URL(document.location).searchParams.get('end')})
    if (logger.message.error) {
      console.log('--- error')
      console.log(logger.message.error)
      return null
    } else
      return logger
  }

  async _download () {
    const zeroPad = (num) => String(num).padStart(2, '0')

    const logger = await this._requestLogger()

    if (logger != null) {
      const schema = ['Caso_01', 'Caso_02', 'Caso_03', 'Caso_04', 'Caso_05',
                      'Caso_06', 'Caso_07', 'Caso_08', 'Caso_09', 'Caso_10',
                      'Caso_11', 'Caso_12', 'Pergunta_01', 'Pergunta_02']
      let table = '"user id","user","start","date"'
      for (const s of schema)
        table += ',"' + s + '","time","miliseconds"'
      table += '\n'
      for (const l of logger.message.logs) {
        const answers = JSON.parse(l.log)
        const track = this._prepareTrack(answers.knotTrack, answers.varTrack)
        let lastTime = new Date(track.timeStart)
        table += '"' + l.user_id + '","' + l.username + '","' +
                 track.timeStart + '","' +
                 zeroPad(lastTime.getDate()) + '/' +
                 zeroPad(lastTime.getMonth() + 1) + '/' +
                 zeroPad(lastTime.getFullYear()) + '"'
        for (const s of schema) {
          const sh = s + '.hypothesis'
          let time = -1
          if (track[sh] != null) {
            const t = new Date(track[sh])
            time = new Date(t - lastTime)
            lastTime = t
          }
          table += ',"'  + (answers.variables[sh] == null ? ''
                     : answers.variables[sh]) +
                   '","' + (time == -1 ? ''
                     : zeroPad(time.getMinutes()) + ':' +
                       zeroPad(time.getSeconds())) + '","' +
                   ((time == -1) ? '' : time.getTime()) + '"'
        }
        table += '\n'
      }

      const element = document.createElement('a')
      element.setAttribute('href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(table))
      element.setAttribute('download', 'log.csv')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  async _report () {
    const reportArea = document.querySelector('#report-area')
    const logger = await this._requestLogger()

    if (logger != null) {
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
          const track = this._prepareTrack(answers.knotTrack, answers.varTrack)
          html += '<tr><td style="border: 2px solid darkgray">' +
                  logs[c.value].username +
                  '</td><td style="border: 2px solid darkgray">' +
                  track.timeStart + '<br>to<br>' + logs[c.value].created_at +
                  '</td><td style="border: 2px solid darkgray">' +
                  '<table style="border: 2px solid darkgray">' +
                  this._presentVariables(answers.variables, track) +
                  '</table></td></tr>'
        }
      }
      html += '</table>'
      document.querySelector('#report-area').innerHTML = html
    }
  }

  _prepareTrack (knotTrack, varTrack) {
    const track = {timeStart: knotTrack[0].timeStart}
    for (const v of varTrack) {
      const changed = v.changed
      for (const t in v)
        if (t != 'changed' && !track[v[t]])
          track[t] = changed
    }
    return track
  }

  _presentVariables (variables, track) {
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
                  track[v] + '</td>' +
                  '<td style="border: 1px solid darkgray">' +
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
