/* Editor for DCC Images
  **********************/

class EditDCCMedia extends EditDCC {
  constructor (obj, dcc, properties, mtype) {
    super(dcc, dcc.currentPresentation(), properties)
    this._componentEditor(obj, mtype)
  }

  async _componentEditor (obj, mtype) {
    // checks if the image is subordinated to another entity
    const path = await this._mediaUploadPanel(
                          mtype, EditDCCMedia.fileExt[mtype])
    if (path != null && path.length > 0) {
      if (obj.image)
        obj.image.path = path
      else
        obj.path = path
      this._properties.applyProperties(true)
    }
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
