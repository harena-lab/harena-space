// Icons helper for CKEditor 5 v42+
// Since 'icons' is not exported from the unified package, we need to import them individually

// Common CKEditor icons - adjust paths based on what you actually need
import bold from '@ckeditor/ckeditor5-icons/theme/icons/bold.svg';
import italic from '@ckeditor/ckeditor5-icons/theme/icons/italic.svg';
import link from '@ckeditor/ckeditor5-icons/theme/icons/link.svg';
import unlink from '@ckeditor/ckeditor5-icons/theme/icons/unlink.svg';
import image from '@ckeditor/ckeditor5-icons/theme/icons/image.svg';
import media from '@ckeditor/ckeditor5-icons/theme/icons/media.svg';
import table from '@ckeditor/ckeditor5-icons/theme/icons/table.svg';
import undo from '@ckeditor/ckeditor5-icons/theme/icons/undo.svg';
import redo from '@ckeditor/ckeditor5-icons/theme/icons/redo.svg';
import bulletedList from '@ckeditor/ckeditor5-icons/theme/icons/bulleted-list.svg';
import numberedList from '@ckeditor/ckeditor5-icons/theme/icons/numbered-list.svg';
import paragraph from '@ckeditor/ckeditor5-icons/theme/icons/paragraph.svg';
import heading1 from '@ckeditor/ckeditor5-icons/theme/icons/heading1.svg';
import heading2 from '@ckeditor/ckeditor5-icons/theme/icons/heading2.svg';
import heading3 from '@ckeditor/ckeditor5-icons/theme/icons/heading3.svg';
import quote from '@ckeditor/ckeditor5-icons/theme/icons/quote.svg';
import code from '@ckeditor/ckeditor5-icons/theme/icons/code.svg';

// Export an icons object similar to the old API
export const icons = {
    bold,
    italic,
    link,
    unlink,
    image,
    media,
    table,
    undo,
    redo,
    bulletedList,
    numberedList,
    paragraph,
    heading1,
    heading2,
    heading3,
    quote,
    code
};

// Export individual icons for direct import
export {
    bold,
    italic,
    link,
    unlink,
    image,
    media,
    table,
    undo,
    redo,
    bulletedList,
    numberedList,
    paragraph,
    heading1,
    heading2,
    heading3,
    quote,
    code
};

export default icons;
