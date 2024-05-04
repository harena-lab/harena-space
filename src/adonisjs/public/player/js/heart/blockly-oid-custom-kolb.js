import { Oid } from '/dccs/lib/oid/oid-full-dev.js'

const kolbToolbox = {
  'kind': 'categoryToolbox',
  'contents': []
}

const kolbQuestionBlock = {
  'type': 'question',
  'args0': [],
  'message1': '4 %1 \n',
  'args1': [
    {
      'type': 'input_value',
      'name': 'q1',
      'check': 'op'
    }
  ],
  'message2': '3 %1 \n',
  'args2': [
    {
      'type': 'input_value',
      'name': 'q2',
      'check': 'op'
    }
  ],
  'message3': '2 %1 \n',
  'args3': [
    {
      'type': 'input_value',
      'name': 'q3',
      'check': 'op'
    }
  ],
  'message4': '1 %1 \n',
  'args4': [
    {
      'type': 'input_value',
      'name': 'q4',
      'check': 'op'
    }
  ],
  'colour': 220
}

const kolbBlock1 =
{
  'type': 'op1',
  'colour': 200,
  'output': 'op'
}

const kolbBlock2 =
{
  'type': 'op2',
  'colour': 200,
  'output': 'op'
}

const kolbBlock3 =
{
  'type': 'op3',
  'colour': 200,
  'output': 'op'
}

const kolbBlock4 =
{
  'type': 'op4',
  'colour': 200,
  'output': 'op'
}

const kolbGenerator = {
  'op1': function (block, generator) {
    return `op1`
  },
  'op2': function (block, generator) {
    return `op2`
  },
  'op3': function (block, generator) {
    return `op3`
  },
  'op4': function (block, generator) {
    return `op4`
  },
  'question': function (block, generator) {
    return JSON.stringify({type: 'kolb1',
                           q1: block.getFieldValue('q1'),
                           q2: block.getFieldValue('q2'),
                           q3: block.getFieldValue('q3'),
                           q4: block.getFieldValue('q4')
                          })
  }
}

const kolbLoad = {
  "blocks": {
      "languageVersion": 0,
      "blocks": [
          {
              "type": "question",
              "id": "H$U1DMUP3EK!G$5`/GjB",
              "x": 23,
              "y": 9
          },
          {
              "type": "op1",
              "id": "H(bRBx{cAi_mpNnS3}BP",
              "x": 21,
              "y": 200
          },
          {
              "type": "op2",
              "id": "a]iO7E/iT6n_$=Htw!YG",
              "x": 475,
              "y": 200
          },
          {
              "type": "op3",
              "id": "mBi=wCrgn|hod+#8Z^VT",
              "x": 21,
              "y": 230
          },
          {
              "type": "op4",
              "id": "XH6!ppHJY`EMt2zYAJB@",
              "x": 475,
              "y": 230
          }
      ]
  }
}

