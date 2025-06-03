import AnnotateEdit from './annotate-edit';
import AnnotateUI from './annotate-ui';

import { Plugin } from 'ckeditor5';

export default class HarenaAnnotatePlugin extends Plugin {
    static get requires() {
        return [ AnnotateEdit, AnnotateUI ];
    }
    
    // Optional: Add plugin name for better debugging
    static get pluginName() {
        return 'HarenaAnnotatePlugin';
    }
}
