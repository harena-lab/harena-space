/* Editor for DCC Texts
  *********************/

/* Extension of the Quill Editor */

const Inline = Quill.import('blots/inline')
const Delta = Quill.import('delta')

class AnnotationBlot extends Inline {
  static create (value) {
    const node = super.create()
    if (value != null) { node.setAttribute('annotation', value) }
    return node
  }

  static formats (node) {
    return node.getAttribute('annotation')
  }
}
AnnotationBlot.blotName = 'annotation'
AnnotationBlot.tagName = 'dcc-annotation'
Quill.register(AnnotationBlot)

class SelectBlot extends Inline {
  static create (value) {
    const node = super.create()
    if (value != null) {
      if (value.variable) { node.setAttribute('variable', value.variable) }
      if (value.answer) { node.setAttribute('answer', value.answer) }
    }
    return node
  }

  static formats (node) {
    const value = {}
    if (node.getAttribute('variable') != null) { value.variable = node.getAttribute('variable') }
    if (node.getAttribute('answer') != null) { value.answer = node.getAttribute('answer') }
    return value
  }
}
SelectBlot.blotName = 'select'
SelectBlot.tagName = 'dcc-state-select'
Quill.register(SelectBlot)

class EditDCCText extends EditDCC {
  constructor (knotContent, el, dcc, svg) {
    console.log('=== knot content')
    console.log(knotContent)
    console.log(el)

    super(dcc, dcc.currentPresentation())
    this._knotContent = knotContent
    this._element = el
    this._handleHighlighter = this._handleHighlighter.bind(this)
    this._handleImageUpload = this._handleImageUpload.bind(this)
    this._handleAnnotation = this._handleAnnotation.bind(this)
    this._handleHlSelect = this._handleHlSelect.bind(this)
    this._handleUndo = this._handleUndo.bind(this)
    this._handleRedo = this._handleRedo.bind(this)
    this._handleConfirm = this._handleConfirm.bind(this)
    this._handleCancel = this._handleCancel.bind(this)
    // this._editElement = element;
    // this._commons = new EditDCC(element);
    this._svgDraw = svg
    this._toolbarControls = EditDCCText.toolbarTemplate +
                              EditDCCText.toolbarTemplateHighlighter +
                              EditDCCText.toolbarTemplateConfirm
    this._buildEditor(false)
    document.querySelector('.ql-editor').focus()
  }

  _buildEditor (selectOptions, oldDelta) {
    Panels.s.lockNonEditPanels()

    /*
      this._editorWrapper = document;
      if (window.parent && window.parent.document) {
         const cont = window.parent.document.querySelector(
            "#inplace-editor-wrapper");
         if (cont != null)
            this._editorWrapper = cont;
      }
      */

    /*
      let elementWrapper = this._editElement;
      console.log("=== elementWrapper");
      console.log(elementWrapper);
      let ew = elementWrapper.parentNode;
      console.log("=== ew");
      console.log(ew);
      while (ew != null && (!ew.id || !ew.id.endsWith("-wrapper")))
         ew = ew.parentNode;
      // otherwise, finds the element outside dccs
      if (ew != null && ew.id && ew.id != "inplace-editor-wrapper")
         elementWrapper = ew;
      else if (elementWrapper.parentNode != null) {
         elementWrapper = elementWrapper.parentNode;
         while (elementWrapper.nodeName.toLowerCase().startsWith("dcc-") &&
                elementWrapper.parentNode != null)
            elementWrapper = elementWrapper.parentNode;
      }
      */

    // this._editorToolbar = this._buildToolbarPanel();
    // this._editorWrapper.appendChild(this._editorToolbar);
    this._buildToolbarPanel(this._toolbarControls)

    this._editor = this._buildEditorPanel()
    this._editorWrapper.appendChild(this._editor)
    this._buildQuillEditor(selectOptions, oldDelta)

    this._editElement.style.display = 'none'

    if (selectOptions) { this._formatSelectOptions() }
  }

