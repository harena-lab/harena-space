import mediaIcon from './upload-media.svg';
import { 
  Plugin,
  FileDialogButtonView,
  FileRepository,
  Notification
} from 'ckeditor5';

export default class UploadMediaPlugin extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add( 'uploadMedia', locale => {
      const view = new FileDialogButtonView( locale );
      const command = editor.commands.get( 'uploadImage' );
      const mediaTypes = ['audio/mpeg', 'video/mp4', 'video/webm'];
      const mediaRE = new RegExp('^' +
        mediaTypes.map(type => type.replace(/\//g, '\\/')).join('|') + '$');
      console.log('=== regular expression');
      console.log(mediaRE);

      view.set( {
				acceptedType: mediaTypes.join(','),
				allowMultipleFiles: true
			} );

			view.buttonView.set( {
				label: 'Insert media',
				icon: mediaIcon,
				tooltip: true
			} );

      view.buttonView.bind( 'isEnabled' ).to( command );

      view.on('done', ( evt, files ) => {
				const mediaToUpload = Array.from(files).filter(file => mediaRE.test(file.type));

        console.log('=== uploading media');
        console.log(mediaToUpload);
        if (mediaToUpload.length) {
          const fileRepository = editor.plugins.get( FileRepository );
          for ( const file of mediaToUpload ) {
            let loader = fileRepository.createLoader(file);

      			if (loader) {
              console.log('=== id uploaded media');
              console.log(loader.id);

              editor.model.change( writer => {
                const mediaElement = writer.createElement(
                  'media', {uploadId: loader.id} );

                console.log('=== triggering read and upload');
                this._readAndUpload(loader, mediaElement);

              });

              this.on( 'uploadComplete', ( evt, { mediaElement, data } ) => {
          			const urls = data.urls ? data.urls : data;

                console.log('=== upload complete, setting attribute to:');
                console.log(urls.default);
          			this.editor.model.change( writer => {
          				writer.setAttribute( 'url', urls.default, mediaElement );
                  editor.model.insertContent(mediaElement,
                    editor.model.document.selection );
          			} );

                this.off('uploadComplete');
          		}, { priority: 'low' } );

            }
      		}
				}
			} );

      return view;
    } );
  }

	_readAndUpload( loader, mediaElement ) {
		const editor = this.editor;
		const model = editor.model;
		const t = editor.locale.t;
		const fileRepository = editor.plugins.get( FileRepository );
		const notification = editor.plugins.get( Notification );

		model.enqueueChange( 'transparent', writer => {
			writer.setAttribute( 'uploadStatus', 'reading', mediaElement );
		} );

		return loader.read()
			.then( () => {
				const promise = loader.upload();

				model.enqueueChange( 'transparent', writer => {
					writer.setAttribute( 'uploadStatus', 'uploading', mediaElement );
				} );

				return promise;
			} )
			.then( data => {
				model.enqueueChange( 'transparent', writer => {
					writer.setAttribute( 'uploadStatus', 'complete', mediaElement );

					this.fire( 'uploadComplete', { data, mediaElement } );
				} );

				clean();
			} )
			.catch( error => {
				if ( loader.status !== 'error' && loader.status !== 'aborted' ) {
					throw error;
				}

				if ( loader.status == 'error' && error ) {
					notification.showWarning( error, {
						title: t( 'Upload failed' ),
						namespace: 'upload'
					} );
				}

				clean();

				model.enqueueChange( 'transparent', writer => {
					writer.remove( mediaElement );
				} );
			} );

		function clean() {
			model.enqueueChange( 'transparent', writer => {
				writer.removeAttribute( 'uploadId', mediaElement );
				writer.removeAttribute( 'uploadStatus', mediaElement );
			} );

			fileRepository.destroyLoader( loader );
		}
	}
}
