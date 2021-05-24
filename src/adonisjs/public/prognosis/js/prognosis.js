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
    if (new URL(document.location).pathname == '/prognosis/learn/player/') {
      Prognosis.i.getPacientOptions()

      const nextStep =  document.querySelector('#btn-next-step')
      const fnnextStep = function (){
        if(this.form.checkValidity()){
            window.location.href = `/prognosis/learn/player/result?sapsCalc=${this.form.querySelector('#saps-survival').value}&playerCalc=${this.form.querySelector('#player-survival-rate').value}`
        }
        // console.log(this.form.querySelector('#saps-survival').value)
        // console.log(this.form.querySelector('#player-survival-rate').value)
      }
      nextStep.addEventListener('click', fnnextStep)

      const createPacientBtn =  document.querySelector('#btn-create-pacient')
      const fnCreatePacientBtn = function (){
        if(this.form.checkValidity())
          Saps.i.calcSaps3Score(this.form)
      }
      createPacientBtn.addEventListener('click', fnCreatePacientBtn)

      const playerSurvivalRate = document.querySelector('#player-survival-rate')
      playerSurvivalRate.addEventListener('keyup', function(){
        if(!this.checkValidity()){
          this.reportValidity()
        }
      })

    }
    if (new URL(document.location).pathname.includes('/prognosis/calculator')){
      Prognosis.i.getPacientOptions(true)
    }
    if (new URL(document.location).pathname.includes('/prognosis/creation')){
      var btnAddOption = document.querySelectorAll('.btn-add-option')
      for (var btn of btnAddOption) {
        // console.log('============')
        // console.log(btn)
        btn.addEventListener('click', Prognosis.i.addPacientVariableOption)
      }
      document.querySelector('#btn-update-idade-option').addEventListener('click', Prognosis.i.updatePacientVariableOption)
    }
    if (new URL(document.location).pathname.includes('/learn/player/result')){
      for (var elem of document.querySelectorAll('input')) {
        elem.checked = false
      }
      Prognosis.i.playerResult()
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

  async pacientFormValidation(form){

    //Check if input has attribute 'required', also removes 'required' if input is hidden
    const fnChildInputs = function (){
      var dependantInput = document.querySelectorAll(`div.d-none.progn-multi-wrapper[id*="wrapper"] > div.form-check > input`)
      for (var elem of dependantInput) {
        elem.required = false
      }
      dependantInput = document.querySelectorAll(`div.progn-multi-wrapper:not(.d-none)[id*="wrapper"] > div.form-check > input`)
      for (var elem of dependantInput) {
        if(!elem.required)
          elem.required = true
      }
    }
    for (var elem of document.querySelectorAll(`div.progn-multi-wrapper[id*="wrapper"] > div.form-check > input`)) {
      elem.removeEventListener('change', fnChildInputs)
      elem.addEventListener('change', fnChildInputs)
    }
    const fnCheckboxRequired = function (){

      var checkboxGroup = this.parentElement.parentElement.querySelectorAll('div.form-check > input[type=checkbox]')
      var checkboxChecked = false
      for (var elem of checkboxGroup) {
        if (elem.checked == true)
           checkboxChecked = true
      }
      if(checkboxChecked){
        for (var elem of checkboxGroup) {
          if(!elem.checked && elem.required == true){
            elem.required = false
          }else if(elem.checked && elem.required == false){
            elem.required = true
          }
        }
      }
      if(!checkboxChecked){
        for (var elem of checkboxGroup) {
          if(!elem.checked && elem.required == false){
            elem.required = true
          }
        }
      }
    }
    var checkboxes = document.querySelectorAll(`div[id*="wrapper"] > div.form-check > input[type=checkbox]`)
    for (var elem of checkboxes) {
      elem.removeEventListener('change', fnCheckboxRequired)
      elem.addEventListener('change', fnCheckboxRequired)
    }

    fnChildInputs()
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
        "pacients":[
          {
            "dificuldade": "1",
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
              "locked": [],
              "open": [
                {
                  "Admissão Planejada": {
                    "values":[
                      "Não",
                      "Sim",
                    ]
                  },
                },
                {
                  "Submetido à cirurgia": {
                    "cascade": "true",
                    "radioYN": "true",
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
                  "Motivo de admissão na UTI": {
                    "values": [
                      "Arritmia",
                      "Choque hipovolêmico",
                      "Outro choque",
                      "Convulsão",
                      "Abdome agudo",
                      "Pancreatite grave",
                      "Déficit focal",
                      "Efeito de massa intracraniana",
                      "Insuficiência hepática",
                      "Alteração do nível de consciência",
                      "Nenhum dos anteriores",
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
                {
                  "Pressão sistólica": {
                    "uniqueValues":"true",
                    "values": [
                      "<40 mmHg",
                      "40-69 mmHg",
                      "70-119 mmHg",
                      ">=120 mmHg",
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
          },
          {
            "dificuldade": "2",
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
                      "Cirurgia eletiva",
                    ],
                    "child": [
                      "Transplante",
                    ],
                  },
                },
                {
                  "Motivo de admissão na UTI": {
                    "values": [
                      "Nenhum dos anteriores",
                    ],
                  },
                },
              ],
              "open": [

              ]
            },
            "statusClinico": {
              "locked": [],
              "open": [
                {
                  "Escala de Coma de Glasgow": {
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
                {
                  "Pressão sistólica": {
                    "uniqueValues":"true",
                    "values": [
                      "<40 mmHg",
                      "40-69 mmHg",
                      "70-119 mmHg",
                      ">=120 mmHg",
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
          },
          {
            "dificuldade": "3",
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
                      "Não",
                    ]
                  },
                },
                {
                  "Submetido à cirurgia": {
                    "cascade": "true",
                    "radioYN": "true",
                    "values": [
                    ],
                    "child": [
                    ],
                  },
                },
                {
                  "Motivo de admissão na UTI": {
                    "values": [
                      "Outro choque",
                      "Pancreatite grave",
                    ],
                  },
                },
              ],
              "open": [

              ]
            },
            "statusClinico": {
              "locked": [],
              "open": [
                {
                  "Escala de Coma de Glasgow": {
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
                {
                  "Pressão sistólica": {
                    "uniqueValues":"true",
                    "values": [
                      "<40 mmHg",
                      "40-69 mmHg",
                      "70-119 mmHg",
                      ">=120 mmHg",
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
          },
          {
            "dificuldade": "4",
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
                      "Não",
                    ]
                  },
                },
                {
                  "Submetido à cirurgia": {
                    "cascade": "true",
                    "radioYN": "true",
                    "values": [
                      "Cirurgia urgência"
                    ],
                    "child": [
                      "NRC por AVC"
                    ],
                  },
                },
                {
                  "Motivo de admissão na UTI": {
                    "values": [
                      "Efeito de massa intracraniana"
                    ],
                  },
                },
              ],
              "open": [

              ]
            },
            "statusClinico": {
              "locked": [],
              "open": [
                {
                  "Escala de Coma de Glasgow": {
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
                {
                  "Pressão sistólica": {
                    "uniqueValues":"true",
                    "values": [
                      "<40 mmHg",
                      "40-69 mmHg",
                      "70-119 mmHg",
                      ">=120 mmHg",
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
          },
          {
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
          },
          {
            "dificuldade": "6",
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
                      "Não",
                    ]
                  },
                },
                {
                  "Submetido à cirurgia": {
                    "cascade": "true",
                    "radioYN": "true",
                    "values": [
                    ],
                    "child": [
                    ],
                  },
                },
                {
                  "Motivo de admissão na UTI": {
                    "values": [
                      "Outro choque",
                      "Pancreatite grave",
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
                      "Sim",
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
          },
          {
            "dificuldade": "7",
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
                {
                  "Internado antes da admissão": {
                    "cascade": "true",
                    "radioYN": "true",
                    "uniqueValues":"true",
                    "values": [
                      ">=28 dias",
                    ],
                  },
                },
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
              ],
            },
            "motivoAdmissao": {
              "locked": [
                {
                  "Admissão Planejada": {
                    "values":[
                      "Não",
                    ]
                  },
                },
                {
                  "Submetido à cirurgia": {
                    "cascade": "true",
                    "radioYN": "true",
                    "values": [
                    ],
                    "child": [
                    ],
                  },
                },
                {
                  "Motivo de admissão na UTI": {
                    "values": [
                      "Outro choque",
                      "Pancreatite grave",
                    ],
                  },
                },
                {
                  "Infectado antes da admissão": {
                    "cascade": "true",
                    "radioYN": "true",
                    "multipleValues": "true",
                    "values": [
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
                      "Sim",
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
          },
          {
            "dificuldade": "8",
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
                {
                  "Internado antes da admissão": {
                    "cascade": "true",
                    "radioYN": "true",
                    "uniqueValues":"true",
                    "values": [
                      ">=28 dias",
                    ],
                  },
                },
              ],
              "open": [
                {
                  "Portador de":{
                    "selectList": "true",
                    "values":[
                      "IC NYHA IV",
                      "Câncer metastático",
                      "Terapia oncológica",
                      "Câncer hematológico",
                      "Cirrose",
                      "SIDA",
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
                      "Não",
                    ]
                  },
                },
                {
                  "Submetido à cirurgia": {
                    "cascade": "true",
                    "radioYN": "true",
                    "values": [
                    ],
                    "child": [
                    ],
                  },
                },
                {
                  "Motivo de admissão na UTI": {
                    "values": [
                      "Outro choque",
                      "Pancreatite grave",
                    ],
                  },
                },
                {
                  "Infectado antes da admissão": {
                    "cascade": "true",
                    "radioYN": "true",
                    "multipleValues": "true",
                    "values": [
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
                      "Sim",
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
                  "Alterações laboratoriais 1":{
                    "groupedChoices": "true",
                    "values":[
                      {
                        "Bilirrubina": {
                          "values": [
                            ">=6 mg/dl",
                          ],
                        },
                      },
                      {
                        "Creatinina": {
                          "values": [
                            ">=3.5 mg/dl",
                          ],
                        },
                      },
                      {
                        "Oxigenação": {
                          "values": [
                            "P/F >=100 em VM",
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  "Alterações laboratoriais 2":{
                    "groupedChoices": "true",
                    "values":[
                      {
                        "pH": {
                          "values": [
                            "<=7.25"
                          ],
                        },
                      },
                      {
                        "Leucócitos": {
                          "values": [
                            ">=15mil /mm³",
                          ],
                        },
                      },
                      {
                        "Plaquetas": {
                          "values": [
                            "<20mil /mm³",
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            "dificuldade": "9",
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
                {
                  "Internado antes da admissão": {
                    "cascade": "true",
                    "radioYN": "true",
                    "uniqueValues":"true",
                    "values": [
                      ">=28 dias",
                    ],
                  },
                },
              ],
              "open": [
                {
                  "Portador de":{
                    "selectList": "true",
                    "values":[
                      "IC NYHA IV",
                      "Câncer metastático",
                      "Terapia oncológica",
                      "Câncer hematológico",
                      "Cirrose",
                      "SIDA",
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
                      "Não",
                    ]
                  },
                },
                {
                  "Submetido à cirurgia": {
                    "cascade": "true",
                    "radioYN": "true",
                    "values": [
                    ],
                    "child": [
                    ],
                  },
                },
                {
                  "Motivo de admissão na UTI": {
                    "values": [
                      "Outro choque",
                      "Pancreatite grave",
                    ],
                  },
                },
                {
                  "Infectado antes da admissão": {
                    "cascade": "true",
                    "radioYN": "true",
                    "multipleValues": "true",
                    "values": [
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
                  "Droga vasoativa": {
                    "uniqueValues":"true",
                    "values": [
                      "Sim",
                    ]
                  },
                },
              ],
              "open": [
                {
                  "Status clínico 1": {
                    "groupedChoices": "true",
                    "values": [
                      {
                          "Temperatura": {
                            "values": [
                              "<35 °C",
                            ],
                          },
                        },
                      {
                          "Frequência cardíaca": {
                            "values": [
                              ">=160 bpm",
                            ],
                          },
                        },
                    ]
                  }
                },
                {
                  "Status clínico 2": {
                    "groupedChoices": "true",
                    "values": [
                      {
                        "Escala de Coma de Glasgow": {
                          "uniqueValues":"true",
                          "values": [
                            "3-4",
                          ],
                        },
                      },
                      {
                          "Pressão sistólica": {
                            "values": [
                              "<40 mmHg",
                            ],
                          },
                        },
                    ]
                  }
                },

              ],
            },
            "alteracoesLab": {
              "locked": [],
              "open": [
                {
                  "Alterações laboratoriais 1":{
                    "groupedChoices": "true",
                    "values":[
                      {
                        "Bilirrubina": {
                          "values": [
                            ">=6 mg/dl",
                          ],
                        },
                      },
                      {
                        "Creatinina": {
                          "values": [
                            ">=3.5 mg/dl",
                          ],
                        },
                      },
                      {
                        "Oxigenação": {
                          "values": [
                            "P/F >=100 em VM",
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  "Alterações laboratoriais 2":{
                    "groupedChoices": "true",
                    "values":[
                      {
                        "pH": {
                          "values": [
                            "<=7.25"
                          ],
                        },
                      },
                      {
                        "Leucócitos": {
                          "values": [
                            ">=15mil /mm³",
                          ],
                        },
                      },
                      {
                        "Plaquetas": {
                          "values": [
                            "<20mil /mm³",
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            "dificuldade": "10",
            "idade":{
              "locked": [
                "<40"
              ],
              "open": []
            },
            "origem":{
              "locked": [
                "Nenhuma das anteriores"
              ],
              "open": [
              ],
            },
            "comorbidade":{
              "locked": [
                {
                  "Internado antes da admissão": {
                    "cascade": "true",
                    "radioYN": "true",
                    "uniqueValues":"true",
                    "values": [
                      ">=28 dias",
                    ],
                  },
                },
              ],
              "open": [
                {
                  "Portador de":{
                    "selectList": "true",
                    "values":[
                      "IC NYHA IV",
                      "Câncer metastático",
                      "Terapia oncológica",
                      "Câncer hematológico",
                      "Cirrose",
                      "SIDA",
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
                      "Não",
                    ]
                  },
                },
                {
                  "Submetido à cirurgia": {
                    "cascade": "true",
                    "radioYN": "true",
                    "values": [
                    ],
                    "child": [
                    ],
                  },
                },
                {
                  "Motivo de admissão na UTI": {
                    "values": [
                      "Outro choque",
                      "Pancreatite grave",
                    ],
                  },
                },
                {
                  "Infectado antes da admissão": {
                    "cascade": "true",
                    "radioYN": "true",
                    "multipleValues": "true",
                    "values": [
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
                  "Droga vasoativa": {
                    "uniqueValues":"true",
                    "values": [
                      "Sim",
                    ]
                  },
                },
                {
                  "Escala de Coma de Glasgow": {
                    "uniqueValues":"true",
                    "values": [
                      "3-4",
                    ],
                  },
                },
              ],
              "open": [
                {
                  "Status": {
                    "selectList": "true",
                    "values": [
                      {
                        "Temperatura": {
                          "values": [
                            "<35 °C",
                          ],
                        },
                      },
                      {
                        "Frequência cardíaca": {
                          "values": [
                            ">=160 bpm",
                          ],
                        },
                      },
                      {
                        "Pressão sistólica": {
                          "values": [
                            "<40 mmHg",
                          ],
                        },
                      },
                    ]
                  }
                },
              ],
            },
            "alteracoesLab": {
              "locked": [],
              "open": [
                {
                  "Alteração":{
                    "selectList": "true",
                    "values":[
                      {
                        "Plaquetas": {
                          "values": [
                            "<20mil /mm³",
                          ],
                        },
                      },
                      {
                        "Oxigenação": {
                          "values": [
                            "P/F >=100 em VM",
                          ],
                        },
                      },
                      {
                        "Bilirrubina": {
                          "values": [
                            ">=6 mg/dl",
                          ],
                        },
                      },
                      {
                        "Leucócitos": {
                          "values": [
                            ">=15mil /mm³",
                          ],
                        },
                      },
                      {
                        "pH": {
                          "values": [
                            "<=7.25",
                          ],
                        },
                      },
                    ]
                  }
                },
              ],
            },
          },
        ]
      }

    }
    var selectedPacient
    if((localStorage.getItem('prognosis-current-lvl') && localStorage.getItem('prognosis-current-lvl') != 'null') || new URL(document.location).searchParams.get('diffic')){
      if(localStorage.getItem('prognosis-current-lvl') != new URL(document.location).searchParams.get('diffic')){
        localStorage.setItem('prognosis-current-lvl', new URL(document.location).searchParams.get('diffic'))
      }
      selectedPacient = pacientInfo.pacients[localStorage.getItem('prognosis-current-lvl')-1]
    }else{

      selectedPacient = pacientInfo.pacients[0]
      localStorage.setItem('prognosis-current-lvl', pacientInfo.pacients[0].dificuldade)
    }


    if(document.querySelector('h1.pacient-title')){
      var title = document.querySelector('h1.pacient-title')
      title.innerHTML = 'João V'+selectedPacient.dificuldade
    }

    ////////////////////////////////// IDADE ///////////////////////////////////////////////////
    if (selectedPacient.idade.open && selectedPacient.idade.open.length > 0) {
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

      for (var i = 0; i < selectedPacient.idade.open.length; i++) {
        option = document.createElement('option')
        option.value = selectedPacient.idade.open[i]
        option.innerHTML = selectedPacient.idade.open[i]+' anos'
        htmlSelect.appendChild(option)


      }
    }
    if(selectedPacient.idade.locked && selectedPacient.idade.locked.length > 0){
      var idadeWrapper = document.querySelector('#idade-wrapper')
      var selectWrapper = idadeWrapper.querySelector('div.input-group')
      var htmlSelect = document.createElement('select')

      selectWrapper.classList.add('disabled-lock')
      htmlSelect.setAttribute('required','')
      htmlSelect.classList.add('custom-select', 'disabled-lock')
      htmlSelect.id = 'idade'
      selectWrapper.appendChild(htmlSelect)

      for (var i = 0; i < selectedPacient.idade.locked.length; i++) {
        option = document.createElement('option')
        option.value = selectedPacient.idade.locked[i]
        option.innerHTML = selectedPacient.idade.locked[i]+' anos'
        htmlSelect.appendChild(option)


      }
    }
    ////////////////////////////////// ORIGEM ///////////////////////////////////////////////////
    if (selectedPacient.origem.open && selectedPacient.origem.open.length > 0) {
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

      for (var i = 0; i < selectedPacient.origem.open.length; i++) {
        option = document.createElement('option')
        option.value = selectedPacient.origem.open[i]
        option.innerHTML = selectedPacient.origem.open[i]
        htmlSelect.appendChild(option)
      }
    }
    if (selectedPacient.origem.locked && selectedPacient.origem.locked.length > 0) {
      var idadeWrapper = document.querySelector('#origem-wrapper')
      var selectWrapper = idadeWrapper.querySelector('div.input-group')
      var htmlSelect = document.createElement('select')

      selectWrapper.classList.add('disabled-lock')
      htmlSelect.classList.add('custom-select', 'disabled-lock')
      htmlSelect.setAttribute('required','')
      htmlSelect.id = 'origem'
      selectWrapper.appendChild(htmlSelect)

      for (var i = 0; i < selectedPacient.origem.locked.length; i++) {
        option = document.createElement('option')
        option.value = selectedPacient.origem.locked[i]
        option.innerHTML = selectedPacient.origem.locked[i]
        htmlSelect.appendChild(option)
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    function objectfyPlayerOptions(fnVariable, fnWrapper, fnPrependTxt){
      const mainWrapper = document.querySelector('#'+fnWrapper)
      if(selectedPacient[fnVariable].locked) {
        for (var i = 0; i < selectedPacient[fnVariable].locked.length; i++) {
          var keyText = Object.keys(selectedPacient[fnVariable].locked[i])[0]
          var keyId = Prognosis.i.removeAccent(keyText).replace(new RegExp('[ ]','ig'), '-')
          var template = document.createElement('template')
          var html = Prognosis.playerOptionLocked
          template.innerHTML = html
          .replace(/\[prependText\]/ig, fnPrependTxt)
          .replace(/\[id\]/ig, keyId)
          mainWrapper.appendChild(template.content.cloneNode(true))
          var textSelect = document.querySelector('#options-'+keyId+'-wrapper')
          if(selectedPacient[fnVariable].locked[i][keyText]['values'].length == 1 &&
          (selectedPacient[fnVariable].locked[i][keyText]['values'][0] == "Sim" ||
          selectedPacient[fnVariable].locked[i][keyText]['values'][0] == "Não"))
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
            for (var z = 0; z < selectedPacient[fnVariable].locked[i][keyText]['values'].length; z++) {
              var value = selectedPacient[fnVariable].locked[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value)))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
              textSelect.querySelector('#'+(keyId+'-'+Prognosis.i.removeAccent(value))).checked = true
            }

          }else if (selectedPacient[fnVariable].locked[i][keyText]['cascade']
          && selectedPacient[fnVariable].locked[i][keyText]['cascade'] == 'true'){
            var template = document.createElement('template')
            var cascadeDiv = document.createElement('div')

            if(selectedPacient[fnVariable].locked[i][keyText]['radioYN']){
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
              if(selectedPacient[fnVariable].locked[i][keyText]['values']
              && selectedPacient[fnVariable].locked[i][keyText]['values'].length > 0){
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
            if(selectedPacient[fnVariable].locked[i][keyText]['values'].length > 0){
              cascadeDiv.classList.add('border', 'rounded')
              // cascadeDiv.setAttribute('disabled','')
              cascadeDiv.style.backgroundColor = "#b5b5b5"
            }
            textSelect.appendChild(cascadeDiv)
            for (var z = 0; z < selectedPacient[fnVariable].locked[i][keyText]['values'].length; z++) {
              var valueText = selectedPacient[fnVariable].locked[i][keyText]['values'][z]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              if((selectedPacient[fnVariable].locked[i][keyText]['values'].length == 2
              || selectedPacient[fnVariable].locked[i][keyText]['uniqueValues'] &&
              selectedPacient[fnVariable].locked[i][keyText]['uniqueValues'] == 'true')
              && (!selectedPacient[fnVariable].locked[i][keyText]['multipleValues'] ||
              selectedPacient[fnVariable].locked[i][keyText]['multipleValues'] != 'true')){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, valueId)
                .replace(/\[name\]/ig, keyId+'-value')
                .replace(/\[value\]/ig, (valueText))
                .replace(/\[valueText\]/ig, valueText)
                textSelect.querySelector('#'+cascadeDiv.id).appendChild(template.content.cloneNode(true))
                textSelect.querySelector('#'+valueId).checked = true
              }else if (selectedPacient[fnVariable].locked[i][keyText]['multipleValues'] ||
              selectedPacient[fnVariable].locked[i][keyText]['multipleValues'] == 'true'){
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
            if(selectedPacient[fnVariable].locked[i][keyText]['child']){
              var cascadeDivChild = document.createElement('div')
              cascadeDivChild.id = keyId+'-value'+ '-wrapper'
              cascadeDivChild.classList.add('border', 'rounded')
              // cascadeDiv.setAttribute('disabled','')
              cascadeDivChild.style.backgroundColor = "#cebfbf"
              cascadeDiv.appendChild(cascadeDivChild)
              for (var z = 0; z < selectedPacient[fnVariable].locked[i][keyText]['child'].length; z++) {
                var childText = selectedPacient[fnVariable].locked[i][keyText]['child'][z]
                var childId = Prognosis.i.removeAccent(childText).replace(new RegExp('[ ]','ig'), '-')
                if(selectedPacient[fnVariable].locked[i][keyText]['child'].length == 2){
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
          else if(selectedPacient[fnVariable].locked[i][keyText]['uniqueValues'] &&
          selectedPacient[fnVariable].locked[i][keyText]['uniqueValues'] == 'true'){
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

            for (var z = 0; z < selectedPacient[fnVariable].locked[i][keyText]['values'].length; z++) {
              var value = selectedPacient[fnVariable].locked[i][keyText]['values'][z]
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
            for (var k = 0; k < selectedPacient[fnVariable].locked[i][keyText]['values'].length; k++) {
              var valueText = selectedPacient[fnVariable].locked[i][keyText]['values'][k]
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
            if(selectedPacient[fnVariable].locked[i][keyText]['child']){
              var template = document.createElement('template')
              var html = Prognosis.playerOption

              // template.innerHTML = html
              // .replace(/\[prependText\]/ig, 'Motivo')
              // .replace(/\[id\]/ig, valueId)
              // mainWrapper.appendChild(template.content.cloneNode(true))
              // for (var j = 0; j < selectedPacient[fnVariable].locked[i][keyText]['child'].length; j++) {
              //   console.log('============ child values')
              //   console.log(selectedPacient[fnVariable].locked[i][keyText]['child'][j])

              // }
            }


          }

        }
      }
      if(selectedPacient[fnVariable].open){
        for (var i = 0; i < selectedPacient[fnVariable].open.length; i++) {
          var keyText = Object.keys(selectedPacient[fnVariable].open[i])[0]
          var keyId = Prognosis.i.removeAccent(keyText).replace(new RegExp('[ ]','ig'), '-')
          var template = document.createElement('template')
          var html = Prognosis.playerOption
          template.innerHTML = html
          .replace(/\[prependText\]/ig, fnPrependTxt)
          .replace(/\[id\]/ig, keyId)
          mainWrapper.appendChild(template.content.cloneNode(true))
          var textSelect = document.querySelector('#options-'+keyId+'-wrapper')
          if(selectedPacient[fnVariable].open[i][keyText]['values'].length == 2 &&
          (selectedPacient[fnVariable].open[i][keyText]['values'][0] == "Sim" ||
          selectedPacient[fnVariable].open[i][keyText]['values'][1] == "Sim"))
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
            for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['values'].length; z++) {
              var value = selectedPacient[fnVariable].open[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value)))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }

          }else if (selectedPacient[fnVariable].open[i][keyText]['cascade'] &&
          selectedPacient[fnVariable].open[i][keyText]['cascade'] == 'true'){
            var template = document.createElement('template')
            var cascadeDiv = document.createElement('div')

            if(selectedPacient[fnVariable].open[i][keyText]['radioYN']){
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
            for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['values'].length; z++) {
              var valueText = selectedPacient[fnVariable].open[i][keyText]['values'][z]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              if((selectedPacient[fnVariable].open[i][keyText]['values'].length == 2
              || selectedPacient[fnVariable].open[i][keyText]['uniqueValues'] &&
              selectedPacient[fnVariable].open[i][keyText]['uniqueValues'] == 'true')
              && (!selectedPacient[fnVariable].open[i][keyText]['multipleValues'] ||
              selectedPacient[fnVariable].open[i][keyText]['multipleValues'] != 'true')){
                template = document.createElement('template')
                template.innerHTML = Prognosis.playerOptionRadio
                .replace(/\[id\]/ig, valueId)
                .replace(/\[name\]/ig, keyId+'-value')
                .replace(/\[value\]/ig, (valueText))
                .replace(/\[valueText\]/ig, valueText)
                document.querySelector('#'+cascadeDiv.id).appendChild(template.content.cloneNode(true))

              }else if (selectedPacient[fnVariable].open[i][keyText]['multipleValues'] ||
              selectedPacient[fnVariable].open[i][keyText]['multipleValues'] == 'true'){
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
            if(selectedPacient[fnVariable].open[i][keyText]['child']){
              var cascadeDivChild = document.createElement('div')
              cascadeDivChild.id = keyId+'-value'+ '-wrapper'
              cascadeDivChild.classList.add('progn-multi-wrapper','d-none', 'border', 'rounded')
              // cascadeDiv.setAttribute('disabled','')
              cascadeDivChild.style.backgroundColor = "#cebfbf"
              cascadeDiv.appendChild(cascadeDivChild)
              for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['child'].length; z++) {
                var childText = selectedPacient[fnVariable].open[i][keyText]['child'][z]
                var childId = Prognosis.i.removeAccent(childText).replace(new RegExp('[ ]','ig'), '-')
                if(selectedPacient[fnVariable].open[i][keyText]['child'].length == 2){
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
          else if(selectedPacient[fnVariable].open[i][keyText]['uniqueValues'] &&
          selectedPacient[fnVariable].open[i][keyText]['uniqueValues'] == 'true'){
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

            for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['values'].length; z++) {
              var value = selectedPacient[fnVariable].open[i][keyText]['values'][z]
              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[name\]/ig, keyId)
              .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-')))
              .replace(/\[value\]/ig, (value))
              .replace(/\[valueText\]/ig, value)
              textSelect.appendChild(template.content.cloneNode(true))
            }
          }
          else if (selectedPacient[fnVariable].open[i][keyText]['selectList'] &&
          selectedPacient[fnVariable].open[i][keyText]['selectList'] == 'true') {
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerSelectList
            .replace(/\[id\]/ig, (keyId))
            textSelect.appendChild(template.content.cloneNode(true))

            var obj = document.querySelector('#options-'+ keyId+'-wrapper')
            obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
            obj.prependTxt.copy = document.createElement('label')
            obj.prependTxt.copy.classList.add('input-group-text')
            obj.prependTxt.copy.textContent = keyText
            obj.prependTxt.appendChild(obj.prependTxt.copy)

            for (var z = 0; z < selectedPacient[fnVariable].open[i][keyText]['values'].length; z++) {

              //Check if select list must include id (because of complex values. e.g.(id'bilirrubina' value'3-4'), instead of just 'bilirrubina')
              if(selectedPacient[fnVariable].open[i][keyText]['values'][z]
              [Object.keys(selectedPacient[fnVariable].open[i][keyText]['values'][z])]){
                var baseKey = selectedPacient[fnVariable].open[i][keyText]['values'][z]
                var valueText = Object.keys(baseKey)[0]
                var value = baseKey[Object.keys(baseKey)]['values'][0]

                const selectList = document.querySelector("#" + keyId)
                var option = document.createElement('option')
                option.textContent = valueText+': '+value
                option.value = value
                selectList.appendChild(option)
              }else{
                var value = selectedPacient[fnVariable].open[i][keyText]['values'][z]
                const selectList = document.querySelector("#" + keyId)
                var option = document.createElement('option')
                option.textContent = value
                option.value = (Prognosis.i.removeAccent(value).replace(new RegExp('[ ]','ig'), '-'))
                selectList.appendChild(option)
              }
            }
          }
          else if (selectedPacient[fnVariable].open[i][keyText]['groupedChoices'] &&
          selectedPacient[fnVariable].open[i][keyText]['groupedChoices'] == 'true') {
            var template = document.createElement('template')
            template.innerHTML = Prognosis.playerGroupedOption
            .replace(/\[id\]/ig, (keyId))
            .replace(/\[prependText\]/ig, (keyText))
            .replace(/\[name\]/ig, (keyId.substring(0,8)+'-activator'))
            textSelect.appendChild(template.content.cloneNode(true))

            var fnGroupActivator = function (){
              var groupValues = document.querySelectorAll(`[id^="options-"] > .input-group >
              [id^="grouped-"] > div > input`)
              for (var elem of groupValues) {
                var parentActivator = elem.parentElement.parentElement.id
                elem.checked = document.querySelector(`#${parentActivator.substring(8,(parentActivator.length - 8))}`).checked
              }
            }
            document.querySelector('#'+keyId).addEventListener('change', fnGroupActivator)

            for (var k = 0; k < selectedPacient[fnVariable].open[i][keyText]['values'].length; k++) {
              var baseKey = selectedPacient[fnVariable].open[i][keyText]['values'][k]
              var valueText = Object.keys(baseKey)[0]
              var valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
              var value = baseKey[valueText]['values'][0]

              var template = document.createElement('template')
              template.innerHTML = Prognosis.playerOptionRadio
              .replace(/\[valueText\]/ig, valueText+`: ${value}`)
              .replace(/\[value\]/ig, value)
              .replace(/\[id\]/ig, valueId)
              .replace(/\[name\]/ig, valueId)

              var optionsWrapper = mainWrapper.querySelector('#grouped-'+keyId+'-wrapper')
              optionsWrapper.appendChild(template.content.cloneNode(true))
              document.querySelector('#'+valueId).removeAttribute('required')
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
              for (var k = 0; k < selectedPacient[fnVariable].open[i][keyText]['values'].length; k++) {
                var valueText = selectedPacient[fnVariable].open[i][keyText]['values'][k]
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
              if(selectedPacient[fnVariable].open[i][keyText]['child']){
                var template = document.createElement('template')
                var html = Prognosis.playerOption

                // template.innerHTML = html
                // .replace(/\[prependText\]/ig, 'Motivo')
                // .replace(/\[id\]/ig, valueId)
                // mainWrapper.appendChild(template.content.cloneNode(true))
                // for (var j = 0; j < selectedPacient[fnVariable].open[i][keyText]['child'].length; j++) {
                //   console.log('============ child values')
                //   console.log(selectedPacient[fnVariable].open[i][keyText]['child'][j])

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
    Prognosis.i.pacientFormValidation()
  }

  async playerResult(){
    const playerGuess = new URL(document.location).searchParams.get('playerCalc')
    const sapsCalc = new URL(document.location).searchParams.get('sapsCalc')
    var numbers = document.querySelectorAll('.roulette-number')

    const createRoulette = function (sectN){
      const diameter = 100
      const svgSize = diameter + 10
      const stroke = "black"
      const strokeWidth = "2"
      const svgRoot = document.querySelector('#svg-wrapper')
      const svgEl = document.createElement('svg')
      svgEl.setAttribute('viewBox', '0 0 110 110')
      svgEl.setAttribute('width',svgSize)
      svgEl.setAttribute('height',svgSize)
      svgRoot.appendChild(svgEl)
      svgEl.appendChild(document.createElement('g'))
      const getSectorPath = (x, y, outerDiameter, sectN) => {
        for (var i = 0; i < sectN; i++) {
          var a1 = (360/sectN)*i
          var a2 = 360/sectN + a1

          var degtorad = Math.PI / 180
          var cr = outerDiameter / 2
          var cx1 = Math.cos(degtorad * a2) * cr + x
          var cy1 = -Math.sin(degtorad * a2) * cr + y
          var cx2 = Math.cos(degtorad * a1) * cr + x
          var cy2 = -Math.sin(degtorad * a1) * cr + y
          var d = `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 1 ${cx2} ${cy2}Z`
          var pathEl = document.createElement('path')
          pathEl.setAttribute('d',d)
          pathEl.setAttribute('stroke', stroke)
          pathEl.setAttribute('strokeWidth',strokeWidth)
          pathEl.setAttribute('fill','transparent')
          svgRoot.querySelector('svg > g').appendChild(pathEl)
          var txtX = (Math.cos(degtorad * (a1 + (360/sectN)/2)) * cr/2) + x
          var txtY = (-Math.sin(degtorad * (a1 + (360/sectN)/2)) * cr/2) + y
          var txtRoulette = document.createElement('text')
          txtRoulette.setAttribute('x', txtX)
          txtRoulette.setAttribute('y', txtY)
          txtRoulette.innerHTML = i+1
          svgRoot.querySelector('svg > g').appendChild(txtRoulette)
        }
      }
      getSectorPath((svgSize/2), (svgSize/2), diameter, sectN)
    }
    createRoulette(10)

    const availableN = Math.round(sapsCalc/10)
    var selectedN = []
    if (numbers) {
      var fnSelectNum = function (){
        var pathChild = this.querySelector('path')
        if((pathChild.getAttribute('fill') == 'white') && (availableN > selectedN.length)){
          selectedN.push(pathChild.previousSibling.innerHTML)
          pathChild.setAttribute('fill','#56c162')
          // this.style.backgroundColor = '#56c162'
        }
        else if(pathChild.getAttribute('fill') == '#56c162'){
          selectedN.pop(pathChild.previousSibling.innerHTML)
          // pathChild.checked = false
          pathChild.setAttribute('fill','white')
          // this.style.backgroundColor = 'white'
        }
        if(availableN == selectedN.length){
          document.querySelector('#roulette-invalid').classList.add('d-none')
        }
      }
      for (var elem of numbers) {
        elem.addEventListener('click', fnSelectNum)
      }
    }
      var playerTxt = document.querySelector('#player-guess')
      var sapsText = document.querySelector('#saps-calc')
      playerTxt.innerHTML = Prognosis.playerGuessTxt
      .replace(/\[playerGuess\]/ig, playerGuess+'%')
      sapsText.innerHTML = Prognosis.sapsCalcTxt
      .replace(/\[sapsSurvival\]/ig, sapsCalc+'%')
      .replace(/\[rouletteN\]/ig, Math.round(sapsCalc/10))

      const btnSpin = document.querySelector('#btn-spin-roulette')
      const fnBtnSpin = function (){
        const sapsCalc = new URL(document.location).searchParams.get('sapsCalc')
        if(availableN == selectedN.length){
          Prognosis.i.spinRoulette()
          document.querySelector('#roulette-invalid').classList.add('d-none')
          if(!document.querySelector('#btn-spin-roulette').innerHTML.includes('novamente'))
            document.querySelector('#btn-spin-roulette').innerHTML += ' novamente'

          const btnNextLvl = document.querySelector('#btn-next-lvl')
          btnNextLvl.classList.remove('d-none')
          btnNextLvl.addEventListener('click', function (){
            var nextLvl = parseInt(localStorage.getItem('prognosis-current-lvl'))+1
            if(nextLvl>10)
              nextLvl = 10
            document.location.href = '/prognosis/learn/player/?diffic=' + (nextLvl)
          })
        }else{
          document.querySelector('#roulette-invalid').classList.remove('d-none')
        }
      }
      btnSpin.addEventListener('click', fnBtnSpin)
  }

  async spinRoulette(){
    var selectedN = []
    var rouletteSvg = document.querySelector('svg.spin')
    var rouletteStyle = window.getComputedStyle(rouletteSvg,null)
    // var selectedNum = document.querySelectorAll('input[type="checkbox"]:checked')
    // for (var num of selectedNum) {
    //   selectedN.push(parseInt(num.value))
    //
    // }
    //
    //
    // var rand = Math.floor(Math.random() * 10) + 1
    // var inputResult = document.querySelector('input[value="'+rand+'"]')
    // inputResult.parentElement.style.backgroundColor = 'red'
    // // console.log('============ result')
    // // console.log(rand)
    // // console.log((selectedN.includes(rand)?'Paciente sobreviveu':'Paciente não sobreviveu'))
    // if(!document.querySelector('#roulette-result')){
    //   var resultTxt = document.createElement('h5')
    //   resultTxt.classList.add('text-light')
    //   resultTxt.id = 'roulette-result'
    // }else {
    //   var resultTxt = document.querySelector('#roulette-result')
    // }
    // var wrapper = document.querySelector('#form-pacient-info')
    // if(selectedN.includes(rand)){
    //   resultTxt.innerHTML = 'Paciente sobreviveu'
    //   if(!document.querySelector('#roulette-result'))
    //     wrapper.insertBefore(resultTxt, document.querySelector('.btn-info'))
    // }
    // else{
    //   resultTxt.innerHTML = 'Paciente não sobreviveu'
    //   if(!document.querySelector('#roulette-result'))
    //     wrapper.insertBefore(resultTxt, document.querySelector('.btn-info'))
    //
    // }

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
      <input class="form-check-input" type="radio" name="[name]" id="[id]" value="">
      <label class="form-check-label" for="[id]">Escolher esse grupo</label>
    </div>
    <div class="w-100">
    </div>
    <div class="d-flex flex-grow-1 border col flex-wrap disabled-look" id="grouped-[id]-wrapper">
    </div>
  </div>
  `
  Prognosis.playerOptionCheckbox = `
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="checkbox" id="[id]" value="[value]" required>
  <label class="form-check-label" for="[id]">[valueText]</label>
  </div>`

  Prognosis.playerOptionRadio = `
  <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name=[name] id="[id]" value="[value]" required>
  <label class="form-check-label" for="[id]">[valueText]</label>
  </div>`

  Prognosis.playerSelectList = `
  <select class="custom-select" id="[id]" required>
    <option value="" selected>Escolha uma opção...</option>
  </select>
  `
  Prognosis.playerOptionInputDisabled = `
  <input class="form-control h-100" type="text" id="[id]" value="[value]" disabled>
  `

  Prognosis.playerGuessTxt = `
  Você respondeu que a chance do paciente sobreviver era: [playerGuess]
  `
  Prognosis.sapsCalcTxt = `
  A chance calculada é de: [sapsSurvival].<br>Essa porcentagem te dá direito à escolha de [rouletteN] números.
  `
})()