  /*
   _buildToolbarPanel() {
      let editorToolbar = document.createElement("div");
      editorToolbar.classList.add("inplace-editor-floating");
      editorToolbar.innerHTML = this._toolbarControls;

      editorToolbar.style.left = this._transformRelativeX(
         this._elementWrapperRect.left - this._containerRect.left);
      editorToolbar.style.bottom = this._transformRelativeY(
         this._containerRect.height -
            (this._elementWrapperRect.top - this._containerRect.top));
      return editorToolbar;
   }
   */

  _buildEditorPanel () {
    const editor = document.createElement('div')
    editor.style.position = 'absolute'
    editor.style.left = this._transformRelativeX(
      this._elementWrapperRect.left - this._containerRect.left)
    editor.style.top = this._transformRelativeY(
      this._elementWrapperRect.top - this._containerRect.top)
    editor.style.width = this._transformRelativeX(this._elementWrapperRect.width)
    editor.style.height =
        this._transformRelativeY(
          (this._elementWrapperRect.height < EditDCCText.minHeight) ? EditDCCText.minHeight : this._elementWrapperRect.height
        )
    if (this._svgDraw) {
      editor.innerHTML =
            EditDCCText.editorTemplate.svg
              .replace('[width]',
                this._transformViewportX(this._elementWrapperRect.width))
              .replace('[height]',
                this._transformViewportY(this._elementWrapperRect.height))
    } else {
      editor.innerHTML =
            EditDCCText.editorTemplate.html
    }
    const inplaceContent = editor.querySelector('#inplace-content')
    const elementStyle = window.getComputedStyle(this._editElement, null)
    const transferFont = ['font-size', 'font-family', 'font-weight']
    for (const tf of transferFont) { inplaceContent.style.setProperty(tf, elementStyle.getPropertyValue(tf)) }

    const par = this._editElement.querySelector('p')
    if (par != null) {
      const transferMargin = ['margin-top', 'margin-right',
        'margin-bottom', 'margin-left']
      const parStyle = window.getComputedStyle(par, null)
      const sty = document.createElement('style')
      let styStr = '#inplace-content p {'
      for (const tm of transferMargin) { styStr += tm + ':' + parStyle.getPropertyValue(tm) + ';' }
      styStr + '}'
      sty.innerHTML = styStr
      document.body.appendChild(sty)
    }

    /*
      inplaceContent.style.fontSize =
         elementStyle.getPropertyValue("font-size");
      inplaceContent.style.fontFamily =
         elementStyle.getPropertyValue("font-family");
      inplaceContent.style.fontWeight =
         elementStyle.getPropertyValue("font-weight");
      */

    return editor
  }

  // builds a Quill editor
  _buildQuillEditor (selectOptions, oldDelta) {
    const inplaceContent = this._editor.querySelector('#inplace-content')
    if (!selectOptions) {
      Translator.instance.authoringRender = false
      let html = Translator.instance.markdownToHTML(
        Translator.instance.objToHTML(this._knotContent[this._element], -1))
      Translator.instance.authoringRender = true
      console.log('=== quill html')
      console.log(html)

      // add a prefix in the ids to avoid conflits with the original
      html = html.replace(/(<[^<]*(?=id)id=['"])([^'"]+['"][^>]*>)/igm,
        '$1ed_$2')

      console.log('=== html')
      console.log(html)
      inplaceContent.innerHTML = html
    }

    this._quill = new Quill(inplaceContent,
      {
        theme: 'snow',
        modules: {
          toolbar: {
            container: this._editorToolbar,
            handlers: {
              image: this._handleImageUpload,
              highlighter: this._handleHighlighter, // <HIGHLIGHTER>
              annotation: this._handleAnnotation,
              'hl-select': this._handleHlSelect,
              undo: this._handleUndo,
              redo: this._handleRedo,
              confirm: this._handleConfirm,
              cancel: this._handleCancel
            }
          }
        }
      })
    if (selectOptions) { this._quill.setContents(oldDelta) }
    this._editor.classList.add('inplace-editor')

    // toolbar customization
    // document.querySelector('.ql-link').innerHTML =
    //      EditDCCText.buttonLinkSVG
    // document.querySelector('.ql-image').innerHTML =
    //      EditDCCText.buttonImageSVG
    document.querySelector('.ql-annotation').innerHTML =
         EditDCCText.buttonAnnotationSVG
    /* <HIGHLIGHTER>
      */
    if (!selectOptions) {
      document.querySelector('.ql-highlighter').innerHTML =
            EditDCCText.buttonHighlightSVG
    }
    document.querySelector('.ql-undo').innerHTML =
         EditDCCText.buttonUndoSVG
    document.querySelector('.ql-redo').innerHTML =
         EditDCCText.buttonRedoSVG
    document.querySelector('.ql-confirm').innerHTML =
         EditDCC.buttonConfirmSVG
    document.querySelector('.ql-cancel').innerHTML =
         EditDCC.buttonCancelSVG
  }

