import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class AnnotateEditPre extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();
    }

    _defineSchema() {
        const schema = this.editor.model.schema;
        schema.extend( '$text', {
            allowAttributes: ['annot1', 'annot2']
        } );
    }

    _annotAttributeToElement (modelAttributeValue, conversionApi, tag) {
        // console.log('=== model attribute/value')
        // console.log(modelAttributeValue)
        const { writer } = conversionApi;
        const ann = {}
        if (modelAttributeValue != null) {
          if (modelAttributeValue.categories)
            for (const a of modelAttributeValue.categories)
              ann[a] = ''
          if (modelAttributeValue.range)
            ann.range = modelAttributeValue.range
          if (modelAttributeValue.group)
            ann.group = modelAttributeValue.group
        }

        return writer.createAttributeElement(tag, ann)
    }

    _annotElementToAttribute (viewElement) {
      const attr = viewElement.getAttributeKeys()
      const attrArr = (attr == null) ? [] : [...attr]
      let result = {}
      if (attrArr.length > 0) {
        result = {'categories': attrArr.filter(c => c!='range' && c!='group'),
                  'range': viewElement.getAttribute('range')}
        if (viewElement.getAttribute('group'))
          result['group'] = viewElement.getAttribute('group')
      }
      return result
    }

    _defineConverters() {
      const conversion = this.editor.conversion;

      this._annotAttributeToElement = this._annotAttributeToElement.bind(this)
      this._annotElementToAttribute = this._annotElementToAttribute.bind(this)

      conversion.for('downcast').attributeToElement( {
         model: 'annot1',
         view: (modelAttributeValue, conversionApi) => {
                 return this._annotAttributeToElement
                   (modelAttributeValue, conversionApi, 'annot1') }
      } );

      conversion.for('downcast').attributeToElement( {
         model: 'annot2',
         view: (modelAttributeValue, conversionApi) => {
                 return this._annotAttributeToElement
                   (modelAttributeValue, conversionApi, 'annot2') }
      } );

      conversion.for('upcast').elementToAttribute( {
         view: {
             name: 'annot1'
         },
         model: {
             key: 'annot1',
             value: this._annotElementToAttribute
         }
      } );

      conversion.for('upcast').elementToAttribute( {
         view: {
             name: 'annot2'
         },
         model: {
             key: 'annot2',
             value: this._annotElementToAttribute
         }
      } );
     }
}