Oid.customize('boid:blockly', {
  cid: 'kolb1',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Gosto de lidar com meus sentimentos'}, kolbBlock1),
    Object.assign({'message0': 'Gosto de pensar sobre idéias'}, kolbBlock2),
    Object.assign({'message0': 'Gosto de observar e escutar'}, kolbBlock3),
    Object.assign({'message0': 'Gosto de estar fazendo coisas'}, kolbBlock4),
    Object.assign({'message0': 'Enquanto aprendo:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb2',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Confio em meus palpites e impressões'}, kolbBlock1),
    Object.assign({'message0': 'Ouço e observo com atenção'}, kolbBlock2),
    Object.assign({'message0': 'Me apoio em pensamento lógico'}, kolbBlock3),
    Object.assign({'message0': 'Trabalho com afinco para executar a tarefa'}, kolbBlock4),
    Object.assign({'message0': 'Aprendo melhor quando:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb3',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Tendo a buscar as explicações para as coisas'}, kolbBlock1),
    Object.assign({'message0': 'Sou responsável acerca das coisas'}, kolbBlock2),
    Object.assign({'message0': 'Fico quieto e concentrado'}, kolbBlock3),
    Object.assign({'message0': 'Tenho sentimentos e reações fortes'}, kolbBlock4),
    Object.assign({'message0': 'Quando estou aprendendo:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb4',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Sentindo'}, kolbBlock1),
    Object.assign({'message0': 'Fazendo'}, kolbBlock2),
    Object.assign({'message0': 'Observando'}, kolbBlock3),
    Object.assign({'message0': 'Pensando'}, kolbBlock4),
    Object.assign({'message0': 'Aprendo:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb5',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Me abro a novas experiências'}, kolbBlock1),
    Object.assign({'message0': 'Examino todos os ângulos da questão'}, kolbBlock2),
    Object.assign({'message0': 'Gosto de analisar as coisas, desdobrá-las em suas partes'}, kolbBlock3),
    Object.assign({'message0': 'Gosto de testar as coisas'}, kolbBlock4),
    Object.assign({'message0': 'Enquanto aprendo:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb6',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Sou uma pessoa observadora'}, kolbBlock1),
    Object.assign({'message0': 'Sou uma pessoa ativa'}, kolbBlock2),
    Object.assign({'message0': 'Sou uma pessoa intuitiva'}, kolbBlock3),
    Object.assign({'message0': 'Sou uma pessoa lógica'}, kolbBlock4),
    Object.assign({'message0': 'Enquanto estou aprendendo:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb7',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Observação'}, kolbBlock1),
    Object.assign({'message0': 'Interações pessoais'}, kolbBlock2),
    Object.assign({'message0': 'Teorias racionais'}, kolbBlock3),
    Object.assign({'message0': 'Oportunidades para experimentar e praticar'}, kolbBlock4),
    Object.assign({'message0': 'Aprendo melhor através de:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb8',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Gosto de ver os resultados de meu trabalho'}, kolbBlock1),
    Object.assign({'message0': 'Gosto de idéias e teorias'}, kolbBlock2),
    Object.assign({'message0': 'Penso antes de agir'}, kolbBlock3),
    Object.assign({'message0': 'Sinto-me pessoalmente envolvido no assunto'}, kolbBlock4),
    Object.assign({'message0': 'Enquanto aprendo:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb9',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Me apoio em minhas observações'}, kolbBlock1),
    Object.assign({'message0': 'Me apoio em minhas impressões'}, kolbBlock2),
    Object.assign({'message0': 'Posso experimentar coisas por mim mesmo'}, kolbBlock3),
    Object.assign({'message0': 'Me apoio em minhas idéias'}, kolbBlock4),
    Object.assign({'message0': 'Aprendo melhor quando:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb10',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Sou uma pessoa compenetrada'}, kolbBlock1),
    Object.assign({'message0': 'Sou uma pessoa flexível'}, kolbBlock2),
    Object.assign({'message0': 'Sou uma pessoa responsável'}, kolbBlock3),
    Object.assign({'message0': 'Sou uma pessoa racional'}, kolbBlock4),
    Object.assign({'message0': 'Quando estou aprendendo:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb11',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Me envolvo todo'}, kolbBlock1),
    Object.assign({'message0': 'Gosto de observar'}, kolbBlock2),
    Object.assign({'message0': 'Avalio as coisas'}, kolbBlock3),
    Object.assign({'message0': 'Gosto de estar ativo'}, kolbBlock4),
    Object.assign({'message0': 'Enquanto aprendo:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})

Oid.customize('boid:blockly', {
  cid: 'kolb12',
  toolbox: kolbToolbox,
  blocks: [
    Object.assign({'message0': 'Analiso as idéias'}, kolbBlock1),
    Object.assign({'message0': 'Sou receptivo e de mente aberta'}, kolbBlock2),
    Object.assign({'message0': 'Sou cuidadoso'}, kolbBlock3),
    Object.assign({'message0': 'Sou prático'}, kolbBlock4),
    Object.assign({'message0': 'Aprendo melhor quando:\n'}, kolbQuestionBlock)
  ],
  generator: kolbGenerator,
  load: kolbLoad  
})