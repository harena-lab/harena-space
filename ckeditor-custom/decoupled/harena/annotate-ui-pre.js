import annotateIcon from '@ckeditor/ckeditor5-highlight/theme/icons/marker.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class AnnotateUIPre extends Plugin {
    init() {
      this._group = 0 // controls grouped attributes
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
        ['annotateWrong', 'Wrong', 'categories', 'wrong'],
        ['annotateTypo', 'Typo', 'categories', 'typo']
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

          this.listenTo(button, 'execute', () => {
              const selection = editor.model.document.selection

              let label = 'annot1'
              const ex = selection.getAttribute(label)
              // console.log('=== existing annotation')
              // console.log(ex)

              const av = []
              for (const range of selection.getRanges()) {
                const complete = range.start.path[0] + ',' +
                                 range.start.path[1] + ',' +
                                 range.end.path[0] + ',' +
                                 range.end.path[1]
                const ann = {
                  range: complete
                }
                ann[field] = []
                if (ex != null) {
                  if(complete == ex.range) {
                    ann[field] = ex[field]
                    editor.model.change(writer => {
                      writer.removeAttribute('annot1', range)
                    })
                  } else
                    label = 'annot2'
                }
                ann[field].push(annotation)
                av.push(ann)
              }

              if (av.length > 1) {
                this._group++
                av.forEach(ann => {ann.group = this._group})
              }

              editor.model.change(writer => {
                let a = 0
                for (const range of selection.getRanges()) {
                  // console.log('--- annotation range')
                  // console.log(range)
                  writer.setAttribute(label, av[a], range)
                  MessageBus.i.publish('annotation/button/' + annotation)
                  a++
                }
              })
          })

          return button;
      })
    }
}
