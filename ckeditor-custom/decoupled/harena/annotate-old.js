import annotateIcon from '@ckeditor/ckeditor5-highlight/theme/icons/marker.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class HarenaAnnotatePlugin extends Plugin {
  init() {
      const editor = this.editor;

      editor.ui.componentFactory.add( 'annotate', locale => {
        const view = new ButtonView(locale);

        view.set( {
          label: 'Annotate',
          icon: annotateIcon,
          tooltip: true
        } );

        // Callback executed once the image is clicked.
        /*
        view.on( 'execute', () => {
          const content = '<figure class="media"><oembed url="' +
            'http://0.0.0.0:10020/resources/artifacts/cases/2b33ddb9-f260-445e-ba5f-f2cf0964ed6a/d5cce0d7-107d-42cf-bc77-f5bd5741b146.mp4' +
            '"></oembed></figure>';
          console.log('=== to insert')
          console.log(content)
          // const content = '<p>A paragraph with <a href="https://ckeditor.com">some link</a>.';
          const viewFragment = editor.data.processor.toView(content);
          const modelFragment = editor.data.toModel(viewFragment);
          editor.model.insertContent(modelFragment,
            editor.model.document.selection);
        } );
        */

        // Callback executed once the media is clicked.
        view.on( 'execute', () => {
          // const url = prompt( 'Media URL to Upload' );

          editor.model.change( writer => {
            // console.log('=== media url')
            // console.log(url)
            //
            // const mediaElement = writer.createElement( 'media', { url } );
            //
            // console.log('=== media element');
            // console.log(mediaElement);
            //
            // // Insert the video in the current selection location.
            // editor.model.insertContent( mediaElement, editor.model.document.selection );

            const images = Array.from(
              writer.createRangeIn(editor.model.document.getRoot()))
                .filter(({type, item}) => type === 'elementStart' &&
                  item.name === 'image')
                .map(el => el.item._attrs.get('src'));
            console.log('=== images')
            console.log(images)
          } );
        } );

        return view;
      } );
  }
}
