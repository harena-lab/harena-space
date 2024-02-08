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
      if (parameters.value == 'simular' || parameters.value == 'voltar') {
        let erro = 0
        let existe = '&#10004;'//existe um coração
        oid.smExiste = 'O coração existe! Verifique se há erro em algum outro lugar.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let instrucoes = '&#10004;'// não há blocos soltas
        oid.sminstrucoes = 'Não existem instruções soltas! Verifique se há erro em algum outro lugar.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let ciclo = '&#10004;' //existe 5 ciclos
        oid.smciclo = 'A quantidade de ciclos do meu coração está correta! Verifique se há erro em algum outro lugar.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let vazio = '&#10004;' //bloco roxo escuro não tem campos vazios
        oid.smvazio = 'Nenhum campo esta vazio! Verifique se há erro em algum outro lugar.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let textoEle = '&#10004;' //associação entre texto e imagem atv. eletrica
        oid.smtextoEle = 'Associação entre texto e imagem correta no bloco da atividade elétrica.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let textoMec = '&#10004;' //associação entre texto e imagem atv. mec
        oid.smtextoMec = 'Associação entre texto e imagem correta no bloco da atividade mecânica.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let ordemEletrica = '&#10004;' //ordem das atv. eletrica
        oid.smordemEle = 'Ordem da atividade elétrica está corretas. Verifique se há erro em algum outro lugar.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let ordemMec = '&#10004;' //ordem das atv. mec
        oid.smordemMec = 'Ordem das atividades mecânica correta.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let ordemOnda = '&#10004;' //ordem das ondas
        oid.smordemOnda = 'Ordem das ondas do ECG correta.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let ordem = '&#10004;' //ordem de todos os blocos
        oid.smordem = 'Ordem dos blocos estão corretos! Verifique se há erro em algum outro lugar.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let asEleMec = '&#10004;' //associacao das atv. eletrica com atv mec
        oid.smasEleMEc = 'Associação da atividades elétrica e da atividade mecânica corretas.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let asMecOnda = '&#10004;' //associacao das atv. mec com onda
        oid.smasMecOnda = 'Associação das ondas ECG e da atividade mecânica corretas.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let asEleOnda = '&#10004;' //associacao das atv eletrica com ondas
        oid.smasEleOnda = 'Associação da atividades elétrica e das ondas ECG corretas.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        let associacao = '&#10004;' //associacao de qualquer bloco
        oid.smassociacao = 'Associação entre blocos está correta! Verifique se há erro em algum outro lugar.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid>'
        oid.txt = '<meta charset="UTF-8"><table><tr><th>Análise</th><th>Status</th><th></th></tr>'
        //oid.txt = '<table><tr><th>Erro</th><th></th></tr>'
        oid.know = ''
        if (oid.statements == null || oid.statements.length == 0){
          //oid.handleSend('display', {value: '-> Nada a ser processado'})
          existe = '&#10060;'
          oid.smExiste = 'Vá em componetes e escolha um bloco para começar! \n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="smsem-coracao" publish="click~action/robot"> </button-oid>'
          erro++
        }
        else {
          if (oid.statements.length > 1 || !Array.isArray(oid.statements[0])){
            //oid.handleSend('display', {value: '-> Ainda há instruções soltas, não posso processar'})
            instrucoes = '&#10060;'
            oid.sminstrucoes = 'Algum bloco está sozinho. Utilize bloco roxo escuro para fazer a conecção dos blocos! \n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="ins" publish="click~action/robot"> </button-oid>'
            erro++
          }
          else{
            let feedback = ''
            const vstm = oid.statements[0]
            if (vstm.length < 5){
              //feedback += '-> Estão faltando ciclos no meu pobre coração\n'
              ciclo = '&#10060;'
              oid.smciclo = 'Ops, estão faltando ciclos no meu coração! \n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="fc" publish="click~action/robot"> </button-oid>'
              erro++
            }
            else if (vstm.length > 5){
              //feedback += '-> Há muitos ciclos no meu coração, ele está fora de controle\n'
              ciclo = '&#10060;'
              oid.smciclo = 'Ops, tem muitos ciclos no meu coração!\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="mc" publish="click~action/robot"> </button-oid>'
              erro++
            }
            let empty = false
            for (const stm of vstm) {
              if (stm.onda == null || stm.atvEle == null || stm.atvMec == null)
                empty = true
            }
            if (empty) {
              //feedback += '-> Há uma ou mais instruções incompletas\n'
              vazio = '&#10060;'
              oid.smvazio = 'Está faltando algo! A associação entre o ECG, a atividade elétrica e a atividade mecânica não está completa! \n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="v" publish="click~action/robot"> </button-oid>'
              erro++
            }
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
              //feedback += -> O texto que você escolheu em uma das imagens em algum dos blocos não descreve adequadamente a atividade ilustrada. (detalhes em Saiba mais)\n
              textoEle = '&#10060;'
              oid.smtextoEle = `Associação entre textos e imagens inconsistente em ${pEle} blocos na atividade elétrica. \n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="te" publish="click~action/robot"> </button-oid>`
              //oid.know += -> Associação entre textos e imagens inconsistente em ${pEle} blocos na atividade elétrica\n
              erro++
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
              //feedback += -> O texto que você escolheu em uma das imagens em algum dos blocos não descreve adequadamente a atividade ilustrada. (detalhes em Saiba mais)\n
              //oid.know += -> Associação entre textos e imagens inconsistente em ${pMec} blocos na atividade mecânica\n
              textoMec = '&#10060;'
              oid.smtextoMec = `Associação entre textos e imagens inconsistente em ${pMec} blocos na atividade mecânica.\n<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="tm" publish="click~action/robot"> </button-oid>`
              erro++
            }

            //if(pMec > 0 || pEle > 0)
            //  feedback += -> O texto que você escolheu em uma das imagens em algum dos blocos não descreve adequadamente a atividade ilustrada. (detalhes em Saiba mais)\n
            // analisando a ordem das células atividade elétrica
            const ordemEle = ['ondaP', 'segmentoPR', 'ondaQRS', 'segmentoST', 'ondaT']
            const max = (vstm.length < 5) ? vstm.length : 5
            let iEle = false
            for (let i = 0; i < max; i++) {
              const eletro = vstm[i].atvEle
              if (eletro != null && eletro.image != ordemEle[i])
                iEle = true
            }
            if (iEle) {
              //feedback += -> Alguma coisa está fora de ordem. (detalhes em Saiba mais)\n
              //oid.know += -> Revise a ordem em que o pulso elétrico segue. Do jeito que está, o impulso não segue uma sequência contínua.\n
              ordemEletrica = '&#10060;'
              oid.smordemEle = 'Ordem da atividade elétrica incorreta.<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="oe" publish="click~action/robot"> </button-oid>\n'
              erro++
            }
            // analisando a ordem das Ondas ECG 
            let iOnda = false
            for (let i = 0; i < max; i++) {
              const onda = vstm[i].onda
              if (onda != null && onda.image != ordemEle[i])
                iOnda = true
            }
              
            if (iOnda){
              //feedback += -> Alguma coisa está fora de ordem. (detalhes em Saiba mais)\n
              //oid.know += -> Revise a ordem da onda do ECG. Do jeito que está a onda não segue uma sequência contínua.\n
              ordemOnda = '&#10060;'
              oid.smordemOnda = 'Ordem da onda do ECG incorreta.<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="oo" publish="click~action/robot"> </button-oid>\n'
              erro++
            }
            // analisando a ordem da atividade mecanica
            let iMec = false
            for (let i = 0; i < max; i++) {
              const onda = vstm[i].atvMec
              if (onda != null && onda.efeitoFis != ordemEle[i])
              iMec = true
              }
            if (iMec){
              //feedback += -> Alguma coisa está fora de ordem. (detalhes em Saiba mais)\n
              //oid.know += -> Revise a ordem da atividade mecânica. Do jeito que está, o movimento não permite bombear sangue na sequência correta.\n
              ordemMec = '&#10060;'
              oid.smordemMec = 'Ordem da atividade mecânica incorreta.<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="om" publish="click~action/robot"> </button-oid>\n'
              erro++
            }
            if(iMec || iEle || iOnda){
              //feedback += -> Alguma coisa está fora de ordem. (detalhes em Saiba mais)\n
              ordem = '&#10060;'
              oid.smordem = ''
              if(iMec)
                oid.smordem += oid.smordemMec
              if(iEle)
                oid.smordem += oid.smordemEle
              if(iOnda)
                oid.smordem += oid.smordemOnda
            }
              
            // verifica compatibilidade entre as células das três colunas
            let incompatOndaEle = false
            let incompatOndaMec = false
            let incompatEleMec = false
            for (let i = 0; i < max; i++) {
              if (vstm[i].onda != null && vstm[i].atvEle != null &&
                  vstm[i].onda.image != vstm[i].atvEle.image)
                incompatOndaEle = true
              if (vstm[i].onda != null && vstm[i].atvMec != null &&
                vstm[i].onda.image != vstm[i].atvMec.efeitoFis)
                incompatOndaMec = true
              if (vstm[i].atvEle != null && vstm[i].atvMec != null &&
                  vstm[i].atvEle.image != vstm[i].atvMec.efeitoFis)
                  incompatEleMec = true
            }
            if (incompatOndaEle){
              //oid.know += -> Uma ou mais atividades elétricas não geram às ondas do ECG que foram associadas.\n
              oid.asEleOnda = 'Uma ou mais atividades elétricas não geram às ondas do ECG.<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="aeo" publish="click~action/robot"> </button-oid>\n'
              asEleOnda = '&#10060;'
              erro++
            }
            if (incompatEleMec){
              //oid.know += -> Uma ou mais atividades elétricas não disparam às atividades mecânicas que foram associadas.\n
              oid.asEleMec = 'Uma ou mais atividades elétricas não disparam às atividades mecânicas.<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="aem" publish="click~action/robot"> </button-oid>\n'
              asEleMec = '&#10060;'
              erro++
            }
            if (incompatOndaMec){
              //oid.know += -> Uma ou mais ondas do ECG não corresponde às atividades mecânicas associadas.\n
              oid.asMecOnda = 'Uma ou mais ondas do ECG não corresponde às atividades mecânicas associadas.<button-oid label="&#129044;" value="voltar" publish="click~action/robot"> </button-oid> <button-oid label="&#128269;" value="aom" publish="click~action/robot"> </button-oid>\n'
              asMecOnda = '&#10060;'
              erro++
            }
            if (incompatOndaEle || incompatOndaMec || incompatEleMec){
              //feedback += '-> Há incompatibilidade entre as colunas (detalhes em Saiba mais).\n'
              associacao = '&#10060;'
              oid.smassociacao = ''
              if(incompatOndaEle)
                oid.smassociacao += oid.asEleOnda
              if(incompatOndaMec)
                oid.smassociacao += oid.asMecOnda
              if(incompatEleMec)
                oid.smassociacao += oid.asEleMec
            }
            if(erro==0){
              feedback = '-> Parabéns! Meu coração esta funcionando!\n'
            }
            oid.handleSend('display', {value: feedback})

          }
        }        
        oid.txt += '<tr><td>Existe coração</td><td>'+existe+'</td><td><button-oid label="&#128269;" value="sem-coracao" publish="click~action/robot"> </button-oid></td></tr>'
        if(existe!='&#10060;'){
          oid.txt += '<tr><td>Blocos soltos</td><td>'+instrucoes+'</td><td><button-oid label="&#128269;" value="instrucoes-incorreta" publish="click~action/robot"></button-oid></td></tr>'
          if(instrucoes!='&#10060;'){
            oid.txt += '<tr><td>Quantidade de ciclos</td><td>'+ciclo+'</td><td><button-oid label="&#128269;" value="ciclos-incorreta" publish="click~action/robot"></button-oid></td></tr>'
            oid.txt += '<tr><td>Campo vazio</td><td>'+vazio+'</td><td><button-oid label="&#128269;" value="campo-vazio" publish="click~action/robot"></button-oid></td></tr>'
            oid.txt += '<tr><td>Descrição da atividade elétrica</td><td>'+textoEle+'</td><td><button-oid label="&#128269;" value="txtEle-incorreta" publish="click~action/robot"></button-oid></td></tr>'
            oid.txt += '<tr><td>Descrição da atividade mecânica</td><td>'+textoMec+'</td><td><button-oid label="&#128269;" value="txtMec-incorreta" publish="click~action/robot"></button-oid></td></tr>'
            oid.txt += '<tr><td>Ordem dos ciclos</td><td>'+ordem+'</td><td><button-oid label="&#128269;" value="ordem-incorreta" publish="click~action/robot"></button-oid></td></tr>'
            oid.txt += '<tr><td>Conexão entre blocos</td><td>'+associacao+'</td><td><button-oid label="&#128269;" value="associacao-incorreta" publish="click~action/robot"></button-oid></td></tr>'
          }
        }

        oid.txt += '</table>'
        if(erro==0){
          oid.txt = 'Parabéns! Meu coração esta funcionando!'
        }
        oid.handleSend('display', {value: oid.txt})
      }
      else if (parameters.value == 'sem-coracao') {
        oid.handleSend('display',
          {value: oid.smExiste})
      } else if (parameters.value == 'instrucoes-incorreta') {
        oid.handleSend('display',
          {value: oid.sminstrucoes})
      } else if (parameters.value == 'ciclos-incorreta') {
        oid.handleSend('display',
          {value: oid.smciclo})
      } else if (parameters.value == 'campo-vazio') {
        oid.handleSend('display',
          {value: oid.smvazio})
      }  else if (parameters.value == 'txtEle-incorreta') {
        oid.handleSend('display',
          {value: oid.smtextoEle})
      } else if (parameters.value == 'txtMec-incorreta') {
        oid.handleSend('display',
          {value: oid.smtextoMec})
      } else if (parameters.value == 'ordem-incorreta') {
        oid.handleSend('display',
          {value: oid.smordem})
      } 
      else if (parameters.value == 'associacao-incorreta') {
        oid.handleSend('display',
          {value: oid.smassociacao})
      }else if (parameters.value == 'smsem-coracao') {
        oid.handleSend('display',
          {value: 'No menu de componentes você verá 4 blocos clique em um para começar.<button-oid label="&#129044;" value="sem-coracao" publish="click~action/robot">'})
      }else if (parameters.value == 'ins') {
        oid.handleSend('display',
          {value: 'Encaixe os blocos soltos dentro de um bloco roxo escuro para fazer as associações.\n<button-oid label="&#129044;" value="instrucoes-incorreta" publish="click~action/robot">'})
      }
      else if (parameters.value == 'fc') {
        oid.handleSend('display',
          {value: 'Meu coração esta incompleto, coloque mais blocos.\n<button-oid label="&#129044;" value="ciclos-incorreta" publish="click~action/robot">'})
      }
      else if (parameters.value == 'mc') {
        oid.handleSend('display',
          {value: 'Estou sobrecarregando! Tire alguns blocos.\n<button-oid label="&#129044;" value="ciclos-incorreta" publish="click~action/robot">'})
      }
      else if (parameters.value == 'v') {
        oid.handleSend('display',
          {value: 'Associação incompleta. Não deixe campos vazios no bloco roxo escuro.\n<button-oid label="&#129044;" value="campo-vazio" publish="click~action/robot">'})
      }
      else if (parameters.value == 'te') {
        oid.handleSend('display',
          {value: 'Revise o texto das atividades elétricas.\n<button-oid label="&#129044;" value="txtEle-incorreta" publish="click~action/robot">'})
      }else if (parameters.value == 'tm') {
        oid.handleSend('display',
          {value: 'Revise o texto das atividades mecânica.\n<button-oid label="&#129044;" value="txtMec-incorreta" publish="click~action/robot">'})
      }else if (parameters.value == 'oe') {
        oid.handleSend('display',
          {value: 'O impulso elétrico não segue o caminho esperado, revise a ordem.\n<button-oid label="&#129044;" value="ordem-incorreta" publish="click~action/robot">'})
      }
      else if (parameters.value == 'oo') {
        oid.handleSend('display',
          {value: 'A onda não segue o caminho esperado, revise a ordem.\n<button-oid label="&#129044;" value="ordem-incorreta" publish="click~action/robot">'})
      }else if (parameters.value == 'om') {
        oid.handleSend('display',
          {value: 'O movimento do coração não pode bombear o sangue, revise a ordem.\n<button-oid label="&#129044;" value="ordem-incorreta" publish="click~action/robot">'})
      }else if (parameters.value == 'aeo') {
        oid.handleSend('display',
          {value: 'Alguma onda do ECG e a atividade elétrica associada não está compativel, tente outra combinação.\n<button-oid label="&#129044;" value="associacao-incorreta" publish="click~action/robot">'})
      }
      else if (parameters.value == 'aem') {
        oid.handleSend('display',
          {value: 'Alguma atividade mecânica não combina com atividade elétrica escolhida, tente outra combinação.\n<button-oid label="&#129044;" value="associacao-incorreta" publish="click~action/robot">'})
      }else if (parameters.value == 'aom') {
        oid.handleSend('display',
          {value: 'Alguma onda do ECG representa outro movimento mecânico do coração, reveja.\n<button-oid label="&#129044;" value="associacao-incorreta" publish="click~action/robot">'})
      }
      else if (parameters.value.length == 0)
        oid.statements = null
      else if (parameters.value != null) {
        const lines = parameters.value.split('\n')
        oid.statements = []
        for (const l of lines)
          oid.statements.push(JSON.parse(l))       
      }
    }
  }
})