  _formatSelectOptions () {
    // transforms the highlight select options in HTML
    const selectOptions =
         document.querySelectorAll('.ql-hl-select .ql-picker-item')
    const selectItems = Array.prototype.slice.call(selectOptions)
    selectItems.forEach(item => item.textContent = item.dataset.label)

    this._hlSelect = document.querySelector(
      '.ql-hl-select .ql-picker-label')
    this._hlSelectHTML = this._hlSelect.innerHTML
    this._hlSelect.innerHTML =
         "<span style='color:lightgray'>diagnostics</span>" +
         this._hlSelectHTML
  }

  _removeEditor () {
    // this._editorWrapper.removeChild(this._editorToolbar);
    const oldDelta = this._quill.getContents()
    this._removeToolbarPanel()
    this._editorWrapper.removeChild(this._editor)
    return oldDelta
  }

  /*
   _buildAnnotationPanel() {
      let editorAnnotation = document.createElement("div");
      editorAnnotation.classList.add("inplace-editor-floating");
      editorAnnotation.innerHTML = EditDCCText.annotationTemplate;

      const toolbarRect = this._editorToolbar.getBoundingClientRect();
      editorAnnotation.style.left = this._transformRelativeX(
         this._elementWrapperRect.left - this._containerRect.left);
      editorAnnotation.style.bottom = this._transformRelativeY(
         this._containerRect.height -
            (this._elementWrapperRect.top - this._containerRect.top));

      this._buttonAnConfirm = editorAnnotation.querySelector("#an-confirm");
      this._buttonAnCancel  = editorAnnotation.querySelector("#an-cancel");
      this._anContent = editorAnnotation.querySelector("#an-content");

      return editorAnnotation;
   }
   */

  /*
    * Relative positions defined in percent are automatically adjusted with resize
    */

  /*
   _transformRelativeX(x) {
      return (x * 100 / this._containerRect.width) + "%";
   }

   _transformRelativeY(y) {
      return (y * 100 / this._containerRect.height) + "%";
   }
   */

  /*
    * Positions transformed to the viewport size
    */

  /*
   _transformViewportX(x) {
      return (x * Basic.referenceViewport.width / this._containerRect.width);
   }

   _transformViewportY(y) {
      return (y * Basic.referenceViewport.height / this._containerRect.height);
   }
   */

  async _handleImageUpload () {
    const range = this._quill.getSelection()
    const imagePath = await this._imageUploadPanel()
    console.log('=== image uploaded')
    console.log(imagePath)
    this._quill.insertEmbed(
      range.index, 'image', Basic.service.imageResolver(imagePath))
    console.log('=== image resolved')
    console.log(Basic.service.imageResolver(imagePath))
    /*
      const range = this._quill.getSelection();
      let ep = await this._extendedPanel(
            EditDCC.imageBrowseTemplate, "image");
      if (ep.clicked == "confirm" && ep.content.files[0]) {
         const asset = await
            MessageBus.ext.request("data/asset//new",
                 {file: ep.content.files[0],
                  caseid: Basic.service.currentCaseId});
         this._quill.insertEmbed(
            range.index, "image", Basic.service.imageResolver(asset.message));
      }
      this._removeExtendedPanel();
      */
  }

  async _handleAnnotation () {
    const range = this._quill.getSelection()
    const ep =
         await this._extendedPanel(EditDCCText.annotationTemplate, 'annotation')
    if (ep.clicked == 'confirm') {
      this._quill.formatText(range.index, range.length,
        { annotation: ep.content.value })
    }
    this._removeExtendedPanel()
  }

