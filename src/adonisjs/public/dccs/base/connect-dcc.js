/* DCC Connector
  **************/

class ConnectDCC extends HTMLElement {
  connectedCallback () {
    if (this.hasAttribute('to') && this.hasAttribute('topic') && this.hasAttribute('role')) {
      this._fromObj = (this.hasAttribute('from'))
        ? document.querySelector('#' + this.from) : this.parentNode
      console.log("=== to connect")
      console.log(this._fromObj)
      this._fromObj.connectTo(this.to, this.topic, this.role)
    }
  }

  /* Properties
      **********/

  static get observedAttributes () {
    return ['from', 'to', 'topic', 'role']
  }

  get from () {
    return this.getAttribute('from')
  }

  set from (newValue) {
    this.setAttribute('from', newValue)
  }

  get to () {
    return this.getAttribute('to')
  }

  set to (newValue) {
    this.setAttribute('to', newValue)
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this.setAttribute('topic', newValue)
  }

  get role () {
    return this.getAttribute('role')
  }

  set role (newValue) {
    this.setAttribute('role', newValue)
  }
}

(function () {
  customElements.define('connect-dcc', ConnectDCC)
})()
