/* Agggregator DCC
  ****************/

class DCCAggregator extends DCCBase {
  constructor () {
    super()

    this._aggregated = []
  }

  connectedCallback () {
    super.connectedCallback()

    if (!this.hasAttribute('topic')) { this._topic = 'dcc/aggregate/post' }
    else { this._topic = this.topic }
    if (this.hasAttribute('quantity')) {
      if (typeof this.quantity === 'number') { this._quantity = this.quantity }
      else { this._quantity = parseInt(this.quantity) }
    } else { this._quantity = 5 }
  }

  /* Properties
      **********/

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['topic', 'quantity'])
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this._topic = newValue
    this.setAttribute('topic', newValue)
  }

  get quantity () {
    return this.getAttribute('quantity')
  }

  set quantity (newValue) {
    this._quantity = newValue
    this.setAttribute('quantity', newValue)
  }

  notify (topic, message) {
    this.addItem(message)
  }

  addItem (content) {
    this._aggregated.push(content)
    if (this._aggregated.length >= this._quantity) { this.publishAggregate() }
  }

  publishAggregate () {
    let html = ''
    for (const item of this._aggregated) {
      html += DCCAggregator.itemTemplate
        .replace('{link}', item.link)
        .replace('{title}', item.title)
    }
    this._aggregated = []
    const message = DCCAggregator.template.replace('{items}', html)
    this._publish(this._topic, message, true)
  }
}

(function () {
  customElements.define('dcc-aggregator', DCCAggregator)

  DCCAggregator.template =
`<ul>
{items}
</ul>`

  DCCAggregator.itemTemplate =
`<li><a href="{link}" target="_blank">{title}</a></li>
`
})()
