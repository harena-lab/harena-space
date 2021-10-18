/**
 * Generator: Artifacts Knot Placement
 */

class ArtifactKnotGenerator {
  static activate (artifacts, candidates, html) {
    ArtifactKnotGenerator.i = new ArtifactKnotGenerator(artifacts, candidates, html)
  }

  constructor (artifacts, candidates, html) {
    MessageBus.i.publish('control/elements/wide')

    this._prepareSubgroup = this._prepareSubgroup.bind(this)

    this._insertArtifacts = this._insertArtifacts.bind(this)
    MessageBus.i.subscribe('generator/insert/artifact-knot', this._insertArtifacts)

    this._artifacts = artifacts
    this._candidates = candidates
    this._htmlSpace = html

    const videoExt = ['']
    let artHTML = '<div style="width:100%;overflow:scrool"><table>'
    for (let a in artifacts) {
      artHTML += '<tr><td>'
      if (Translator.instance.classifyArtifactType(a) != 'image')
        artHTML += '<video controls style="max-width:200px;height:auto"><source src="' +
                   Basic.service.imageResolver(a) + '"></video>'
      else
        artHTML += '<img style="max-width:200px;height:auto" src="' + Basic.service.imageResolver(a) + '>'
      artHTML += '</td><td><a href="' + Basic.service.imageResolver(a) +
                 '" target="_blank">' +
                 artifacts[a] + '</a></td>'
      const id = a.replace(/[.-]/g, '_')
      artHTML += '<td><select name="g_' + id + '" id="g_' + id + '">' +
                 '<option value="_empty_" selected></option>'
      for (let c in candidates)
         artHTML += '<option value="' + c + '">' + candidates[c].description + '</option>'
      artHTML += '</select></td>'
      artHTML += '<td><select name="s_' + id + '" id="s_' + id + '">' +
                 '<option value="_empty_" selected></option></select></td></tr>'
    }

    artHTML += '</table>' +
               '<dcc-button xstyle="in" topic="generator/insert/artifact-knot"' +
               ' label="INSERT"></dcc-button></div>'

    html.innerHTML = artHTML
    for (let a in artifacts)
      html.querySelector('#g_' + a.replace(/[.-]/g, '_'))
          .addEventListener('change', this._prepareSubgroup)
  }

  _prepareSubgroup (event) {
    let select = this._htmlSpace
      .querySelector('#s_' + event.target.id.substring(2))
    select.innerHTML = ''
    const sub = this._candidates[event.target.value]
    for (let s in sub) {
      let option = document.createElement('option')
      if (s == 'description') {
        option.setAttribute('value', '_empty_')
        option.setAttribute('selected', true)
        option.innerHTML = ''
      } else if (s != 'template') {
        option.setAttribute('value', s)
        option.innerHTML = sub[s]
      }
      select.appendChild(option)
    }
  }

  async _insertArtifacts () {
    let templateHistory = {}
    for (let a in this._artifacts) {
      const id = a.replace(/[.-]/g, '_')
      console.log('=== artifact build')
      console.log(id)
      const knot = this._htmlSpace.querySelector('#g_' + id)
      const sub = this._htmlSpace.querySelector('#s_' + id)
      if (knot.value != '_empty_' && sub.value != '_empty_') {
        const template = this._candidates[knot.value].template
        let status = true
        if (!templateHistory[template])
          status = await MessageBus.i.request('edit/knot/check-create',
            {target: '',
             before: true,
             template: template,
             knotId: knot.value}
          )
        if (status) {
          templateHistory[template] = true
          MessageBus.i.publish('edit/artifact/insert',
            {knot: knot.value,
             target: sub.value,
             artifact: a,
             includeMissing: true}
          )
        }
      }
    }
    MessageBus.i.publish('control/case/refresh')
    MessageBus.i.publish('control/elements/retract')
    MessageBus.i.publish('generator/finished/artifact-knot')
  }
}
