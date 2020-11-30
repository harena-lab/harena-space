/* Editor for DCC Images
  **********************/

class EditDCCImage extends EditDCC {
  constructor (obj, dcc, properties) {
    super(dcc, dcc.currentPresentation(), properties)
    this._componentEditor(obj)
  }

  async _componentEditor (obj) {
    obj.image.path = await this._imageUploadPanel()
    this._properties.applyProperties(true)
    // MessageBus.ext.publish('properties/apply/details')
  }
}
