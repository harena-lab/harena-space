class Saps {
  constructor(){

  }

  // saps3Alg(score){
  //   //-32.6659+Math.log(dynamicScore+20.5958)*7.3068 other calc
  //   // 64.5990 +Math.log(dynamicScore+20.5958)*13.2322 south america calc
  //   var logitDynamic = -32.6659+Math.log(dynamicScore+20.5958)*7.3068
  // }
  buildSapsText (type, source){
    let sapsGroups = {}
    let txtGen = {}
    let txtReady
    sapsGroups['Idade'] = ['Idade']
    sapsGroups['Origem'] = ['Origem']
    sapsGroups['Comorbidade'] = ['IC NYHA IV','Câncer metastático','Terapia oncológica',
     'Câncer hematológico','Cirrose','SIDA']
    sapsGroups['Contexto da admissão'] = []
    sapsGroups['Status clínico'] = ['Escala de Coma de Glasgow','Temperatura',
     'Frequência cardíaca','Pressão sistólica','Droga vasoativa']
    sapsGroups['Alterações laboratoriais'] = ['Bilirrubina','Creatinina','pH','Leucócitos'
     ,'Plaquetas','Oxigenação']

    let keys = Object.keys(source)
    if(type == 'complex'){
      for (let i = 0; i < keys.length; i++) {
        switch (keys[i]) {
          case 'Internado antes da admissão':
            txtGen[keys[i]] = ` internado ${source[keys[i]]} antes da admissão, `
            break;
          case 'Infectado antes da admissão':
            txtGen[keys[i]] = `com infecção ${source[keys[i]][0]}`
            for (var k = 1; k < source[keys[i]].length; k++) {
              txtGen[keys[i]] += ` e ${source[keys[i]][k]}`
            }
            txtGen[keys[i]] += '.'
            break;
          case 'Admissão planejada':
            txtGen[keys[i]] = ` Admitido ${source[keys[i]]}, `
            break;
          case 'Submetido à cirurgia':
            let firstTxt
            for (let k = 0; k < source[keys[i]].length; k++) {
              if (!source[keys[i]][k].includes('submetido à cirurgia')) {
                if (txtGen[keys[i]])
                  txtGen[keys[i]] += ` e ${source[keys[i]][k]}`
                else
                  txtGen[keys[i]] = ` ${source[keys[i]][k]}`
              }else {
                firstTxt = source[keys[i]][k]
              }
            }
            if (txtGen[keys[i]]) {
              txtGen[keys[i]] = firstTxt + txtGen[keys[i]]
            }else {
              txtGen[keys[i]] = firstTxt
            }
            break;
          case 'Motivo de admissão na UTI':
            txtGen[keys[i]] = `, sendo encaminhado à UTI por ${source[keys[i]][0]}`
            for (let k = 1; k < source[keys[i]].length; k++) {
              txtGen[keys[i]] += ` e ${source[keys[i]][k]}`
            }
            break;
          case 'Escala de Coma de Glasgow':

            txtGen[keys[i]] = ` GCS de ${source[keys[i]]},`
            break;
          case 'Temperatura':
            txtGen[keys[i]] = ` Temp ${source[keys[i]]},`
            break;
          case 'Frequência cardíaca':
            txtGen[keys[i]] = ` FC ${source[keys[i]]},`
            break;
          case 'Pressão sistólica':
            txtGen[keys[i]] = ` PAS ${source[keys[i]]},`
            break;
          case 'Bilirrubina':
            txtGen[keys[i]] = ` Bilirrubina total ${source[keys[i]]};`
            break;
          case 'Creatinina':
            txtGen[keys[i]] = ` Creatinina ${source[keys[i]]};`
            break;
          case 'pH':
            txtGen[keys[i]] = ` pH ${source[keys[i]]};`
            break;
          case 'Leucócitos':
            txtGen[keys[i]] = ` Leucócitos ${source[keys[i]]};`
            break;
          case 'Plaquetas':
            txtGen[keys[i]] = ` Plaquetas ${source[keys[i]]};`
            break;
          case 'Oxigenação':
            txtGen[keys[i]] = ` ${source[keys[i]]}.`
            break;
          default:
            txtGen[keys[i]] = source[keys[i]]
        }
          if (sapsGroups['Idade'].indexOf(keys[i]) > -1) {
            txtGen[keys[i]] = source[keys[i]]
          }else if (sapsGroups['Origem'].indexOf(keys[i]) > -1) {
            txtGen[keys[i]] = source[keys[i]]
          }else if (sapsGroups['Comorbidade'].indexOf(keys[i]) > -1) {
            if (txtGen['Comorbidade'])
              txtGen['Comorbidade'] += ` e ${source[keys[i]]}`
            else
              txtGen['Comorbidade'] = `${source[keys[i]]}`
          }
      }
      if(txtGen['Comorbidade'] && txtGen['Comorbidade'].length > 0)
        txtGen['Comorbidade'] = `${txtGen['Comorbidade']},`
      else
        txtGen['Comorbidade'] = ' nenhuma comorbidade,'
      if(!txtGen['Internado antes da admissão'] || txtGen['Internado antes da admissão'].length <= 0)
        txtGen['Internado antes da admissão'] = ' sem internação antes da admissão,'
      if(!txtGen['Infectado antes da admissão'] || txtGen['Infectado antes da admissão'].length <= 0)
        txtGen['Infectado antes da admissão'] = ' sem infecção.'
      if(!txtGen['Admissão planejada'] || txtGen['Admissão planejada'].length <= 0)
        txtGen['Admissão planejada'] = ' não submetido à cirurgia'

      txtReady = Saps.overviewText
      .replace(/\[_idade\]/ig, txtGen['Idade'] || '')
      .replace(/\[_origem\]/ig, txtGen['Origem'] || '')
      .replace(/\[_comorbidade\]/ig, txtGen['Comorbidade'] || '')
      .replace(/\[_internadoDias\]/ig, txtGen['Internado antes da admissão'] || '')
      .replace(/\[_ifeccao\]/ig, txtGen['Infectado antes da admissão'] || '')
      .replace(/\[_admissao\]/ig, txtGen['Admissão planejada'] || '')
      .replace(/\[_submetidoCirurgia\]/ig, txtGen['Submetido à cirurgia'] || '')
      .replace(/\[_submetidoUti\]/ig, txtGen['Motivo de admissão na UTI'] ||'')
      .replace(/\[_gcs\]/ig, txtGen['Escala de Coma de Glasgow'] || '')
      .replace(/\[_temperatura\]/ig, txtGen['Temperatura'] || '')
      .replace(/\[_freqCardiaca\]/ig, txtGen['Frequência cardíaca'] || '')
      .replace(/\[_pressaoSistolica\]/ig, txtGen['Pressão sistólica'] || '')
      .replace(/\[_drogaVasoativa\]/ig, txtGen['Droga vasoativa'] || '')
      .replace(/\[_bilirrubina\]/ig, txtGen['Bilirrubina'] || '')
      .replace(/\[_creatinina\]/ig, txtGen['Creatinina'] || '')
      .replace(/\[_ph\]/ig, txtGen['pH'] || '')
      .replace(/\[_leucocitos\]/ig, txtGen['Leucócitos'] || '')
      .replace(/\[_plaquetas\]/ig, txtGen['Plaquetas'] || '')
      .replace(/\[_oxigenacao\]/ig, txtGen['Oxigenação'] || '')
    }
    else if(type == 'abstract') {
      for (let i = 0; i < keys.length; i++) {
        if (sapsGroups['Comorbidade'].indexOf(keys[i]) > -1) {
          if (txtGen['Comorbidade'])
            txtGen['Comorbidade'] += `, ${source[keys[i]]}`
          else
            txtGen['Comorbidade'] = `${source[keys[i]]}`
        }else {
          switch (keys[i]) {
            case 'Motivo de admissão na UTI':
              txtGen[keys[i]] = source[keys[i]][0]
              for (let k = 1; k < source[keys[i]].length; k++) {
                txtGen[keys[i]] += `, ${source[keys[i]][k]}`
              }
              txtGen[keys[i]]+= ';'
              break;
            case 'Submetido à cirurgia':
              let firstTxt
              for (let k = 0; k < source[keys[i]].length; k++) {
                if (!source[keys[i]][k].includes('submetido à cirurgia')) {
                  if (txtGen[keys[i]])
                    txtGen[keys[i]] += `, ${source[keys[i]][k]}`
                  else
                    txtGen[keys[i]] = `${source[keys[i]][k]}`
                }else {
                  if (source[keys[i]][k].includes('não submetido à cirurgia')) {
                    firstTxt = 'não'
                  }else {
                    firstTxt = `${source[keys[i]][k].substring(20,(source[keys[i]][k].length))}; `
                  }
                }
              }
              if (txtGen[keys[i]]) {
                txtGen[keys[i]] = firstTxt + txtGen[keys[i]] + ';'
              }else {
                txtGen[keys[i]] = firstTxt;
              }
              break;
            case 'Infectado antes da admissão':
              txtGen[keys[i]] = source[keys[i]][0]
              for (var k = 1; k < source[keys[i]].length; k++) {
                txtGen[keys[i]] += `, ${source[keys[i]][k]}`
              }
              txtGen[keys[i]] += ';'
              break;
            case 'Admissão planejada':
              if(source[keys[i]].includes('não'))
                txtGen[keys[i]] = 'não'
              else
                txtGen[keys[i]] = 'sim'
              break;
            case 'Droga vasoativa':
              if(source[keys[i]].includes('sem'))
                txtGen[keys[i]] = 'não'
              else
                txtGen[keys[i]] = 'sim'
              break;
            default:
              txtGen[keys[i]] = `${source[keys[i]]}`
          }
          // console.log('============ key')
          // console.log(keys[i])
          // console.log(source[keys[i]])
        }
      }
      if(txtGen['Comorbidade'] && txtGen['Comorbidade'].length>0)
        txtGen['Comorbidade'] += ';'

      txtReady = Saps.pacientAbstract
      .replace(/\[_idade\]/ig, txtGen['Idade'] ||'não')
      .replace(/\[_origem\]/ig, txtGen['Origem'] ||'não')
      .replace(/\[_comorbidade\]/ig, txtGen['Comorbidade'] ||'não')
      .replace(/\[_internadoDias\]/ig, txtGen['Internado antes da admissão'] ||'não')
      .replace(/\[_ifeccao\]/ig, txtGen['Infectado antes da admissão'] ||'não')
      .replace(/\[_admissao\]/ig, txtGen['Admissão planejada'] ||'não')
      .replace(/\[_submetidoCirurgia\]/ig, txtGen['Submetido à cirurgia'] ||'não')
      .replace(/\[_submetidoUti\]/ig, txtGen['Motivo de admissão na UTI'] ||'outro')
      .replace(/\[_gcs\]/ig, txtGen['Escala de Coma de Glasgow'] ||'não')
      .replace(/\[_temperatura\]/ig, txtGen['Temperatura'] ||'não')
      .replace(/\[_freqCardiaca\]/ig, txtGen['Frequência cardíaca'] ||'não')
      .replace(/\[_pressaoSistolica\]/ig, txtGen['Pressão sistólica'] ||'não')
      .replace(/\[_drogaVasoativa\]/ig, txtGen['Droga vasoativa'] ||'não')
      .replace(/\[_bilirrubina\]/ig, txtGen['Bilirrubina'] ||'não')
      .replace(/\[_creatinina\]/ig, txtGen['Creatinina'] ||'não')
      .replace(/\[_ph\]/ig, txtGen['pH'] ||'não')
      .replace(/\[_leucocitos\]/ig, txtGen['Leucócitos'] ||'não')
      .replace(/\[_plaquetas\]/ig, txtGen['Plaquetas'] ||'não')
      .replace(/\[_oxigenacao\]/ig, txtGen['Oxigenação'] ||'não')
    }
    else if(type == 'json') {
      let textJson = {}
      for(let i = 0; i < keys.length; i++){
        if (sapsGroups['Comorbidade'].indexOf(keys[i]) > -1) {
          if (txtGen['Comorbidade'])
            txtGen['Comorbidade'].push(`${source[keys[i]]}`)
          else{
            txtGen['Comorbidade'] = []
            txtGen['Comorbidade'] = source[keys[i]]
          }
        }else {
          switch (keys[i]) {
            case 'Motivo de admissão na UTI':
              txtGen[keys[i]] = []
              txtGen[keys[i]].push(`${source[keys[i]][0]}`)
              for (let k = 1; k < source[keys[i]].length; k++) {
                txtGen[keys[i]].push(`${source[keys[i]][k]}`)
              }
              break;
            case 'Submetido à cirurgia':
              let firstTxt
              for (let k = 0; k < source[keys[i]].length; k++) {
                if (!source[keys[i]][k].includes('submetido à cirurgia')) {
                  if (txtGen[keys[i]])
                    txtGen[keys[i]].push(`${source[keys[i]][k]}`)
                  else{
                    txtGen[keys[i]] = []
                    txtGen[keys[i]].push(`${source[keys[i]][k]}`)
                  }
                }else {
                  if (source[keys[i]][k].includes('não submetido à cirurgia')) {
                    firstTxt = 'não'
                  }else {
                    firstTxt = `${source[keys[i]][k].substring(21,(source[keys[i]][k].length))}`
                  }
                }
              }
              if (txtGen[keys[i]]) {
                txtGen[keys[i]].push(`${firstTxt}`)
              }else {
                txtGen[keys[i]] = []
                txtGen[keys[i]].push(`${firstTxt}`)
              }
              break;
            case 'Infectado antes da admissão':
              txtGen[keys[i]] = []
              txtGen[keys[i]].push(`${source[keys[i]][0]}`)
              for (var k = 1; k < source[keys[i]].length; k++) {
                txtGen[keys[i]].push(`${source[keys[i]][k]}`)
              }
              break;
            case 'Admissão planejada':
              if(source[keys[i]].includes('não')){
                txtGen[keys[i]] = []
                txtGen[keys[i]] = 'não'
              }
              else{
                txtGen[keys[i]] = []
                txtGen[keys[i]] = 'sim'
              }
              break;
            case 'Droga vasoativa':
              if(source[keys[i]].includes('sem')){
                txtGen[keys[i]] = []
                txtGen[keys[i]] = 'não'
              }
              else{
                txtGen[keys[i]] = []
                txtGen[keys[i]] = 'sim'
              }
              break;
            default:
              txtGen[keys[i]] = []
              txtGen[keys[i]] = `${source[keys[i]]}`
          }
          // console.log('============ key')
          // console.log(keys[i])
          // console.log(source[keys[i]])
        }
        // console.log('============ key')
        // console.log(keys[i])
        // console.log(source[keys[i]])
      }
      txtReady = JSON.stringify(txtGen)

    }
    // console.log('============ text')
    // console.log(txtReady)
    return txtReady
  }
  async calcSaps3Score(pacientData){
    let idade
    let origem
    let comorb = {}
    let motvAdm = {}
    let statsClinico = {}
    let altLab = {}
    let sapsTextBuild = {}
    let sapsCalcGroup = {}
    let sapsTotal = 0

    let sapsScoreValues = Prognosis.sapsScoreValues['pacient']
    let sapsScoreKeys = Object.keys(sapsScoreValues)

    for (var elem of pacientData.querySelectorAll('select')) {
      if(elem.validity.valid){

        for (let i = 0; i < sapsScoreKeys.length; i++) {
          let valueKey = Object.keys(sapsScoreValues[sapsScoreKeys[i]]['values'])
          if(Prognosis.i.removeAccent(sapsScoreKeys[i]) == Prognosis.i.removeAccent(elem.value)){
            let sapsValue = sapsScoreValues[sapsScoreKeys[i]]['values']['Sim']['saps']
            let sapsText = sapsScoreValues[sapsScoreKeys[i]]['values']['Sim']['text']
            /* console.log('==============================================')
            // console.log('============ selected')
            // console.log(sapsScoreKeys[i])
            //
            // console.log(sapsValue)
            // console.log('============ text')
            // console.log(sapsText)
            if (sapsText != ''){
              if (!sapsTextBuild[sapsScoreKeys[i]]) {
                sapsTextBuild[sapsScoreKeys[i]] = []
              }
              sapsTextBuild[sapsScoreKeys[i]].push(sapsText)
            }*/

            // console.log(sapsValue)
            sapsCalcGroup[sapsScoreKeys[i]] = sapsValue
          }else {
            for (let k = 0; k < valueKey.length; k++) {
              let sapsValue = sapsScoreValues[sapsScoreKeys[i]]['values'][valueKey[k]]['saps']
              let sapsText = sapsScoreValues[sapsScoreKeys[i]]['values'][valueKey[k]]['text']
              if(Prognosis.i.removeAccent(valueKey[k]) == Prognosis.i.removeAccent(elem.value)){
                /* console.log('==============================================')

                // console.log('============ text')
                // console.log(sapsText)
                if (sapsText != ''){
                  if (!sapsTextBuild[sapsScoreKeys[i]]) {
                    sapsTextBuild[sapsScoreKeys[i]] = []
                  }

                  sapsTextBuild[sapsScoreKeys[i]].push(sapsText)
                }*/
                // console.log('============ selected')
                // console.log(valueKey[k])
                // console.log(sapsValue)
                if(!sapsCalcGroup[sapsScoreKeys[i]])
                  sapsCalcGroup[sapsScoreKeys[i]] = {}
                sapsCalcGroup[sapsScoreKeys[i]][valueKey[k]] = sapsValue
              }
            }
          }
        }
        switch (elem.id) {
          case 'idade':
            idade = elem.value
            switch (idade) {
              case '<40 anos':
              idade = 0
              break;
              case '40-59 anos':
              idade = 5
              break;
              case '60-69 anos':
              idade = 9
              break;
              case '70-74 anos':
              idade = 13
              break;
              case '75-79 anos':
              idade = 15
              break;
              case '>=80 anos':
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
            case 'Outro local do hospital':
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
            case 'neurocirurgia-por-acidente-vascular-cerebral':
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
            case 'paO2 <60 sem VM':
              altLab.oxigenacao = 5
              break;
            case 'paO2/FiO2 <100 em VM':
              altLab.oxigenacao = 11
              break;
            case 'paO2/FiO2 >=100 em VM':
              altLab.oxigenacao = 7
              break;
            }
        }
      }

    }
    for (var elem of pacientData.querySelectorAll('input[type=radio]')) {
      if(elem.validity.valid && elem.checked){
        for (let i = 0; i < sapsScoreKeys.length; i++) {
          let valueKeys = Object.keys(sapsScoreValues[sapsScoreKeys[i]]['values'])

          if (Prognosis.i.removeAccent(sapsScoreKeys[i]) == Prognosis.i.removeAccent(elem.name)
          || Prognosis.i.removeAccent(sapsScoreKeys[i]) == Prognosis.i.removeAccent(elem.name.substring(0,(elem.name.length - 6)))) {
            // console.log('===================== selected main')
            // console.log(sapsScoreKeys[i])
            for (let k = 0; k < valueKeys.length; k++) {
              if (Prognosis.i.removeAccent(valueKeys[k]) == Prognosis.i.removeAccent(elem.value)) {
                let selectedOpt = sapsScoreValues[sapsScoreKeys[i]]['values'][valueKeys[k]]
                let sapsValue = selectedOpt['saps']
                let sapsText = selectedOpt['text']
                /* console.log('============ Selected radio')
                // console.log(elem.name)
                // console.log(elem.value)
                // console.log('============ SAPS translated info')
                // console.log(sapsValue)
                // console.log(sapsText)
                // if (sapsText != ''){
                //   if (!sapsTextBuild[sapsScoreKeys[i]]) {
                //     sapsTextBuild[sapsScoreKeys[i]] = []
                //   }
                //   sapsTextBuild[sapsScoreKeys[i]].push(sapsText)
                // }*/
                // console.log('============ selected value')
                // console.log(valueKeys[k])
                // console.log(sapsValue)
                if(!sapsCalcGroup[sapsScoreKeys[i]])
                  sapsCalcGroup[sapsScoreKeys[i]] = {}
                if(valueKeys[k] == 'Não' || valueKeys[k] == 'Sim')
                  sapsCalcGroup[sapsScoreKeys[i]] = sapsValue
                else
                  sapsCalcGroup[sapsScoreKeys[i]][valueKeys[k]] = sapsValue
              }
            }
          }
        }

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
            case 'paO2 <60 sem VM':
            altLab.oxigenacao = 5
            break;
            case 'paO2/FiO2 <100 em VM':
            altLab.oxigenacao = 11
            break;
            case 'paO2/FiO2 >=100 em VM':
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

          for (let i = 0; i < sapsScoreKeys.length; i++) {
            let valueKeys = Object.keys(sapsScoreValues[sapsScoreKeys[i]]['values'])
            // console.log('======================= selected main')
            // console.log(sapsScoreKeys[i])
            for (let k = 0; k < valueKeys.length; k++) {
              let selectedOpt = sapsScoreValues[sapsScoreKeys[i]]['values'][valueKeys[k]]
              if (Prognosis.i.removeAccent(valueKeys[k]) == Prognosis.i.removeAccent(elem.id)) {
                let sapsValue = selectedOpt['saps']
                let sapsText = selectedOpt['text']
                /* console.log('============ Selected checkbox')
                // console.log(elem.value)
                // console.log(elem.id)
                // console.log('============ SAPS translated info')
                // console.log(sapsValue)
                // console.log(sapsText)
                if (sapsText != ''){
                  if (!sapsTextBuild[sapsScoreKeys[i]]) {
                    sapsTextBuild[sapsScoreKeys[i]] = []
                  }
                  sapsTextBuild[sapsScoreKeys[i]].push(sapsText)
                }*/
                // console.log('============ select value')
                // console.log(valueKeys[k])
                // console.log(sapsValue)
                if(!sapsCalcGroup[sapsScoreKeys[i]])
                  sapsCalcGroup[sapsScoreKeys[i]] = {}
                sapsCalcGroup[sapsScoreKeys[i]][valueKeys[k]] = sapsValue
              }
            }
          }
          switch (elem.id) {
            case 'cirurgia-urgencia':
            motvAdm.motvCirurgia = 6
            break;
            case 'neurocirurgia-por-acidente-vascular-cerebral':
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
            case 'neurocirurgia-por-acidente-vascular-cerebral':
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
    sapsCalcGroup['UTI'] = 16
    let calcGroupKey = Object.keys(sapsCalcGroup)

    for (let i = 0; i < calcGroupKey.length; i++) {
      if (typeof sapsCalcGroup[calcGroupKey[i]] == 'object') {
        let childKey = Object.keys(sapsCalcGroup[calcGroupKey[i]])
        for (let k = 0; k < childKey.length; k++) {
          sapsTotal += sapsCalcGroup[calcGroupKey[i]][childKey[k]]
        }
      }else {
        sapsTotal += sapsCalcGroup[calcGroupKey[i]]
      }
    }
    //motvAdm.uti = 16
    // console.log('============ motvADM')
    // console.log(motvAdm)
    // console.log('============ idade')
    // console.log(idade)
    //
    // console.log('============ origem')
    // console.log(origem)
    /*
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
    }*/

    // console.log('============ saps score ')
    // console.log(dynamicScore)
    // console.log('============ Mortality')
    //-32.6659+Math.log(dynamicScore+20.5958)*7.3068 other calc
    // 64.5990 +Math.log(dynamicScore+20.5958)*13.2322 south america calc
    let logitDynamic = -32.6659+Math.log(sapsTotal+20.5958)*7.3068
    // console.log(logitDynamic)
    function round(value,precision) {
      let multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    let mortalityDynamic = Math.exp(logitDynamic)/ (1+ Math.exp(logitDynamic))
    let mortalityPercentage = (Math.round(mortalityDynamic*1000)/1000)*100

    // console.log(round(mortalityPercentage, 1)+'%')
    // let modal = document.querySelector('#saps-result-modal')
    function buildCalculatorResults(sapsOptions, selectedGroup, wrapper){
      let sapsGroups = {}
      sapsGroups['Idade'] = ['Idade']
      sapsGroups['Origem'] = ['Origem']
      sapsGroups['Comorbidade'] = ['IC NYHA IV','Câncer metastático','Terapia oncológica',
       'Câncer hematológico','Cirrose','SIDA', 'Internado antes da admissão', 'Infectado antes da admissão']
      sapsGroups['Contexto da admissão'] = ['Admissão planejada', 'Submetido à cirurgia', 'Motivo de admissão na UTI']
      sapsGroups['Status clínico'] = ['Escala de Coma de Glasgow','Temperatura',
       'Frequência cardíaca','Pressão sistólica','Droga vasoativa']
      sapsGroups['Alterações laboratoriais'] = ['Bilirrubina','Creatinina','pH','Leucócitos'
       ,'Plaquetas','Oxigenação']

      let sapsCalcKey = Object.keys(sapsOptions)
      for (let i = 0; i < sapsCalcKey.length; i++) {
        if(sapsGroups[selectedGroup].indexOf(sapsCalcKey[i]) > -1){
          if (typeof sapsOptions[sapsCalcKey[i]] == 'object') {
            let childKey = Object.keys(sapsOptions[sapsCalcKey[i]])
            for (let k = 0; k < childKey.length; k++) {
              let resultText = document.createElement('h6')
              resultText.classList.add('pl-2')
              resultText.innerHTML = `${sapsCalcKey[i]}(${childKey[k]}): ${sapsOptions[sapsCalcKey[i]][childKey[k]]}`
              wrapper.appendChild(resultText)
            }
          }else {
            let resultText = document.createElement('h6')
            resultText.classList.add('pl-2')
            resultText.innerHTML = `${sapsCalcKey[i]}: ${sapsOptions[sapsCalcKey[i]]}`
            wrapper.appendChild(resultText)
          }
        }
      }
    }
    if(document.querySelector('#idade-result-wrapper')){
      let resultText = document.createElement('h6')
      let resultWrapper = document.querySelector('#idade-result-wrapper')
      let oldResult = resultWrapper.querySelectorAll('h6')
      for (let i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      buildCalculatorResults(sapsCalcGroup, 'Idade', resultWrapper)

      resultWrapper = document.querySelector('#origem-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (let i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      buildCalculatorResults(sapsCalcGroup, 'Origem', resultWrapper)


      resultWrapper = document.querySelector('#comorbidade-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (let i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      buildCalculatorResults(sapsCalcGroup, 'Comorbidade', resultWrapper)

      resultWrapper = document.querySelector('#motivo-admissao-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (let i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      buildCalculatorResults(sapsCalcGroup, 'Contexto da admissão', resultWrapper)

      resultWrapper = document.querySelector('#status-clinico-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (let i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      buildCalculatorResults(sapsCalcGroup, 'Status clínico', resultWrapper)

      resultWrapper = document.querySelector('#alt-lab-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (let i = 0; i < oldResult.length; i++) {
        oldResult[i].remove()
      }
      buildCalculatorResults(sapsCalcGroup, 'Alterações laboratoriais', resultWrapper)

      resultWrapper = document.querySelector('#saps-result-wrapper')
      oldResult = resultWrapper.querySelectorAll('h6')
      for (let i = 0; i < oldResult.length; i++) {

        oldResult[i].remove()
      }
      resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = 'SAPS-3 Score: '+ sapsTotal
      resultWrapper.appendChild(resultText)

      resultText = document.createElement('h6')
      resultText.classList.add('pl-2')
      resultText.innerHTML = 'Mortality: '+ (round(mortalityPercentage, 1))+'%'
      resultWrapper.appendChild(resultText)
    }
    if(document.querySelector('#saps-survival')){
      document.querySelector('#saps-survival').value = round((100 - mortalityPercentage),1)
      MessageBus.progn.publish('compute/predict/sapsCalc', round((100 - mortalityPercentage),1), false)
      MessageBus.i.publish('var/set/sapsCalc', round((100 - mortalityPercentage),1), false)
    }

    $('#saps-result-modal').modal('show')
    if (new URL(document.location).pathname == '/prognosis/learn/player/' || new URL(document.location).pathname.includes('/prognosis/challenge')){
      Saps.i.pacientOverview(pacientData)
    }


  }

  async pacientOverview(pacientData){

    let sapsScoreValues = Prognosis.sapsScoreValues['pacient']
    let sapsScoreKeys = Object.keys(sapsScoreValues)
    let sapsTextBuild = {}

    for (let elem of pacientData.querySelectorAll('select')) {
      if(elem.validity.valid){

        for (let i = 0; i < sapsScoreKeys.length; i++) {
          let valueKey = Object.keys(sapsScoreValues[sapsScoreKeys[i]]['values'])
          if(Prognosis.i.removeAccent(sapsScoreKeys[i]) == Prognosis.i.removeAccent(elem.value)){
            let sapsValue = sapsScoreValues[sapsScoreKeys[i]]['values']['Sim']['saps']
            let sapsText = sapsScoreValues[sapsScoreKeys[i]]['values']['Sim']['text']
            // console.log('==============================================')
            // console.log('============ selected')
            // console.log(sapsScoreKeys[i])
            //
            // console.log(sapsValue)
            // console.log('============ text')
            // console.log(sapsText)
            if (sapsText != ''){
              if (!sapsTextBuild[sapsScoreKeys[i]]) {
                sapsTextBuild[sapsScoreKeys[i]] = []
              }
              sapsTextBuild[sapsScoreKeys[i]].push(sapsText)
            }
          }else {
            for (let k = 0; k < valueKey.length; k++) {
              let sapsValue = sapsScoreValues[sapsScoreKeys[i]]['values'][valueKey[k]]['saps']
              let sapsText = sapsScoreValues[sapsScoreKeys[i]]['values'][valueKey[k]]['text']
              if(Prognosis.i.removeAccent(valueKey[k]) == Prognosis.i.removeAccent(elem.value)){
                // console.log('==============================================')
                // console.log('============ selected')
                // console.log(valueKey[k])
                //
                // console.log(sapsValue)
                // console.log('============ text')
                // console.log(sapsText)
                if (sapsText != ''){
                  if (!sapsTextBuild[sapsScoreKeys[i]]) {
                    sapsTextBuild[sapsScoreKeys[i]] = []
                  }

                  sapsTextBuild[sapsScoreKeys[i]].push(sapsText)
                }
              }
            }
          }
        }
      }
    }
    for (let elem of pacientData.querySelectorAll('input[type=radio]')) {
      if(elem.validity.valid && elem.checked){

        for (let i = 0; i < sapsScoreKeys.length; i++) {
          let valueKeys = Object.keys(sapsScoreValues[sapsScoreKeys[i]]['values'])
          if (Prognosis.i.removeAccent(sapsScoreKeys[i]) == Prognosis.i.removeAccent(elem.name)
          || Prognosis.i.removeAccent(sapsScoreKeys[i]) == Prognosis.i.removeAccent(elem.name.substring(0,(elem.name.length - 6)))) {
            for (let k = 0; k < valueKeys.length; k++) {
              if (Prognosis.i.removeAccent(valueKeys[k]) == Prognosis.i.removeAccent(elem.value)) {
                let selectedOpt = sapsScoreValues[sapsScoreKeys[i]]['values'][valueKeys[k]]
                let sapsValue = selectedOpt['saps']
                let sapsText = selectedOpt['text']
                // console.log('============ Selected radio')
                // console.log(elem.name)
                // console.log(elem.value)
                // console.log('============ SAPS translated info')
                // console.log(sapsValue)
                // console.log(sapsText)
                if (sapsText != ''){
                  if (!sapsTextBuild[sapsScoreKeys[i]]) {
                    sapsTextBuild[sapsScoreKeys[i]] = []
                  }
                  sapsTextBuild[sapsScoreKeys[i]].push(sapsText)
                }
              }
            }
          }
        }
      }
    }
    for (let elem of pacientData.querySelectorAll('input[type=checkbox]')) {
      if(elem.validity.valid){
        switch (elem.checked) {
          case true:
          for (let i = 0; i < sapsScoreKeys.length; i++) {
            let valueKeys = Object.keys(sapsScoreValues[sapsScoreKeys[i]]['values'])
            for (let k = 0; k < valueKeys.length; k++) {
              let selectedOpt = sapsScoreValues[sapsScoreKeys[i]]['values'][valueKeys[k]]
              if (Prognosis.i.removeAccent(valueKeys[k]) == Prognosis.i.removeAccent(elem.id)) {
                let sapsValue = selectedOpt['saps']
                let sapsText = selectedOpt['text']
                // console.log('============ Selected checkbox')
                // console.log(elem.value)
                // console.log(elem.id)
                // console.log('============ SAPS translated info')
                // console.log(sapsValue)
                // console.log(sapsText)
                if (sapsText != ''){
                  if (!sapsTextBuild[sapsScoreKeys[i]]) {
                    sapsTextBuild[sapsScoreKeys[i]] = []
                  }
                  sapsTextBuild[sapsScoreKeys[i]].push(sapsText)
                }
              }
            }
          }
          break;
        }
      }
    }

    let overviewText = this.buildSapsText('complex', sapsTextBuild)

    let pacientAbstract = this.buildSapsText('abstract', sapsTextBuild)
    let pacientJson = this.buildSapsText('json', sapsTextBuild)



    if(!document.querySelector('#pacient-overview-wrapper > h5')){
      var txt = document.createElement('h5')
      txt.innerHTML = overviewText
      document.querySelector('#pacient-overview-wrapper').appendChild(txt)
    }else {
      var txt = document.querySelector('#pacient-overview-wrapper > h5')
      txt.innerHTML = overviewText
    }
    document.querySelector('#pacient-abstract').value = pacientAbstract
    if(MessageBus.progn)
      MessageBus.progn.publish('input/changed/presentation/pacientAbstract', pacientAbstract)
    document.querySelector('#pacient-abstract-json').value = pacientJson
    document.querySelector('dcc-submit[bind="submit-prognosis-lvl-txt"]')._computeTrigger()
    $('#pacient-overview-modal').modal('show')
    // console.log('===========================')
    // console.log('============ publishing ===================')
    // console.log('=============================')
    MessageBus.progn.publish('knot/navigate/>', {url:'/prognosis/learn/player/'})

  }

  bestPacient(){

    const checkOptions = function(object) {
      let possible = []
      for (let key of Object.values(object)) {
        if(typeof key == 'object'){
          let group = Object.values(key)
          let groupValue = 0
          for (let value of group) {
            if(typeof value == 'object' && value!=null){
              possible.push(checkOptions(groupValue))
            }else if(value!=null){
              groupValue+=value
            }
          }
          possible.push(groupValue)
        }else if (key!=null){
          possible.push(key)
        }
      }

      if(possible.length>0){
        let bestOption
        for (let variable of possible) {
          if(variable < bestOption || bestOption == null){
            bestOption = variable
          }
        }
        return bestOption
      }
    }
    let lockedOptions = 0
    let openOptions = 0
    if (pacientInfo.pacient.locked && Object.keys(pacientInfo.pacient.locked).length > 0) {
      for (let i = 0; i < Object.keys(pacientInfo.pacient.locked).length; i++) {
        lockedOptions += Object.values(pacientInfo.pacient.locked)[i]
      }

    }
    if(pacientInfo.pacient.open && Object.keys(pacientInfo.pacient.open).length > 0){
      for (let i = 0; i < Object.keys(pacientInfo.pacient.open).length; i++) {
        // console.log('============ before')
        // console.log(Object.values(pacientInfo.pacients.open)[i])
        let object = Object.values(pacientInfo.pacient.open)[i]
        // console.log('============open begins')
        openOptions += checkOptions(object)
        // console.log(openOptions)
      }
    }
  }

}


(function () {
  Saps.i = new Saps()

  Saps.overviewText =
  `
  Paciente [_idade], encaminhado [_origem], portador de [_comorbidade]
  [_internadoDias][_ifeccao][_admissao][_submetidoCirurgia][_submetidoUti]. À admissão, apresentava [_gcs][_temperatura]
  [_freqCardiaca][_pressaoSistolica] [_drogaVasoativa] uso de DVA. A seguir, os exames da admissão:
  [_bilirrubina][_creatinina][_ph][_leucocitos][_plaquetas][_oxigenacao]
  `
  Saps.pacientAbstract =
  `
  <b>Idade:</b> [_idade]<br>
  <b>Origem:</b> [_origem]<br>
  <b>Comorbidade(s):</b> [_comorbidade]<br>
  <b>Internado antes da admissão:</b> [_internadoDias]<br>
  <b>Infectado antes da admissão:</b> [_ifeccao]<br>
  <b>Admissão planejada:</b> [_admissao]<br>
  <b>Submetido à cirugia:</b> [_submetidoCirurgia]<br>
  <b>Motivo de admissão na UTI:</b> [_submetidoUti]<br>
  <b>GCS:</b> [_gcs]<br>
  <b>Temp:</b> [_temperatura]<br>
  <b>FC:</b> [_freqCardiaca]<br>
  <b>PAS:</b> [_pressaoSistolica]<br>
  <b>Droga vasoativa:</b> [_drogaVasoativa]<br>
  <b>Bilirrubina:</b> [_bilirrubina]<br>
  <b>Creatinina:</b> [_creatinina]<br>
  <b>pH:</b> [_ph]<br>
  <b>Leucócitos:</b>[_leucocitos]<br>
  <b>Plaquetas:</b> [_plaquetas]<br>
  <b>Oxigenação:</b> [_oxigenacao]<br>
  `
})()
