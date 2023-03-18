import AnnotateEdit from './annotate-edit';
import AnnotateUI from './annotate-ui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class HarenaAnnotatePlugin extends Plugin {
    static get requires() {
        return [ AnnotateEdit, AnnotateUI ];
    }
}
