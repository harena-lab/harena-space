/* Editor for DCC Texts
  *********************/

/* Extension of the Quill Editor */

let Inline = Quill.import('blots/inline');

class MetadataBlot extends Inline {
   static create(value) {
      let node = super.create();
      node.setAttribute("value", value);
      node.classList.add("dcc-state-select-" + value + "-template");
      return node;
   }

   static formats(node) {
      return node.getAttribute("value");
   }
}
MetadataBlot.blotName = "metadata";
MetadataBlot.tagName = "span";
Quill.register(MetadataBlot);

class EditDCCText {
   constructor(element) {
      // builds the toolbar and editor panels
      let container = document;
      if (window.parent && window.parent.document) {
         const cont = window.parent.document.querySelector("#inplace-editor-wrapper");
         if (cont != null)
            container = cont;
      }
      this._containerRect = container.getBoundingClientRect();
      this._elementRect = element.getBoundingClientRect();

      const editorToolbar = this._buildToolbarPanel();
      container.appendChild(editorToolbar);

      const editor = this._buildEditorPanel(element);
      container.appendChild(editor);

      this._buildEditor(element, editor, editorToolbar);

      this._loadSelectOptions();
   }

   _buildToolbarPanel() {
      let editorToolbar = document.createElement("div");
      editorToolbar.classList.add("inplace-editor-toolbar");
      editorToolbar.innerHTML = EditDCCText.toolbarTemplate;

      editorToolbar.style.left = this._transformRelativeX(
         this._elementRect.left - this._containerRect.left);
      editorToolbar.style.bottom = this._transformRelativeY(
         this._containerRect.height - (this._elementRect.top - this._containerRect.top));
      return editorToolbar;
   }

   _buildEditorPanel(element) {
      let editor = document.createElement("div");
      editor.style.position = "absolute";
      editor.style.left = this._transformRelativeX(
         this._elementRect.left - this._containerRect.left);
      editor.style.top = this._transformRelativeY(
         this._elementRect.top - this._containerRect.top);
      editor.style.width = this._transformRelativeX(this._elementRect.width);
      editor.style.height = this._transformRelativeY(this._elementRect.height);
      editor.style.fontSize =
         window.getComputedStyle(element, null).getPropertyValue("font-size");
      return editor;
   }


   // builds a Quill editor
   _buildEditor(element, editor, editorToolbar) {
      editor.innerHTML =
         EditDCCText.editorTemplate
            .replace("[width]", this._transformViewportX(this._elementRect.width))
            .replace("[height]", this._transformViewportY(this._elementRect.height))
            .replace("[content]", element.innerHTML);
      let inplaceContent = editor.querySelector("#inplace-content");

      this._handleHighlighter = this._handleHighlighter.bind(this);
      this._handleComment = this._handleComment.bind(this);
      this._handleContribution = this._handleContribution.bind(this);
      this._quill = new Quill(inplaceContent, 
         {theme: "snow",
          modules: {
             toolbar: {
               container: editorToolbar,
               handlers: {
                  "highlighter" : this._handleHighlighter,
                  "comment"     : this._handleComment,
                  "contribution": this._handleContribution
               }
             }
          }
         });
      editor.classList.add("inplace-editor");

      document.querySelector(".ql-comment").innerHTML =
         EditDCCText.buttonCommentSVG;
      document.querySelector(".ql-highlighter").innerHTML =
         EditDCCText.buttonHighlightSVG;
   }

   _loadSelectOptions() {
      // transforms the contribution options in HTML
      const selectOptions =
         document.querySelectorAll(".ql-contribution .ql-picker-item");
      const selectItems = Array.prototype.slice.call(selectOptions);
      selectItems.forEach(item => item.textContent = item.dataset.value);

      this._contributionSelect = document.querySelector(
         ".ql-contribution .ql-picker-label");
      this._contributionSelectHTML = this._contributionSelect.innerHTML;
      this._contributionSelect.innerHTML =
         "<span style='color:lightgray'>diagnostics</span>" +
         this._contributionSelectHTML;
   }

   /*
    * Relative positions defined in percent are automatically adjusted with resize
    */

   _transformRelativeX(x) {
      return (x * 100 / this._containerRect.width) + "%";
   }

   _transformRelativeY(y) {
      return (y * 100 / this._containerRect.height) + "%";
   }

   /*
    * Positions transformed to the viewport size
    */

   _transformViewportX(x) {
      return (x * Basic.referenceViewport.width / this._containerRect.width);
   }

   _transformViewportY(y) {
      return (y * Basic.referenceViewport.height / this._containerRect.height);
   }

   _handleContribution(contribution) {
      this._contributionSelect.innerHTML = contribution + this._contributionSelectHTML;
      const range = this._quill.getSelection();
      this._quill.formatText(range.index, range.length, {
         metadata: contribution
      });
   }

   _handleComment() {
      const range = this._quill.getSelection();
      this._quill.formatText(range.index, range.length, {
         metadata: "comment"
      });
   }

   _handleHighlighter() {
      const range = this._quill.getSelection();
      this._quill.formatText(range.index, range.length, {
         metadata: "highlight"
      });
   }
}

(function() {
EditDCCText.toolbarTemplate =
`<select class="ql-contribution">
   <option value="key"></option>
   <option value="contributes"></option>
   <option value="indiferent"></option>
   <option value="against"></option>
</select>
<button class="ql-bold"></button>
<button class="ql-italic"></button>
<button class="ql-comment"></button>
<button class="ql-highlighter"></button>`;
EditDCCText.editorTemplate =
`<svg viewBox="0 0 [width] [height]">
   <foreignObject width="100%" height="100%">
      <div id="inplace-content">[content]</div>
   </foreignObject>
</svg>`;
/* icons from Font Awesome, license: https://fontawesome.com/license */
// comment-alt https://fontawesome.com/icons/comment-alt?style=regular
EditDCCText.buttonCommentSVG =
`<svg viewBox="0 0 512 512">
<path fill="currentColor" d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288z">
</path></svg>`;
// highlighter https://fontawesome.com/icons/highlighter?style=solid
EditDCCText.buttonHighlightSVG =
`<svg viewBox="0 0 544 512">
<path fill="currentColor" d="M0 479.98L99.92 512l35.45-35.45-67.04-67.04L0 479.98zm124.61-240.01a36.592 36.592 0 0 0-10.79 38.1l13.05 42.83-50.93 50.94 96.23 96.23 50.86-50.86 42.74 13.08c13.73 4.2 28.65-.01 38.15-10.78l35.55-41.64-173.34-173.34-41.52 35.44zm403.31-160.7l-63.2-63.2c-20.49-20.49-53.38-21.52-75.12-2.35L190.55 183.68l169.77 169.78L530.27 154.4c19.18-21.74 18.15-54.63-2.35-75.13z">
</path></svg>`;
})();