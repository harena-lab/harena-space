class Saps {
  constructor(){

  }

  async calcSaps3Score(pacientData){
    var idade
    var origem
    var comorb = {}
    var motvAdm = {}
    var statsClinico = {}
    var altLab = {}

    for (var elem of pacientData.querySelectorAll('select')) {
      if(elem.validity.valid){
        switch (elem.id) {
          case 'idade':
            idade = elem.value
            switch (idade) {
              case '<40':
              idade = 0
              break;
              case '40-59':
              idade = 5
              break;
              case '60-69':
              idade = 9
              break;
              case '70-74':
              idade = 13
              break;
              case '75-79':
              idade = 15
              break;
              case '>=80':
              idade = 18
              break;
          }
            break;
          case 'origem':
            origem = elem.value
            switch (origem) {
            case 'Pronto Socorro':
            origem = 5
            break;
            case 'Outra UTI':
            origem = 7
            break;
            case 'Nenhuma das anteriores':
            origem = 8
            break;
          }
            break;
          default:
            var optionSelected = elem.value
            switch (optionSelected) {
            case 'ic-nyha-iv':
              comorb.icNyhaIv = 6
              break;
            case 'cancer-metastatico':
              comorb.cancerMetast = 11
              break;
            case 'terapia-oncologica':
              comorb.terapiaOncol = 3
              break;
            case 'cancer-hematologico':
              comorb.cancerHemat = 6
              break;
            case 'cirrose':
              comorb.cirrose = 8
              break;
            case 'sida':
              comorb.sida = 8
              break;
            case 'nrc-por-avc':
              motvAdm.submCirurgiaNrcAvc = 5
              break;
            case 'revascularizacao-miocardica':
              motvAdm.submCirurgiaRevascMiorc = -6
              break;
            case 'trauma':
              motvAdm.submCirurgiaTrauma = -8
              break;
            case 'transplante':
              motvAdm.submCirurgiaTransplante = -11
              break;
            case 'outro':
              motvAdm.submCirurgiaOutro = 0
              break;
            case 'arritmia':
              motvAdm.admClinicaArritmia = -5
              break;
            case 'choque-hipovolemico':
              motvAdm.admClinicaChoqueHipo = 3
              break;
            case 'outro-choque':
              motvAdm.admClinicaOutroChoque = 5
              break;
            case 'convulsao':
              motvAdm.admClinicaColvusao = -4
              break;
            case 'abdome-agudo':
              motvAdm.admClinicaAbdomeAgudo = 3
              break;
            case 'pancreatite-grave':
              motvAdm.admClinicaPancreatite = 9
              break;
            case 'deficit-focal':
              motvAdm.admClinicaDeficitFocal = 7
              break;
            case 'efeito-de-massa-intracraniana':
              motvAdm.admClinicaMassaIntracran = 10
              break;
            case 'insuficiencia-hepatica':
              motvAdm.insuficienciaHepat = 6
              break;
            case 'alteracao-do-nivel-de-consciencia':
              motvAdm.admClinicaAltNvlConsc = 4
              break;
            case 'nenhum-dos-anteriores':
              motvAdm.admClinicaOutro = 0
              break;
            case 'Nosocomial':
                comorb.infectAntesAdm = 4
              break;
            case 'Respiratória':
              comorb.infectAntesAdm = 5
              break;
            case '<14 dias':
                comorb.intAntesAdm = 0
                break;
            case '14-27 dias':
              comorb.intAntesAdm = 6
              break;
            case '>=28 dias':
              comorb.intAntesAdm = 7
              break;
            case '3-4':
              statsClinico.gcs = 15
              break;
            case '5':
              statsClinico.gcs = 10
              break;
            case '6':
              statsClinico.gcs = 7
              break;
            case '7-12':
              statsClinico.gcs = 2
              break;
            case '>=13':
              statsClinico.gcs = 0
              break;
            case '<35 °C':
              statsClinico.temp = 7
              break;
            case '>=35 °C':
              statsClinico.temp = 0
              break;
            case '<120 bpm':
              statsClinico.freqCard = 0
              break;
            case '120-159 bpm':
              statsClinico.freqCard = 5
              break;
            case '>=160 bpm':
              statsClinico.freqCard = 7
              break;
            case '<40 mmHg':
              statsClinico.pressSist = 11
              break;
            case '40-69 mmHg':
              statsClinico.pressSist = 8
              break;
            case '70-119 mmHg':
              statsClinico.pressSist = 3
              break;
            case '>=120 mmHg':
              statsClinico.pressSist = 0
              break;
            case '<2 mg/dl':
              altLab.bilirrubina = 0
              break;
            case '2-6 mg/dl':
              altLab.bilirrubina = 4
              break;
            case '>=6 mg/dl':
              altLab.bilirrubina = 5
              break;
            case '<1.2 mg/dl':
              altLab.creatinina = 0
              break;
            case '1.2-1.9 mg/dl':
              altLab.creatinina = 2
              break;
            case '2-3.4 mg/dl':
              altLab.creatinina = 7
              break;
            case '>=3.5 mg/dl':
              altLab.creatinina = 8
              break;
            case '<=7.25':
              altLab.ph = 3
              break;
            case '>7.25':
              altLab.ph = 0
              break;
            case '<15mil /mm³':
              altLab.leucocitos = 0
              break;
            case '>=15mil /mm³':
              altLab.leucocitos = 2
              break;
            case '<20mil /mm³':
              altLab.plaquetas = 13
              break;
            case '20-49mil /mm³':
              altLab.plaquetas = 8
              break;
            case '50-99mil /mm³':
              altLab.plaquetas = 5
              break;
            case '>=100mil /mm³':
              altLab.plaquetas = 0
              break;
            case 'paO2 >=60 sem VM':
              altLab.oxigenacao = 0
              break;
            case 'pa02 <60 sem VM':
              altLab.oxigenacao = 5
              break;
            case 'P/F<100 em VM':
              altLab.oxigenacao = 11
              break;
            case 'P/F >=100 em VM':
              altLab.oxigenacao = 7
              break;
            }
        }
      }

    }
    for (var elem of pacientData.querySelectorAll('input[type=radio]')) {
      if(elem.validity.valid && elem.checked){
        // console.log(elem.name)
        switch (elem.name) {
          case 'ic-nyha-iv':
          switch (elem.value) {
            case 'Sim':
            comorb.icNyhaIv = 6
            break;
            case 'Não':
            comorb.icNyhaIv = 0
            break;
          }
          break;
          case 'cancer-metastatico':
          switch (elem.value) {
            case 'Sim':
            comorb.cancerMetast = 11
            break;
            case 'Não':
            comorb.cancerMetast = 0
            break;
          }
          break;
          case 'terapia-oncologica':

          switch (elem.value) {
            case 'Sim':
            comorb.terapiaOncol = 3
            break;
            case 'Não':
            comorb.terapiaOncol = 0
            break;
          }
          break;
          case 'cancer-hematologico':

          switch (elem.value) {
            case 'Sim':
            comorb.cancerHemat = 6
            break;
            case 'Não':
            comorb.cancerHemat = 0
            break;
          }
          break;
          case 'cirrose':

          switch (elem.value) {
            case 'Sim':
            comorb.cirrose = 8
            break;
            case 'Não':
            comorb.cirrose = 0
            break;
          }
          break;
          case 'sida':

          switch (elem.value) {
            case 'Sim':
            comorb.sida = 8
            break;
            case 'Não':
            comorb.sida = 0
            break;
          }
          break;
          case 'internado-antes-da-admissao':
            comorb.intAntesAdm = 0
          break;
          case 'internado-antes-da-admissao-value':
            switch (elem.value) {
              case '<14 dias':
                comorb.intAntesAdm = 0
                break;
              case '14-27 dias':
                comorb.intAntesAdm = 6
                break;
              case '>=28 dias':
                comorb.intAntesAdm = 7
                break;
              default:
              comorb.intAntesAdm = 0
            }
            break;
          case 'infectado-antes-da-admissao-value':
            switch (elem.value) {
              case 'Nosocomial':
                  comorb.infectAntesAdm = 4
                break;
              case 'Respiratória':
                comorb.infectAntesAdm = 5
                break;
            }
            break;
          break;
          case 'admissao-planejada':

          switch (elem.value) {
            case 'Sim':
            motvAdm.admPlanejada = 0
            break;
            case 'Não':
            motvAdm.admPlanejada = 3
            break;
          }
          break;
          case 'submetido-a-cirurgia':
          switch (elem.value) {
            case 'Sim':
            motvAdm.submCirurgia = 0
            break;
            case 'Não':
            motvAdm.submCirurgia = 5
            motvAdm.motvCirurgia = 0
            break;
          }
          break;
          case 'submetido-a-cirurgia-value':
            switch (elem.value) {
              case 'Cirurgia eletiva':
                motvAdm.motvCirurgia = 0
                break;
              case 'Cirurgia urgência':
                motvAdm.motvCirurgia = 6
                break;
              default:

            }
            break;
          case 'escala-de-coma-de-glasgow':

          switch (elem.value) {
            case '3-4':
            statsClinico.gcs = 15
            break;
            case '5':
            statsClinico.gcs = 10
            break;
            case '6':
            statsClinico.gcs = 7
            break;
            case '7-12':
            statsClinico.gcs = 2
            break;
            case '>=13':
            statsClinico.gcs = 0
            break;
            default:
            statsClinico.gcs = 0
          }
          break;
          case 'temperatura':

          switch (elem.value) {
            case '<35 °C':
            statsClinico.temp = 7
            break;
            case '>=35 °C':
            statsClinico.temp = 0
            break;
            default:
            statsClinico.temp = 0
          }
          break;
          case 'frequencia-cardiaca':

          switch (elem.value) {
            case '<120 bpm':
            statsClinico.freqCard = 0
            break;
            case '120-159 bpm':
            statsClinico.freqCard = 5
            break;
            case '>=160 bpm':
            statsClinico.freqCard = 7
            break;
          }
          break;
          case 'pressao-sistolica':

          switch (elem.value) {
            case '<40 mmHg':
            statsClinico.pressSist = 11
            break;
            case '40-69 mmHg':
            statsClinico.pressSist = 8
            break;
            case '70-119 mmHg':
            statsClinico.pressSist = 3
            break;
            case '>=120 mmHg':
            statsClinico.pressSist = 0
            break;
          }
          break;
          case 'droga-vasoativa':

          switch (elem.value) {
            case 'Sim':
            statsClinico.drogaVaso = 3
            break;
            case 'Não':
            statsClinico.drogaVaso = 0
            break;
          }
          break;
          case 'bilirrubina':

          switch (elem.value) {
            case '<2 mg/dl':
            altLab.bilirrubina = 0
            break;
            case '2-6 mg/dl':
            altLab.bilirrubina = 4
            break;
            case '>=6 mg/dl':
            altLab.bilirrubina = 5
            break;
          }
          break;
          case 'creatinina':

          switch (elem.value) {
            case '<1.2 mg/dl':
            altLab.creatinina = 0
            break;
            case '1.2-1.9 mg/dl':
            altLab.creatinina = 2
            break;
            case '2-3.4 mg/dl':
            altLab.creatinina = 7
            break;
            case '>=3.5 mg/dl':
            altLab.creatinina = 8
            break;
          }
          break;
          case 'ph':

          switch (elem.value) {
            case '<=7.25':
            altLab.ph = 3
            break;
            case '>7.25':
            altLab.ph = 0
            break;
          }
          break;
          case 'leucocitos':

          switch (elem.value) {
            case '<15mil /mm³':
            altLab.leucocitos = 0
            break;
            case '>=15mil /mm³':
            altLab.leucocitos = 2
            break;
          }
          break;
          case 'plaquetas':

          switch (elem.value) {
            case '<20mil /mm³':
            altLab.plaquetas = 13
            break;
            case '20-49mil /mm³':
            altLab.plaquetas = 8
            break;
            case '50-99mil /mm³':
            altLab.plaquetas = 5
            break;
            case '>=100mil /mm³':
            altLab.plaquetas = 0
            break;
          }
          break;
          case 'oxigenacao':

          switch (elem.value) {
            case 'paO2 >=60 sem VM':
            altLab.oxigenacao = 0
            break;
            case 'pa02 <60 sem VM':
            altLab.oxigenacao = 5
            break;
            case 'P/F<100 em VM':
            altLab.oxigenacao = 11
            break;
            case 'P/F >=100 em VM':
            altLab.oxigenacao = 7
            break;
          }
          break;
        }
      }
    }
    for (var elem of pacientData.querySelectorAll('input[type=checkbox]')) {
      if(elem.validity.valid){
        // console.log(elem.id)
        switch (elem.checked) {
          case true:
          switch (elem.id) {
            case 'nrc-por-avc':
            motvAdm.submCirurgiaNrcAvc = 5
            break;
            case 'revascularizacao-miocardica':
            motvAdm.submCirurgiaRevascMiorc = -6
            break;
            case 'trauma':
            motvAdm.submCirurgiaTrauma = -8
            break;
            case 'transplante':
            motvAdm.submCirurgiaTransplante = -11
            break;
            case 'outro':
            motvAdm.submCirurgiaOutro = 0
            break;
            case 'arritmia':
            motvAdm.admClinicaArritmia = -5
            break;
            case 'choque-hipovolemico':
            motvAdm.admClinicaChoqueHipo = 3
            break;
            case 'outro-choque':
            motvAdm.admClinicaOutroChoque = 5
            break;
            case 'convulsao':
            motvAdm.admClinicaColvusao = -4
            break;
            case 'abdome-agudo':
            motvAdm.admClinicaAbdomeAgudo = 3
            break;
            case 'pancreatite-grave':
            motvAdm.admClinicaPancreatite = 9
            break;
            case 'deficit-focal':
            motvAdm.admClinicaDeficitFocal = 7
            break;
            case 'efeito-de-massa-intracraniana':
            motvAdm.admClinicaMassaIntracran = 10
            break;
            case 'insuficiencia-hepatica':
            motvAdm.insuficienciaHepat = 6
            break;
            case 'alteracao-do-nivel-de-consciencia':
            motvAdm.admClinicaAltNvlConsc = 4
            break;
            case 'nenhum-dos-anteriores':
            motvAdm.admClinicaOutro = 0
            break;
            case 'nosocomial':
                comorb.infectAntesAdmNosocomial = 4
              break;
            case 'respiratoria':
              comorb.infectAntesAdmRespiratoria = 5
              break;

          }
          break;
          case false:
          switch (elem.id) {
            case 'nrc-por-avc':
            motvAdm.submCirurgiaNrcAvc = 0
            break;
            case 'revascularizacao-miocardica':
            motvAdm.submCirurgiaRevascMiorc = 0
            break;
            case 'trauma':
            motvAdm.submCirurgiaTrauma = 0
            break;
            case 'transplante':
            motvAdm.submCirurgiaTransplante = 0
            break;
            case 'outro':
            motvAdm.submCirurgiaOutro = 0
            break;
            case 'arritmia':
            motvAdm.admClinicaArritmia = 0
            break;
            case 'choque-hipovolemico':
            motvAdm.admClinicaChoqueHipo = 0
            break;
            case 'outro-choque':
            motvAdm.admClinicaOutroChoque = 0
            break;
            case 'convulsao':
            motvAdm.admClinicaColvusao = 0
            break;
            case 'abdome-agudo':
            motvAdm.admClinicaAbdomeAgudo = 0
            break;
            case 'pancreatite-grave':
            motvAdm.admClinicaPancreatite = 0
            break;
            case 'deficit-focal':
            motvAdm.admClinicaDeficitFocal = 0
            break;
            case 'efeito-de-massa-intracraniana':
            motvAdm.admClinicaMassaIntracran = 0
            break;
            case 'alteracao-do-nivel-de-consciencia':
            motvAdm.admClinicaAltNvlConsc = 0
            break;
            case 'nenhum-dos-anteriores':
            motvAdm.admClinicaOutro = 0
            break;
            default:

          }
          break;
          default:

        }
      }
    }
    motvAdm.uti = 16

    // console.log('============ idade')
    // console.log(idade)
    //
    // console.log('============ origem')
    // console.log(origem)

    var dynamicScore = (idade + origem)

    for (var i = 0; i < Object.keys(comorb).length; i++) {

      // var resultText = document.createElement('h6')
      // resultText.classList.add('pl-2')
      // resultText.innerHTML = Object.entries(comorb)[i][0]+': '+Object.entries(comorb)[i][1]
      // resultWrapper.appendChild(resultText)
      // console.log('============ comorb value')
      // console.log(Object.entries(comorb)[i])
      dynamicScore += comorb[Object.keys(comorb)[i]]

    }

    for (var i = 0; i < Object.keys(motvAdm).length; i++) {
      // var resultText = document.createElement('h6')
      // resultText.classList.add('pl-2')
      // resultText.innerHTML = Object.entries(motvAdm)[i][0]+': '+Object.entries(motvAdm)[i][1]
      // resultWrapper.appendChild(resultText)
      // console.log('============ motivo value')
      // console.log(Object.entries(motvAdm)[i])
      dynamicScore += motvAdm[Object.keys(motvAdm)[i]]
    }

    for (var i = 0; i < Object.keys(statsClinico).length; i++) {
      // var resultText = document.createElement('h6')
      // resultText.classList.add('pl-2')
      // resultText.innerHTML = Object.entries(motvAdm)[i][0]+': '+Object.entries(motvAdm)[i][1]
      // resultWrapper.appendChild(resultText)
      // console.log('============ stats value')
      // console.log(Object.entries(statsClinico)[i])
      dynamicScore += statsClinico[Object.keys(statsClinico)[i]]
    }

    for (var i = 0; i < Object.keys(altLab).length; i++) {
      // var resultText = document.createElement('h6')
      // resultText.classList.add('pl-2')
      // resultText.innerHTML = Object.entries(altLab)[i][0]+': '+Object.entries(altLab)[i][1]
      // resultWrapper.appendChild(resultText)
      // console.log('============ alt lab value')
      // console.log(Object.entries(altLab)[i])
      dynamicScore += altLab[Object.keys(altLab)[i]]
    }

    // console.log('============ saps score ')
    // console.log(dynamicScore)
    // console.log('============ Mortality')
    //-32.6659+Math.log(dynamicScore+20.5958)*7.3068 other calc
    // 64.5990 +Math.log(dynamicScore+20.5958)*13.2322 south america calc
    var logitDynamic = -32.6659+Math.log(dynamicScore+20.5958)*7.3068
    // console.log(logitDynamic)
    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    var mortalityDynamic = Math.exp(logitDynamic)/ (1+ Math.exp(logitDynamic))
    var mortalityPercentage = (Math.round(mortalityDynamic*1000)/1000)*100

    // console.log(round(mortalityPercentage, 1)+'%')
    // var modal = document.querySelector('#saps-result-modal')
    if(document.querySelector('#idade-result-wrapper')){
      var resultWrapper = document.querySelector('#idade-result-wrapper')
      var oldResult = resultWrapper.querySelectorAll('h6')
      for (var i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      var resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = "idade: "+idade
      resultWrapper.appendChild(resultText)

      resultWrapper = document.querySelector('#origem-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (var i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = "origem: "+origem
      resultWrapper.appendChild(resultText)


      resultWrapper = document.querySelector('#comorbidade-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (var i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      for (var i = 0; i < Object.keys(comorb).length; i++) {
        resultText = document.createElement('h6')
        resultText.classList.add('pl-2')
        resultText.innerHTML = Object.entries(comorb)[i][0]+': '+Object.entries(comorb)[i][1]
        resultWrapper.appendChild(resultText)
      }

      resultWrapper = document.querySelector('#motivo-admissao-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (var i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      for (var i = 0; i < Object.keys(motvAdm).length; i++) {
        resultText = document.createElement('h6')
        resultText.classList.add('pl-2')
        resultText.innerHTML = Object.entries(motvAdm)[i][0]+': '+Object.entries(motvAdm)[i][1]
        resultWrapper.appendChild(resultText)
      }

      resultWrapper = document.querySelector('#status-clinico-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (var i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      for (var i = 0; i < Object.keys(statsClinico).length; i++) {
        resultText = document.createElement('h6')
        resultText.classList.add('pl-2')
        resultText.innerHTML = Object.entries(motvAdm)[i][0]+': '+Object.entries(motvAdm)[i][1]
        resultWrapper.appendChild(resultText)
      }

      resultWrapper = document.querySelector('#alt-lab-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (var i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      for (var i = 0; i < Object.keys(altLab).length; i++) {
        resultText = document.createElement('h6')
        resultText.classList.add('pl-2')
        resultText.innerHTML = Object.entries(altLab)[i][0]+': '+Object.entries(altLab)[i][1]
        resultWrapper.appendChild(resultText)
      }

      resultWrapper = document.querySelector('#saps-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (var i = 0; i < oldResult.length; i++) {

        oldResult[i].remove()
      }
      resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = 'SAPS-3 Score: '+ dynamicScore
      resultWrapper.appendChild(resultText)

      resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = 'Mortality: '+ (round(mortalityPercentage, 1))+'%'
      resultWrapper.appendChild(resultText)
    }
    if(document.querySelector('#saps-survival')){
      document.querySelector('#saps-survival').value = round((100 - mortalityPercentage),1)
    }

    $('#saps-result-modal').modal('show')
    if (new URL(document.location).pathname == '/prognosis/learn/player/'){
      Saps.i.pacientOverview(pacientData)
    }


  }

  async pacientOverview(pacientData){
    var idade = ''
    var origem = ''
    var comorb = ''
    var internadoAntes = ''
    var infectadoAntes = ''
    var admissao = ''
    var submetidoCirurgia = ''
    var primeiroItemCirur = true
    var submetidoUti = ''
    var gcs = ''
    var temperatura = ''
    var freqCard = ''
    var pressSist = ''
    var drogaVaso = ''
    var bilirrubina = ''
    var creatinina = ''
    var ph = ''
    var leucocitos = ''
    var plaquetas = ''
    var oxigenacao = ''

    for (var elem of pacientData.querySelectorAll('select')) {
      if(elem.validity.valid){
        switch (elem.id) {
          case 'idade':
            idade = elem.value
            switch (idade) {
              case '<40':
              idade = 'menos que 40 anos'
              break;
              case '40-59':
              idade = 'entre 40 e 59 anos'
              break;
              case '60-69':
              idade = 'entre 60 e 69 anos'
              break;
              case '70-74':
              idade = 'entre 70 e 74 anos'
              break;
              case '75-79':
              idade = 'entre 75 e 79 anos'
              break;
              case '>=80':
              idade = 'mais que 80 anos'
              break;
          }
            break;
          case 'origem':
            origem = elem.value
            switch (origem) {
            case 'Pronto Socorro':
            origem = 'do PRONTO SOCORRO'
            break;
            case 'Outra UTI':
            origem = 'de OUTRA UTI'
            break;
            case 'Nenhuma das anteriores':
            origem = 'de OUTRA UNIDADE'
            break;
          }
            break;
        }
        switch (elem.value) {
          case 'ic-nyha-iv':
          if(comorb.length>0)
            comorb += 'e IC NYHA IV '
          else
            comorb += 'IC NYHA IV '
          break;
            break;
          case 'cancer-metastatico':
            if(comorb.length>0)
              comorb += 'e CÂNCER METASTÁTICO '
            else
              comorb += 'CÂNCER METASTÁTICO '
            break;
          case 'terapia-oncologica':
            if(comorb.length>0)
              comorb += 'e TRATAMENTO ONCOLÓGICO '
            else
              comorb += 'TRATAMENTO ONCOLÓGICO '
            break;
          case 'cancer-hematologico':
            if(comorb.length>0)
              comorb += 'e CÂNCER HEMATOLÓGICO '
            else
              comorb += 'CÂNCER HEMATOLÓGICO '
            break;
          case 'cirrose':
            if(comorb.length>0)
              comorb += 'e CIRROSE '
            else
              comorb += 'CIRROSE '
            break;
          case 'sida':
            if(comorb.length>0)
              comorb += 'e SIDA '
            else
              comorb += 'SIDA '
            break;
          case 'nrc-por-avc':
            if(submetidoCirurgia.length>0)
              submetidoCirurgia += ' e NCR sec. a AVC'
            else
              submetidoCirurgia += ' NCR sec. a AVC'
            break;
          case 'revascularizacao-miocardica':
            if(submetidoCirurgia.length>0)
                submetidoCirurgia += ' e REVASCULARIZAÇÃO MIOCÁRDICA'
              else
                submetidoCirurgia += ' REVASCULARIZAÇÃO MIOCÁRDICA'
            break;
          case 'trauma':
            if(submetidoCirurgia.length>0)
              submetidoCirurgia += ' e TRAUMA '
            else
              submetidoCirurgia += ' TRAUMA '
            break;
          case 'transplante':
            if(submetidoCirurgia.length>0)
              submetidoCirurgia += ' e TRANSPLANTE'
            else
              submetidoCirurgia += ' TRANSPLANTE'
            break;
          case 'arritmia':
            if (submetidoUti.length>0)
              submetidoUti += ' e ARRITMIA'
            else
              submetidoUti += ' sendo encaminhado à UTI por ARRITMIA'
            break;
          case 'choque-hipovolemico':
            if (submetidoUti.length>0)
              submetidoUti += ' e CHOQUE HIPOVOLÊMICO'
            else
              submetidoUti += ' sendo encaminhado à UTI por CHOQUE HIPOVOLÊMICO'
            break;
          case 'outro-choque':
            if (submetidoUti.length>0)
              submetidoUti += ' e OUTRO CHOQUE'
            else
              submetidoUti += ' sendo encaminhado à UTI por OUTRO CHOQUE'
            break;
          case 'convulsao':
            if (submetidoUti.length>0)
              submetidoUti += ' e CONVULSÃO'
            else
              submetidoUti += ' sendo encaminhado à UTI por CONVULSÃO'
            break;
          case 'abdome-agudo':
            if (submetidoUti.length>0)
              submetidoUti += ' e ABDOME AGUDO'
            else
              submetidoUti += ' sendo encaminhado à UTI por ABDOME AGUDO'
            break;
          case 'pancreatite-grave':
            if (submetidoUti.length>0)
              submetidoUti += ' e PANCREATITE GRAVE'
            else
              submetidoUti += ' sendo encaminhado à UTI por PANCREATITE GRAVE'
            break;
          case 'deficit-focal':
            if (submetidoUti.length>0)
              submetidoUti += ' e DÉFICIT FOCAL'
            else
              submetidoUti += ' sendo encaminhado à UTI por DÉFICIT FOCAL'
            break;
          case 'efeito-de-massa-intracraniana':
            if (submetidoUti.length>0)
              submetidoUti += ' e EFEITO DE MASSA INTRACRANIANA'
            else
              submetidoUti += ' sendo encaminhado à UTI por EFEITO DE MASSA INTRACRANIANA'
            break;
          case 'insuficiencia-hepatica':
          if (submetidoUti.length>0)
            submetidoUti += ' e INSUFICIÊNCIA HEPÁTICA'
          else
            submetidoUti += ' sendo encaminhado à UTI por INSUFICIÊNCIA HEPÁTICA'
            break;
          case 'alteracao-do-nivel-de-consciencia':
            if (submetidoUti.length>0)
              submetidoUti += ' e ALTERAÇÃO DO NÍVEL DE CONSCIÊNCIA'
            else
              submetidoUti += ' sendo encaminhado à UTI por ALTERAÇÃO DO NÍVEL DE CONSCIÊNCIA'
            break;
          case 'Nosocomial':
              infectadoAntes = 'NOSOCOMIAL'
            break;
          case 'Respiratória':
            infectadoAntes = 'RESPIRATÓRIA'
            break;
          case '<14 dias':
              internadoAntes = 'menos de 14 DIAS'
              break;
          case '14-27 dias':
            internadoAntes = 'entre 14 E 27 DIAS'
            break;
          case '>=28 dias':
            internadoAntes = 'mais de 28 DIAS'
            break;
          case '3-4':
            gcs = '3 a 4'
            break;
          case '5':
            gcs = '5'
            break;
          case '6':
            gcs = '6'
            break;
          case '7-12':
            gcs = 'entre 7 a 12'
            break;
          case '>=13':
            gcs = '&#8805;13' //"&#8805;" is code for ">="
            break;
          case '<35 °C':
            temperatura = '<35 °C'
            break;
          case '>=35 °C':
            temperatura = '&#8805;35 °C' //"&#8805;" is code for ">="
            break;
          case '<120 bpm':
            freqCard = '<120 bpm'
            break;
          case '120-159 bpm':
            freqCard = '120-159 bpm'
            break;
          case '>=160 bpm':
            freqCard = '>=160 bpm'
            break;
          case '<40 mmHg':
            pressSist = '<40 mmHg'
            break;
          case '40-69 mmHg':
            pressSist = '40-69 mmHg'
            break;
          case '70-119 mmHg':
            pressSist = '70-119 mmHg'
            break;
          case '>=120 mmHg':
            pressSist = '&#8805;120 mmHg' //"&#8805;" is code for ">="
            break;
          case '<2 mg/dl':
            bilirrubina = '<2 mg/dl'
            break;
          case '2-6 mg/dl':
            bilirrubina = '2-6 mg/dl'
            break;
          case '>=6 mg/dl':
            bilirrubina = '&#8805;6 mg/dl' //"&#8805;" is code for ">="d
            break;
            case '<1.2 mg/dl':
              creatinina = '<1.2 mg/dl'
              break;
            case '1.2-1.9 mg/dl':
              creatinina = '1.2-1.9 mg/dl'
              break;
            case '2-3.4 mg/dl':
              creatinina = '2-3.4 mg/dl'
              break;
            case '>=3.5 mg/dl':
              creatinina = '&#8805;3.5 mg/dl' //"&#8805;" is code for ">="
              break;
            case '<=7.25':
              ph = '&#8804;7.25'
              break;
            case '>7.25':
              ph = '&#62;7.25'
              break;
            case '<15mil /mm³':
              leucocitos = '<15mil /mm³'
              break;
            case '>=15mil /mm³':
              leucocitos = '&#8805;15mil /mm³' //"&#8805;" is code for ">="
              break;
            case '<20mil /mm³':
              plaquetas = '<20mil /mm³'
              break;
            case '20-49mil /mm³':
              plaquetas = '20-49mil /mm³'
              break;
            case '50-99mil /mm³':
              plaquetas = '50-99mil /mm³'
              break;
            case '>=100mil /mm³':
              plaquetas = '&#8805;100mil /mm³'//"&#8805;" is code for ">="
              break;
            case 'paO2 >=60 sem VM':
              oxigenacao = ' sem VM com paO2 &#8805;60'//"&#8805;" is code for ">="
              break;
            case 'pa02 <60 sem VM':
              oxigenacao = ' sem VM com paO2 <60'
              break;
            case 'P/F<100 em VM':
              oxigenacao = ' em VM com P/F <100'
              break;
            case 'P/F >=100 em VM':
              oxigenacao = ' em VM com P/F &#8805;100'
              break;
        }
      }

    }
    for (var elem of pacientData.querySelectorAll('input[type=radio]')) {
      if(elem.validity.valid && elem.checked){
        // console.log(elem.name)
        switch (elem.name) {
          case 'ic-nyha-iv':
          switch (elem.value) {
            case 'Sim':
            if(comorb.length>0)
              comorb += 'e IC NYHA IV '
            else
              comorb += 'IC NYHA IV '
            break;
          }
          break;
          case 'cancer-metastatico':
          switch (elem.value) {
            case 'Sim':
            if(comorb.length>0)
              comorb += 'e CÂNCER METASTÁTICO '
            else
              comorb += 'CÂNCER METASTÁTICO '
            break;
          }
          break;
          case 'terapia-oncologica':

          switch (elem.value) {
            case 'Sim':
            if(comorb.length>0)
              comorb += 'e TRATAMENTO ONCOLÓGICO '
            else
              comorb += 'TRATAMENTO ONCOLÓGICO '
            break;
          }
          break;
          case 'cancer-hematologico':

          switch (elem.value) {
            case 'Sim':
            if(comorb.length>0)
              comorb += 'e CÂNCER HEMATOLÓGICO '
            else
              comorb += 'CÂNCER HEMATOLÓGICO '
            break;
          }
          break;
          case 'cirrose':

          switch (elem.value) {
            case 'Sim':
            if(comorb.length>0)
              comorb += 'e CIRROSE '
            else
              comorb += 'CIRROSE '
            break;
          }
          break;
          case 'sida':

          switch (elem.value) {
            case 'Sim':
            if(comorb.length>0)
              comorb += 'e SIDA '
            else
              comorb += 'SIDA '
            break;
          }
          break;
          case 'internado-antes-da-admissao-value':

            switch (elem.value) {
              case '<14 dias':
                internadoAntes = 'menos de 14 DIAS'
                break;
              case '14-27 dias':
                internadoAntes = 'entre 14 E 27 DIAS'
                break;
              case '>=28 dias':
                internadoAntes = 'mais de 28 DIAS'
                break;
            }
            break;
          case 'infectado-antes-da-admissao-value':

            switch (elem.value) {
              case 'Nosocomial':
                  infectadoAntes = 'NOSOCOMIAL'
                break;
              case 'Respiratória':
                infectadoAntes = 'RESPIRATÓRIA'
                break;
            }
            break;
          break;
          case 'admissao-planejada':

          switch (elem.value) {
            case 'Sim':
            admissao = 'ELETIVAMENTE'
            break;
            case 'Não':
            admissao = 'NÃO ELETIVAMENTE'
            break;
          }
          break;
          case 'submetido-a-cirurgia':

          switch (elem.value) {
            case 'Sim':
            submetidoCirurgia = ' submetido à cirurgia de'
            break;
          }
          break;
          case 'submetido-a-cirurgia-value':
            switch (elem.value) {
              case 'Cirurgia eletiva':
                submetidoCirurgia += 'ELETIVA '
                break;
              case 'Cirurgia urgência':
              submetidoCirurgia += 'URGÊNCIA '
                break;
              default:

            }
            break;
          case 'escala-de-coma-de-glasgow':

          switch (elem.value) {
            case '3-4':
            gcs = '3 a 4'
            break;
            case '5':
              gcs = '5'
            break;
            case '6':
              gcs = '6'
            break;
            case '7-12':
              gcs = 'entre 7 a 12'
            break;
            case '>=13':
              gcs = '&#8805;13' //"&#8805;" is code for ">="
            break;

          }
          break;
          case 'temperatura':

          switch (elem.value) {
            case '<35 °C':
            temperatura = '<35 °C'
            break;
            case '>=35 °C':
            temperatura = '&#8805;35 °C' //"&#8805;" is code for ">="
            break;
          }
          break;
          case 'frequencia-cardiaca':

          switch (elem.value) {
            case '<120 bpm':
            freqCard = '<120 bpm'
            break;
            case '120-159 bpm':
            freqCard = '120-159 bpm'
            break;
            case '>=160 bpm':
            freqCard = '>=160 bpm'
            break;
          }
          break;
          case 'pressao-sistolica':

          switch (elem.value) {
            case '<40 mmHg':
            pressSist = '<40 mmHg'
            break;
            case '40-69 mmHg':
            pressSist = '40-69 mmHg'
            break;
            case '70-119 mmHg':
            pressSist = '70-119 mmHg'
            break;
            case '>=120 mmHg':
            pressSist = '&#8805;120 mmHg' //"&#8805;" is code for ">="
            break;
          }
          break;
          case 'droga-vasoativa':

          switch (elem.value) {
            case 'Sim':
            drogaVaso = ' em'
            break;
            case 'Não':
            drogaVaso = ' sem'
            break;
          }
          break;
          case 'bilirrubina':

          switch (elem.value) {
            case '<2 mg/dl':
            bilirrubina = '<2 mg/dl'
            break;
            case '2-6 mg/dl':
            bilirrubina = '2-6 mg/dl'
            break;
            case '>=6 mg/dl':
            bilirrubina = '&#8805;6 mg/dl' //"&#8805;" is code for ">="d
            break;
          }
          break;
          case 'creatinina':

          switch (elem.value) {
            case '<1.2 mg/dl':
            creatinina = '<1,2 mg/dl'
            break;
            case '1.2-1.9 mg/dl':
            creatinina = '1,2-1,9 mg/dl'
            break;
            case '2-3.4 mg/dl':
            creatinina = '2-3,4 mg/dl'
            break;
            case '>=3.5 mg/dl':
            creatinina = '&#8805;3,5 mg/dl' //"&#8805;" is code for ">="
            break;
          }
          break;
          case 'ph':
          switch (elem.value) {
            case '<=7.25':
            ph = '&#8804;7,25'
            break;
            case '>7.25':
            ph = '&#62;7,25'
            break;
          }
          break;
          case 'leucocitos':

          switch (elem.value) {
            case '<15mil /mm³':
            leucocitos = '<15mil /mm³'
            break;
            case '>=15mil /mm³':
            leucocitos = '&#8805;15mil /mm³' //"&#8805;" is code for ">="
            break;
          }
          break;
          case 'plaquetas':

          switch (elem.value) {
            case '<20mil /mm³':
            plaquetas = '<20mil /mm³'
            break;
            case '20-49mil /mm³':
            plaquetas = '20-49mil /mm³'
            break;
            case '50-99mil /mm³':
            plaquetas = '50-99mil /mm³'
            break;
            case '>=100mil /mm³':
            plaquetas = '&#8805;100mil /mm³'//"&#8805;" is code for ">="
            break;
          }
          break;
          case 'oxigenacao':

          switch (elem.value) {
            case 'paO2 >=60 sem VM':
            oxigenacao = ' sem VM com paO2 &#8805;60;'//"&#8805;" is code for ">="
            break;
            case 'pa02 <60 sem VM':
            oxigenacao = ' sem VM com paO2 <60;'
            break;
            case 'P/F<100 em VM':
            oxigenacao = ' em VM com P/F <100;'
            break;
            case 'P/F >=100 em VM':
            oxigenacao = ' em VM com P/F &#8805;100;'
            break;
          }
          break;
        }
      }
    }
    for (var elem of pacientData.querySelectorAll('input[type=checkbox]')) {
      if(elem.validity.valid){
        // console.log(elem.id)
        switch (elem.checked) {
          case true:
          switch (elem.id) {
            case 'nrc-por-avc':
            if(submetidoCirurgia.length>0 && !primeiroItemCirur)
              submetidoCirurgia += ' e NCR sec. a AVC'
            else{
              submetidoCirurgia += ' NCR sec. a AVC'
              primeiroItemCirur = false
            }
            break;
            case 'revascularizacao-miocardica':
              if(submetidoCirurgia.length>0 && !primeiroItemCirur)
                submetidoCirurgia += ' e REVASCULARIZAÇÃO MIOCÁRDICA'
              else{
                submetidoCirurgia += ' REVASCULARIZAÇÃO MIOCÁRDICA'
                primeiroItemCirur = false
              }
            break;
            case 'trauma':
            if(submetidoCirurgia.length>0 && !primeiroItemCirur)
              submetidoCirurgia += ' e TRAUMA'
            else{
              submetidoCirurgia += ' TRAUMA'
              primeiroItemCirur = false
            }
            break;
            case 'transplante':
            if(submetidoCirurgia.length>0 && !primeiroItemCirur)
              submetidoCirurgia += ' e TRANSPLANTE'
            else{
              submetidoCirurgia += ' TRANSPLANTE'
              primeiroItemCirur = false
            }
            break;
            case 'arritmia':
            if (submetidoUti.length>0)
              submetidoUti += ' e ARRITMIA'
            else
              submetidoUti += ' sendo encaminhado à UTI por ARRITMIA'
            break;
            case 'choque-hipovolemico':
            if (submetidoUti.length>0)
              submetidoUti += ' e CHOQUE HIPOVOLÊMICO'
            else
              submetidoUti += ' sendo encaminhado à UTI por CHOQUE HIPOVOLÊMICO'
            break;
            case 'outro-choque':
            if (submetidoUti.length>0)
              submetidoUti += ' e OUTRO CHOQUE'
            else
              submetidoUti += ' sendo encaminhado à UTI por OUTRO CHOQUE'
            break;
            case 'convulsao':
            if (submetidoUti.length>0)
              submetidoUti += ' e CONVULSÃO'
            else
              submetidoUti += ' sendo encaminhado à UTI por CONVULSÃO'
            break;
            case 'abdome-agudo':
            if (submetidoUti.length>0)
              submetidoUti += ' e ABDOME AGUDO'
            else
              submetidoUti += ' sendo encaminhado à UTI por ABDOME AGUDO'
            break;
            case 'pancreatite-grave':
            if (submetidoUti.length>0)
              submetidoUti += ' e PANCREATITE GRAVE'
            else
              submetidoUti += ' sendo encaminhado à UTI por PANCREATITE GRAVE'
            break;
            case 'deficit-focal':
            if (submetidoUti.length>0)
              submetidoUti += ' e DÉFICIT FOCAL'
            else
              submetidoUti += ' sendo encaminhado à UTI por DÉFICIT FOCAL'
            break;
            case 'efeito-de-massa-intracraniana':
            if (submetidoUti.length>0)
              submetidoUti += ' e EFEITO DE MASSA INTRACRANIANA'
            else
              submetidoUti += ' sendo encaminhado à UTI por EFEITO DE MASSA INTRACRANIANA'
            break;
            case 'insuficiencia-hepatica':
            if (submetidoUti.length>0)
              submetidoUti += ' e INSUFICIÊNCIA HEPÁTICA'
            else
              submetidoUti += ' sendo encaminhado à UTI por INSUFICIÊNCIA HEPÁTICA'
            break;
            case 'alteracao-do-nivel-de-consciencia':
            if (submetidoUti.length>0)
              submetidoUti += ' e ALTERAÇÃO DO NÍVEL DE CONSCIÊNCIA'
            else
              submetidoUti += ' sendo encaminhado à UTI por ALTERAÇÃO DO NÍVEL DE CONSCIÊNCIA'
            break;

            case 'nosocomial':
                infectadoAntes = 'NOSOCOMIAL'
              break;
            case 'respiratoria':
              infectadoAntes = 'RESPIRATÓRIA'
              break;

          }
          break;
        }
      }
    }

    if(comorb.length > 0)
      comorb = comorb+','
    else
      comorb = ' nenhuma comorbidade, '
    if(internadoAntes.length > 0)
      internadoAntes = ' internado há '+internadoAntes+' antes da admissão, '
    else
      internadoAntes = ' sem internação antes da admissão,'
    if(infectadoAntes.length > 0)
      infectadoAntes = ' com infecção '+infectadoAntes+'.'
    else
      infectadoAntes = ' sem infecção.'
    if(admissao.length > 0)
      admissao = ' Admitido '+admissao+','
    if(submetidoCirurgia.length <= 0)
      submetidoCirurgia = ' não submetido à cirurgia'
    if(gcs.length > 0)
      gcs = ' GCS de '+gcs+','
    if(temperatura.length > 0)
      temperatura = ' Temp '+temperatura+','
    if(freqCard.length > 0)
      freqCard = ' FC '+freqCard+','
    if(pressSist.length > 0)
      pressSist = ' PAS '+pressSist+','
    if(bilirrubina.length > 0)
      bilirrubina = ' Bilirrubina total '+bilirrubina+';'
    if(creatinina.length > 0)
      creatinina = ' Creatinina '+creatinina+';'
    if(ph.length > 0)
      ph = ' pH '+ph+';'
    if(leucocitos.length > 0)
      leucocitos = ' Leucócitos '+leucocitos+';'
    if(plaquetas.length > 0)
      plaquetas = ' Plaquetas '+plaquetas+';'

    var overviewText = Saps.overviewText
    .replace(/\[_idade\]/ig, idade)
    .replace(/\[_origem\]/ig, origem)
    .replace(/\[_comorbidade\]/ig, comorb)
    .replace(/\[_internadoDias\]/ig, internadoAntes)
    .replace(/\[_ifeccao\]/ig, infectadoAntes)
    .replace(/\[_admissao\]/ig, admissao)
    .replace(/\[_submetidoCirurgia\]/ig, submetidoCirurgia)
    .replace(/\[_submetidoUti\]/ig, submetidoUti)
    .replace(/\[_gcs\]/ig, gcs)
    .replace(/\[_temperatura\]/ig, temperatura)
    .replace(/\[_freqCardiaca\]/ig, freqCard)
    .replace(/\[_pressaoSistolica\]/ig, pressSist)
    .replace(/\[_drogaVasoativa\]/ig, drogaVaso)
    .replace(/\[_bilirrubina\]/ig, bilirrubina)
    .replace(/\[_creatinina\]/ig, creatinina)
    .replace(/\[_ph\]/ig, ph)
    .replace(/\[_leucocitos\]/ig, leucocitos)
    .replace(/\[_plaquetas\]/ig, plaquetas)
    .replace(/\[_oxigenacao\]/ig, oxigenacao)

    if(!document.querySelector('#pacient-overview-wrapper > h5')){
      var txt = document.createElement('h5')
      txt.innerHTML = overviewText
      document.querySelector('#pacient-overview-wrapper').appendChild(txt)
    }else {
      var txt = document.querySelector('#pacient-overview-wrapper > h5')
      txt.innerHTML = overviewText
    }
    // console.log(overviewText)
    $('#pacient-overview-modal').modal('show')

  }
}


(function () {
  Saps.i = new Saps()

  Saps.overviewText =
  `
  Paciente de [_idade], encaminhado [_origem], portador de [_comorbidade]
  [_internadoDias][_ifeccao][_admissao][_submetidoCirurgia][_submetidoUti]. À admissão, apresentava[_gcs][_temperatura]
  [_freqCardiaca][_pressaoSistolica][_drogaVasoativa] uso de DVA. A seguir, os exames da admissão:
  [_bilirrubina][_creatinina][_ph][_leucocitos][_plaquetas][_oxigenacao]
  `
})()
