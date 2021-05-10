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
    if (new URL(document.location).pathname.includes('/prognosis/partials/pacient-info.html')) {
      Prognosis.i.getPacientOptions()
    }
    if(new URL(document.location).pathname.includes('/prognosis/creation')){
      var btnAddOption = document.querySelectorAll('.btn-add-option')
      for (var btn of btnAddOption) {
        // console.log('============')
        // console.log(btn)
        btn.addEventListener('click', Prognosis.i.addPacientVariableOption)
      }
      document.querySelector('#btn-update-idade-option').addEventListener('click', Prognosis.i.updatePacientVariableOption)
    }
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
      <div class="border rounded px-2 mb-2 bg-secondary d-inline-flex align-middle" id="[id]-[value]">
      <input class="form-control-plaintext" type="text" value="[value]" readonly style="width: [valueLength]ch !important;">
      <button id="btn-del-[id]-[value]" type="button" class="btn px-1 m-0"><i class="fas fa-minus-circle"></i></button>
      </div>
      `
      template.innerHTML = html
      .replace(/\[value\]/ig, inputValue.value)
      .replace(/\[id\]/ig, this.message)
      .replace(/\[valueLength\]/ig, inputValue.value.length)
      optionWrapper.appendChild(template.content.cloneNode(true))
      const delOptionBtn = document.querySelector('#btn-del-'+ this.message+'-'+inputValue.value)
      delOptionBtn.addEventListener('click', Prognosis.i.deletePacientVariableOption)
    }

  }

  async deletePacientVariableOption (topic, message){
    this.parentElement.remove()
  }

  async updatePacientVariableOption (topic, message){

    const modalOptions = this.form.querySelector("div[id$='wrapper']")
    const valueWrapper = document.querySelector('.pancient-info-values.'+this.value)
    valueWrapper.innerHTML = modalOptions.innerHTML
    const delButtons = valueWrapper.querySelectorAll('button')
    for (var btn of delButtons) {
      btn.remove()
    }
  }

  removeAccent (src){
    src = src.toLowerCase()
    src = src.replace(new RegExp('[ÁÀÂÃ]','ig'), 'a')
    src = src.replace(new RegExp('[ÉÈÊ]','ig'), 'e')
    src = src.replace(new RegExp('[ÍÌÎ]','ig'), 'i')
    src = src.replace(new RegExp('[ÓÒÔÕ]','ig'), 'o')
    src = src.replace(new RegExp('[ÚÙÛ]','ig'), 'u')
    src = src.replace(new RegExp('[Ç]','ig'), 'c')
    return src
  }

  async getPacientOptions (){
    const pacientInfo = {
      "idade":{
        "locked": [

        ],
        "open": [
          "<40",
          "40-59",
          "60-69",
          "70-74",
          "75-79",
          ">=80",
        ]
      },
      "origem":{
        "locked": [],
        "open": [
          "Pronto Socorro",
          "Outra UTI",
          "Nenhuma das anteriores",
        ],
      },
      "comorbidade":{
        "multiOption": "2",
        "locked": [
          {
            "IC NYHA IV": {
              "values": [
                "Sim",
              ],
            },
          },
        ],
        "open": [
          {
            "Câncer metastático": {
              "values": [
                "Não",
                "Sim",
              ],
            },
          },
          {
            "Terapia oncológica": {
              "values": [
                "Não",
                "Sim",
              ],
            },
          },
          {
            "Câncer hematológico": {
              "values": [
                "Não",
                "Sim",
              ],
            },
          },
          {
            "Cirrose": {
              "values": [
                "Não",
                "Sim",
              ],
            },
          },
          {
            "SIDA": {
              "values": [
                "Não",
                "Sim",
              ],
            },
          },
          {
            "Internado antes da admissão": {
              "cascade": "true",
              "values": [
                "14-27 dias",
                ">=28 dias",
              ],
            },
          },
          {
            "Infectado antes da admissão": {
              "cascade": "true",
              "values": [
                "Nosocomial",
                "Respiratória",
              ],
            },
          },
        ],
      },
      "motivoAdmissao": {
        "locked": [],
        "open": [
          {
            "Admissão Planejada": {
              "values":[
                "Não",
                "Sim",
              ]
            }
          },
          {
            "Admissão cirúrgica": {
              "cascade": "true",
              "values": [
                "Cirurgia eletiva",
                "Cirurgia urgência",
              ],
              "child": [
                "NRC por AVC",
                "Revascularização miocárdica",
                "Trauma",
                "Transplante",
                "Outro",
              ],
            },
          },
          {
            "Admissão clínica": {
              "cascade": "true",
              "values": [
                "Arritmia",
                "Choque hipovolêmico",
                "Outro choque",
                "Convulsão",
                "Abdome agudo",
                "Pancreatite grave",
                "Déficit focal",
                "Efeito de massa intracraniana",
                "Alteração do nível de consciência",
                "Outro",
              ],
            },
          },
        ]
      },
      "statusClinico": {
        "locked": [],
        "open": [
          {
            "GCS": {
              "uniqueValues":"true",
              "values": [
                "3-4",
                "5",
                "6",
                "7-12",
                ">=13",
              ],
            },
          },
          {
            "Temperatura": {
              "uniqueValues":"true",
              "values": [
                "<35",
                ">=35",
              ],
            },
          },
          {
            "Frequência cardíaca": {
              "uniqueValues":"true",
              "values": [
                "<120",
                "120-159",
                ">=160",
              ],
            },
          },
          {
            "Pressão sistólica": {
              "uniqueValues":"true",
              "values": [
                "<40",
                "40-69",
                "70-119",
                ">=120",
              ],
            },
          },
          {
            "Droga vasoativa": {
              "uniqueValues":"true",
              "values": [
                "Não",
                "Sim",
              ]
            },
          },
        ],
      },
      "alteracoesLab": {
        "locked": [],
        "open": [
          {
            "Bilirrubina": {
              "uniqueValues":"true",
              "values": [
                "<2",
                "2-6",
                ">=6",
              ],
            },
          },
          {
            "Creatinina": {
              "uniqueValues":"true",
              "values": [
                "<1,2",
                "1,2-1,9",
                "2-3,4",
                ">=3,5",
              ],
            },
          },
          {
            "pH": {
              "uniqueValues":"true",
              "values": [
                "<=7,25",
                ">7,25"
              ],
            },
          },
          {
            "Leucócitos": {
              "uniqueValues":"true",
              "values": [
                "<15mil",
                ">=15mil",
              ],
            },
          },
          {
            "Plaquetas": {
              "uniqueValues":"true",
              "values": [
                "<20mil",
                "20-49mil",
                "50-99mil",
                ">=100mil",
              ],
            },
          },
        ],
      },
    }
    ////////////////////////////////// IDADE ///////////////////////////////////////////////////
    if (pacientInfo.idade.open) {
      var idadeWrapper = document.querySelector('#idade-wrapper')
      var selectWrapper = idadeWrapper.querySelector('div.input-group')
      var htmlSelect = document.createElement('select')

      htmlSelect.classList.add('custom-select')
      htmlSelect.id = 'idade-1'
      selectWrapper.appendChild(htmlSelect)
      var option = document.createElement('option')
      option.textContent = 'Escolha...'
      htmlSelect.appendChild(option)
      for (var i = 0; i < pacientInfo.idade.open.length; i++) {
        option = document.createElement('option')
        option.value = pacientInfo.idade.open[i]
        option.innerHTML = pacientInfo.idade.open[i]+' anos'
        htmlSelect.appendChild(option)
      }
    }
    ////////////////////////////////// ORIGEM ///////////////////////////////////////////////////
    if (pacientInfo.origem.open) {
      var idadeWrapper = document.querySelector('#origem-wrapper')
      var selectWrapper = idadeWrapper.querySelector('div.input-group')
      var htmlSelect = document.createElement('select')

      htmlSelect.classList.add('custom-select')
      htmlSelect.id = 'origem-1'
      selectWrapper.appendChild(htmlSelect)
      var option = document.createElement('option')
      option.textContent = 'Escolha...'
      htmlSelect.appendChild(option)
      for (var i = 0; i < pacientInfo.origem.open.length; i++) {
        option = document.createElement('option')
        option.value = pacientInfo.origem.open[i]
        option.innerHTML = pacientInfo.origem.open[i]
        htmlSelect.appendChild(option)
      }
    }

    function objectfyPlayerOptions(fnVariable, fnWrapper, fnPrependTxt){
      const mainWrapper = document.querySelector('#'+fnWrapper)
      if(pacientInfo[fnVariable].locked){
        for (var i = 0; i < pacientInfo[fnVariable].locked.length; i++) {
          var keyText = Object.keys(pacientInfo[fnVariable].locked[i])[0]
          var keyId = Prognosis.i.removeAccent(keyText).replace(new RegExp('[ ]','ig'), '-')
          var template = document.createElement('template')
          var html = Prognosis.playerOptionLocked
          template.innerHTML = html
          .replace(/\[prependText\]/ig, fnPrependTxt)
          .replace(/\[id\]/ig, keyId)
          mainWrapper.appendChild(template.content.cloneNode(true))
          var textSelect = document.querySelector('#options-'+keyId+'-wrapper')
          if(pacientInfo[fnVariable].locked[i][keyText]['values'].length == 2 &&
          (pacientInfo[fnVariable].locked[i][keyText]['values'][0] == "Sim" ||
          pacientInfo[fnVariable].locked[i][keyText]['values'][1] == "Sim"))
          {

            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerOptionInputDisabled
            .replace(/\[value\]/ig, keyText)
            .replace(/\[id\]/ig, keyId)
            textSelect.appendChild(template.content.cloneNode(true))
            for (var z = 0; z < pacientInfo[fnVariable].locked[i][keyText]['values'].length; z++) {
              var value = pacientInfo[fnVariable].locked[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }

          }else if (pacientInfo[fnVariable].locked[i][keyText]['cascade'] &&
          pacientInfo[fnVariable].locked[i][keyText]['cascade'] == 'true'){
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerOptionCheckbox
            .replace(/\[id\]/ig, keyId)
            .replace(/\[valueText\]/ig, keyText)
            textSelect.appendChild(template.content.cloneNode(true))
            var cascadeDiv = document.createElement('div')
            cascadeDiv.id = keyId + '-wrapper'
            cascadeDiv.classList.add('progn-multi-wrapper','d-none', 'border', 'rounded')
            cascadeDiv.style.backgroundColor = "#b5b5b5"
            textSelect.appendChild(cascadeDiv)
            for (var z = 0; z < pacientInfo[fnVariable].locked[i][keyText]['values'].length; z++) {
              var valueText = pacientInfo[fnVariable].locked[i][keyText]['values'][z]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              if(pacientInfo[fnVariable].locked[i][keyText]['values'].length == 2){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, valueId+'-'+z)
                .replace(/\[name\]/ig, keyId+'-value')
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))

              }else{
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId+'-'+z)
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
              }
            }
          }
          else if(pacientInfo[fnVariable].locked[i][keyText]['uniqueValues'] &&
          pacientInfo[fnVariable].locked[i][keyText]['uniqueValues'] == 'true'){
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerOptionInputDisabled
            .replace(/\[value\]/ig, keyText)
            .replace(/\[id\]/ig, keyId)
            textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#'+ keyId)
            obj.prependTxt = obj.parentElement.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = obj.prependTxt.firstElementChild.cloneNode(true)
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            //Hide input and add the value to prepend text
            document.querySelector('#'+keyId).setAttribute('hidden','')
            document.querySelector('#'+keyId).removeAttribute('disabled')
            // obj.parentElement.querySelector('.input-group-prepend')

            for (var z = 0; z < pacientInfo[fnVariable].locked[i][keyText]['values'].length; z++) {
              var value = pacientInfo[fnVariable].locked[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }
          }
           else{
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerOptionInputDisabled
            .replace(/\[value\]/ig, keyText)
            .replace(/\[id\]/ig, keyId)
            textSelect.appendChild(template.content.cloneNode(true))
            // if((pacientInfo[fnVariable].locked[i][keyText]['child'] ||
            // pacientInfo[fnVariable].locked[i][keyText]['values'].length != 2) &&
            // (pacientInfo[fnVariable].locked[i][keyText]['values'][0] != "Sim" &&
            // pacientInfo[fnVariable].locked[i][keyText]['values'][1] != "Não"))
            // {

            for (var k = 0; k < pacientInfo[fnVariable].locked[i][keyText]['values'].length; k++) {
              // console.log(pacientInfo[fnVariable].locked[i][keyText]['values'][k])
              var valueText = pacientInfo[fnVariable].locked[i][keyText]['values'][k]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')

              var template = document.createElement('template')
              var html = Prognosis.playerOptionCheckbox

              template.innerHTML = html
              .replace(/\[valueText\]/ig, valueText)
              .replace(/\[id\]/ig, valueId)
              var optionsWrapper = mainWrapper.querySelector('#options-'+keyId+'-wrapper')
              optionsWrapper.appendChild(template.content.cloneNode(true))
              if(pacientInfo[fnVariable].locked[i][keyText]['values'].length == 1){
                optionsWrapper.querySelector('#'+valueId).setAttribute('checked','')

              }
            }
            if(pacientInfo[fnVariable].locked[i][keyText]['child']){
              var template = document.createElement('template')
              var html = Prognosis.playerOption

              template.innerHTML = html
              .replace(/\[prependText\]/ig, 'Motivo | Cirurgia eletiva')
              .replace(/\[id\]/ig, valueId)
              mainWrapper.appendChild(template.content.cloneNode(true))
              for (var j = 0; j < pacientInfo[fnVariable].locked[i][keyText]['child'].length; j++) {

              }
            }

          // }
        }

      }
      }
      if(pacientInfo[fnVariable].open){
        /////Verify if has multi option, then create enough selects +TODO+
        for (var i = 0; i < pacientInfo[fnVariable].open.length; i++) {
          var keyText = Object.keys(pacientInfo[fnVariable].open[i])[0]
          var keyId = Prognosis.i.removeAccent(keyText).replace(new RegExp('[ ]','ig'), '-')
          var template = document.createElement('template')
          var html = Prognosis.playerOption
          template.innerHTML = html
          .replace(/\[prependText\]/ig, fnPrependTxt)
          .replace(/\[id\]/ig, keyId)
          mainWrapper.appendChild(template.content.cloneNode(true))
          var textSelect = document.querySelector('#options-'+keyId+'-wrapper')
          if(pacientInfo[fnVariable].open[i][keyText]['values'].length == 2 &&
          (pacientInfo[fnVariable].open[i][keyText]['values'][0] == "Sim" ||
          pacientInfo[fnVariable].open[i][keyText]['values'][1] == "Sim"))
          {

            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerOptionInputDisabled
            .replace(/\[value\]/ig, keyText)
            .replace(/\[id\]/ig, keyId)
            textSelect.appendChild(template.content.cloneNode(true))
            for (var z = 0; z < pacientInfo[fnVariable].open[i][keyText]['values'].length; z++) {
              var value = pacientInfo[fnVariable].open[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }

          }else if (pacientInfo[fnVariable].open[i][keyText]['cascade'] &&
          pacientInfo[fnVariable].open[i][keyText]['cascade'] == 'true'){
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerOptionCheckbox
            .replace(/\[id\]/ig, keyId)
            .replace(/\[valueText\]/ig, keyText)
            textSelect.appendChild(template.content.cloneNode(true))
            var cascadeDiv = document.createElement('div')
            cascadeDiv.id = keyId + '-wrapper'
            cascadeDiv.classList.add('progn-multi-wrapper','d-none', 'border', 'rounded')
            cascadeDiv.style.backgroundColor = "#b5b5b5"
            textSelect.appendChild(cascadeDiv)
            for (var z = 0; z < pacientInfo[fnVariable].open[i][keyText]['values'].length; z++) {
              var valueText = pacientInfo[fnVariable].open[i][keyText]['values'][z]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              if(pacientInfo[fnVariable].open[i][keyText]['values'].length == 2){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, valueId+'-'+z)
                .replace(/\[name\]/ig, keyId+'-value')
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))

              }else{
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId+'-'+z)
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
              }
            }
          }
          else if(pacientInfo[fnVariable].open[i][keyText]['uniqueValues'] &&
          pacientInfo[fnVariable].open[i][keyText]['uniqueValues'] == 'true'){
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerOptionInputDisabled
            .replace(/\[value\]/ig, keyText)
            .replace(/\[id\]/ig, keyId)
            textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#'+ keyId)
            obj.prependTxt = obj.parentElement.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = obj.prependTxt.firstElementChild.cloneNode(true)
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            //Hide input and add the value to prepend text
            document.querySelector('#'+keyId).setAttribute('hidden','')
            document.querySelector('#'+keyId).removeAttribute('disabled')
            // obj.parentElement.querySelector('.input-group-prepend')

            for (var z = 0; z < pacientInfo[fnVariable].open[i][keyText]['values'].length; z++) {
              var value = pacientInfo[fnVariable].open[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }
          }
           else{
            var optionSelect = document.createElement('option')
            optionSelect.value = keyId
            optionSelect.innerHTML = keyText
            textSelect.appendChild(optionSelect)
            if((pacientInfo[fnVariable].open[i][keyText]['child'] ||
            pacientInfo[fnVariable].open[i][keyText]['values'].length != 2) &&
            (pacientInfo[fnVariable].open[i][keyText]['values'][0] != "Sim" &&
            pacientInfo[fnVariable].open[i][keyText]['values'][1] != "Não"))
            {

            for (var k = 0; k < pacientInfo[fnVariable].open[i][keyText]['values'].length; k++) {
              // console.log(pacientInfo[fnVariable].open[i][keyText]['values'][k])
              var valueText = pacientInfo[fnVariable].open[i][keyText]['values'][k]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              console.log(valueText)
              console.log(valueId)
              var template = document.createElement('template')
              var html = Prognosis.playerOptionCheckbox

              template.innerHTML = html
              .replace(/\[valueText\]/ig, valueText)
              .replace(/\[id\]/ig, valueId)
              var optionsWrapper = mainWrapper.querySelector('#options-'+keyId+'-wrapper')
              optionsWrapper.appendChild(template.content.cloneNode(true))
            }
            if(pacientInfo[fnVariable].open[i][keyText]['child']){
              var template = document.createElement('template')
              var html = Prognosis.playerOption

              template.innerHTML = html
              .replace(/\[prependText\]/ig, 'Motivo | Cirurgia eletiva')
              .replace(/\[id\]/ig, valueId)
              mainWrapper.appendChild(template.content.cloneNode(true))
              for (var j = 0; j < pacientInfo[fnVariable].open[i][keyText]['child'].length; j++) {
                console.log('============ child values')
                console.log(pacientInfo[fnVariable].open[i][keyText]['child'][j])

              }
            }

          }
        }

      }
    }
    }
    ////////////////////////////////// COMORBIDADE ///////////////////////////////////////////////////
    const comorbidadeWrapper = document.querySelector('#comorbidade-wrapper')
    var mainVariable = 'comorbidade'
    objectfyPlayerOptions('comorbidade','comorbidade-wrapper','Comorbidade')

    ////////////////////////////////// MOTIVO DA ADMMISSAO ///////////////////////////////////////////////////
    const motivoAdmissaoWrapper = document.querySelector('#motivo-admissao-wrapper')
    objectfyPlayerOptions('motivoAdmissao','motivo-admissao-wrapper','Motivo')

    ////////////////////////////////// STATUS CLINICO ///////////////////////////////////////////////////
    objectfyPlayerOptions('statusClinico','status-clinico-wrapper','Status')

    ////////////////////////////////// ALTERACOES LABORATORIAIS ///////////////////////////////////////////////////
    objectfyPlayerOptions('alteracoesLab','alt-lab-wrapper','Alteração')

  Prognosis.i.expandMultiChoice()
}

}
(function () {
  Prognosis.i = new Prognosis()

  Prognosis.playerOption =
  `
  <div class="input-group mb-2 d-flex no-gutters">
  <div class="input-group-prepend">
  <label class="input-group-text" for="[id]">[prependText]</label>
  </div>
  <div class="d-flex flex-grow-1 border col" id="options-[id]-wrapper">
  </div>
  </div>
  `
  Prognosis.playerOptionLocked =
  `
  <div class="input-group mb-2 d-flex no-gutters disabled-lock">
  <div class="input-group-prepend">
  <label class="input-group-text" for="[id]">[prependText]</label>
  </div>
  <div class="d-flex flex-grow-1 border col" id="options-[id]-wrapper">
  </div>
  </div>
  `
  Prognosis.playerOptionCheckbox = `
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="[id]" value="[id]">
  <label class="form-check-label" for="[id]">[valueText]</label>
  </div>`

  Prognosis.playerOptionRadio = `
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name=[name] id="[id]" value="[id]">
  <label class="form-check-label" for="[id]">[valueText]</label>
  </div>`

  Prognosis.playerOptionInputDisabled = `

  <input class="form-control" type="text" id="[id]" value="[value]" disabled>
  `
})()
