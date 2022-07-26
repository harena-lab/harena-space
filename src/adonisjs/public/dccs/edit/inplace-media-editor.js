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
    if (path != null) {
      // <TODO> this will becone an action
      if (path != '_#clear#_') {
        if (obj.image)
          obj.image.path = path
        else
          obj.path = path
      } else {
        if (obj.image)
          obj.image.path = Translator.objTemplates.image.path
        else {
          if (mtype == 'image')
            obj.path = Translator.objTemplates.image.path
          else if (obj.path)
            delete obj.path
        }
      }
      this._properties.applyProperties(true)
    }
  }
}

(function () {
  EditDCCMedia.fileExt = {
    'image': {
      select: Translator.extension.image,
      browse: 'image/png, image/jpeg, image/svg' },
    'media': {
      select: Translator.extension.video.concat(Translator.extension.audio),
      browse: 'audio/mpeg, video/mp4, video/webm'
    }
  }
})()
