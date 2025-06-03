import { Plugin, ButtonView } from 'ckeditor5';
import { icons } from '../utils/icons';

export default class HarenaPlugin extends Plugin {
    static get pluginName() {
        return 'HarenaPlugin';
    }

    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('confirmEdit', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Confirm edit',
                icon: icons.check, // Using built-in check icon from icons object
                tooltip: true
            });

            // Callback executed once the button is clicked
            view.on('execute', () => {
                const confirm = editor.config.get('harena.confirm');
                // Safety check for MessageBus availability
                if (typeof MessageBus !== 'undefined' && MessageBus.i) {
                    MessageBus.i.publish(confirm);
                } else {
                    console.warn('MessageBus not available. Confirm action:', confirm);
                }
            });

            return view;
        });

        editor.ui.componentFactory.add('cancelEdit', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Cancel edit',
                icon: icons.cancel, // Using built-in cancel icon from icons object
                tooltip: true
            });

            // Callback executed once the button is clicked
            view.on('execute', () => {
                const cancel = editor.config.get('harena.cancel');
                // Safety check for MessageBus availability
                if (typeof MessageBus !== 'undefined' && MessageBus.i) {
                    MessageBus.i.publish(cancel);
                } else {
                    console.warn('MessageBus not available. Cancel action:', cancel);
                }
            });

            return view;
        });
    }
}
