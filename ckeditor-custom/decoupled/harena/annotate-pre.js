import AnnotateEditPre from './annotate-edit-pre';
import AnnotateUIPre from './annotate-ui-pre';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class HarenaAnnotatePrePlugin extends Plugin {
    static get requires() {
        return [ AnnotateEditPre, AnnotateUIPre ];
    }
}
