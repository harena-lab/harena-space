import DecoupledEditorBase from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

// Harena customization - plugins
import HarenaTablePlugin from './harena/table';
import UploadMediaPlugin from './harena/upload';
import HarenaAnnotatePlugin from './harena/annotate';
import HarenaPlugin from './harena/harena';

export default class DecoupledEditor extends DecoupledEditorBase {}

DecoupledEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
  UploadMediaPlugin,  // Harena customization
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation,
  HarenaTablePlugin,        // Harena customization
  HarenaAnnotatePlugin,     // Harena customization
  HarenaPlugin              // Harena customization
];

// Editor configuration.
DecoupledEditor.defaultConfig = {
	toolbar: {
		items: [
			'bold',
			'italic',
      'link',  // Harena customization (order - after italic)
      'bulletedList',  // Harena customization (order - before numberedList)
			'numberedList',
			'|',
			'uploadImage',
      'uploadMedia',  // Harena customization
      'mediaEmbed',  // Harena customization
			'insertTable',
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
		]
	},
	language: 'en'
};
