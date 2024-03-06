class ReportManager {
  start () {
    this._report = this._report.bind(this)
    MessageBus.i.subscribe('report/update', this._report)
    this._download = this._download.bind(this)
    MessageBus.i.subscribe('report/download', this._download)
    MessageBus.i.subscribe('table/updated', this._updateCSV.bind(this))
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

  _updateCSV (topic, message) {
    console.log('===== CSV received')
    console.log(message.table.schema)
    this._schema = message.table.schema
  }

  async _download () {
    const zeroPad = (num) => String(num).padStart(2, '0')

    const logger = await this._requestLogger()

    if (logger != null) {
      const schema = this._schema
      let table = '"user id","user","start","date"'
      for (const s of schema)
        table += ',"' + s + '","time","miliseconds"'
      table += '\n'

      const logSet = this._preprocess(logger.message.logs,
        (new URL(document.location).searchParams.get('aggregate')) == 'true')

      for (const l of logSet) {
        const answers = l.log
        if (answers.varTrack != null) {
          const track = this._prepareTrack(answers.knotTrack, answers.varTrack)
          let lastTime = new Date(track.timeStart)
          table += '"' + l.user_id + '","' + l.username + '","' +
                  track.timeStart + '","' +
                  zeroPad(lastTime.getDate()) + '/' +
                  zeroPad(lastTime.getMonth() + 1) + '/' +
                  zeroPad(lastTime.getFullYear()) + '"'
          for (const s of schema) {
            let time = -1
            if (track[s] != null) {
              const t = new Date(track[s])
              time = new Date(t - lastTime)
              lastTime = t
            }
            console.log('=== variable ' + s)
            console.log(answers.variables[s])
            table += ',"'  + 
                    (answers.variables[s] == null
                      ? ''
                      : (typeof answers.variables[s] === 'string' || answers.variables[s] instanceof String)
                        ? answers.variables[s].replace(/"/g, '""')
                        : answers.variables[s]
                    ) +
                    '","' + (time == -1 ? ''
                      : zeroPad(time.getMinutes()) + ':' +
                        zeroPad(time.getSeconds())) + '","' +
                    ((time == -1) ? '' : time.getTime()) + '"'
          }
          table += '\n'
        }
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

  _preprocess (logs, aggregate) {
    const toAdd = ['knotTrack', 'varTrack']
    const toUpdate = ['variables', 'varUpdated', 'mandatoryFilled']
    const toReplace = ['groupInput', 'caseCompleted']
    const pp = (aggregate) ? [] : logs
    let agg = null
    let l = 0
    let prev = null
    while (l < logs.length) {
      const parsed = JSON.parse(logs[l].log)
      if (!aggregate)
        pp[l].log = parsed
      else {
        if (prev == null || prev != logs[l].instance_id) {
          if (agg != null) {
            console.log('=== agg')
            console.log(agg)
            pp.push(agg)
          }
          agg = logs[l]
          agg.log = {variables: {}}
          prev = logs[l].instance_id
        }
        for (const ta of toAdd) {
          if (parsed[ta] != null) {
            if (agg.log[ta] == null)
              agg.log[ta] = [parsed[ta]]
            else
              agg.log[ta] = agg.log[ta].concat(parsed[ta])
          }
        }
        for (const tu of toUpdate)
          if (parsed[tu] != null) {
            if (agg.log[tu] == null)
              agg.log[tu] = parsed[tu]
            else
              for (const t in parsed[tu])
                agg.log[tu][t] = parsed[tu][t]
          }
        for (const tr of toReplace)
          if (parsed[tr] != null)
            agg.log[tr] = parsed[tr]
        if (parsed['varTrack'] != null) {
          const vt = (Array.isArray(parsed['varTrack'])) ? parsed['varTrack'] : [parsed['varTrack']]
          for (const v of vt) {
            for (const f in Object.keys(v)) {
              if (v[f] != 'changed')
                agg.log.variables[f] = v[f]
            }
          }
        }
      }
      l++
    }
    if (agg != null)
      pp.push(agg)
    console.log('=== pp')
    console.log(pp)
    return pp
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