  async _handleHighlighter () {
    const ctxList = Context.instance.listSelectVocabularies()
    this._contextList = EditDCCText.headerTemplate + "<select id='ext-content'>"
    for (const c in ctxList) {
      this._contextList +=
            "<option value='" + ctxList[c][0] + "'>" +
               ctxList[c][1] + '</option>'
    }
    this._contextList += '</select>'
    const ep = await this._extendedPanel(this._contextList, 'annotation')
    if (ep.clicked == 'confirm') {
      const vocabulary = ep.content.value

      /*
         MessageBus.ext.publish("control/element/input/new/unique",
            {type: "input",
             subtype: "group select",
             vocabularies: [vocabulary]});
         */

      const first = await this._loadSelectOptions(vocabulary)
      this._handleHlSelect(first, true)
    }
    this._removeExtendedPanel()
  }

  async _loadSelectOptions (vocabulary) {
    const range = this._quill.getSelection(true)
    const context =
         await Context.instance.loadResource(vocabulary)
    this._highlightOptions = {}
    for (const c in context.states) {
      this._highlightOptions[context.states[c]['@id']] =
            {
              label: c,
              symbol: context.states[c].symbol,
              style: context.states[c].style
            }
    }

    this._toolbarControls = EditDCCText.toolbarTemplate +
                              "<select class='ql-hl-select'>"
    let first = null
    for (const op in this._highlightOptions) {
      if (first == null) first = op
      this._toolbarControls +=
            "<option value='" + op + "'>" +
            this._highlightOptions[op].label + '</option>'
    }
    this._toolbarControls += '</select>' +
                               EditDCCText.toolbarTemplateConfirm
    Panels.s.unlockNonEditPanels()
    const oldDelta = this._removeEditor()
    this._buildEditor(true, oldDelta)
    if (range && range.length > 0) { this._quill.setSelection(range) }
    return first
  }

  _handleHlSelect (hlSelect, maintainSelect) {
    const range = this._quill.getSelection(true)
    this._hlSelect.innerHTML = this._highlightOptions[hlSelect].label +
                                 this._hlSelectHTML
    this._quill.formatText(range.index, range.length, {
      select: { answer: this._highlightOptions[hlSelect].symbol }
    })

    if (!maintainSelect) { this._quill.setSelection(range.index + range.length, 0) }
  }

  /*
   async _handleExtendedPanel(html, imageBrowser) {
      // this._editorAnnotation = this._buildAnnotationPanel();
      this._editorExtended =
         this._buildExtendedPanel(html, (imageBrowser) ? true : false);
      this._editorWrapper.appendChild(this._editorExtended);

      let promise = new Promise((resolve, reject) => {
         const callback = function(button) { resolve(button); };
         if (this._extendedSub.confirm)
            this._extendedSub.confirm.onclick = function(e) {
               callback("confirm");
            };
         else if (this._extendedSub.image) {
            this._extendedSub.image.onchange = function(e) {
               callback("confirm");
            };
         }
         this._extendedSub.cancel.onclick = function(e) {
            callback("cancel");
         };
      });
      let buttonClicked = await promise;
      this._editorWrapper.removeChild(this._editorExtended);
      return buttonClicked;
   }

   _buildExtendedPanel(html, imageBrowser) {
      let editorExtended = document.createElement("div");
      editorExtended.classList.add("inplace-editor-floating");
      editorExtended.innerHTML = html;

      const toolbarRect = this._editorToolbar.getBoundingClientRect();
      editorExtended.style.left = this._transformRelativeX(
         this._elementWrapperRect.left - this._containerRect.left);
      editorExtended.style.bottom = this._transformRelativeY(
         this._containerRect.height -
            (this._elementWrapperRect.top - this._containerRect.top));

      this._extendedSub = {
         cancel:  editorExtended.querySelector("#ext-cancel"),
         content: editorExtended.querySelector("#ext-content")
      };
      if (imageBrowser)
         this._extendedSub.image = editorExtended.querySelector("#ext-content");
      else
         this._extendedSub.confirm = editorExtended.querySelector("#ext-confirm");

      return editorExtended;
   }
   */

  _handleUndo () {
    this._quill.history.undo()
  }

  _handleRedo () {
    this._quill.history.redo()
  }

