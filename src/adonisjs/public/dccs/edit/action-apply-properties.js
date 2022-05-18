class ApplyPropertiesAction{
  constructor(details, objProperties, panelDetails, editor, buttonType, knotOriginalTitle, typeProfile, itemEdit, item){
    this._details = details
    this._objProperties = objProperties
    this._panelDetails = panelDetails
    this._editor = editor
    this._buttonType = buttonType,
    this._knotOriginalTitle = knotOriginalTitle
    this._typeProfile = typeProfile
    this._originalObjProperties = null
    this._itemEdit = itemEdit
    this._item = item

  }

  async execute(){
    const sufix = (this._details) ? '_d' : '_s'
    const panel = (this._details)
      ? this._panelDetails : this._editor.editorExtended
    if (this._objProperties) {
      this._originalObjProperties = Object.assign({}, this._objProperties);
      const profile = this._typeProfile(this._objProperties)[this._buttonType]
      let seq = 1
      for (const p in profile) {
        if (profile[p].type != 'void') {
          if (!profile[p].composite) {
            if (this._details ||
                (profile[p].visual && profile[p].visual.includes('panel'))) {
              const objProperty =
                        await this._applySingleProperty(profile[p],
                          seq, panel, sufix, this._objProperties[p])
              if (objProperty != null) { this._objProperties[p] = objProperty }
            }
            seq++
          } else {
            for (const s in profile[p].composite) {
              if (this._details || (profile[p].visual &&
                         profile[p].visual.includes('panel'))) {
                const objProperty = await this._applySingleProperty(
                  profile[p].composite[s], seq, panel, sufix,
                  this._objProperties[p])
                if (objProperty != null &&
                            (typeof objProperty !== 'string' ||
                              objProperty.trim().length > 0)) {
                  if (!this._objProperties[p]) { this._objProperties[p] = {} }
                  this._objProperties[p][s] = objProperty
                }
              }
              seq++
            }
          }
        }
      }

      Translator.instance.updateElementMarkdown(this._objProperties)

      if (this._knotOriginalTitle &&
             this._knotOriginalTitle != this._objProperties.title) {
        MessageBus.i.publish('control/knot/rename',
          this._objProperties.title, true)
      }
    }
  }

  undo(){
    Translator.instance.updateElementMarkdown(this._originalObjProperties)

    if (this._knotOriginalTitle &&
           this._knotOriginalTitle != this._objProperties.title) {
      MessageBus.i.publish('control/knot/rename',
        this._knotOriginalTitle, true)
    }

    this.objectProperties = this._originalObjProperties
    this._originalObjProperties = null
  }


 async _applySingleProperty(property, seq, panel, sufix, previous) {
    console.log(property.type)
    let objProperty = null
    console.log('=== property')
    console.log('#pfield' + seq + sufix)
    const field = (panel != null) ?
         panel.querySelector('#pfield' + seq + sufix) : null
    switch (property.type) {
      case 'shortStr' :
      case 'text':
      case 'textField':
      case 'variable':
        if (field == 'variable') {
          console.log('=== variable')
          console.log(field.value)
        }
        if (field != null) {
          const value = field.value.trim()
          if (value.length > 0) { objProperty = value }
        }
        break
      case 'shortStrArray' :
        if (field != null) {
          const catStr = field.value.trim()
          if (catStr.length > 0) {
            const categories = catStr.split(',')
            for (const c in categories) { categories[c] = categories[c].trim() }
            objProperty = categories
          }
        }
        break
      case 'option':
        objProperty = {}
        let i = 0
        for (const item in previous) {
          if (i == this._item) {
            if (this._itemEdit.edit.trim().length > 0) {
              if (field != null)
                previous[item].message = field.value.trim()
              objProperty[this._itemEdit.edit] = previous[item]
            }
          } else { objProperty[item] = previous[item] }
          i++
        }
        break
      case 'propertyValue':
        objProperty = {}
        let sub = 1
        let fp = null
        do {
          fp = panel.querySelector('#pfieldprop' + seq + sufix + '_' + sub)
          if (fp != null) {
            const fv = panel.querySelector('#pfield' + seq + sufix + '_' + sub)
            objProperty[fp.value.trim()] = fv.value.trim()
            sub++
          }
        } while (fp != null)
        break
      case 'select':
        if (field != null)
          objProperty = field.value
        break
      case 'image':
        if (field != null) {
          // uploads the image
          if (field.files[0]) {
            const asset = await
            MessageBus.i.request('data/asset//new',
              {
                file: field.files[0],
                caseid: Basic.service.currentCaseId
              }, null, true)
            objProperty = asset.message.filename
          }
        }
        break
    }
    return objProperty
  }

}
