class ApplyPropertiesAction{
  constructor(knotId, el, newObjProperties, oldObjProperties = null, dccId, role, buttonType, presentationId){
    this._oldObjProperties = oldObjProperties
    this._objProperties = null
    this.el = el
    this._newObjProperties = JSON.parse(JSON.stringify(newObjProperties))
    this.type = 'ApplyProperties'
    this.knotId = knotId
    this._dccId = dccId
    this._role = role
    this._buttonType = buttonType
    this._presentationId = presentationId
  }

    async execute(knots){
      this._objProperties = knots[this.knotId].content[this.el]
      this._oldObjProperties = JSON.parse(JSON.stringify(this._objProperties))
      knots[this.knotId].content[this.el] = this._newObjProperties
      Translator.instance.updateElementMarkdown(this._newObjProperties)
      await MessageBus.i.request('control/knot/update', null, null, true)
    }


    async undo(knots){
      knots[this.knotId].content[this.el] = this._oldObjProperties
      this._objProperties = knots[this.knotId].content[this.el]
      this._objProperties._modified = true
      await MessageBus.i.request('control/knot/update', null, null, true)
    }

    selectElement(){
      let topic = 'control/element/' + this._dccId + '/selected'

      let message = {}
      message._selectedByAction = true
      if (this._role != null){
        message.role = this._role
      }
      if (this._buttonType != null){
        message.buttonType = this._buttonType
      }
      if (this._presentationId != null){
        message.presentationId = this._presentationId
      }

      MessageBus.i.publish(topic, message)
    }

    serialize(action){
      action.type = this.type
      return JSON.stringify(action)
    }

    static deserialize(properties){
      return new ApplyPropertiesAction(properties.knotId, properties.el, properties._newObjProperties, properties._oldObjProperties,
                                       properties._dccId,properties._role, properties._buttonType, properties.presentationId)

    }

}
