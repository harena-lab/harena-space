/**
 * Artifacts Manager
 *
 * Manages the artifacts.
 */

class Artifacts {
  static start (author) {
    Artifacts.i = new Artifacts(author)
  }

  constructor (author) {
    this._author = author
    this._uploadArtifacts = this._uploadArtifacts.bind(this)
    document.querySelector("#artifacts-select").onchange = this._uploadArtifacts
    this.activateGenerator = this.activateGenerator.bind(this)
    MessageBus.i.subscribe('generator/activate/artifact-knot', this.activateGenerator)
  }

  async _uploadArtifacts () {
    let files = document.querySelector('#artifacts-select').files
    let progSpace = document.querySelector('#progress-artifacts')
    let a = 0
    for (let f of files) {
      let art = document.createElement('div')
      progSpace.appendChild(art)
      a++
      let prMsg = "action/upload/artifact/" + a
      art.innerHTML =
        '<dcc-progress index><subscribe-dcc topic="' + prMsg + '" map="update">' +
        '</subscribe-dcc></dcc-progress>'
      let ref = document.createElement('div')
      progSpace.appendChild(ref)
      ref.innerHTML = f.name
      const artifact = await
        MessageBus.i.request('data/asset//new',
          {
            file: f,
            caseid: Basic.service.currentCaseId,
            progress: prMsg
          }, null, true)
      ref.innerHTML = '<a href="' + artifact.message.url + '" target="_blank">' +
                      f.name + '</a>'
      this._insertArtifactReference(artifact.message.filename, f.name)
    }
    progSpace.innerHTML = ''
    this.showArtifacts()
  }

  _insertArtifactReference (artifactId, artifactName) {
    let compiledCase = this._author.compiledCase

    if (!compiledCase.layers.Data) {
      compiledCase.layers.Data = {
        _source: '',
        content: []
      }
    }

    const content = compiledCase.layers.Data.content
    let artifacts = null
    for (let c of content)
      if (c.type == 'field' && c.field == 'artifacts')
        artifacts = c

    if (artifacts == null) {
      artifacts = {
        _source: '',
        type: 'field',
        field: 'artifacts',
        value: {}
      }
      artifacts.seq = (content.length == 0) ? 1 : content[content.length - 1].seq + 1
      content.push(artifacts)
      compiledCase.artifacts = artifacts.value
      Properties.s.artifacts = compiledCase.artifacts
    }

    artifacts.value[artifactId] = artifactName
    Translator.instance.updateElementMarkdown(artifacts)
    compiledCase.layers.Data._source =
      '\n' + Translator.instance.contentToMarkdown(content)
  }

  showArtifacts () {
    if (this._author.compiledCase.artifacts) {
      const artifacts = this._author.compiledCase.artifacts
      let artHTML = ''
      for (let a in artifacts)
        artHTML += '<div><a href="' + Basic.service.imageResolver(a) +
                   '" target="_blank">' +
                   artifacts[a] + '</a></div>'
      document.querySelector('#case-artifacts').innerHTML = artHTML
    }
  }

  activateGenerator () {
    const compiled = this._author.compiledCase
    if (compiled.generators && compiled.generators['artifact-knot'] != null &&
        compiled.artifacts) {
      document.querySelector('#artifact-controls').style.display = 'none'
      ArtifactKnotGenerator.activate(
        compiled.artifacts, compiled.generators['artifact-knot'],
          document.querySelector('#case-artifacts'))
    }
  }
}
