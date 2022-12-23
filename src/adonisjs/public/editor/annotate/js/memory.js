class AnnotatorMemory {
  async start () {
    await this._loadMemory()
    if (this._memory != null)
      this._updateSummary()
  }

  async _loadMemory () {
    const roomId = (new URL(document.location)).searchParams.get('roomid')
    let questAnn =
      await MessageBus.i.request('quest/annotations/get', {room_id: roomId})

    if (questAnn != null && questAnn.message != null) {
      questAnn = questAnn.message
      const annotations = []
      const ifrag = {}
      for (const c of questAnn) {
        let slot
        if (ifrag[c.fragment])
          slot = ifrag[c.fragment]
        else {
          slot = {
            fragments: [{fragment: c.fragment}],
            categories: [],
            count: []}
          annotations.push(slot)
          ifrag[c.fragment] = slot
        }
        const cat = c.property_id.substring(4)
        slot.categories.push(cat)
        slot.count.push(c.count)
      }
      this._memory = annotations
    }
  }

  _updateSummary () {
    const annotations = this._memory
    let html = '<table>'
    for (const an of annotations) {
      html += '<tr><td><table>'
      for (const f of an.fragments)
        html += '<tr><td>' + f.fragment + '</td></tr>'
      html += '</table></td><td><table>'
      let index = 0
      for (const c of an.categories) {
        html += '<tr><td>' + c + '</td><td>' + an.count[index] + '</td></tr>'
        index++
      }
      html += '</td></tr></table>'
    }
    html += '</table>'
    document.querySelector('#memory-details').innerHTML = html
  }
}

(function () {
  AnnotatorMemory.i = new AnnotatorMemory()
})()
