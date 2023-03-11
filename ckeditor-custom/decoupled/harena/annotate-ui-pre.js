import annotateIcon from '@ckeditor/ckeditor5-highlight/theme/icons/marker.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class AnnotateUIPre extends Plugin {
    init() {
      this._group = 0 // controls grouped attributes
      const buttons = [
        ['annotatePatho', 'Pathophysiology', 'pathophysiology'],
        ['annotateEpi', 'Epidemiology', 'epidemiology'],
        ['annotateEti', 'Etiology', 'etiology'],
        ['annotateHist', 'History', 'history'],
        ['annotatePhys', 'Physical examination', 'physical'],
        ['annotateCompl', 'Complementary exams', 'exams'],
        ['annotateDiff', 'Differential diagnosis', 'differential'],
        ['annotateThera', 'Therapeutic plan', 'therapeutic'],
        ['annotateSimple', 'Simple', 'simple'],
        ['annotateEncap', 'Encapsulated', 'encapsulated'],
        ['annotateJar', 'Jargon', 'jargon'],
        ['annotateRight', 'Right', 'right'],
        ['annotateWrong', 'Wrong', 'wrong'],
        ['annotateTypo', 'Typo', 'typo']
      ]
      for (const b of buttons)
        this._buildButton(...b)
    }

    _buildButton(id, label, annotation) {
      const editor = this.editor;
      editor.ui.componentFactory.add( id, () => {
          const button = new ButtonView();

          button.label = label;
          button.tooltip = true;
          button.withText = true;

          this.listenTo(button, 'execute', () => {
            const selection = editor.model.document.selection

            let tag = 'annot2'
            this._group++
            const av = []
            const rangev = []
            for (const range of selection.getRanges()) {
              // adjusr range delimitation (removing extra spaces)
              let content = ''
              for (const i of range.getItems())
                content += i.data
              const min = content.trim()
              const newStart = content.indexOf(min)
              range.start.offset = range.start.offset + newStart
              range.end.offset =
                range.end.offset - (content.length - min.length - newStart)
              rangev.push(range)

              const complete = range.start.path[1] + ',' + min.length

              // find existing annotation
              const items = range.getItems()
              let ex = null
              for (const i of items) {
                ex = i.getAttribute(tag)
                if (ex == null) {
                  tag = 'annot1'
                  ex = i.getAttribute(tag)
                }
                if (ex != null) break
              }

              const ann = {
                range: complete
              }
              ann.categories = []
              // expand the existing annotation (same range) or level it up (different range)
              if (ex != null) {
                if (complete == ex.range) {
                  // initialize with existing categories/groups to a add new ones
                  ann.categories = ex.categories
                  editor.model.change(writer => {
                    writer.removeAttribute(tag, range)
                  })
                } else
                  tag = 'annot2'  // annotation level up for a different overlapping range
              }
              ann.categories.push('N' + this._group + ':' + annotation)
              av.push(ann)
            }

            editor.model.change(writer => {
              let a = 0
              for (const range of rangev) {
                writer.setAttribute(tag, av[a], range)
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
