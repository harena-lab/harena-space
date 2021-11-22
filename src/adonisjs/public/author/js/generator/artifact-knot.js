/**
 * Generator: Artifacts Knot Placement
 */

class ArtifactKnotGenerator {
  static activate (artifacts, candidates, html) {
    if (ArtifactKnotGenerator.i == null)
      ArtifactKnotGenerator.i = new ArtifactKnotGenerator()

    ArtifactKnotGenerator.i.buildGenerator(artifacts, candidates, html)
  }

  buildGenerator (artifacts, candidates, html) {
    MessageBus.i.publish('control/elements/wide')

    this._prepareSubgroup = this._prepareSubgroup.bind(this)

    this._insertArtifacts = this._insertArtifacts.bind(this)
    MessageBus.i.subscribe('generator/insert/artifact-knot',
                           this._insertArtifacts)

    this._artifacts = artifacts
    this._candidates = candidates
    this._htmlSpace = html
    console.log('=== candidates')
    console.log(this._candidates)

    const videoExt = ['']
    let artHTML = '<div style="width:100%;overflow:scrool"><table>'
    for (let a in artifacts) {
      artHTML += '<tr><td>'
      if (Translator.instance.classifyArtifactType(a) != 'image')
        artHTML += '<video controls style="max-width:200px;height:auto"><source src="' +
                   Basic.service.imageResolver(a) + '"></video>'
      else
        artHTML += '<img style="max-width:200px;height:auto" src="' + Basic.service.imageResolver(a) + '">'
      artHTML += '<br><a href="' + Basic.service.imageResolver(a) +
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
    const sub = this._candidates[event.target.value].contexts
    if (sub != null) {
      let option = document.createElement('option')
      option.setAttribute('value', '_empty_')
      option.setAttribute('selected', true)
      option.innerHTML = ''
      select.appendChild(option)
      for (let s in sub) {
        option = document.createElement('option')
        if (s != 'template') {
          option.setAttribute('value', s)
          option.innerHTML = sub[s]
        }
        select.appendChild(option)
      }
    }
  }

  async _insertArtifacts () {
    let templateHistory = {}
    const knotsU = {}
    // sort the answers according to the template
    for (let a in this._artifacts) {
      const id = a.replace(/[.-]/g, '_')
      const knot = this._htmlSpace.querySelector('#g_' + id)
      const sub = this._htmlSpace.querySelector('#s_' + id)
      if (knot.value != '_empty_' && sub.value != '_empty_') {
        if (!knotsU[knot.value])
          knotsU[knot.value] = {}
        if (!knotsU[knot.value][sub.value])
          knotsU[knot.value][sub.value] = []
        knotsU[knot.value][sub.value].push(a)
      }
    }
    for (const c in this._candidates) {
      if (knotsU[c]) {
        const candidate = this._candidates[c]
        let status = true
        if (!templateHistory[candidate.template])
          status = await MessageBus.i.request('modify/knot/update',
            {target: '',
             before: true,
             template: candidate.template,
             knotId: c}
          )
        if (status) {
          templateHistory[candidate.template] = true
          for (const s in this._candidates[c].contexts) {
            if (knotsU[c][s])
              for (const ss of knotsU[c][s])
              {
                MessageBus.i.publish('modify/artifact/insert',
                  {knot: c,
                   target: s,
                   artifact: ss,
                   includeMany:
                      (candidate['include-many'] != null &&
                       (candidate['include-many'] == '*' ||
                        candidate['include-many'] == s))
                      ? true : false,
                   includeMissing: (candidate['include-missing']) ? true : false,
                   includeTitle:
                     (candidate['include-title'])
                       ? candidate.contexts[s] : null}
                )
              }
          }
        }
      }
    }
    MessageBus.i.unsubscribe('generator/insert/artifact-knot',
                             this._insertArtifacts)

    MessageBus.i.publish('control/case/refresh')
    MessageBus.i.publish('control/elements/retract')
    MessageBus.i.publish('generator/finished/artifact-knot')
  }
}
