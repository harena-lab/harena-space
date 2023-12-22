import { Bus } from '/dccs/lib/oid/oid-full-dev.js'

export class ReportManager {
  start () {
    MessageBus.i.subscribe('table/updated', this._updateCSV.bind(this))
    Bus.i.subscribe('json/loaded', this._updateJSON.bind(this))
    Bus.i.subscribe('report/add', this._addReport.bind(this))
    Bus.i.subscribe('report/download', this._downloadReport.bind(this))

    document.querySelector('#report-track').value = ''
    document.querySelector('#report-state').value = ''
  }

  _updateCSV (topic, message) {
    console.log('===== CSV received')
    console.log(message.table.schema)
    this._schema = message.table.schema
    if (this._schema[0] == 'blocks')
      this._table = '"user id","time","type","value"\n'
    else {
      this._table = '"user id","start","date"'
      for (const s of this._schema)
        this._table += ',"' + s + '","time","miliseconds"'
      this._table += '\n'
    }
    document.querySelector('#report-status').innerHTML = 'Schema loaded'
  }

  _updateJSON(topic, message) {
    console.log('===== JSON received')

    this._id = '[empty]'
    this._track = {}
    this._state = {}
    if (message.value != null) {
      const idRest = message.value.split('[[TRACK]]')
      this._id = idRest[0].trim()
      if (idRest.length > 1) {
        const trackState = idRest[1].split('[[STATE]]')
        this._track = JSON.parse(trackState[0].trim())
        if (trackState.length > 1)
          this._state = JSON.parse(trackState[1].trim())
      }
    }

    document.querySelector('#report-status').innerHTML = 'Tracking loaded'

    document.querySelector('#report-id').innerHTML = this._id
    document.querySelector('#report-track').value = JSON.stringify(this._track, null, 2)
    document.querySelector('#report-state').value = JSON.stringify(this._state, null, 2)
  }

  _addReport () {
    if (this._schema != null && this._table != null && this._track != null) {
      if (this._schema[0] == 'blocks')
        this._addBlocks()
      else
        this._addVariables()
    }

    document.querySelector('#report-status').innerHTML = 'Report added'

    document.querySelector('#report-id').innerHTML = ''
    document.querySelector('#report-track').value = ''
    document.querySelector('#report-state').value = ''
  }

  _addBlocks () {
    const zeroPad = (num) => String(num).padStart(2, '0')

    let table = this._table
    const track = this._prepareTrack(this._track.knotTrack, this._track.varTrack)
    let lastTime = new Date(track.timeStart)
    const head = '"' + this._id + '","'

    for (const v of this._track.varTrack) {
      if (v.blocks || v.talk) {
        table += head + v.changed + '","'
        if (v.blocks) {
          if (v.blocks.value[0] != '{' && v.blocks.value[0] != '[')
            table += 'a","' + v.blocks.value + '"\n'
          else {
            const vblock = v.blocks.value.split('\n')

            let fblock = ''
            for (const b of vblock)
              fblock += JSON.stringify(JSON.parse(b), null, 2) + '\n'

            table += 'b","' + fblock.replace(/"/g, '""') + '"\n'
          }
        } else if (v.talk) {
          table += 't","' + v.talk.value.replace(/"/g, '""').replace(/<br>/g, '\n') + '"\n'
        }
      }
    }

    this._table = table
  }

  _addVariables () {
    const zeroPad = (num) => String(num).padStart(2, '0')

    let table = this._table
    const track = this._prepareTrack(this._track.knotTrack, this._track.varTrack)
    let lastTime = new Date(track.timeStart)
    table += '"' + this._id + '","' +
            track.timeStart + '","' +
            zeroPad(lastTime.getDate()) + '/' +
            zeroPad(lastTime.getMonth() + 1) + '/' +
            zeroPad(lastTime.getFullYear()) + '"'
    for (const s of this._schema) {
      let time = -1
      if (track[s] != null) {
        const t = new Date(track[s])
        time = new Date(t - lastTime)
        lastTime = t
      }

      const variables = this._track.variables
      console.log('=== variable ' + s)
      console.log(variables[s])
      table += ',"'  + 
                (variables[s] == null
                ? ''
                : (typeof variables[s] === 'string' || variables[s] instanceof String)
                  ? variables[s].replace(/"/g, '""')
                  : variables[s]
                ) +
                '","' + (time == -1 ? ''
                  : zeroPad(time.getMinutes()) + ':' +
                    zeroPad(time.getSeconds())) + '","' +
                ((time == -1) ? '' : time.getTime()) + '"'
    }
    this._table = table + '\n'
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

  _downloadReport () {
    if (this._table != null) {
      const element = document.createElement('a')
      element.setAttribute('href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(this._table))
      element.setAttribute('download', 'log.csv')
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }
}

ReportManager.i = new ReportManager()
window.reportManager = ReportManager.i
