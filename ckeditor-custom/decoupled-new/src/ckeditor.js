// Import CKEditor 5 styles
import 'ckeditor5/ckeditor5.css';

// Import CKEditor 5 DecoupledEditor and plugins
import {
  DecoupledEditor,
  AccessibilityHelp,
  Autoformat,
  AutoImage,
  Autosave,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  Heading,
  Highlight,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  SelectAll,
  SimpleUploadAdapter,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersText,
  SpecialCharactersMathematical,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo
} from 'ckeditor5';

// Import your customized editor (which already includes all plugins)
import CustomDecoupledEditor, { createDecoupledEditor, editorConfig } from './ckeditor-customized.js';

// Use the CustomDecoupledEditor as the main class
class CKEditor5Custom extends CustomDecoupledEditor {
  // Inherit everything from CustomDecoupledEditor
  // You can override or extend configuration here if needed
}

// Export the custom editor class and utility functions
export default CKEditor5Custom;

// Also export individual components for flexibility
export {
  DecoupledEditor,
  CustomDecoupledEditor,
  createDecoupledEditor,
  editorConfig
};
