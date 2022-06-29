class ApplyPropertiesAction{
  constructor(knotId, el, newObjProperties, oldObjProperties = null){
    this._oldObjProperties = oldObjProperties
    this._objProperties = null
    this.el = el
    this._newObjProperties = JSON.parse(JSON.stringify(newObjProperties))
    this.type = 'ApplyProperties'
    this.knotId = knotId
  }

  async execute(knots){
      this._objProperties = knots[this.knotId].content[this.el]
      this._oldObjProperties = JSON.parse(JSON.stringify(this._objProperties))
      knots[this.knotId].content[this.el] = this._newObjProperties
      Translator.instance.updateElementMarkdown(this._newObjProperties)
      await MessageBus.i.request('control/knot/update', null, null, true)
    }


    async undo(knots){
      this._objProperties = knots[this.knotId].content[this.el]
      knots[this.knotId].content[this.el] = this._oldObjProperties
      this._objProperties = knots[this.knotId].content[this.el]
      this._objProperties._modified = true
      await MessageBus.i.request('control/knot/update', null, null, true)
      let element = {
        knotId : this.knotId,
        el: this.el,
        objPropertiesClone: JSON.parse(JSON.stringify(this._objProperties))
      }
      return element
    }

    serialize(action){
      action.type = this.type
      return JSON.stringify(action)
    }

    static deserialize(properties){
      return new ApplyPropertiesAction(properties.knotId, properties.el, properties._newObjProperties, properties._oldObjProperties)
    }

}
