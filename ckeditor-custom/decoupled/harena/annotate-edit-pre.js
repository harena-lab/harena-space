import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class AnnotateEditPre extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();
    }

    _defineSchema() {
        const schema = this.editor.model.schema;
        schema.extend( '$text', {
            allowAttributes: [ 'annotation' ]
        } );
    }

    _defineConverters() {
         const conversion = this.editor.conversion;

         conversion.for( 'downcast' ).attributeToElement( {
             model: 'annotation',
             view: ( modelAttributeValue, conversionApi ) => {
                 const { writer } = conversionApi;
                 const ann = {}
                 if (modelAttributeValue != null &&
                     modelAttributeValue.categories) {
                   for (const a of modelAttributeValue.categories)
                     ann[a] = ''
                 }

                 return writer.createAttributeElement( 'annotation', ann);
             }
         } );

         conversion.for( 'upcast' ).elementToAttribute( {
             view: {
                 name: 'annotation'
             },
             model: {
                 key: 'annotation',
                 value: viewElement => {
                   const attr = viewElement.getAttributeKeys()
                   const attrArr = (attr == null) ? [] : [...attr]
                   return (attrArr.length > 0) ? {'categories': attrArr} : {}
                 }
             }
         } );
     }
}
