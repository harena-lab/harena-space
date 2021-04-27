/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import DecoupledEditorBase from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';

// Harena customization
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';

import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
// import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle';  // Harena customization
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';

// Harena customization - table dropdown
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

// Harena customization
import tableColumnIcon from '@ckeditor/ckeditor5-table/theme/icons/table-column.svg';
import tableRowIcon from '@ckeditor/ckeditor5-table/theme/icons/table-row.svg';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

// Harena customization - media upload
import mediaIcon from './upload-media.svg';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';
// import { createImageTypeRegExp } from '@ckeditor/ckeditor5-image/src/imageupload/utils';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import { insertMedia } from '@ckeditor/ckeditor5-media-embed/src/utils';
import { insertImage } from '@ckeditor/ckeditor5-image/src/image/utils';
import Notification from '@ckeditor/ckeditor5-ui/src/notification/notification';

// Harena customization - annotation
import annotateIcon from '@ckeditor/ckeditor5-highlight/theme/icons/marker.svg';

export default class DecoupledEditor extends DecoupledEditorBase {}

// Harena customization
class HarenaTablePlugin extends Plugin {
  init() {
    const editor = this.editor;
    const t = this.editor.t;
    const dropdownTooltip = t('Column');
    const contentLanguageDirection = editor.locale.contentLanguageDirection;
    const isContentLtr = contentLanguageDirection === 'ltr';

    editor.ui.componentFactory.add( 'tableColumnHarena', locale => {
      const options = [
        {
          type: 'button',
          model: {
            commandName: isContentLtr ? 'insertTableColumnRight' : 'insertTableColumnLeft',
            label: t( 'Insert column right' )
          }
        },
        {
          type: 'button',
          model: {
            commandName: 'removeTableColumn',
            label: t( 'Delete column' )
          }
        },
        {
          type: 'button',
          model: {
            commandName: 'selectTableColumn',
            label: t( 'Select column' )
          }
        }
      ];

      return this._prepareDropdown( t( 'Column' ), tableColumnIcon, options, locale );
    } );


    editor.ui.componentFactory.add( 'tableRowHarena', locale => {
      const options = [
        {
          type: 'button',
          model: {
            commandName: 'insertTableRowBelow',
            label: t( 'Insert row below' )
          }
        },
        {
          type: 'button',
          model: {
            commandName: 'removeTableRow',
            label: t( 'Delete row' )
          }
        },
        {
          type: 'button',
          model: {
            commandName: 'selectTableRow',
            label: t( 'Select row' )
          }
        }
      ];

      return this._prepareDropdown( t( 'Row' ), tableRowIcon, options, locale );
    } );
  }

  _prepareDropdown( label, icon, options, locale ) {
    const editor = this.editor;
    const dropdownView = createDropdown( locale );
    const commands = this._fillDropdownWithListOptions( dropdownView, options );

    // Decorate dropdown's button.
    dropdownView.buttonView.set( {
      label,
      icon,
      tooltip: true
    } );

    // Make dropdown button disabled when all options are disabled.
    dropdownView.bind( 'isEnabled' ).toMany( commands, 'isEnabled', ( ...areEnabled ) => {
      return areEnabled.some( isEnabled => isEnabled );
    } );

    this.listenTo( dropdownView, 'execute', evt => {
      editor.execute( evt.source.commandName );
      editor.editing.view.focus();
    } );

    return dropdownView;
  }

  _fillDropdownWithListOptions( dropdownView, options ) {
    const editor = this.editor;
    const commands = [];
    const itemDefinitions = new Collection();

    for ( const option of options ) {
      addListOption( option, editor, commands, itemDefinitions );
    }

    addListToDropdown( dropdownView, itemDefinitions, editor.ui.componentFactory );

    return commands;
  }
}

function addListOption( option, editor, commands, itemDefinitions ) {
  const model = option.model = new Model( option.model );
  const { commandName, bindIsOn } = option.model;

  if ( option.type === 'button' || option.type === 'switchbutton' ) {
    const command = editor.commands.get( commandName );

    commands.push( command );

    model.set( { commandName } );

    model.bind( 'isEnabled' ).to( command );

    if ( bindIsOn ) {
      model.bind( 'isOn' ).to( command, 'value' );
    }
  }

  model.set( {
    withText: true
  } );

  itemDefinitions.add( option );
}

