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
            idade = 3
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
      if(elem.validity.valid){
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
          switch (elem.value) {
            case 'Sim':
              switch (true) {
                case ((elem.name = 'internado-antes-da-admissao-value') && (elem.value == '14-27 dias')):
                  comorb.intAntesAdm = 6
                  break;
                case ((elem.name = 'internado-antes-da-admissao-value') && (elem.value == '>=28 dias')):
                  comorb.intAntesAdm = 7
                  break;
              }
            break;
            case 'Não':
              comorb.intAntesAdm = 0
            break;
          }
          break;
          case 'infectado-antes-da-admissao':
          switch (elem.value) {
            case 'Sim':
            switch (true) {
              case ((elem.name = 'infectado-antes-da-admissao-value') && (elem.value == 'Nosocomial')):
                comorb.infectAntesAdm = 4
                break;
              case ((elem.name = 'infectado-antes-da-admissao-value') && (elem.value == 'Respiratória')):
                comorb.infectAntesAdm = 5
                break;
            }

            break;
            case 'Não':
            comorb.infectAntesAdm = 0
            break;
          }
          break;
          case 'admissao-planejada':

          switch (elem.value) {
            case 'Sim':
            motvAdm.admPlanejada = 3
            break;
            case 'Não':
            motvAdm.admPlanejada = 0
            break;
          }
          break;
          case 'submetido-a-cirurgia':

          switch (elem.value) {
            case 'Sim':
            motvAdm.submCirurgia = 16
            break;
            case 'Não':
            motvAdm.submCirurgia = 5
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
            statsClinico.gcs = 6
            break;
            case '7-12':
            statsClinico.gcs = 2
            break;
            case '>=13':
            statsClinico.gcs = 0
            break;
          }
          break;
          case 'temperatura':

          switch (elem.value) {
            case '<35 °C':
            statsClinico.temp = 7
            break;
            case '>=35 °C':
            statsClinico.temp = 8
            break;
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
            case '<1,2 mg/dl':
            altLab.creatinina = 0
            break;
            case '1,2-1,9 mg/dl':
            altLab.creatinina = 0
            break;
            case '2-3,4 mg/dl':
            altLab.creatinina = 7
            break;
            case '>=3,5 mg/dl':
            altLab.creatinina = 8
            break;
          }
          break;
          case 'ph':

          switch (elem.value) {
            case '<=7,25':
            altLab.ph = 3
            break;
            case '>7,25':
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
            case ' revascularizacao-miocardica':
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
            motvAdm.admClinicaOutroChoque = 3
            break;
            case 'convulsao':
            motvAdm.admClinicaColvusao = -4
            break;
            case ' abdome-agudo':
            motvAdm.admClinicaAbdomeAgudo = 3
            break;
            case 'pancreatite-grave':
            motvAdm.admClinicaPancreatite = 9
            break;
            case 'deficit-focal':
            motvAdm.admClinicaDeficitFocal = 7
            break;
            case ' efeito-de-massa-intracraniana':
            motvAdm.admClinicaMassaIntracran = 10
            break;
            case 'alteracao-do-nivel-de-consciencia':
            motvAdm.admClinicaAltNvlConsc = 4
            break;
            case 'nenhum-dos-anteriores':
            motvAdm.admClinicaOutro = 0
            break;
            default:

          }
          break;
          case false:
          switch (elem.id) {
            case 'nrc-por-avc':
            motvAdm.submCirurgiaNrcAvc = 0
            break;
            case ' revascularizacao-miocardica':
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
            motvAdm.admClinicaAhoqueHipo = 0
            break;
            case 'outro-choque':
            motvAdm.admClinicaOutroChoque = 0
            break;
            case 'convulsao':
            motvAdm.admClinicaColvusao = 0
            break;
            case ' abdome-agudo':
            motvAdm.admClinicaAbdomeAgudo = 0
            break;
            case 'pancreatite-grave':
            motvAdm.admClinicaPancreatite = 0
            break;
            case 'deficit-focal':
            motvAdm.admClinicaDeficitFocal = 0
            break;
            case ' efeito-de-massa-intracraniana':
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
    console.log('============ idade')
    console.log(idade)
    console.log('============ origem')
    console.log(origem)
    console.log('============ comorbidade')
    console.log(comorb)
    console.log('============ motivo adm')
    console.log(motvAdm)
    console.log('============ statsClinico')
    console.log(statsClinico)
    console.log('============ alt lab')
    console.log(altLab)
  }
}


(function () {
  Saps.i = new Saps()
})()
