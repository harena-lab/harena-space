/* Image DCC Editable
 ********************/
function editableDCCImage() {
   DCCImage.prototype._editImage = function() {
      this._presentation.removeEventListener("click", this._editImage);
      const templateHTML =
      `<style>
      .styd-border-notice {
         border-radius: 1px;
         box-shadow: 0px 0px 0px 20px rgba(0,0,0,0.5);
         margin: 15px;
      }
      .styd-border {
         border: 1px solid black;
         border-radius: 5px;
         margin: 5px;
      }
      .styd-notice {
         position: absolute;
         margin: auto;
         top: 0;
         right: 0;
         bottom: 0;
         left: 0;
         width: 400px;
         height: 200px;
         overflow: hidden;
         display: flex;
         background: white;
         flex-direction: column;
         padding: 10px;
      }
      .styd-selector {
         margin: auto;
         top: 0;
         right: 0;
         bottom: 0;
         left: 0;
         width: 400px;
         height: 50px;
      }
      </style>
      <div id="presentation-editable-dcc" class="styd-notice styd-border-notice">
         <label for="selImage">Choose a picture:</label>
         <input type="file" id="selImage" name="selImage" class="styd-selector"
                accept="image/png, image/jpeg, image/svg">
      </div>`;
      const template = document.createElement("template");
      template.innerHTML = templateHTML;
      this._imageDialog = template.content.cloneNode(true);
      this.appendChild(this._imageDialog);
      this._presentationEditable = this.querySelector("#presentation-editable-dcc");
      this._selImage = this.querySelector("#selImage");
      this._imageSelected = this._imageSelected.bind(this);
      this._selImage.addEventListener("change", this._imageSelected);
   };
   
   DCCImage.prototype._editDCC = function() {
      this._presentation.innerHTML =
         "<div class='sty-editable-asset'>" + this._imageHTML() + "</div>";
      this._editImage = this._editImage.bind(this);
      this._presentation.addEventListener("click", this._editImage);
      // this._presentation.style.cursor = "pointer";
   };

   DCCImage.prototype._imageSelected = async function() {
      console.log(this._selImage.files[0]);
      this.removeChild(this._presentationEditable);
      const caseId = await MessageBus.ext.request("control/_current_case_id/get");
      console.log(caseId.message);
      const fileId = await MessageBus.ext.request("data/asset//new",
                                                  {file: "/home/santanche/git/case-notebook/notebook/cases/case001-development/images/case-forklift.png",
                                                   caseid: caseId.message});
      console.log(fileId);
   }
}