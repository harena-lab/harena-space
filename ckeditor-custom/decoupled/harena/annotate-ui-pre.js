import annotateIcon from '@ckeditor/ckeditor5-highlight/theme/icons/marker.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class AnnotateUIPre extends Plugin {
    init() {
      const buttons = [
        ['annotatePatho', 'Pathophysiology', 'categories', 'pathophysiology'],
        ['annotateEpi', 'Epidemiology', 'categories', 'epidemiology'],
        ['annotateEti', 'Etiology', 'categories', 'etiology'],
        ['annotateCli', 'Clinical findings', 'categories', 'clinical'],
        ['annotateLab', 'Laboratory findings', 'categories', 'laboratory'],
        ['annotateDiff', 'Differential diagnosis', 'categories', 'differential'],
        ['annotateThera', 'Therapeutic plan', 'categories', 'therapeutic'],
        ['annotateEncap', 'Encapsulated', 'categories', 'encapsulated'],
        ['annotateJar', 'Jargon', 'categories', 'jargon'],
        ['annotateWrong', 'Wrong', 'categories', 'wrong']
      ]
      for (const b of buttons)
        this._buildButton(...b)
    }

    _buildButton(id, label, field, annotation) {
      const editor = this.editor;
      editor.ui.componentFactory.add( id, () => {
          const button = new ButtonView();

          button.label = label;
          button.tooltip = true;
          button.withText = true;

          this.listenTo( button, 'execute', () => {
              const selection = editor.model.document.selection;

              let ann = selection.getAttribute('annotation')
              console.log('=== existing annotation')
              console.log(ann)
              if (ann == null)
                ann = {}
              else
                editor.model.change(writer => {
                  for ( const range of selection.getRanges() ) {
                      writer.removeAttribute('annotation', range)
                  }
                })

              if (ann[field] == null)
                ann[field] = []
              ann[field].push(annotation)

              editor.model.change(writer => {
                for ( const range of selection.getRanges() ) {
                  writer.setAttribute( 'annotation', ann, range )
                  MessageBus.i.publish('annotation/button/' + annotation)
                }
              })
          })

          return button;
      })
    }
}
