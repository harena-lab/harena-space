/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
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
import CKBox from '@ckeditor/ckeditor5-ckbox/src/ckbox';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
// import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties';  // Harena customization
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import PictureEditing from '@ckeditor/ckeditor5-image/src/pictureediting';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';

// Harena customization - plugins
import HarenaTablePlugin from './harena/table';
import UploadMediaPlugin from './harena/upload';
import HarenaAnnotatePlugin from './harena/annotate';
import HarenaPlugin from './harena/harena';

export default class DecoupledEditor extends DecoupledEditorBase {}

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
	// CKBox,          -- Harena customization
	// CKFinder,       -- Harena customization
	// CloudServices,  -- Harena customization
	// EasyImage,      -- Harena customization
  // Heading,        -- Harena customization
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
  // Indent,       -- Harena customization
	// IndentBlock,  -- Harena customization
  UploadMediaPlugin,  // Harena customization
	Link,
	List,
	// ListProperties,  -- Harena customization
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
  // PictureEditing,  -- Harena customization
	Table,
	TableToolbar,
	TextTransformation,
  HarenaTablePlugin,     // Harena customization
  HarenaAnnotatePlugin,  // Harena customization
  HarenaPlugin           // Harena customization
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
		resizeUnit: 'px',
		styles: [
			'full',
			'alignLeft',
			'alignRight'
		],
		toolbar: [
			// 'imageStyle:inline',   -- Harena customization
			// 'imageStyle:wrapText',
			// 'imageStyle:breakText',
      'imageResize',  // Harena customization
			'|',
			'toggleImageCaption',
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
	// list: {  -- Harena customization
	// 	properties: {
	// 		styles: true,
	// 		startIndex: true,
	// 		reversed: true
	// 	}
	// },
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};
