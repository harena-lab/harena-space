/**
 * Case Navigator
 *
 * Concentrates routines related to navigation throughout a case.
 * It shows a visual map of knots and enables to visually access and edit them.
 */

class Navigator {
  constructor (translator) {
    this._translator = translator

    this._retracted = true
    this._navigatorSpread = 1
    this._showPreviewMiniature = false

    this.expandClicked = this.expandClicked.bind(this)
    MessageBus.i.subscribe('control/navigator/expand', this.expandClicked)
    this.retractClicked = this.retractClicked.bind(this)
    MessageBus.i.subscribe('control/navigator/retract', this.retractClicked)
  }

  async expandClicked (topic, message) {
    if (this._navigatorSpread == 0) { Panels.s.setupVisibleNavigator() } else {
      Panels.s.setupWideNavigator()
      this._retracted = false
      this._presentTreeCase()
    }
    this._navigatorSpread++
  }

  async retractClicked (topic, message) {
    if (this._navigatorSpread == 1) { Panels.s.setupHiddenNavigator() } else {
      Panels.s.setupRegularNavigator()
      this._retracted = true
      this._presentTreeCase()
    }
    this._navigatorSpread--
  }

  async mountTreeCase (author, knots) {
    const navigationGraph = document.querySelector('#navigation-graph')
    const graph = {
      nodes: [],
      edges: []
    }

    // <TODO> provisory
    const specialKnot = ['note', 'notice', 'notice_wide', 'notice_exam_zoom',
      'expansion', 'master', 'master_top', 'master_bottom']

    const templatesCats = author.templatesCategories

    let current = graph
    const levelStack = []
    let previousKnot = null
    for (const k in knots) {
      // special case for knot as notes
      // <TODO> provisory - not presented
      let draw = true
      if (knots[k].categories != null) {
        for (const c of knots[k].categories) {
          if (specialKnot.includes(c)) { draw = false }
        }
      }

      if (draw) {
        // build nodes of the graph
        const newKnot = {
          id: k,
          label: knots[k].title,
          render: knots[k].render,
          level: knots[k].level
        }

        // attach menus to nodes
        const items = {}
        const templatesNewKnot = {}
        if (knots[k].categories && templatesCats != null) {
          const templateCatIds = Object.keys(templatesCats)
          for (let cat of knots[k].categories) {
            if (templateCatIds.includes(cat)) {
              const templs = templatesCats[cat]
              if (typeof templs === 'string')
                templatesNewKnot[templs.substring(templs.lastIndexOf('/') + 1)] = templs
              else
                for (let tp in templs)
                  templatesNewKnot[tp] = templs[tp]
            }
          }
          for (const tnn in templatesNewKnot) {
            items['add ' + tnn] =
                  {
                    topic: 'control/knot/new',
                    message: { knotid: k, template: templatesNewKnot[tnn] }
                  }
          }
        }
        items['delete ' + newKnot.label] =
            { topic: 'control/knot/remove', message: { knotid: k } }
        items['move up'] = { topic: 'control/knot/up', message: { knotid: k } }
        items['move down'] = { topic: 'control/knot/down', message: { knotid: k } }
        newKnot.menu = items

        // put in the containment hierachy
        if (previousKnot == null || newKnot.level == previousKnot.level) { current.nodes.push(newKnot) } else if (newKnot.level > previousKnot.level) {
          previousKnot.graph = {
            nodes: [newKnot],
            edges: []
          }
          levelStack.push(current)
          current = previousKnot.graph
        } else {
          let newLevel = previousKnot.level
          while (levelStack.length > 0 && newKnot.level <= newLevel) {
            current = levelStack.pop()
            newLevel = current.level
          }
          current.nodes.push(newKnot)
        }

        // build edges of the graph
        // <TODO> adjust flow.next
        for (const c of knots[k].content) {
          if (c.type == 'option' || c.type == 'divert')
            this._insertEdge(current, k, c.contextTarget)
          else if (c.type == 'input' && c.subtype == 'choice' && c.options)
            for (const o in c.options)
              this._insertEdge(current, k, c.options[o].contextTarget)
        }

        previousKnot = newKnot
      }
    }

    navigationGraph.cleanGraph()
    navigationGraph.importGraph(graph)
    navigationGraph.scrollTo(
      navigationGraph.width/2 + GraphLayoutDG.parameters['horizontal-margin'] +
      GraphLayoutDG.parameters['node-width']/2, 0)
  }

  _insertEdge(current, source, contextTarget) {
    let target = contextTarget
    const tl = target.toLowerCase()
    if (Navigator.edgeMap[tl] != null) { target = Navigator.edgeMap[tl] }
    if (!Translator.reservedNavigation.includes(target.toLowerCase())) {
      current.edges.push({
        source: source,
        target: target
      })
    }
  }
}

(function() {
   Navigator.edgeMap = {
     'knot.next': '#next',
     'knot.previous': '#previous',
     'flow.next': '#next'
   }
})();