  async _handleConfirm () {
    Panels.s.unlockNonEditPanels()

    const objSet = await this._translateContent(
      this._quill.getContents(), this._knotContent[this._element].blockquote)

    // removes extra linfeeds
    if (objSet[objSet.length - 1].type == 'linefeed') { objSet.pop() }
    /*
      if (this._element+1 < this._knotContent.length &&
          this._knotContent[this._element+1].type == "linefeed" &&
          objSet[objSet.length-1].type == "linefeed") {
         if (objSet[objSet.length-1].content.length >
             this._knotContent[this._element+1].content.length) {
            this._knotContent[this._element+1]._source =
               objSet[objSet.length-1]._source;
            this._knotContent[this._element+1].content =
               objSet[objSet.length-1].content;
         }
         objSet.pop();
      }
      */

    // redefines the sequence according to the new elements
    const seq = this._knotContent[this._element].seq
    const shift = objSet.length - 1
    for (let s = this._element + 1; s < this._knotContent.length; s++) { this._knotContent[s].seq += shift }

    // removes the previous element and insert the new one
    this._knotContent.splice(this._element, 1)
    for (let o = 0; o < objSet.length; o++) {
      objSet[o].seq = seq + o
      this._knotContent.splice(this._element + o, 0, objSet[o])
    }

    /*
      let obj = objSet[0];
      this._knotContent[this._element].type    = obj.type;
      this._knotContent[this._element]._source = obj._source;
      if (obj.content)
         this._knotContent[this._element].content = obj.content;
      if (obj.natural)
         this._knotContent[this._element].natural = obj.natural;
      if (obj.formal)
         this._knotContent[this._element].formal = obj.formal;

      for (let o = 1; o < objSet.length; o++)
         MessageBus.ext.publish("control/element/insert", objSet[o]);
      */

    MessageBus.ext.publish('control/knot/update')

    this._removeEditor()
  }

  _handleCancel () {
    Panels.s.unlockNonEditPanels()
    MessageBus.ext.publish('control/knot/update')
    this._removeEditor()
  }

  async _translateContent (editContent, blockquote) {
    let content = ''
    console.log('=== content')
    console.log(editContent)
    for (const e in editContent.ops) {
      const ec = editContent.ops[e]
      if (ec.insert) {
        if (typeof ec.insert === 'string') {
          /*
               ec.insert = ec.insert.replace(/\n\n/g, "\n<br>\n").
                           replace(/\n/g, "\n\n");
               */
          let md = ec.insert.replace(/\n/g, '\n\n')
          if (ec.attributes) {
            const attr = ec.attributes
            if (attr.bold) { md = '**' + md + '**' }
            if (attr.italic) { md = '*' + md + '*' }
            if (attr.script == 'sub') { md = '<sub>' + md + '</sub>' }
            if (attr.script == 'sup') { md = '<sup>' + md + '</sup>' }
            if (attr.link) { md = '[' + md + '](' + attr.link + ')' }
            if (attr.annotation || attr.select) {
              md = '{' + md + '}'
              if (attr.annotation && attr.annotation.length > 0) {
                md += '(' + attr.annotation
                  .replace(/\(/, '\(')
                  .replace(/\)/, '\)') + ')'
              }
              if (attr.select && attr.select.answer &&
                         attr.select.answer.length > 0) { md += '/' + attr.select.answer + '/' }
            }
            if (attr.align == 'center') {
              /*
                     if (content.includes("\n")) {
                        const cut = content.lastIndexOf("\n");
                        content = content.substring(0, cut+1) + "<div align='center'>" +
                                  content.substring(cut+1) + "</div>";
                     } else
                        content = "<div align='center'>" + content + "</div>";
                     if (md.endsWith("\n"))
                        md = md.substring(0, md.length-1);
                     */
              content = this._formatPreSegment(
                content, "<div align='center'>", '</div>')
              md = this._formatCurrent(md)
            }
            if (attr.list == 'bullet') {
              content = this._formatPreSegment(content, '* ', '')
              md = this._formatCurrent(md)
            }
          }
          content += md
        } else if (ec.insert.image) {
          let imageURL = ec.insert.image
          if (imageURL.startsWith('data:')) {
            const asset = await
            MessageBus.ext.request('data/asset//new',
              {
                b64: imageURL,
                caseid: Basic.service.currentCaseId
              })
            imageURL = asset.message
          }
          content += '![' +
                  ((ec.attributes && ec.attributes.alt) ? ec.attributes.alt : 'image') + '](' +
                  Basic.service.imageAbsoluteToRelative(imageURL) + ')\n'
        }
      }
    }
    content = content.trimEnd()
    content = content.replace(/[\n]+$/g, '') + '\n'
    console.log('=== html')
    console.log(content)
    const unity = { _source: content }
    Translator.instance._compileUnityMarkdown(unity)
    Translator.instance._compileMerge(unity)
    if (blockquote != null) {
      for (const c of unity.content) {
        c.blockquote = true
        if (c.type == 'text-block') {
          for (const tb of c.content) { tb.blockquote = true }
        }
        Translator.instance.updateElementMarkdown(c)
      }
    }
    console.log('=== unity')
    console.log(unity)
    return unity.content
  }

