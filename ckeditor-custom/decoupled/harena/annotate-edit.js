import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class AnnotateEditing extends Plugin {
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

                 return writer.createAttributeElement( 'annot', {
                     title: modelAttributeValue
                 } );
             }
         } );

         conversion.for( 'upcast' ).elementToAttribute( {
             view: {
                 name: 'annot',
                 attributes: [ 'title' ]
             },
             model: {
                 key: 'annotation',
                 value: viewElement => {
                     const title = viewElement.getAttribute( 'title' );
                     return title;
                 }
             }
         } );
     }
}
