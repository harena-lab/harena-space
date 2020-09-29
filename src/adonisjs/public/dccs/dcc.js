/* DCC Factory
  ************/

class DCC {
  static contentComponent(name, companion, content) {
    DCC.components[companion.toLowerCase() + "." + name.toLowerCase()] = content;
  }

  static component(name, dccClass) {
    customElements.define(name, dccClass)
  }

  static retrieve(name, companion) {
    return DCC.components[companion.toLowerCase() + "." + name.toLowerCase()];
  }

  // <FUTURE>
  /*
  static component(name, companion, content) {
    DCC.components[name] = class extends DCCVisual {
      constructor() {
        super()
        console.log('Element name: ')
        console.log(this.nodeName)
      }
    }

    customElements.define(name, DCC.components[name])
  }
  */
}

(function () {
  DCC.components = {}
})()
