/* RSS DCC
  ********/

class DCCRSS extends DCCBase {
  constructor () {
    super()

    this._items = []
    this._currentItem = 0
  }

  connectedCallback () {
    super.connectedCallback()

    if (!this.hasAttribute('topic')) { this._topic = 'dcc/rss/post' }
    else { this._topic = this.topic }
  }

  /* Properties
      **********/

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['source', 'topic'])
  }

  get source () {
    return this.getAttribute('source')
  }

  set source (newValue) {
    this.setAttribute('source', newValue)
  }

  get topic () {
    return this.getAttribute('topic')
  }

  set topic (newValue) {
    this._topic = newValue
    this.setAttribute('topic', newValue)
  }

  notify (topic, message) {
    if (!topic.includes('/'))
      topic = 'action/' + topic
    switch (topic.toLowerCase()) {
      // case 'action/start': this.start(); break
      // case 'action/stop' : this.stop(); break
      case 'action/next' : this.next(); break
    }
  }

  async next () {
    if (this._items.length == 0) { await this._loadRSS() }
    if (this._currentItem < this._items.length) {
      this._publish(this._topic, this._items[this._currentItem], true)
    }
    this._currentItem++
  }

  async _loadRSS () {
    if (this.hasAttribute('source')) {
      await fetch(this.source)
        .then(response => response.text())
        .then(rss => new window.DOMParser().parseFromString(rss, 'text/xml'))
        .then(data => {
          const items = data.querySelectorAll('item')
          this._items = []
          for (const it of items) {
            let image = null
            let el = 0
            while (image == null && el < DCCRSS.imageEl.length) {
              image = it.querySelector(DCCRSS.imageEl[el])
              el++
            }
            const imageURL =
                     (image == null) ? null
                       : (image.getAttribute('url')) ? image.getAttribute('url')
                         : (image.getAttribute('href')) ? image.getAttribute('href')
                           : null
            const item = {
              title: it.querySelector('title').innerHTML,
              link: it.querySelector('link').innerHTML
            }
            if (imageURL != null) { item.image = imageURL }
            item.value = DCCRSS.template
              .replace('{img}', (imageURL == null) ? ''
                : DCCRSS.imageTemplate.replace('{image}', imageURL))
              .replace('{link}', item.link)
              .replace('{title}', item.title)
            this._items.push(item)
          }
        })
    }
  }
}

(function () {
  customElements.define('dcc-rss', DCCRSS)

  DCCRSS.imageEl = ['image', 'thumbnail']

  DCCRSS.template =
`<article>{img}
   <h3>
      <a href="{link}" target="_blank">{title}</a>
   </h3>
</article>`

  DCCRSS.imageTemplate =
`
   <img width="200px" height="auto" src="{image}" alt="">`
})()