  _formatPreSegment (content, preform, posform) {
    let formated = content
    if (content.includes('\n')) {
      const cut = content.lastIndexOf('\n')
      formated = content.substring(0, cut + 1) + preform +
                    content.substring(cut + 1) + posform
    } else { formated = preform + content + posform }
    return formated
  }

  _formatCurrent (current) {
    let formated = current
    if (current.endsWith('\n')) { formated = current.substring(0, current.length - 1) }
    return formated
  }
}

(function () {
/* icons from Font Awesome, license: https://fontawesome.com/license */

  EditDCCText.minHeight = 300

  // comment-alt https://fontawesome.com/icons/comment-alt?style=regular
  EditDCCText.buttonAnnotationSVG =
`<svg viewBox="0 0 512 512">
<path fill="currentColor" d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z">
</path></svg>`

  // highlighter https://fontawesome.com/icons/highlighter?style=solid
  EditDCCText.buttonHighlightSVG =
`<svg viewBox="0 0 544 512">
<path fill="currentColor" d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z">
</path></svg>`

  // highlighter https://fontawesome.com/icons/highlighter?style=solid
  EditDCCText.buttonUndoSVG =
`<svg viewBox="0 0 512 512">
<path fill="currentColor" d="M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z">
</path></svg>`

  // highlighter https://fontawesome.com/icons/highlighter?style=solid
  EditDCCText.buttonRedoSVG =
`<svg viewBox="0 0 512 512">
<path fill="currentColor" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z">
</path></svg>`

  EditDCCText.toolbarTemplate =
`<button class="ql-bold"></button>
<button class="ql-italic"></button>
<button class="ql-align" value="center"></button>
<button class="ql-script" value="sub"></button>
<button class="ql-script" value="super"></button>
<button class="ql-link"></button>
<button class="ql-image"></button>
<button class="ql-annotation"></button>`

  EditDCCText.toolbarTemplateHighlighter =
'<button class="ql-highlighter"></button>'
/* <HIGHLIGHTER>
EditDCCText.toolbarTemplateHighlighter = "";
*/

  EditDCCText.toolbarTemplateConfirm =
`<button class="ql-undo"></button>
<button class="ql-redo"></button>
<button class="ql-confirm"></button>
<button class="ql-cancel"></button>`

  EditDCCText.editorTemplate = {
    html:
'<div id="inplace-content"></div>',
    svg:
`<svg viewBox="0 0 [width] [height]">
   <foreignObject width="100%" height="100%">
      <div id="inplace-content"></div>
   </foreignObject>
</svg>`
  }

  EditDCCText.headerTemplate =
`<div class="annotation-bar">Annotation
   <div class="annotation-buttons">
      <div id="ext-confirm" style="width:24px">` +
          EditDCC.buttonConfirmSVG + '</div>' +
'      <div id="ext-cancel" style="width:28px">' +
          EditDCC.buttonCancelSVG + '</div>' +
`   </div>
</div>`

  EditDCCText.annotationTemplate = EditDCCText.headerTemplate +
'<textarea id="ext-content" rows="3" cols="20"></textarea>'

  EditDCCText.metadataStyle = {
    annotation: 'dcc-text-annotation',
    select: 'dcc-state-select-area'
  }
})()
