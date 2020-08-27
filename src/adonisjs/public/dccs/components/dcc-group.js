/**
 * Group of DCCs
 */

class DCCGroup extends DCCMultiVisual {
  connectedCallback () {
    super.connectedCallback()

    // Fetch all the children that are not defined yet
    const undefinedChildren = this.querySelectorAll(':not(:defined)')

    const promises = [...undefinedChildren].map(element => {
      return customElements.whenDefined(element.localName)
    })

    // Wait for all the options be ready
    Promise.all(promises).then(() => {
      const children = this.querySelectorAll('*')
      for (const c of children) {
        if (c.tagName && c.tagName.toLowerCase().startsWith('dcc-')) { this._storePresentation(c.currentPresentation()) }
      }
      this._presentationIsReady()
    })
  }
}

(function () {
  customElements.define('dcc-group', DCCGroup)
})()
