/* Timer DCC
  **********/

class DCCTimer extends DCCBase {
  constructor () {
    super()
    // this.notify = this.notify.bind(this);
    this.next = this.next.bind(this)

    this.reset()
  }

  connectedCallback () {
    super.connectedCallback()

    if (!this.hasAttribute('cycles')) { this._cycles = 10 }
    else { this._cycles = this.cycles }

    if (!this.hasAttribute('interval')) { this._interval = 100 }
    else { this._interval = this.interval }

    if (!this.hasAttribute('topic')) { this._topic = 'dcc/timer/cycle' }
    else { this._topic = this.topic }

    if (this.autostart)
      this.start()
  }

  /* Properties
      **********/

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['cycles', 'interval', 'topic', 'autostart'])
  }

  get cycles () {
    return this.getAttribute('cycles')
  }

  set cycles (newValue) {
    this._cycles = newValue
    this.setAttribute('cycles', newValue)
  }

  get currentCycle () {
    return this._currentCycle
  }

  get interval () {
    return this.getAttribute('interval')
  }

  set interval (newValue) {
    this._interval = this.interval
    this.setAttribute('interval', newValue)
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this._topic = newValue
    this.setAttribute('topic', newValue)
  }

  get autostart () {
    return this.hasAttribute('autostart')
  }

  set autostart (isAutostart) {
    if (isAutostart) { this.setAttribute('autostart', '') }
    else { this.removeAttribute('autostart') }
  }

  notify (topic, message) {
    if (!topic.includes('/'))
      topic = 'action/' + topic
    switch (topic.toLowerCase()) {
      case 'action/reset': this.reset(); break
      case 'action/start': this.start(); break
      case 'action/stop' : this.stop(); break
      case 'action/step' : this.step(); break
      case 'action/interval': this._interval = message.value; break
    }
  }

  reset () {
    this._currentCycle = 0
  }

  async start () {
    if (this._timeout == null) {
      this._timeout = setTimeout(this.next, this._interval)
      await this.multiRequest('begin', this._currentCycle)
    }
  }

  async next () {
    this.step()
    if (this._currentCycle < this._cycles) {
      this._timeout = setTimeout(this.next, this._interval)
    } else {
      await this.multiRequest('end', this._currentCycle)
    }
  }

  async step () {
    this._currentCycle++
    if (this._currentCycle <= this._cycles) {
      this._publish(this._topic, this._currentCycle, true)
      await this.multiRequest('cycle', this._currentCycle)
    }
  }

  stop () {
    if (this._timeout) {
      clearTimeout(this._timeout)
      this._timeout = null
    }
  }
}

(function () {
  customElements.define('dcc-timer', DCCTimer)
})()
