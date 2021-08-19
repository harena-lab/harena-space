/* Editor for DCC Images
  **********************/

class EditDCCMedia extends EditDCC {
  constructor (obj, dcc, properties, mtype) {
    super(dcc, dcc.currentPresentation(), properties)
    this._componentEditor(obj, mtype)
  }

  async _componentEditor (obj, mtype) {
    // checks if the image is subordinated to another entity
    if (obj.image)
      obj.image.path = await this._mediaUploadPanel(
        mtype, EditDCCMedia.fileExt[mtype])
    else
      obj.path = await this._mediaUploadPanel(
        mtype, EditDCCMedia.fileExt[mtype])
    console.log('=== media properties')
    console.log(this._properties)
    this._properties.applyProperties(true)
    // MessageBus.i.publish('properties/apply/details', null, true)
  }


}

(function () {
  EditDCCMedia.fileExt = {
    'image': {
      select: ['png', 'jpg', 'jpeg', 'png'],
      browse: 'image/png, image/jpeg, image/svg' },
    'media': {
      select: ['mpg', 'mpeg', 'mp4', 'webm', 'mp3'],
      browse: 'audio/mpeg, video/mp4, video/webm'
    }
  }
})()
