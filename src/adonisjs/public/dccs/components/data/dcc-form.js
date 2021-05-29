/**
 * Transforms data from a form in a REST submission
 */

class DCCForm extends DCCVisual {
  connectedCallback () {
    super.connectedCallback()
    this._renderForm()
  }

  _renderForm() {
    this.innerHTML = "<h1>Form Component</h1><BR>" + this._setup.field 
  }
}

(function () {
  DCC.webComponent('dcc-form', DCCForm)
})()
