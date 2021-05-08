;class Prognosis {
  constructor() {
    window.addEventListener('load', this.start)

    // this.addPacientVariableOption = this.addPacientVariableOption.bind(this)
    // this.deletePacientVariableOption = this.deletePacientVariableOption.bind(this)
    // MessageBus.ext.subscribe('button/add-option/clicked', this.addPacientVariableOption)
    // MessageBus.ext.subscribe('button/delete-option/clicked', this.deletePacientVariableOption)
  }


  async start (){
    Prognosis.i.expandMultiChoice()
    let btnAddOption = document.querySelectorAll('.btn-add-option')
    for (var btn of btnAddOption) {
      // console.log('============')
      // console.log(btn)
      btn.addEventListener('click', Prognosis.i.addPacientVariableOption)
    }
    document.querySelector('#btn-update-idade-option').addEventListener('click', Prognosis.i.updatePacientVariableOption)

  }

  async expandMultiChoice (){
    var multiValues = document.querySelectorAll('.progn-multi-wrapper')
    for (var e = 0; e < multiValues.length; e++) {
      if(multiValues[e].hasAttribute('class') && multiValues[e].classList.contains('progn-multi-wrapper')){
        var el = document.querySelector('#' + multiValues[e].id.substring(0,(multiValues[e].id.length - 8)))
        if(el == null){
          el = document.querySelectorAll('input[name="'+ multiValues[e].id.substring(0,(multiValues[e].id.length - 8)) +'"'+']')
        }

        const listenerFnMultiChoice = function () {
          var multiWrapper
          var _id
          if(this.getAttribute('type') == 'radio'){
            _id = this.name
          }else {
            _id = this.id
          }
          multiWrapper = document.querySelector('#' + _id + '-wrapper')
          if(this.checked && multiWrapper.classList.contains('d-none')){
            multiWrapper.classList.remove('d-none')
          } else if(!this.checked && multiWrapper.classList.contains('d-none') == false){
            multiWrapper.classList.add('d-none')
            var inputList = multiWrapper.querySelectorAll('div > input')
            var childListWrappers = multiWrapper.querySelectorAll(' .progn-multi-wrapper')

            for (var i = 0; i < inputList.length; i++) {
              inputList[i].checked = false
            }
            for (var e = 0; e < childListWrappers.length; e++) {
              childListWrappers[e].classList.add('d-none')
            }
          }
        }

        function checkMultiChoice (){
          var multiWrapper
          var radioSiblingChecked = false

          if(el.length){
            for (var p = 0; p < el.length; p++) {

              multiWrapper = document.querySelector('#' + el[p].name + '-wrapper')
              if((el[p].checked && multiWrapper.classList.contains('d-none'))
              || (radioSiblingChecked && multiWrapper.classList.contains('d-none') == false)){
                radioSiblingChecked = true
                multiWrapper.classList.remove('d-none')
              } else {
                multiWrapper.classList.add('d-none')
                var inputList = multiWrapper.querySelectorAll('div > input')
                var childListWrappers = multiWrapper.querySelectorAll(' .progn-multi-wrapper')

                for (var i = 0; i < inputList.length; i++) {
                  inputList[i].checked = false
                }
                for (var e = 0; e < childListWrappers.length; e++) {
                  childListWrappers[e].classList.add('d-none')
                }
              }

            }
          }
          else {
            multiWrapper = document.querySelector('#' + el.id + '-wrapper')

            if(el.checked && multiWrapper.classList.contains('d-none')){
              multiWrapper.classList.remove('d-none')
            } else if(!el.checked && multiWrapper.classList.contains('d-none') == false){
              multiWrapper.classList.add('d-none')
              var inputList = multiWrapper.querySelectorAll('div > input')
              var childListWrappers = multiWrapper.querySelectorAll(' .progn-multi-wrapper')

              for (var i = 0; i < inputList.length; i++) {
                inputList[i].checked = false
              }
              for (var e = 0; e < childListWrappers.length; e++) {
                childListWrappers[e].classList.add('d-none')
              }
            }
          }
        }
        checkMultiChoice()

        if(el.length){
          for (var i = 0; i < el.length; i++) {
            el[i].removeEventListener('change', listenerFnMultiChoice)
            el[i].addEventListener('change', listenerFnMultiChoice)
          }
        }else{
          el.removeEventListener('change', listenerFnMultiChoice)
          el.addEventListener('change', listenerFnMultiChoice)
        }


      }
    }
  }

  async addPacientVariableOption (topic, message){
    const optionWrapper = document.querySelector('#'+ this.id.substring(4) +'-wrapper')
    const inputValue = this.offsetParent.querySelector('input')
    this.message = this.getAttribute('message')
    if(!optionWrapper.querySelector('#'+this.message+'-'+inputValue.value)){
      var template = document.createElement('template')
      const html = `
      <div class="border rounded mb-2 bg-secondary d-inline-flex align-middle" id="[id]-[value]">
      <h5 class="text-center ">[value]</h5>
      <button id="btn-del-[id]-[value]" type="button" class="btn px-1 m-0"><i class="fas fa-minus-circle"></i></button>
      </div>
      `
      template.innerHTML = html
        .replace(/\[value\]/ig, inputValue.value)
        .replace(/\[id\]/ig, this.message)
      optionWrapper.appendChild(template.content.cloneNode(true))
      const delOptionBtn = document.querySelector('#btn-del-'+ this.message+'-'+inputValue.value)
      delOptionBtn.addEventListener('click', Prognosis.i.deletePacientVariableOption)
    }

  }

  async deletePacientVariableOption (topic, message){
    this.parentElement.remove()
  }

  async updatePacientVariableOption (topic, message){
    console.log('============ aaa')
    console.log(this.form.querySelector("div[id$='wrapper']"))
  }

}
(function () {
  Prognosis.i = new Prognosis()
})()
