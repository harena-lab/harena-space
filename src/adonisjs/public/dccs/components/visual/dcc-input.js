/**
 * Base for all input components
 */

class DCCInput extends DCCBlock {
  constructor () {
    super()
    this._changed = false
  }

  connectedCallback () {
    if (this.hasAttribute('variable'))
      this._variable = this.variable
    else
      this._variable = DCC.generateVarName()
    this._statement = (this.hasAttribute('statement'))
      ? this.statement : this.innerHTML

    super.connectedCallback()

    if (this.mandatory) {
      const inputIndication = (this._statement != null)
        ? this._statement
        : this._variable.substring(this._variable.lastIndexOf('.') + 1)

      this._publish('input/mandatory/' + this._variable.replace(/\./g, '/'),
                    inputIndication)
    }
  }

  static get observedAttributes () {
    return DCCBlock.observedAttributes.concat(
      ['statement', 'variable', 'value', 'mandatory'])
  }

  /*
    * HTML Element property handling
    */

  get statement () {
    return this.getAttribute('statement')
  }

  set statement (newValue) {
    this.setAttribute('statement', newValue)
  }

  get variable () {
    return this.getAttribute('variable')
  }

  set variable (newValue) {
    this._variable = newValue
    this.setAttribute('variable', newValue)
  }

  get value () {
    return this.getAttribute('value')
  }

  set value (newValue) {
    this.setAttribute('value', newValue)
  }

  get mandatory () {
    return this.hasAttribute('mandatory')
  }

  set mandatory (isMandatory) {
    if (isMandatory) { this.setAttribute('mandatory', '') } else { this.removeAttribute('mandatory') }
  }

  /*
    * Class property handling
    */

  get changed () {
    return this._changed
  }

  set changed (newValue) {
    this._changed = newValue
  }
}
