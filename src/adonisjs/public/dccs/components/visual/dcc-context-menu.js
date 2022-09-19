/* Context Menu DCC
  *****************/
class DCCContextMenu {
  constructor (x, y, items) {
    const template = document.createElement('template')
    template.innerHTML = DCCContextMenu.htmlTemplate
      .replace('{css}', DCCVisual.themeStyleResolver('dcc-context-menu.css'))
      .replace('{left}', x)
      .replace('{top}', y)
    this._presentation = document.createElement('div')
    this._presentation.appendChild(template.content.cloneNode(true))
    const content = this._presentation.querySelector('#menu-content')

    this._keyPressed = this._keyPressed.bind(this)
    document.addEventListener('keydown', this._keyPressed)

    for (const i in items) {
      const menuItem = document.createElement('div')
      menuItem.classList.add('dcc-context-menu-item')
      menuItem.innerHTML = i
      const ci = new ContextItem(items[i])
      menuItem.addEventListener('click', ci.sendMessage)
      content.appendChild(menuItem)
    }
  }

  _keyPressed (evt) {
    evt = evt || window.event
    let isEscape = false
    if ("key" in evt)
      isEscape = (evt.key === "Escape" || evt.key === "Esc")
    else
      isEscape = (evt.keyCode === 27)
    if (isEscape)
      DCCContextMenu.close()
  }

  static async display (x, y, menu) {
    if (DCCContextMenu.menu != null) { DCCContextMenu.close() }
    DCCContextMenu.menu = new DCCContextMenu(x, y, menu)
    document.body.appendChild(DCCContextMenu.menu._presentation)
  }

  static async close () {
    if (DCCContextMenu.menu != null) {
      document.removeEventListener('keydown', DCCContextMenu.menu._keyPressed)
      document.body.removeChild(DCCContextMenu.menu._presentation)
      DCCContextMenu.menu = null
    }
  }
}

class ContextItem {
  constructor (topicMessage) {
    this._topicMessage = topicMessage
    this.sendMessage = this.sendMessage.bind(this)
  }

  sendMessage () {
    DCCContextMenu.close()
    // <TODO> Change to contextualized menu
    MessageBus.i.publish(this._topicMessage.topic, this._topicMessage.message, true)
  }
}

(function () {
  DCCContextMenu.htmlTemplate =
`<style>@import "{css}"</style>
<div id="menu-content" class="dcc-context-menu" style="left:{left}px;top:{top}px">
</div>`
  DCCContextMenu.itemTemplate =
'<div class="dcc-context-menu-item">{item}</div>'
})()
