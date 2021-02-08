/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
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
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

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
	EasyImage,
  // Heading,  -- Harena customization
	Image,
	ImageCaption,
	ImageStyle,
  ImageResize, // Harena customization
	ImageToolbar,
	ImageUpload,
	// Indent,       -- Harena customization
	// IndentBlock,  -- Harena customization
	Link,
	List,
  ListStyle,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
  HarenaTablePlugin, // Harena customization
  HarenaPlugin       // Harena customization
];

// Editor configuration.
DecoupledEditor.defaultConfig = {
	toolbar: {
		items: [
      // 'heading',  -- Harena customization
      // '|',
			// 'fontfamily',
			// 'fontsize',
			// 'fontColor',
			// 'fontBackgroundColor',
			// '|',
			'bold',
			'italic',
      'link',
			// 'underline',  -- Harena customization
			// 'strikethrough',
			// '|',
			// 'alignment',
			// '|',
      'bulletedList',
			'numberedList',
			'|',
			// 'indent',  -- Harena customization
			// 'outdent',
			// '|',
      // 'blockQuote',
			'imageUpload',
			'insertTable',
			'mediaEmbed',
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
			// 'imageStyle:full',        -- Harena customization
			// 'imageStyle:alignRight',  -- Harena customization
			// '|',
      'imageResize', // Harena customization
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
