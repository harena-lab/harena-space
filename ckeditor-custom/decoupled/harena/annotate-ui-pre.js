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

              let label = 'annot2'
              let ex = selection.getAttribute(label)
              if (ex == null) {
                label = 'annot1'
                ex = selection.getAttribute(label)
              }

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
                  if (complete == ex.range) {
                    ann[field] = ex[field]
                    editor.model.change(writer => {
                      writer.removeAttribute(label, range)
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

              const rangeV = []
              editor.model.change(writer => {
                let a = 0
                for (const range of selection.getRanges()) {
                  writer.setAttribute(label, av[a], range)
                  MessageBus.i.publish('annotation/button/' + annotation)
                  a++
                  rangeV.push({start: range.start, end: range.end})
                }
              })

              this.editor.editing.view.focus()
          })

          return button;
      })
    }
}
