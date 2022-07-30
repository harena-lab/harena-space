/* Chart DCC
  **********/
class DCCChart extends DCCVisual {
  constructor () {
    super()
  }

  connectedCallback () {
    this._min = (this.hasAttribute('min')) ? this.min : DCCChart.defaultValueMin
    this._max = (this.hasAttribute('max')) ? this.max : DCCChart.defaultValueMax
    this._value = (this.hasAttribute('value')) ? this.value : '0%'

    this._width = (this.hasAttribute('width')) ? parseInt(this.width) : 300
    this._height = (this.hasAttribute('height')) ? parseInt(this.height) : 300

    this._plotWidth = this._width - 20
    this._plotHeight = this._height - 20

    const html = DCCChart.svgTemplate
      .replace(/\[width\]/g, this._width)
      .replace(/\[height\]/g, this._height)
      .replace(/\[axis-y\]/g, this._height - 5)
      .replace(/\[axis-length\]/g, this._width - 14)
      .replace(/\[label-x-height\]/g, this._height - 15)

    let presentation = this._shadowHTML(html)
    this._plotArea = presentation.querySelector('#plot-area')
    this._xLabel =
      presentation.querySelector('#x-label').childNodes[0]
    this._yLabel =
      presentation.querySelector('#y-label').childNodes[0]

    this._setPresentation(presentation)
    super.connectedCallback()

    // this._updateChart()

    this._presentationIsReady()
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['value', 'min', 'max', 'index'])
  }

  get value () {
    return this.getAttribute('value')
  }

  set value (newValue) {
    this.setAttribute('value', newValue)
  }

  get min () {
    return this.getAttribute('min')
  }

  set min (newValue) {
    this._min = newValue
    this.setAttribute('min', newValue)
  }

  get max () {
    return this.getAttribute('max')
  }

  set max (newValue) {
    this._max = newValue
    this.setAttribute('max', newValue)
  }

  get index () {
    return this.hasAttribute('index')
  }

  set index (hasIndex) {
    if (hasIndex) { this.setAttribute('index', '') } else { this.removeAttribute('index') }
  }

  notify (topic, message) {
    if (!topic.includes('/'))
      topic = 'action/' + topic
    switch (topic.toLowerCase()) {
      case 'action/update':
        this._value = ((message.value) ? message.value : message)
        this._updateChart(this._value.table)
        break
    }
  }

  _updateChart (table) {
    console.log('=== updating table')
    console.log(table)
    if (table.content) {
      const dots = []
      let minX = parseFloat(table.content[0][0])
      let minY = parseFloat(table.content[0][1])
      let maxX = minX
      let maxY = minY
      for (const d of table.content) {
        const dt = [parseFloat(d[0]), parseFloat(d[1])]
        minX = (dt[0] < minX) ? dt[0] : minX
        minY = (dt[1] < minY) ? dt[1] : minY
        maxX = (dt[0] > maxX) ? dt[0] : maxX
        maxY = (dt[1] > maxY) ? dt[1] : maxY
        dots.push(dt)
      }

      const ratioX = this._plotWidth / (maxX - minX)
      const ratioY = this._plotHeight / (maxY - minY)

      for (const d of dots) {
        console.log(d)
        const dot = document.createElementNS(
          'http://www.w3.org/2000/svg', 'circle')
        dot.setAttribute('cx', (d[0]-minX) * ratioX)
        dot.setAttribute('cy', this._plotHeight - ((d[1]-minY) * ratioY))
        dot.setAttribute('r', 3)
        dot.classList.add('dcc-chart-plot')
        this._plotArea.appendChild(dot)
      }
    }

    if (table.schema) {
      this._xLabel.nodeValue = table.schema[0]
      this._yLabel.nodeValue = table.schema[1]
    }
  }
}

(function () {
  customElements.define('dcc-chart', DCCChart)

  DCCChart.defaultValueMin = 0
  DCCChart.defaultValueMax = 100

  DCCChart.svgTemplate =
`<style>
  .dcc-chart-back {fill: var(--dcc-chart-back);}
  .dcc-chart-axis {stroke: var(--dcc-chart-axis);}
  .dcc-chart-plot {fill: var(--dcc-chart-plot);}
  .dcc-chart-label {fill: var(--dcc-chart-label);}
</style>
<div id="chart-wrapper">
<svg id="presentation-dcc" width="[width]" height="[height]" xmlns="http://www.w3.org/2000/svg">
  <marker id="arrowhead" markerWidth="7" markerHeight="5" refX="0" refY="2.5" orient="auto">
    <polygon points="0 0, 7 2.5, 0 5" />
  </marker>
  <rect class="dcc-chart-back" x="0" y="0" width="100%" height="100%"/>
  <g id="plot-area" class="dcc-chart-back" x="7" y="0" width="100%" height="100%"/>
  <line class="dcc-chart-axis" x1="0" y1="[axis-y]" x2="[axis-length]" y2="[axis-y]"
        stroke-width="2" marker-end="url(#arrowhead)" />
  <line class="dcc-chart-axis" x1="5" y1="100%" x2="5" y2="12"
        stroke-width="2" marker-end="url(#arrowhead)" />
  <text id="y-label" class="dcc-chart-label" dominant-baseline="hanging" x="12" y="0">y</text>
  <text id="x-label" class="dcc-chart-label" dominant-baseline="text-top" text-anchor="end" x="[axis-length]" y="[label-x-height]">x</text>
</svg>
</div>`
})()
