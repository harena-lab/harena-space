import annotateIcon from '@ckeditor/ckeditor5-highlight/theme/icons/marker.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class AnnotateUI extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add( 'annotate', () => {
            const button = new ButtonView();

            button.label = 'Annotate';
            button.icon = annotateIcon;
            button.tooltip = true;

            this.listenTo( button, 'execute', () => {
                const selection = editor.model.document.selection;
                const title = 'pathophysiology';

                editor.model.change( writer => {
                  for ( const range of editor.model.document.selection.getRanges() ) {
                    writer.setAttribute( 'annotation', title, range );
                  }
                } );
            } );

            return button;
        } );
    }
}
