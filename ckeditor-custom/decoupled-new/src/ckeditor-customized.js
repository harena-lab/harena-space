// Modern CKEditor 5 customization (v42+)
// Install: npm install ckeditor5

import { DecoupledEditor } from 'ckeditor5';

// Import plugins using the new approach
import {
  Essentials,
  Autoformat,
  Bold,
  Italic,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Table,
  TableToolbar,
  TextTransformation,
  Undo
} from 'ckeditor5';

// Import your custom Harena plugins
import HarenaTablePlugin from './harena/table';
import UploadMediaPlugin from './harena/upload';
import HarenaAnnotatePlugin from './harena/annotate';
import HarenaPlugin from './harena/harena';

// Create a custom DecoupledEditor class
class CustomDecoupledEditor extends DecoupledEditor {
  static builtinPlugins = [
    Essentials,
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
    Undo,
    HarenaTablePlugin,        // Harena customization
    HarenaAnnotatePlugin,     // Harena customization
    HarenaPlugin              // Harena customization
  ];

  static defaultConfig = {
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
}

// Editor configuration (for backward compatibility)
const editorConfig = {
  plugins: [
    Essentials,
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
    Undo,
    HarenaTablePlugin,        // Harena customization
    HarenaAnnotatePlugin,     // Harena customization
    HarenaPlugin              // Harena customization
  ],
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

// Function to create the editor
export async function createDecoupledEditor(element) {
  try {
    const editor = await CustomDecoupledEditor.create(element);
    
    // You need to add the toolbar to the page manually
    // Example: document.querySelector('#toolbar-container').appendChild(editor.ui.view.toolbar.element);
    
    return editor;
  } catch (error) {
    console.error('Error creating editor:', error);
    throw error;
  }
}

// Export the custom editor class as default
export default CustomDecoupledEditor;

// Also export the configuration for backward compatibility
export { editorConfig };

// Usage example:
/*
import CustomDecoupledEditor, { createDecoupledEditor } from './ckeditor-customized.js';

// Method 1: Using the custom class directly
CustomDecoupledEditor.create(document.querySelector('#editor'))
  .then(editor => {
    document.querySelector('#toolbar-container')
      .appendChild(editor.ui.view.toolbar.element);
    console.log('Editor was initialized', editor);
  })
  .catch(error => {
    console.error('Editor initialization failed:', error);
  });

// Method 2: Using the helper function
createDecoupledEditor(document.querySelector('#editor'))
  .then(editor => {
    document.querySelector('#toolbar-container')
      .appendChild(editor.ui.view.toolbar.element);
    console.log('Editor was initialized', editor);
  })
  .catch(error => {
    console.error('Editor initialization failed:', error);
  });
*/
