import { css, Oid } from '/dccs/lib/oid/oid-full-dev.js'

Oid.customize('foid:lively-talk', {
  cid: 'robot',
  style: css`
  .character {
    width: 256px;
  }
  .bubble {
    height: 40vh;
    padding-left: 100px;
  }`,
  process: function(oid, parameters) {
    if (parameters) {
      if (parameters.value == 'simular') {
        oid.know = ''
        console.log('=== simular')
        console.log(oid.statements)
        if (oid.statements == null || oid.statements.length == 0)
          oid.handleSend('display', {value: '-> Nada a ser processado'})
        else {
          if (oid.statements.length > 1 || !Array.isArray(oid.statements[0]))
            oid.handleSend('display', {value: '-> Ainda há instruções soltas, não posso processar'})
          else {
            let feedback = ''
            const vstm = oid.statements[0]
            if (vstm.length < 5)
              feedback += '-> Estão faltando ciclos no meu pobre coração\n'
            else if (vstm.length > 5)
              feedback += '-> Há muitos ciclos no meu coração, ele está fora de controle\n'
            let empty = false
            for (const stm of vstm) {
              if (stm.onda == null || stm.atvEle == null || stm.atvMec == null)
                empty = true
            }
            if (empty) feedback += '-> Há uma ou mais instruções incompletas\n'

            // analisando consistencia entre texto e imagem de cada célula
            let pEle = 0
            for (const stm of vstm) {
              // analisando a coluna eletro
              const eletro = stm.atvEle
              if (eletro != null &&
                  (!eletro.estrutura.includes(eletro.image) || eletro.image != eletro.efeito))
                pEle++
            }
            if (pEle > 0) {
              feedback += `-> O texto que você escolheu em uma das imagens em algum dos blocos não descreve adequadamente a atividade ilustrada. (detalhes em Saiba mais)\n`
              oid.know += `-> Associação entre textos e imagens inconsistente em ${pEle} blocos na atividade elétrica\n`
            }
            // analisando consistencia entre texto e imagem atividade mecanica
            let pMec = 0
            for (const stm of vstm) {
              const mec = stm.atvMec
              if (mec != null &&
                  (!mec.estrutura.includes(mec.efeitoMec) || !mec.image.includes(mec.efeitoMec) || mec.efeitoMec != mec.efeitoFis))
                  pMec++
            }
            if (pMec > 0) {
              feedback += `-> O texto que você escolheu em uma das imagens em algum dos blocos não descreve adequadamente a atividade ilustrada. (detalhes em Saiba mais)\n`
              oid.know += `-> Associação entre textos e imagens inconsistente em ${pMec} blocos na atividade mecânica\n`
            }

            // analisando a ordem das células atividade elétrica
            const ordemEle = ['ondaP', 'segmentoPR', 'ondaQRS', 'segmentoST', 'OndaT']
            const max = (vstm.length < 5) ? vstm.length : 5
            let iEle = false
            for (let i = 0; i < max; i++) {
              const eletro = vstm[i].atvEle
              if (eletro != null && eletro.image != ordemEle[i])
                iEle = true
            }
            if (iEle) {
              feedback += `-> Alguma coisa está fora de ordem.\n`
              oid.know += `-> Revise a ordem em que o pulso elétrico segue. Do jeito que está, o impulso não segue uma sequência contínua.\n`
            }
            // analisando a ordem das Ondas ECG 
            let iOnda = false
            for (let i = 0; i < max; i++) {
              const onda = vstm[i].onda
              if (onda != null && onda.image != ordemEle[i])
                iOnda = true
              }
            if (iOnda){
              feedback += `-> Alguma coisa está fora de ordem.\n`
              oid.know += `-> Revise a ordem da onda do ECG. Do jeito que está a onda não segue uma sequência contínua.\n`
            }
            // analisando a ordem da atividade mecanica
            for (let i = 0; i < max; i++) {
              const onda = vstm[i].atvMec
              if (onda != null && onda.efeitoFis != ordemEle[i])
                iOnda = true
              }
            if (iOnda){
                feedback += `-> Alguma coisa está fora de ordem.\n`
                oid.know += `-> Revise a ordem da atividade mecânica. Do jeito que está, o movimento não permite bombear sangue na sequência correta.\n`
            }
            // verifica compatibilidade entre as células das três colunas
            let incompat = false
            for (let i = 0; i < max; i++) {
              if (vstm[i].onda != null && vstm[i].atvEle != null &&
                  vstm[i].onda.image != vstm[i].atvEle.image)
                incompat = true
              if (vstm[i].onda != null && vstm[i].atvMec != null &&
                vstm[i].onda.image != vstm[i].atvMec.efeitoFis)
                incompat = true
              if (vstm[i].atvEle != null && vstm[i].atvMec != null &&
                  vstm[i].atvEle.image != vstm[i].atvMec.efeitoFis)
                incompat = true
            }
            if (incompat) feedback += '-> Há incompatibilidade entre as colunas\n'

            oid.handleSend('display', {value: feedback})
          }
        }
      }
      else if (parameters.value == 'saiba') {
        oid.handleSend('display',
          {value: (oid.know == null || oid.know.length == 0) ? '-> Não há nada a ser dito' : oid.know})
      } else if (parameters.value.length == 0)
        oid.statements = null
      else if (parameters.value != null) {
        console.log('=== guarda parametros')
        console.log(parameters.value)
        const lines = parameters.value.split('\n')
        oid.statements = []
        for (const l of lines)
          oid.statements.push(JSON.parse(l))       
      }
    }
  }
})