// Harena customization
class UploadMediaPlugin extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add( 'uploadMedia', locale => {
      // const view = new ButtonView( locale );
      const view = new FileDialogButtonView( locale );
      const command = editor.commands.get( 'uploadImage' );
      const mediaTypes = ['audio/mpeg', 'video/mp4', 'video/webm']
      const mediaRE = new RegExp('^' +
        mediaTypes.map(type => type.replace(/\//g, '\\/')).join('|') + '$')
      console.log('=== regular expression')
      console.log(mediaRE)

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
              console.log('=== id uploaded media')
              console.log(loader.id)

              editor.model.change( writer => {
                const mediaElement = writer.createElement(
                  'media', {uploadId: loader.id} );                /*
                const imageElement = writer.createElement(
                  'image', {uploadId: loader.id} );

                editor.model.insertContent(imageElement,
                  editor.model.document.selection );
                */
                console.log('=== triggering read and upload');
                this._readAndUpload(loader, mediaElement);

              })

              this.on( 'uploadComplete', ( evt, { mediaElement, data } ) => {
          			const urls = data.urls ? data.urls : data;

                console.log('=== upload complete, setting attribute to:');
                console.log(urls.default);
          			this.editor.model.change( writer => {
          				writer.setAttribute( 'url', urls.default, mediaElement );
                  editor.model.insertContent(mediaElement,
                    editor.model.document.selection );
          			} );
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

// Harena customization
class HarenaAnnotatePlugin extends Plugin {
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

// Harena customization
class HarenaPlugin extends Plugin {
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
        MessageBus.int.publish(confirm)
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
        MessageBus.int.publish(cancel)
      } );

      return view;
    } );
  }
}

// Plugins to include in the build.
DecoupledEditor.builtinPlugins = [
	Essentials,
  // Alignment,  -- Harena customization
	// FontSize,   -- Harena customization
	// FontFamily, -- Harena customization
	// FontColor,  -- Harena customization
	// FontBackgroundColor,  -- Harena customization
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
  // Strikethrough,  -- Harena customization
	// Underline,      -- Harena customization
  // BlockQuote,     -- Harena customization
	CKFinder,
	CloudServices,
	EasyImage,
  // Heading,  -- Harena customization
	Image,
	ImageCaption,
	ImageStyle,
  ImageResize,  // Harena customization
	ImageToolbar,
	ImageUpload,
  UploadMediaPlugin,  // Harena customization
  // Indent,       -- Harena customization
	// IndentBlock,  -- Harena customization
	Link,
	List,
	// ListStyle,  -- Harena customization
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
  HarenaTablePlugin, // Harena customization
  HarenaAnnotatePlugin,  // Harena customization
  HarenaPlugin       // Harena customization
];

// Editor configuration.
DecoupledEditor.defaultConfig = {
	toolbar: {
		items: [
			// 'heading',    -- Harena customization
			// '|',
			// 'fontfamily',
			// 'fontsize',
			// 'fontColor',
			// 'fontBackgroundColor',
			// '|',
			'bold',
			'italic',
      'link',  // Harena customization (order - after italic)
			// 'underline',  -- Harena customization
			// 'strikethrough',
			// '|',
			// 'alignment',
			// '|',
      'bulletedList',  // Harena customization (order - before numberedList)
			'numberedList',
			'|',
			// 'outdent',  -- Harena customization
			// 'indent',
			// '|',
			// 'blockquote',
			'uploadImage',
      'uploadMedia',  // Harena customization
      'mediaEmbed',  // Harena customization
			'insertTable',
      // 'annotate',    -- Harena customization
			'|',
			'undo',
			'redo',
      '|',           // Harena customization
      'confirmEdit', // Harena customization
      'cancelEdit'   // Harena customization
		]
	},
	image: {
		styles: [
			'full',
			'alignLeft',
			'alignRight'
		],
		toolbar: [
			// 'imageStyle:alignLeft',   -- Harena customization
			// 'imageStyle:full',
			// 'imageStyle:alignRight',
      'imageResize',  // Harena customization
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
      'tableColumnHarena',  // Harena customization
      'tableRowHarena'  // Harena customization
			// 'mergeTableCells'  -- Harena customization
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
