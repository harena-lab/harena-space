import { Plugin, ButtonView } from 'ckeditor5';
import { icons } from '../utils/icons';

// Note: You may need to import your own icon if the marker icon is not available
// import annotateIcon from './path/to/your/marker-icon.svg';

export default class AnnotateUI extends Plugin {
    static get pluginName() {
        return 'AnnotateUI';
    }

    init() {
        this._group = 0; // controls grouped attributes
        this._lock = false; // controls lock of grouped selections
        this._lockedRanges = {}; // stores locked ranges

        const buttons = [
            ['annotatePatho', 'Pathophysiology', 'pathophysiology'],
            ['annotateEpi', 'Epidemiology', 'epidemiology'],
            ['annotateEti', 'Etiology', 'etiology'],
            ['annotateHist', 'History', 'history'],
            ['annotatePhys', 'Physical examination', 'physical'],
            ['annotateCompl', 'Complementary exams', 'exams'],
            ['annotateDiff', 'Differential diagnosis', 'differential'],
            ['annotateProgn', 'Prognosis', 'prognosis'],
            ['annotateThera', 'Therapeutic plan', 'therapeutic'],
            ['annotateSimple', 'Simple', 'simple'],
            ['annotateEncap', 'Encapsulated', 'encapsulated'],
            ['annotateJar', 'Jargon', 'jargon'],
            ['annotateRight', 'Right', 'right'],
            ['annotateWrong', 'Wrong', 'wrong'],
            ['annotateTypo', 'Typo', 'typo']
        ];

        for (const b of buttons) {
            this._buildButton(...b);
        }

        // Lock button using SwitchButtonView (now available from main ckeditor5 package)
        this.editor.ui.componentFactory.add('annotateLock', () => {
            // Note: SwitchButtonView might need to be imported separately if not available in main package
            // You may need to use ButtonView with state management instead
            const button = new ButtonView();
            button.label = 'Lock';
            button.tooltip = true;
            button.withText = true;
            
            // Manual state management for switch behavior
            button.isOn = false;
            
            this.listenTo(button, 'execute', () => {
                button.isOn = !button.isOn;
                button.class = button.isOn ? 'ck-on' : 'ck-off';
                
                if (button.isOn) {
                    this._lock = true;
                } else {
                    this._lock = false;
                    this._lockedRanges = {};
                }
            });
            
            return button;
        });

        this.editor.ui.componentFactory.add('annotateAdd', () => {
            const button = new ButtonView();
            button.label = '(+)';
            button.tooltip = 'Add';
            button.withText = true;
            
            this.listenTo(button, 'execute', () => {
                // add selection to locked ranges
                const rangev = {...this._lockedRanges};
                AnnotateUI._addMinimizedSelection(
                    rangev, 
                    this.editor.model.document.selection
                );
                this._lockedRanges = rangev;
                AnnotateUI._updateSequence(this._lockedRanges);
            });
            
            return button;
        });

        this.editor.ui.componentFactory.add('annotateRemove', () => {
            const button = new ButtonView();
            button.label = '(-)';
            button.tooltip = 'Remove';
            button.withText = true;
            
            this.listenTo(button, 'execute', () => {
                const rangev = {...this._lockedRanges};
                const keys = Object.keys(rangev);
                if (keys.length > 0) {
                    delete rangev[keys[keys.length - 1]];
                    this._lockedRanges = rangev;
                }
                AnnotateUI._updateSequence(this._lockedRanges);
            });
            
            return button;
        });

        this.editor.ui.componentFactory.add('annotateReset', () => {
            const button = new ButtonView();
            button.label = '(R)';
            button.tooltip = 'Restart';
            button.withText = true;
            
            this.listenTo(button, 'execute', () => {
                this._lockedRanges = {};
                AnnotateUI._updateSequence(this._lockedRanges);
            });
            
            return button;
        });
    }

    _buildButton(id, label, annotation) {
        const editor = this.editor;
        
        editor.ui.componentFactory.add(id, () => {
            const button = new ButtonView();

            button.label = label;
            button.tooltip = true;
            button.withText = true;
            
            // You can set an icon if available
            // button.icon = annotateIcon;

            this.listenTo(button, 'execute', () => {
                let tag = 'annot2';
                let tagLocked = false;
                this._group++;
                const av = [];
                const rangev = {...this._lockedRanges}; // empty if not locked

                AnnotateUI._addMinimizedSelection(
                    rangev, 
                    editor.model.document.selection
                );

                for (const r in rangev) {
                    const range = rangev[r];

                    // find existing annotation
                    const items = range.getItems();
                    let ex = null;
                    for (const i of items) {
                        ex = i.getAttribute(tag);
                        if (ex == null && !tagLocked) {
                            tag = 'annot1';
                            ex = i.getAttribute(tag);
                        }
                        if (ex != null) break;
                    }

                    const ann = {
                        range: r
                    };
                    ann.categories = [];
                    
                    // expand the existing annotation (same range) or level it up (different range)
                    if (ex != null) {
                        if (r == ex.range) {
                            // initialize with existing categories/groups to add new ones
                            ann.categories = ex.categories;
                            editor.model.change(writer => {
                                writer.removeAttribute(tag, range);
                            });
                        } else {
                            tag = 'annot2'; // annotation level up for a different overlapping range
                            tagLocked = true; // maintain tag in level 2 for composite annotations
                        }
                    }
                    ann.categories.push('N' + this._group + ':' + annotation);
                    av.push(ann);
                }

                editor.model.change(writer => {
                    let a = 0;
                    for (const r in rangev) {
                        writer.setAttribute(tag, av[a], rangev[r]);
                        // Note: MessageBus is external - make sure it's available in your environment
                        if (typeof MessageBus !== 'undefined') {
                            MessageBus.i.publish('annotation/button/' + annotation);
                        }
                        a++;
                    }
                });

                if (this._lock) {
                    this._lockedRanges = rangev;
                }

                AnnotateUI._updateSequence(this._lockedRanges);

                this.editor.editing.view.focus();
            });

            return button;
        });
    }

    static _addMinimizedSelection(rangev, selection) {
        for (const range of selection.getRanges()) {
            // adjust range delimitation (removing extra spaces)
            let content = '';
            for (const i of range.getItems()) {
                content += i.data;
            }
            const min = content.trim();
            const newStart = content.indexOf(min);
            range.start.offset = range.start.offset + newStart;
            range.end.offset = range.end.offset - (content.length - min.length - newStart);
            const complete = range.start.path[1] + ',' + min.length;
            rangev[complete] = range;
        }
    }

    static _updateSequence(lockedRanges) {
        // convert locked ranges fragments into a string
        let seq = '';
        let sep = '';
        for (const r in lockedRanges) {
            const range = lockedRanges[r];
            for (const i of range.getItems()) {
                seq += sep + i.data;
                sep = ' + ';
            }
        }
        // Note: MessageBus is external - make sure it's available in your environment
        if (typeof MessageBus !== 'undefined') {
            MessageBus.i.publish('annotation/sequence/update', seq);
        }
    }
}
