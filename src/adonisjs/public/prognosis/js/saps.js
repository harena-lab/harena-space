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
          // case 'infectado-antes-da-admissao':
          // switch (elem.value) {
          //   case 'Sim':
          //   comorb.infectAntesAdm = true
          //   break;
          //   case 'Não':
          //   comorb.infectAntesAdm = false
          //   break;
          // }
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
    // if(motvAdm.admClinicaArritmia > 0 && motvAdm.admClinicaColvusao > 0)
    //   motvAdm.admClinicaArritmia = 0
    // if(comorb.cancerHemat > 0 && comorb.sida > 0){
    //   comorb.cancerHemat = comorb.cancerHemat*2
    //   comorb.sida = comorb.sida*2
    // }
    var resultWrapper = document.querySelector('#idade-result-wrapper')
    var oldResult = resultWrapper.querySelectorAll('h6')
    for (var i = 0; i < oldResult.length; i++) {
      oldResult[i].remove()
    }
    var resultText = document.createElement('h6')
    resultText.classList.add('pl-2')
    resultText.innerHTML = "idade: "+idade
    resultWrapper.appendChild(resultText)
    console.log('============ idade')
    console.log(idade)
    var resultWrapper = document.querySelector('#origem-result-wrapper')
    var oldResult = resultWrapper.querySelectorAll('h6')
    for (var i = 0; i < oldResult.length; i++) {
      oldResult[i].remove()
    }
    var resultText = document.createElement('h6')
    resultText.classList.add('pl-2')
    resultText.innerHTML = "origem: "+origem
    resultWrapper.appendChild(resultText)
    console.log('============ origem')
    console.log(origem)
    /*
    // console.log('============ comorbidade')
    // console.log(comorb)
    // console.log(comorb.icNyhaIv+' '+comorb.cancerMetast+' '+comorb.terapiaOncol+' '+comorb.cancerHemat
    // +' '+comorb.cirrose+' '+comorb.sida+' '+comorb.intAntesAdm+' '+comorb.infectAntesAdm)
    // console.log('============ motivo adm')
    // console.log(motvAdm)
    // console.log(motvAdm.admPlanejada+' '+motvAdm.submCirurgia+' '+motvAdm.motvCirurgia+' '+motvAdm.submCirurgiaNrcAvc+' '+motvAdm.submCirurgiaTrauma
    // +' '+motvAdm.submCirurgiaTransplante+' '+motvAdm.submCirurgiaOutro+' '+motvAdm.admClinicaArritmia+' '+motvAdm.admClinicaColvusao+' '+motvAdm.admClinicaChoqueHipo
    // +' '+motvAdm.admClinicaOutroChoque+' '+motvAdm.admClinicaPancreatite)
    // console.log('============ statsClinico')
    // console.log(statsClinico)
    // console.log(statsClinico.temp+' '+statsClinico.pressSist+' '+statsClinico.drogaVaso)
    // console.log('============ alt lab')
    // console.log(altLab)
    // console.log(altLab.bilirrubina+' '+altLab.creatinina+' '+altLab.ph+' '+altLab.leucocitos+' '+altLab.plaquetas+' '+altLab.oxigenacao)
    // var saps3Score = (idade+origem+
    //   comorb.icNyhaIv+comorb.cancerMetast+comorb.terapiaOncol+comorb.cancerHemat
    //   +comorb.cirrose+comorb.sida+comorb.intAntesAdm+comorb.infectAntesAdm
    //   +motvAdm.admPlanejada+motvAdm.submCirurgia+motvAdm.motvCirurgia+motvAdm.submCirurgiaNrcAvc+motvAdm.submCirurgiaTrauma
    //   +motvAdm.submCirurgiaTransplante+motvAdm.submCirurgiaOutro+motvAdm.admClinicaArritmia+motvAdm.admClinicaColvusao+motvAdm.admClinicaChoqueHipo
    //   +motvAdm.admClinicaOutroChoque+motvAdm.admClinicaPancreatite+statsClinico.temp+statsClinico.pressSist+statsClinico.drogaVaso
    //   +altLab.bilirrubina+altLab.creatinina+altLab.ph+altLab.leucocitos+altLab.plaquetas+altLab.oxigenacao)
    //
    // console.log(saps3Score)
    //
    // console.log('============ logit')
    // var logit = -32.6659+Math.log(saps3Score+20.5958)*7.3068
    // console.log(logit)
    //
    // var mortalidade = Math.exp(logit)/ (1+ Math.exp(logit))
    // console.log((Math.round(mortalidade*1000)/1000)*100)
    */
    var dynamicScore = (idade + origem)
    var resultWrapper = document.querySelector('#comorbidade-result-wrapper')
    var oldResult = resultWrapper.querySelectorAll('h6')
    for (var i = 0; i < oldResult.length; i++) {
      oldResult[i].remove()
    }
    for (var i = 0; i < Object.keys(comorb).length; i++) {

      var resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = Object.entries(comorb)[i][0]+': '+Object.entries(comorb)[i][1]
      resultWrapper.appendChild(resultText)
      // console.log('============ comorb value')
      // console.log(Object.entries(comorb)[i])
      dynamicScore += comorb[Object.keys(comorb)[i]]

    }
    var resultWrapper = document.querySelector('#motivo-admissao-result-wrapper')
    var oldResult = resultWrapper.querySelectorAll('h6')
    for (var i = 0; i < oldResult.length; i++) {
      oldResult[i].remove()
    }
    for (var i = 0; i < Object.keys(motvAdm).length; i++) {
      var resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = Object.entries(motvAdm)[i][0]+': '+Object.entries(motvAdm)[i][1]
      resultWrapper.appendChild(resultText)
      // console.log('============ motivo value')
      // console.log(Object.entries(motvAdm)[i])
      dynamicScore += motvAdm[Object.keys(motvAdm)[i]]
    }
    var resultWrapper = document.querySelector('#status-clinico-result-wrapper')
    var oldResult = resultWrapper.querySelectorAll('h6')
    for (var i = 0; i < oldResult.length; i++) {
      oldResult[i].remove()
    }
    for (var i = 0; i < Object.keys(statsClinico).length; i++) {
      var resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = Object.entries(motvAdm)[i][0]+': '+Object.entries(motvAdm)[i][1]
      resultWrapper.appendChild(resultText)
      // console.log('============ stats value')
      // console.log(Object.entries(statsClinico)[i])
      dynamicScore += statsClinico[Object.keys(statsClinico)[i]]
    }
    var resultWrapper = document.querySelector('#alt-lab-result-wrapper')
    var oldResult = resultWrapper.querySelectorAll('h6')
    for (var i = 0; i < oldResult.length; i++) {
      oldResult[i].remove()
    }
    for (var i = 0; i < Object.keys(altLab).length; i++) {
      var resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = Object.entries(altLab)[i][0]+': '+Object.entries(altLab)[i][1]
      resultWrapper.appendChild(resultText)
      // console.log('============ alt lab value')
      // console.log(Object.entries(altLab)[i])
      dynamicScore += altLab[Object.keys(altLab)[i]]
    }
    var resultWrapper = document.querySelector('#saps-result-wrapper')
    var oldResult = resultWrapper.querySelectorAll('h6')
    for (var i = 0; i < oldResult.length; i++) {

      oldResult[i].remove()
    }
    var resultText = document.createElement('h6')
    resultText.classList.add('pl-2')
    resultText.innerHTML = 'SAPS-3 Score: '+ dynamicScore

    console.log('============ saps score ')
    console.log(dynamicScore)
    console.log('============ Mortality')
    var logitDynamic = -32.6659+Math.log(dynamicScore+20.5958)*7.3068
    // console.log(logitDynamic)
    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    var mortalityDynamic = Math.exp(logitDynamic)/ (1+ Math.exp(logitDynamic))
    var mortalityPercentage = (Math.round(mortalityDynamic*1000)/1000)*100
    resultWrapper.appendChild(resultText)
    resultText = document.createElement('h6')
    resultText.classList.add('pl-2')
    resultText.innerHTML = 'Mortality: '+ (round(mortalityPercentage, 1))+'%'
    resultWrapper.appendChild(resultText)
    console.log((Math.round(round(mortalityPercentage, 1)+'%')))
    // var modal = document.querySelector('#saps-result-modal')
    $('#saps-result-modal').modal('show')

  }
}


(function () {
  Saps.i = new Saps()
})()
