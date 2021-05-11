class SAPS {
  constructor(){

  }

  async calcSaps3Score(){
    var idade
    var origem
    var comorb{
    comorb.icNyhaIv
    comorb.cancerMetast
    comorb.terapiaOncol
    comorb.cancerHemat
    comorb.cirrose
    comorb.sida
    comorb.intAntesAdm
    comorb.infectAntesAdm}
    var motvAdm{
    motvAdm.admPlanejada
    motvAdm.submCirurgia
    motvAdm.submCirurgia.nrcAvc
    motvAdm.submCirurgia.revascMiorc
    motvAdm.submCirurgia.trauma
    motvAdm.submCirurgia.transplante
    motvAdm.submCirurgia.outro
    motvAdm.admClinica
    motvAdm.admClinica.arritmia
    motvAdm.admClinica.choqueHipo
    motvAdm.admClinica.outroChoque
    motvAdm.admClinica.colvusao
    motvAdm.admClinica.abdomeAgudo
    motvAdm.admClinica.pancreatite
    motvAdm.admClinica.deficitFocal
    motvAdm.admClinica.massaIntracran
    motvAdm.admClinica.altNvlConsc
    motvAdm.admClinica.outro}
    var statsClinico{
    statsClinico.gcs
    statsClinico.temp
    statsClinico.freqCard
    statsClinico.pressSist
    statsClinico.drogaVaso}
    var altLab{
    altLab.bilirrubina
    altLab.creatinina
    altLab.ph
    altLab.leucocitos
    altLab.plaquetas
    altLab.oxigenacao}

    switch (idade) {
      case '<40':

      break;
      case '40-59':

      break;
      case '60-69':

      break;
      case '70-74':

      break;
      case '75-79':

      break;
      case '>=80':

      break;
    }
    switch (origem) {
      case 'Pronto Socorro':

      break;
      case 'Outra UTI':

      break;
      case 'Nenhuma das anteriores':

      break;
    }
    if (comorb){
      switch (comorb.icNyhaIv) {
        case 'ic-nyha-iv-sim':

          break;
        default:
      }
      switch (comorb.cancerMetast) {
        case 'cancer-metastatico-sim':

          break;
        default:
      }
      switch (comorb.terapiaOncol) {
        case 'terapia-oncologica-sim':

          break;
        default:

      }
      switch (comorb.cancerHemat) {
        case 'cancer-hematologico-sim':

          break;
        default:

      }
      switch (comorb.cirrose) {
        case 'cirrose-sim':

          break;
        default:

      }
      switch (comorb.sida) {
        case 'sida-sim':

          break;
        default:

      }
      switch (comorb.intAntesAdm) {
        case '14-27 dias':

          break;
        case '>=28 dias':

          break;
        default:

      }
      switch (comorb.infectAntesAdm) {
        case 'Nosocomial':

          break;
        case 'Respiratória':

          break;
        default:

      }

    }
    if(motvAdm){
      switch (motvAdm.admPlanejada) {
        case 'Sim':

          break;
        case 'Não':

          break;
        default:

      }
      switch (motvAdm.submCirurgia) {
        case 'Sim':

          break;
        case 'Não':

          break;
        default:
      }
      switch (motvAdm.motvCirurgia) {
        case 'Cirurgia eletiva':

          break;
        case 'Cirurgia urgência':

          break;
        default:

      }
      switch (motvAdm.motvCirurgia.nrcAvc) {
        case 'Sim':

          break;
        case 'Não':

          break;
        default:
      }
      switch (motvAdm.motvCirurgia.revascMiorc) {
        case 'Sim':

          break;
        case 'Não':

          break;
        default:
      }
      switch (motvAdm.motvCirurgia.trauma) {
        case 'Sim':

          break;
        case 'Não':

          break;
        default:
      }
      switch (motvAdm.motvCirurgia.transplante) {
        case 'Sim':

          break;
        case 'Não':

          break;
        default:
      }
      switch (motvAdm.motvCirurgia.outro) {
        case 'Sim':

          break;
        case 'Não':

          break;
        default:
      }
      switch (motvAdm.admClinica) {
        case 'Sim':

          break;
        case 'Não':
          //needs to verify if children values are negative as well
          break;
        default:

      }
      switch (motvAdm.admClinica.arritmia) {
        case expression:

          break;
        default:

      }
      switch (motvAdm.admClinica.choqueHipo) {
        case expression:

          break;
        default:

      }
      switch (motvAdm.admClinica.outroChoque) {
        case expression:

          break;
        default:

      }
      switch (motvAdm.admClinica.colvusao) {
        case expression:

          break;
        default:

      }
      switch (motvAdm.admClinica.abdomeAgudo) {
        case expression:

          break;
        default:

      }
      switch (motvAdm.admClinica.pancreatite) {
        case expression:

          break;
        default:

      }
      switch (motvAdm.admClinica.deficitFocal) {
        case expression:

          break;
        default:

      }
      switch (motvAdm.admClinica.massaIntracran) {
        case expression:

          break;
        default:

      }
      switch (motvAdm.admClinica.altNvlConsc) {
        case expression:

          break;
        default:

      }
      switch (motvAdm.admClinica.outro) {
        case expression:

          break;
        default:

      }
    }
    if(statsClinico){
      switch (statsClinico.gcs) {
        case expression:

          break;
        default:

      }
      switch (statsClinico.temp) {
        case expression:

          break;
        default:

      }
      switch (statsClinico.freqCard) {
        case expression:

          break;
        default:

      }
      switch (statsClinico.pressSist) {
        case expression:

          break;
        default:

      }
      switch (statsClinico.drogaVaso) {
        case expression:

          break;
        default:

      }
    }
    if(altLab){
      switch (altLab.creatinina) {
        case expression:

          break;
        default:

      }
      switch (altLab.ph) {
        case expression:

          break;
        default:

      }
      switch (altLab.leucocitos) {
        case expression:

          break;
        default:

      }
      switch (altLab.plaquetas) {
        case expression:

          break;
        default:

      }
      switch (altLab.oxigenacao) {
        case expression:

          break;
        default:

      }
    }
  }

}
(function () {

})()
