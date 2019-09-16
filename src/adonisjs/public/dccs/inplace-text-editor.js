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
      this._handleContribution = this._handleContribution.bind(this);

      let container = document;
      if (window.parent && window.parent.document) {
         const cont = window.parent.document.querySelector("#inplace-editor-wrapper");
         if (cont != null)
            container = cont;
      }

      let editorToolbar = document.createElement("div");
      editorToolbar.classList.add("inplace-editor-toolbar");
      editorToolbar.innerHTML = EditDCCText.toolbarTemplate;
      container.appendChild(editorToolbar);

      let editor = document.createElement("div");
      container.appendChild(editor);

      editor.style.position = "absolute";

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      /*
      console.log(container);
      console.log("container width: " + containerRect.width);
      console.log("container height: " + containerRect.height);
      console.log("offset width: " + container.offsetWidth);
      console.log("offset height: " + container.offsetHeight);
      console.log("client width: " + container.clientWidth);
      console.log("client height: " + container.clientHeight);
      console.log("scroll width: " + container.scrollWidth);
      console.log("scroll height: " + container.scrollHeight);
      */

      console.log("font size: " +
         window.getComputedStyle(element, null).getPropertyValue("font-size"));

      editorToolbar.style.left =
         ((elementRect.left - containerRect.left) /
           containerRect.width * 100) + "%";
      editorToolbar.style.bottom =
         ((containerRect.height - (elementRect.top-containerRect.top)) /
           containerRect.height * 100) + "%";

      editor.style.left =
         ((elementRect.left - containerRect.left) * 100 /
                     containerRect.width) + "%";
      editor.style.top =
         ((elementRect.top - containerRect.top) * 100 /
                     containerRect.height) + "%";
      editor.style.width = (elementRect.width * 100 / containerRect.width) + "%";
      editor.style.height = (elementRect.height * 100 / containerRect.height) + "%";
      editor.style.fontSize =
         window.getComputedStyle(element, null).getPropertyValue("font-size");

      editor.innerHTML =
         EditDCCText.editorTemplate
            .replace("[width]",
               (elementRect.width/containerRect.width)*Basic.referenceViewport.width)
            .replace("[height]",
               (elementRect.height/containerRect.height)*Basic.referenceViewport.height)
            .replace("[content]", element.innerHTML);
      let inplaceContent = editor.querySelector("#inplace-content");

      this._quill = new Quill(inplaceContent, 
         {theme: "snow",
          modules: {
             toolbar: {
               container: editorToolbar,
               handlers: {
                  "contribution": this._handleContribution
               }
             }
          }
         });
      editor.classList.add("inplace-editor");

      // transforms contribution the options in HTML
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

   _handleContribution(contribution) {
      this._contributionSelect.innerHTML = contribution + this._contributionSelectHTML;
      var range = this._quill.getSelection();
      this._quill.formatText(range.index, range.length, {
         metadata: contribution
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
<button class="ql-italic"></button>`;
EditDCCText.editorTemplate =
`<svg viewBox="0 0 [width] [height]">
   <foreignObject width="100%" height="100%">
      <div id="inplace-content">[content]</div>
   </foreignObject>
</svg>
`;
})();