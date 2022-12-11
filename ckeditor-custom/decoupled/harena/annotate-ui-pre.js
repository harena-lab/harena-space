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
        ['annotateHist', 'History', 'categories', 'history'],
        ['annotatePhys', 'Physical examination', 'categories', 'physical'],
        ['annotateCompl', 'Complementary exams', 'categories', 'exams'],
        ['annotateDiff', 'Differential diagnosis', 'categories', 'differential'],
        ['annotateThera', 'Therapeutic plan', 'categories', 'therapeutic'],
        ['annotateSimple', 'Simple', 'categories', 'simple'],
        ['annotateEncap', 'Encapsulated', 'categories', 'encapsulated'],
        ['annotateJar', 'Jargon', 'categories', 'jargon'],
        ['annotateRight', 'Right', 'categories', 'right'],
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
            const av = []
            const rangev = []
            for (const range of selection.getRanges()) {
              // remove extra spaces
              let content = ''
              for (const i of range.getItems())
                content += i.data
              const min = content.trim()
              const newStart = content.indexOf(min)
              range.start.offset = range.start.offset + newStart
              range.end.offset =
                range.end.offset - (content.length - min.length - newStart)
              rangev.push(range)

              const items = range.getItems()
              let ex = null
              for (const i of items) {
                ex = i.getAttribute(label)
                if (ex == null) {
                  label = 'annot1'
                  ex = i.getAttribute(label)
                }
                if (ex != null) break
              }

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
              av.forEach(ann => {ann.group = 'N' + this._group})
            }

            editor.model.change(writer => {
              let a = 0
              for (const range of rangev) {
                writer.setAttribute(label, av[a], range)
                MessageBus.i.publish('annotation/button/' + annotation)
                a++
              }
            })

            this.editor.editing.view.focus()
        })

        return button;
      })
    }
}
