/* Monitor DCC
  **********/

class DCCMonitor extends DCCVisual {
  connectedCallback () {
    super.connectedCallback()
    let html =
        '<textarea style="width:97%;font-family:"Courier New", monospace;' +
          'font-size:1em;background-color:gray"' +
          'rows="10" id="presentation-dcc" readonly></textarea>'
    this._messagesPanel = this._shadowHTML(html)
    this._setPresentation(this._messagesPanel)
    this._presentationIsReady()
  }

  notify (topic, message) {
    this._messagesPanel.value =
           this._messagesPanel.value +
           "topic: " + topic + "\n" +
           "message: " + JSON.stringify(message) + "\n\n";  }
  }

(function () {
  customElements.define('dcc-monitor', DCCMonitor)
})()
