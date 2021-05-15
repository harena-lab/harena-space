class Prognosis {
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
    if (new URL(document.location).pathname.includes('/prognosis/calculator')){
      Prognosis.i.getPacientOptions(true)
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
          if(this.checked && multiWrapper.classList.contains('d-none')) {
              if((this.getAttribute('type') == 'radio' && this.id.includes('sim')) || (this.getAttribute('type') != 'radio' || (this.getAttribute('type') == 'radio' && this.id.includes('nao') == false))){
                multiWrapper.classList.remove('d-none')
              }
          } else if(multiWrapper.classList.contains('d-none') == false){
            if ((this.checked && this.getAttribute('type') == 'radio' && this.id.includes('nao')) ||
            (!this.checked && (this.getAttribute('type') != 'radio' || (this.getAttribute('type') == 'radio'
            && this.id.includes('nao') == false)))) {
              multiWrapper.classList.add('d-none')
              var inputList = multiWrapper.querySelectorAll('div > input')
              var childListWrappers = multiWrapper.querySelectorAll(' .progn-multi-wrapper')

              for (var i = 0; i < inputList.length; i++) {
                inputList[i].checked = false
                // var testWrapper = document.querySelector('#' + inputList[i].name + '-wrapper')
                // var test = testWrapper.querySelectorAll('div > input')
                // testWrapper.classList.add('d-none')
                // for (var k = 0; k < test.length; k++) {
                  // console.log(test[k].checked = false)
                // }
              }
              for (var e = 0; e < childListWrappers.length; e++) {
                childListWrappers[e].classList.add('d-none')
              }
            }

          }
            // console.log('============')
            // console.log(this)
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
    src = src.replace(new RegExp('[>]','ig'), 'maior')
    src = src.replace(new RegExp('[<]','ig'), 'menor')
    src = src.replace(new RegExp('[=]','ig'), 'igual')
    src = src.replace(new RegExp('[/\|+_?;:.,*!@#$%&()¹²³°ªº]','ig'), '')
    src = src.replace(new RegExp(' ','ig'), '-')
    return src
  }

  async getPacientOptions (calculator){
    if(calculator){
      var pacientInfo = {
        "idade":{
          "locked": [

          ],
          "open": [
            "<40",//0
            "40-59",//5
            "60-69",//9
            "70-74",//13
            "75-79",//15
            ">=80",//18
          ]
        },
        "origem":{
          "locked": [],
          "open": [
            "Pronto Socorro",//5
            "Outra UTI",//7
            "Nenhuma das anteriores",//8
          ],
        },
        "comorbidade":{
          "locked": [

          ],
          "open": [
            {
              "IC NYHA IV": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//6
            },
            {
              "Câncer metastático": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//11
            },
            {
              "Terapia oncológica": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//3
            },
            {
              "Câncer hematológico": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//6 IF HAS SIDA + CANCER  it gets double points
            },
            {
              "Cirrose": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//8
            },
            {
              "SIDA": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },//8   IF HEMATOLOGICA + SIDA = 16+12
            },
            {
              "Internado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "uniqueValues":"true",
                "values": [
                  "<14 dias",//0
                  "14-27 dias",//6
                  ">=28 dias",//7
                ],
              },
            },
            {
              "Infectado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "multipleValues": "true",
                "values": [
                  "Nosocomial",//4
                  "Respiratória",//5
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
                  "Não",//3
                  "Sim",//0
                ]
              },
            },
            {
              "Submetido à cirurgia": {// no surgery = 5 //surgery = 16
                "cascade": "true",
                "radioYN": "true",
                "values": [
                  "Cirurgia eletiva",//0
                  "Cirurgia urgência",//6
                ],
                "child": [
                  "NRC por AVC",//5
                  "Revascularização miocárdica",//-6
                  "Trauma",//-8
                  "Transplante",//-11
                  "Outro",//0
                ],
              },
            },
            {
              "Motivo de admissão na UTI": {//16
                "values": [
                  "Arritmia",//-5 Out of arritmia and convulsão, choose the worst value if both apply
                  "Choque hipovolêmico",//3
                  "Outro choque",//5
                  "Convulsão",//-4
                  "Abdome agudo",//3
                  "Pancreatite grave",//9
                  "Déficit focal",//7
                  "Efeito de massa intracraniana",//10
                  "Insuficiência hepática", //6
                  "Alteração do nível de consciência",//4
                  "Nenhum dos anteriores",//0
                ],
              },
            },
          ]
        },
        "statusClinico": {
          "locked": [],
          "open": [
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues":"true",
                "values": [
                  "3-4",//15
                  "5",//10
                  "6",//7
                  "7-12",//2
                  ">=13",//0
                ],
              },
            },
            {
              "Temperatura": {
                "uniqueValues":"true",
                "values": [
                  "<35 °C",//7
                  ">=35 °C",//0
                ],
              },
            },
            {
              "Frequência cardíaca": {
                "uniqueValues":"true",
                "values": [
                  "<120 bpm",//0
                  "120-159 bpm",//5
                  ">=160 bpm",//7
                ],
              },
            },
            {
              "Pressão sistólica": {
                "uniqueValues":"true",
                "values": [
                  "<40 mmHg",//11
                  "40-69 mmHg",//8
                  "70-119 mmHg",//3
                  ">=120 mmHg",//0
                ],
              },
            },
            {
              "Droga vasoativa": {
                "uniqueValues":"true",
                "values": [
                  "Não",
                  "Sim",//3
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
                  "<2 mg/dl",//0
                  "2-6 mg/dl",//4
                  ">=6 mg/dl",//5
                ],
              },
            },
            {
              "Creatinina": {
                "uniqueValues":"true",
                "values": [
                  "<1.2 mg/dl",//0
                  "1.2-1.9 mg/dl",//2
                  "2-3.4 mg/dl",//7
                  ">=3.5 mg/dl",//8
                ],
              },
            },
            {
              "pH": {
                "uniqueValues":"true",
                "values": [
                  "<=7.25",//3
                  ">7.25"//0
                ],
              },
            },
            {
              "Leucócitos": {
                "uniqueValues":"true",
                "values": [
                  "<15mil /mm³",//0
                  ">=15mil /mm³",//2
                ],
              },
            },
            {
              "Plaquetas": {
                "uniqueValues":"true",
                "values": [
                  "<20mil /mm³",//13
                  "20-49mil /mm³",//8
                  "50-99mil /mm³",//5
                  ">=100mil /mm³",//0
                ],
              },
            },
            {
              "Oxigenação": {
                "uniqueValues":"true",
                "values": [
                  "paO2 >=60 sem VM",//0
                  "pa02 <60 sem VM",//5
                  "P/F<100 em VM",//11
                  "P/F >=100 em VM",//7
                ],
              },
            },
          ],
        },
      }
    } else {
      var pacientInfo = {
        "dificuldade": "5",
        "idade":{
          "locked": [
            "<40"
          ],
          "open": []
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
          "locked": [

          ],
          "open": [
            {
              "IC NYHA IV": {
                "values": [
                  "Não",
                  "Sim",
                ],
              },
            },
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
                "radioYN": "true",
                "uniqueValues":"true",
                "values": [
                  "<14 dias",
                  "14-27 dias",
                  ">=28 dias",
                ],
              },
            },
            {
              "Infectado antes da admissão": {
                "cascade": "true",
                "radioYN": "true",
                "multipleValues": "true",
                "values": [
                  "Nosocomial",
                  "Respiratória",
                ],
              },
            },
          ],
        },
        "motivoAdmissao": {
          "locked": [
            {
              "Admissão Planejada": {
                "values":[
                  "Sim",
                ]
              },
            },
            {
              "Submetido à cirurgia": {
                "cascade": "true",
                "radioYN": "true",
                "values": [
                  "Cirurgia eletiva"
                ],
                "child": [
                  "Transplante"
                ],
              },
            },
            {
              "Motivo de admissão na UTI": {
                "values": [
                  "Nenhum dos anteriores"
                ],
              },
            },
          ],
          "open": [

          ]
        },
        "statusClinico": {
          "locked": [
            {
              "Escala de Coma de Glasgow": {
                "uniqueValues":"true",
                "values": [
                  ">=13",
                ],
              },
            },
            {
              "Pressão sistólica": {
                "uniqueValues":"true",
                "values": [
                  ">=120 mmHg",
                ],
              },
            },
            {
              "Droga vasoativa": {
                "uniqueValues":"true",
                "values": [
                  "Não",
                ]
              },
            },
          ],
          "open": [

            {
              "Temperatura": {
                "uniqueValues":"true",
                "values": [
                  "<35 °C",
                  ">=35 °C",
                ],
              },
            },
            {
              "Frequência cardíaca": {
                "uniqueValues":"true",
                "values": [
                  "<120 bpm",
                  "120-159 bpm",
                  ">=160 bpm",
                ],
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
                  "<2 mg/dl",
                  "2-6 mg/dl",
                  ">=6 mg/dl",
                ],
              },
            },
            {
              "Creatinina": {
                "uniqueValues":"true",
                "values": [
                  "<1.2 mg/dl",
                  "1.2-1.9 mg/dl",
                  "2-3.4 mg/dl",
                  ">=3.5 mg/dl",
                ],
              },
            },
            {
              "pH": {
                "uniqueValues":"true",
                "values": [
                  "<=7.25",
                  ">7.25"
                ],
              },
            },
            {
              "Leucócitos": {
                "uniqueValues":"true",
                "values": [
                  "<15mil /mm³",
                  ">=15mil /mm³",
                ],
              },
            },
            {
              "Plaquetas": {
                "uniqueValues":"true",
                "values": [
                  "<20mil /mm³",
                  "20-49mil /mm³",
                  "50-99mil /mm³",
                  ">=100mil /mm³",
                ],
              },
            },
            {
              "Oxigenação": {
                "uniqueValues":"true",
                "values": [
                  "paO2 >=60 sem VM",
                  "pa02 <60 sem VM",
                  "P/F<100 em VM",
                  "P/F >=100 em VM",
                ],
              },
            },
          ],
        },
      }
    }
    if(document.querySelector('h1.pacient-title')){
      var title = document.querySelector('h1.pacient-title')
      title.innerHTML = 'João V'+pacientInfo.dificuldade
    }
    ////////////////////////////////// IDADE ///////////////////////////////////////////////////
    if (pacientInfo.idade.open && pacientInfo.idade.open.length > 0) {
      var idadeWrapper = document.querySelector('#idade-wrapper')
      var selectWrapper = idadeWrapper.querySelector('div.input-group')
      var htmlSelect = document.createElement('select')

      htmlSelect.setAttribute('required','')
      htmlSelect.classList.add('custom-select')
      htmlSelect.id = 'idade'
      selectWrapper.appendChild(htmlSelect)
      var option = document.createElement('option')
      option.textContent = 'Escolha...'
      option.value = ''
      htmlSelect.appendChild(option)

      for (var i = 0; i < pacientInfo.idade.open.length; i++) {
        option = document.createElement('option')
        option.value = pacientInfo.idade.open[i]
        option.innerHTML = pacientInfo.idade.open[i]+' anos'
        htmlSelect.appendChild(option)


      }
    }
    if(pacientInfo.idade.locked && pacientInfo.idade.locked.length > 0){
      var idadeWrapper = document.querySelector('#idade-wrapper')
      var selectWrapper = idadeWrapper.querySelector('div.input-group')
      var htmlSelect = document.createElement('select')

      selectWrapper.classList.add('disabled-lock')
      htmlSelect.setAttribute('required','')
      htmlSelect.classList.add('custom-select', 'disabled-lock')
      htmlSelect.id = 'idade'
      selectWrapper.appendChild(htmlSelect)

      for (var i = 0; i < pacientInfo.idade.locked.length; i++) {
        option = document.createElement('option')
        option.value = pacientInfo.idade.locked[i]
        option.innerHTML = pacientInfo.idade.locked[i]+' anos'
        htmlSelect.appendChild(option)


      }
    }
    ////////////////////////////////// ORIGEM ///////////////////////////////////////////////////
    if (pacientInfo.origem.open && pacientInfo.origem.open.length > 0) {
      var idadeWrapper = document.querySelector('#origem-wrapper')
      var selectWrapper = idadeWrapper.querySelector('div.input-group')
      var htmlSelect = document.createElement('select')

      htmlSelect.classList.add('custom-select')
      htmlSelect.setAttribute('required','')
      htmlSelect.id = 'origem'
      selectWrapper.appendChild(htmlSelect)
      var option = document.createElement('option')
      option.textContent = 'Escolha...'
      option.value = ''
      htmlSelect.appendChild(option)

      for (var i = 0; i < pacientInfo.origem.open.length; i++) {
        option = document.createElement('option')
        option.value = pacientInfo.origem.open[i]
        option.innerHTML = pacientInfo.origem.open[i]
        htmlSelect.appendChild(option)
      }
    }
    if (pacientInfo.origem.locked && pacientInfo.origem.locked.length > 0) {
      var idadeWrapper = document.querySelector('#origem-wrapper')
      var selectWrapper = idadeWrapper.querySelector('div.input-group')
      var htmlSelect = document.createElement('select')

      selectWrapper.classList.add('disabled-lock')
      htmlSelect.classList.add('custom-select', 'disabled-lock')
      htmlSelect.setAttribute('required','')
      htmlSelect.id = 'origem'
      selectWrapper.appendChild(htmlSelect)

      for (var i = 0; i < pacientInfo.origem.locked.length; i++) {
        option = document.createElement('option')
        option.value = pacientInfo.origem.locked[i]
        option.innerHTML = pacientInfo.origem.locked[i]
        htmlSelect.appendChild(option)
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    function objectfyPlayerOptions(fnVariable, fnWrapper, fnPrependTxt){
      const mainWrapper = document.querySelector('#'+fnWrapper)
      if(pacientInfo[fnVariable].locked) {
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
          if(pacientInfo[fnVariable].locked[i][keyText]['values'].length == 1 &&
          (pacientInfo[fnVariable].locked[i][keyText]['values'][0] == "Sim" ||
          pacientInfo[fnVariable].locked[i][keyText]['values'][0] == "Não"))
          {
            var template = document.createElement('template')
            // template.innerHTML = Prognosis.playerOptionInputDisabled
            // .replace(/\[value\]/ig, keyText)
            // .replace(/\[id\]/ig, keyId)
            // textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            for (var z = 0; z < pacientInfo[fnVariable].locked[i][keyText]['values'].length; z++) {
              var value = pacientInfo[fnVariable].locked[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value)))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
              textSelect.querySelector('#'+(keyId+'-'+Prognosis.i.removeAccent(value))).checked = true
            }

          }else if (pacientInfo[fnVariable].locked[i][keyText]['cascade']
          && pacientInfo[fnVariable].locked[i][keyText]['cascade'] == 'true'){
            var template = document.createElement('template')
            var cascadeDiv = document.createElement('div')

            if(pacientInfo[fnVariable].locked[i][keyText]['radioYN']){
              template = document.createElement('template')
              // template.innerHTML = Prognosis.playerOptionInputDisabled
              // .replace(/\[value\]/ig, keyText)
              // .replace(/\[id\]/ig, '')
              // textSelect.appendChild(template.content.cloneNode(true))
              var obj = document.querySelector('#options-'+ keyId+'-wrapper')
              obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
              obj.prependTxt.copy = document.createElement('label')
              obj.prependTxt.copy.classList.add('input-group-text')
              obj.prependTxt.copy.textContent = keyText
              obj.prependTxt.appendChild(obj.prependTxt.copy)
              template = document.createElement('template')
              if(pacientInfo[fnVariable].locked[i][keyText]['values']
              && pacientInfo[fnVariable].locked[i][keyText]['values'].length > 0){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, keyId+'-sim')
                .replace(/\[name\]/ig, keyId)
                .replace(/\[value\]/ig, 'Sim')
                .replace(/\[valueText\]/ig, 'Sim')
                textSelect.appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+(keyId+'-sim')).checked = true
              }else{
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, keyId+'-nao')
                .replace(/\[name\]/ig, keyId)
                .replace(/\[value\]/ig, 'Não')
                .replace(/\[valueText\]/ig, 'Não')
                textSelect.appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+(keyId+'-nao')).checked = true
              }
            }else{
              template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionCheckbox
              .replace(/\[id\]/ig, keyId)
              .replace(/\[value\]/ig, keyText)
              .replace(/\[valueText\]/ig, keyText)
              textSelect.appendChild(template.content.cloneNode(true))
              textSelect.querySelector('#'+ keyId).checked = true
            }

            cascadeDiv.id = keyId + '-wrapper'
            if(pacientInfo[fnVariable].locked[i][keyText]['values'].length > 0){
              cascadeDiv.classList.add('border', 'rounded')
              // cascadeDiv.setAttribute('disabled','')
              cascadeDiv.style.backgroundColor = "#b5b5b5"
            }
            textSelect.appendChild(cascadeDiv)
            for (var z = 0; z < pacientInfo[fnVariable].locked[i][keyText]['values'].length; z++) {
              var valueText = pacientInfo[fnVariable].locked[i][keyText]['values'][z]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              if((pacientInfo[fnVariable].locked[i][keyText]['values'].length == 2
              || pacientInfo[fnVariable].locked[i][keyText]['uniqueValues'] &&
              pacientInfo[fnVariable].locked[i][keyText]['uniqueValues'] == 'true')
              && (!pacientInfo[fnVariable].locked[i][keyText]['multipleValues'] ||
              pacientInfo[fnVariable].locked[i][keyText]['multipleValues'] != 'true')){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, valueId)
                .replace(/\[name\]/ig, keyId+'-value')
                .replace(/\[value\]/ig, (valueText))
                .replace(/\[valueText\]/ig, valueText)
                textSelect.querySelector('#'+cascadeDiv.id).appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+valueId).checked = true
              }else if (pacientInfo[fnVariable].locked[i][keyText]['multipleValues'] ||
              pacientInfo[fnVariable].locked[i][keyText]['multipleValues'] == 'true'){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[valueText\]/ig, valueText)
                textSelect.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+valueId).checked = true
              }else{
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[valueText\]/ig, valueText)
                textSelect.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+valueId).checked = true
              }

            }
            if(pacientInfo[fnVariable].locked[i][keyText]['child']){
              var cascadeDivChild = document.createElement('div')
              cascadeDivChild.id = keyId+'-value'+ '-wrapper'
              cascadeDivChild.classList.add('border', 'rounded')
              // cascadeDiv.setAttribute('disabled','')
              cascadeDivChild.style.backgroundColor = "#cebfbf"
              cascadeDiv.appendChild(cascadeDivChild)
              for (var z = 0; z < pacientInfo[fnVariable].locked[i][keyText]['child'].length; z++) {
                var childText = pacientInfo[fnVariable].locked[i][keyText]['child'][z]
                var childId = Prognosis.i.removeAccent(childText).replace(new RegExp('[ ]','ig'), '-')
                if(pacientInfo[fnVariable].locked[i][keyText]['child'].length == 2){
                  template = document.createElement('template')
                  template.innerHTML = Prognosis.playerOptionRadio
                  .replace(/\[id\]/ig, childId)
                  .replace(/\[name\]/ig, childId+'-value')
                  .replace(/\[valueText\]/ig, childText)
                  textSelect.querySelector('#'+cascadeDivChild.id).appendChild(template.content.cloneNode(true))
                  textSelect.querySelector('#'+childId).checked = true
                }else{
                  template = document.createElement('template')
                  template.innerHTML = Prognosis.playerOptionCheckbox
                  .replace(/\[id\]/ig, childId)
                  .replace(/\[value\]/ig, childText)
                  .replace(/\[valueText\]/ig, childText)
                  textSelect.querySelector('#'+cascadeDivChild.id).appendChild(template.content.cloneNode(true))
                  textSelect.querySelector('#'+childId).checked = true
                }
              }
            }
          }
          else if(pacientInfo[fnVariable].locked[i][keyText]['uniqueValues'] &&
          pacientInfo[fnVariable].locked[i][keyText]['uniqueValues'] == 'true'){
            var template = document.createElement('template')
            // template.innerHTML = Prognosis.playerOptionInputDisabled
            // .replace(/\[value\]/ig, keyText)
            // .replace(/\[id\]/ig, keyId)
            // textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            //Hide input and add the value to prepend text
            // document.querySelector('#'+keyId).setAttribute('hidden','')
            // document.querySelector('#'+keyId).removeAttribute('disabled')
            // obj.parentElement.querySelector('.input-group-prepend')

            for (var z = 0; z < pacientInfo[fnVariable].locked[i][keyText]['values'].length; z++) {
              var value = pacientInfo[fnVariable].locked[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-')))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
              textSelect.querySelector('#'+(keyId+'-'+Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-'))).checked = true
            }
          }
          else{
            // document.querySelector('#options-'+keyId+'-wrapper').appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            for (var k = 0; k < pacientInfo[fnVariable].locked[i][keyText]['values'].length; k++) {
              var valueText = pacientInfo[fnVariable].locked[i][keyText]['values'][k]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              var template = document.createElement('template')
              var html = Prognosis.playerOptionCheckbox

              template.innerHTML = html
              .replace(/\[valueText\]/ig, valueText)
              .replace(/\[value\]/ig, valueText)
              .replace(/\[id\]/ig, valueId)
              var optionsWrapper = mainWrapper.querySelector('#options-'+keyId+'-wrapper')
              optionsWrapper.appendChild(template.content.cloneNode(true))
              optionsWrapper.querySelector('#'+valueId).checked = true
            }
            if(pacientInfo[fnVariable].locked[i][keyText]['child']){
              var template = document.createElement('template')
              var html = Prognosis.playerOption

              // template.innerHTML = html
              // .replace(/\[prependText\]/ig, 'Motivo')
              // .replace(/\[id\]/ig, valueId)
              // mainWrapper.appendChild(template.content.cloneNode(true))
              // for (var j = 0; j < pacientInfo[fnVariable].locked[i][keyText]['child'].length; j++) {
              //   console.log('============ child values')
              //   console.log(pacientInfo[fnVariable].locked[i][keyText]['child'][j])

              // }
            }


          }

        }
      }
      if(pacientInfo[fnVariable].open){
        for (var i = 0; i < pacientInfo[fnVariable].open.length; i++) {
          // if (pacientInfo[fnVariable].open[i]['groupedOption']) {
          //   console.log('============')
          //   var keyText = Object.keys(pacientInfo[fnVariable].open[i])[0]
          //   var keyId = Prognosis.i.removeAccent(keyText).replace(new RegExp('[ ]','ig'), '-')
          //   var template = document.createElement('template')
          //   var html = Prognosis.playerGroupedOption
          //   template.innerHTML = html
          //   .replace(/\[prependText\]/ig, keyText+i)
          //   .replace(/\[id\]/ig, keyId)
          //   mainWrapper.appendChild(template.content.cloneNode(true))
          //   for (var z = 0; z < pacientInfo[fnVariable].open[i]['groupedOption'].length; z++) {
          //     for (var k = 0; k < Object.keys(pacientInfo[fnVariable].open[i]['groupedOption'][z]).length; k++) {
          //       console.log('============a')
          //       console.log(Object.entries(pacientInfo[fnVariable].open[i]['groupedOption'][z]))
          //       var optionText = Object.keys(pacientInfo[fnVariable].open[i]['groupedOption'][z])[k]
          //       var optionId = Prognosis.i.removeAccent(optionText).replace(new RegExp('[ ]','ig'), '-')
          //       var value = pacientInfo[fnVariable].open[i]['groupedOption'][z]
          //         [Object.keys(pacientInfo[fnVariable].open[i]['groupedOption'][z])[k]]['values'][0]
          //       var textSelect = document.querySelector('#options-'+keyId+'-wrapper')
          //
          //       var template = document.createElement('template')
          //       template.innerHTML = Prognosis.playerOptionRadio
          //       .replace(/\[name\]/ig, optionId)
          //       .replace(/\[id\]/ig, (optionId+'-'+Prognosis.i.removeAccent(value)))
          //       .replace(/\[value\]/ig, (value))
          //       .replace(/\[valueText\]/ig, value)
          //       textSelect.appendChild(template.content.cloneNode(true))
          //       var prependOption = document.createElement('label')
          //       prependOption.classList.add('input-group-text')
          //       prependOption.innerHTML = optionText
          //       var optionContainer = textSelect.querySelector('#'+(optionId+'-'+Prognosis.i.removeAccent(value)))
          //       console.log('============')
          //       console.log(optionContainer)
          //       optionContainer.parentElement.insertBefore(template.content.cloneNode(true), optionContainer)
          //       /*<label class="input-group-text">Temperatura</label>*/
          //     }
          //
          //   }
          // }
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
            // template.innerHTML = Prognosis.playerOptionInputDisabled
            // .replace(/\[value\]/ig, keyText)
            // .replace(/\[id\]/ig, keyId)
            // textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            for (var z = 0; z < pacientInfo[fnVariable].open[i][keyText]['values'].length; z++) {
              var value = pacientInfo[fnVariable].open[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value)))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }

          }else if (pacientInfo[fnVariable].open[i][keyText]['cascade'] &&
          pacientInfo[fnVariable].open[i][keyText]['cascade'] == 'true'){
            var template = document.createElement('template')
            var cascadeDiv = document.createElement('div')

            if(pacientInfo[fnVariable].open[i][keyText]['radioYN']){
              template = document.createElement('template')
              // template.innerHTML = Prognosis.playerOptionInputDisabled
              // .replace(/\[value\]/ig, keyText)
              // .replace(/\[id\]/ig, '')
              // textSelect.appendChild(template.content.cloneNode(true))
              var obj = document.querySelector('#options-'+ keyId+'-wrapper')
              obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
              obj.prependTxt.copy = document.createElement('label')
              obj.prependTxt.copy.classList.add('input-group-text')
              obj.prependTxt.copy.textContent = keyText
              obj.prependTxt.appendChild(obj.prependTxt.copy)
              template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[id\]/ig, keyId+'-nao')
              .replace(/\[name\]/ig, keyId)
              .replace(/\[value\]/ig, 'Não')
              .replace(/\[valueText\]/ig, 'Não')
              textSelect.appendChild(template.content.cloneNode(true))

              template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[id\]/ig, keyId+'-sim')
              .replace(/\[name\]/ig, keyId)
              .replace(/\[value\]/ig, 'Sim')
              .replace(/\[valueText\]/ig, 'Sim')
              textSelect.appendChild(template.content.cloneNode(true))
            }else{
              template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionCheckbox
              .replace(/\[id\]/ig, keyId)
              .replace(/\[value\]/ig, keyText)
              .replace(/\[valueText\]/ig, keyText)
              textSelect.appendChild(template.content.cloneNode(true))
            }

            cascadeDiv.id = keyId + '-wrapper'
            cascadeDiv.classList.add('progn-multi-wrapper','d-none', 'border', 'rounded')
            // cascadeDiv.setAttribute('disabled','')
            cascadeDiv.style.backgroundColor = "#b5b5b5"
            textSelect.appendChild(cascadeDiv)
            for (var z = 0; z < pacientInfo[fnVariable].open[i][keyText]['values'].length; z++) {
              var valueText = pacientInfo[fnVariable].open[i][keyText]['values'][z]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              if((pacientInfo[fnVariable].open[i][keyText]['values'].length == 2
              || pacientInfo[fnVariable].open[i][keyText]['uniqueValues'] &&
              pacientInfo[fnVariable].open[i][keyText]['uniqueValues'] == 'true')
              && (!pacientInfo[fnVariable].open[i][keyText]['multipleValues'] ||
              pacientInfo[fnVariable].open[i][keyText]['multipleValues'] != 'true')){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, valueId)
                .replace(/\[name\]/ig, keyId+'-value')
                .replace(/\[value\]/ig, (valueText))
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+cascadeDiv.id).appendChild(template.content.cloneNode(true))

              }else if (pacientInfo[fnVariable].open[i][keyText]['multipleValues'] ||
              pacientInfo[fnVariable].open[i][keyText]['multipleValues'] == 'true'){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
              }else{
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionCheckbox
                .replace(/\[id\]/ig, valueId)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+(keyId)+'-wrapper').appendChild(template.content.cloneNode(true))
              }

            }
            if(pacientInfo[fnVariable].open[i][keyText]['child']){
              var cascadeDivChild = document.createElement('div')
              cascadeDivChild.id = keyId+'-value'+ '-wrapper'
              cascadeDivChild.classList.add('progn-multi-wrapper','d-none', 'border', 'rounded')
              // cascadeDiv.setAttribute('disabled','')
              cascadeDivChild.style.backgroundColor = "#cebfbf"
              cascadeDiv.appendChild(cascadeDivChild)
              for (var z = 0; z < pacientInfo[fnVariable].open[i][keyText]['child'].length; z++) {
                var childText = pacientInfo[fnVariable].open[i][keyText]['child'][z]
                var childId = Prognosis.i.removeAccent(childText).replace(new RegExp('[ ]','ig'), '-')
                if(pacientInfo[fnVariable].open[i][keyText]['child'].length == 2){
                  template = document.createElement('template')
                  template.innerHTML = Prognosis.playerOptionRadio
                  .replace(/\[id\]/ig, childId)
                  .replace(/\[name\]/ig, childId+'-value')
                  .replace(/\[valueText\]/ig, childText)
                  document.querySelector('#'+cascadeDivChild.id).appendChild(template.content.cloneNode(true))

                }else{
                  template = document.createElement('template')
                  template.innerHTML = Prognosis.playerOptionCheckbox
                  .replace(/\[id\]/ig, childId)
                  .replace(/\[value\]/ig, childText)
                  .replace(/\[valueText\]/ig, childText)
                  document.querySelector('#'+cascadeDivChild.id).appendChild(template.content.cloneNode(true))
                }
              }
            }
          }
          else if(pacientInfo[fnVariable].open[i][keyText]['uniqueValues'] &&
          pacientInfo[fnVariable].open[i][keyText]['uniqueValues'] == 'true'){
            var template = document.createElement('template')
            // template.innerHTML = Prognosis.playerOptionInputDisabled
            // .replace(/\[value\]/ig, keyText)
            // .replace(/\[id\]/ig, keyId)
            // textSelect.appendChild(template.content.cloneNode(true))
            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)
            //Hide input and add the value to prepend text
            // document.querySelector('#'+keyId).setAttribute('hidden','')
            // document.querySelector('#'+keyId).removeAttribute('disabled')
            // obj.parentElement.querySelector('.input-group-prepend')

            for (var z = 0; z < pacientInfo[fnVariable].open[i][keyText]['values'].length; z++) {
              var value = pacientInfo[fnVariable].open[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-')))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }
          }
          else{
              // document.querySelector('#options-'+keyId+'-wrapper').appendChild(template.content.cloneNode(true))
              var obj = document.querySelector('#options-'+ keyId+'-wrapper')
              obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
              obj.prependTxt.copy = document.createElement('label')
              obj.prependTxt.copy.classList.add('input-group-text')
              obj.prependTxt.copy.textContent = keyText
              obj.prependTxt.appendChild(obj.prependTxt.copy)
              for (var k = 0; k < pacientInfo[fnVariable].open[i][keyText]['values'].length; k++) {
                var valueText = pacientInfo[fnVariable].open[i][keyText]['values'][k]
                var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
                var template = document.createElement('template')
                var html = Prognosis.playerOptionCheckbox

                template.innerHTML = html
                .replace(/\[valueText\]/ig, valueText)
                .replace(/\[value\]/ig, valueText)
                .replace(/\[id\]/ig, valueId)
                var optionsWrapper = mainWrapper.querySelector('#options-'+keyId+'-wrapper')
                optionsWrapper.appendChild(template.content.cloneNode(true))
              }
              if(pacientInfo[fnVariable].open[i][keyText]['child']){
                var template = document.createElement('template')
                var html = Prognosis.playerOption

                // template.innerHTML = html
                // .replace(/\[prependText\]/ig, 'Motivo')
                // .replace(/\[id\]/ig, valueId)
                // mainWrapper.appendChild(template.content.cloneNode(true))
                // for (var j = 0; j < pacientInfo[fnVariable].open[i][keyText]['child'].length; j++) {
                //   console.log('============ child values')
                //   console.log(pacientInfo[fnVariable].open[i][keyText]['child'][j])

                // }
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
  <div class="input-group-prepend ">
  </div>
  <div class="d-flex flex-grow-1 border col flex-wrap" id="options-[id]-wrapper">
  </div>
  </div>
  `
  Prognosis.playerOptionLocked =
  `
  <div class="input-group mb-2 d-flex no-gutters disabled-lock">
  <div class="input-group-prepend ">
  </div>
  <div class="d-flex flex-grow-1 border col" id="options-[id]-wrapper">
  </div>
  </div>
  `
  Prognosis.playerGroupedOption =
  `
  <div class="input-group mb-2 d-flex no-gutters">
    <div class="input-group-prepend ">
      <label class="input-group-text">[prependText]</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" name="" id="[id]" value="">
      <label class="form-check-label" for="[id]">Activate</label>
    </div>
    <div class="w-100">
    </div>
    <div class="d-flex flex-grow-1 border col flex-wrap" id="options-[id]-wrapper">
    </div>
  </div>
  `
  Prognosis.playerOptionCheckbox = `
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="[id]" value="[value]">
  <label class="form-check-label" for="[id]">[valueText]</label>
  </div>`

  Prognosis.playerOptionRadio = `
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name=[name] id="[id]" value="[value]">
  <label class="form-check-label" for="[id]">[valueText]</label>
  </div>`

  Prognosis.playerOptionInputDisabled = `

  <input class="form-control h-100" type="text" id="[id]" value="[value]" disabled>
  `
})()
