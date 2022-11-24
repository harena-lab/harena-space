import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class HarenaPlugin extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add( 'confirmEdit', locale => {
      const view = new ButtonView( locale );

      view.set( {
        label: 'Confirm edit',
        icon: checkIcon,
        tooltip: true
      } );

      // Callback executed once the image is clicked.
      view.on( 'execute', () => {
        const confirm = editor.config.get('harena.confirm')
        MessageBus.i.publish(confirm)
      } );

      return view;
    } );

    editor.ui.componentFactory.add( 'cancelEdit', locale => {
      const view = new ButtonView( locale );

      view.set( {
        label: 'Cancel edit',
        icon: cancelIcon,
        tooltip: true
      } );

      // Callback executed once the image is clicked.
      view.on( 'execute', () => {
        const cancel = editor.config.get('harena.cancel')
        MessageBus.i.publish(cancel)
      } );

      return view;
    } );
  }
}
