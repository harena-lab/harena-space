import { Oid } from '/dccs/lib/oid/oid-full-dev.js'

Oid.customize('boid:blockly', {

cid: 'heart',

toolbox: {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': 'Componentes',
      'contents': [
        {
          'kind': 'block',
          'type': 'eletro'
        },
        {
          'kind': 'block',
          'type': 'mecanico'
        },
        {
          'kind': 'block',
          'type': 'onda'
        },
        {
          'kind': 'block',
          'type': 'sequence'
        }
      ],
      'colour': 300
    }
  ]
},

blocks:
[
  {
    'type': 'eletro',
    'message0': '%1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'image',
        'options': [
          [{src: '/player/case/images/heart/images/1ondaP.png', width: 200, height: 200, alt: 'heart 1'}, 'ondaP'],
          [{src: '/player/case/images/heart/images/2segmentoPR.png', width: 200, height: 200, alt: 'heart 2'}, 'segmentoPR'],
          [{src: '/player/case/images/heart/images/3ondaQRS.png', width: 200, height: 200, alt: 'heart 3'}, 'ondaQRS'],
          [{src: '/player/case/images/heart/images/4segmentoST.png', width: 200, height: 200, alt: 'heart 4'}, 'segmentoST'],
          [{src: '/player/case/images/heart/images/5ondaT.png', width: 200, height: 200, alt: 'heart 4'}, 'ondaT']
        ]
      }
    ],
    'message1': 'Estrutura: %1',
    'args1': [
      {
        'type': 'field_dropdown',
        'name': 'estrutura',
        'options': [
          ['Sistema His-Purkinje', 'ondaQRS'],
          ['Sino atrial', 'ondaP'],
          ['Ventrículo', 'segmentoST/ondaT'],
          ['Nó atrio ventricular', 'segmentoPR']
        ]
      }
    ],
    'message2': 'Efeito Elétrico: %1',
    'args2': [
      {
        'type': 'field_dropdown',
        'name': 'efeito',
        'options': [
          ['Tempo de retardo entre a ativação auricular e ventricular', 'segmentoPR'],
          ['Condução rápida dos estímulos elétricos nos ventrículos', 'ondaQRS'],
          ['Intervalo entre o fim da despolarização e o início da repolarização ventricular', 'segmentoST'],
          ['Estímulo disparando a despolarização atrial', 'ondaP'],
          ['Repolarização ventricular', 'ondaT']
        ]
      }
    ],
    'colour': 160,
    'tooltip': 'Coração',
    'output': 'atvEle'
  },

  {
    'type': 'mecanico',
    'message0': '%1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'image',
        'options': [
          [{src: '/player/case/images/heart/images/3movimento.png', width: 200, height: 200, alt: 'heart_mov 3'}, 'ondaQRS'],
          [{src: '/player/case/images/heart/images/1movimento.png', width: 200, height: 200, alt: 'heart_mov 1'}, 'ondaP'],
          [{src: '/player/case/images/heart/images/2movimento.png', width: 200, height: 200, alt: 'heart_mov 2'}, 'segmentoPR/segmentoST'],
          [{src: '/player/case/images/heart/images/5movimento.png', width: 200, height: 200, alt: 'heart_mov 4'}, 'ondaT']
        ]
      }
    ],
    'message1': 'Estrutura: %1',
    'args1': [
      {
        'type': 'field_dropdown',
        'name': 'estrutura',
        'options': [
          ['Nó AV', 'segmentoPR'],
          ['Átrio', 'ondaP'],
          ['Ventrículo', 'ondaQRS/segmentoST/ondaT']
        ]
      }
    ],
    'message2': 'Efeito Mecânico: %1',
    'args2': [
      {
        'type': 'field_dropdown',
        'name': 'efeitoMec',
        'options': [
          ['Não existe atividade mecânica', 'segmentoST'],
          ['Convergência dos estímulos atriais + retardo da condução do estímulo elétrico', 'segmentoPR'],
          ['Contração atrial', 'ondaP'],
          ['Contração ventricular', 'ondaQRS'],
          ['Relaxamento Ventricular', 'ondaT']
        ]
      }
    ],
    'message3': 'Efeito Fisiológico: %1',
    'args3': [
      {
        'type': 'field_dropdown',
        'name': 'efeitoFis',
        'options': [
          ['Envio de sangue sob pressão do átrio para ventrículos', 'ondaP'],
          ['Retardo de condução para contração atrial antes da contração ventricular', 'segmentoPR'],
          ['Envio do sangue para o sistema arterial pulmonar e sistêmico', 'ondaQRS'],
          ['Representa o início da repolarização ventricular', 'segmentoST'],
          ['Enchimento dos ventrículos', 'ondaT']
        ]
      }
    ],
    'colour': 20,
    'tooltip': 'eletro',
    'output': 'atvMec'
  },

  {
    'type': 'onda',
    'message0': '%1',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'image',
        'options': [
          [{src: '/player/case/images/heart/images/1ondaPECG.png', width: 200, height: 200, alt: 'ecg 1'}, 'ondaP'],
          [{src: '/player/case/images/heart/images/2segmentoPRECG.png', width: 200, height: 200, alt: 'ecg 2'}, 'segmentoPR'],
          [{src: '/player/case/images/heart/images/3ondaQRSECG.png', width: 200, height: 200, alt: 'ecg 3'}, 'ondaQRS'],
          [{src: '/player/case/images/heart/images/4segmentoSTECG.png', width: 200, height: 200, alt: 'ecg 4'}, 'segmentoST'],
          [{src: '/player/case/images/heart/images/5ondaTECG.png', width: 200, height: 200, alt: 'ecg 5'}, 'ondaT']
      ]
      }
    ],
    colour: 290,
    tooltip: 'Eletro',
    output: 'onda'
  },

  {
    'type': 'sequence',
    'message0': '%1 onda %2 elétrico %3 mecânico',
    'args0': [
      {
        'type': 'input_value',
        'name': 'onda',
        'check': 'onda'
      },
      {
        'type': 'input_value',
        'name': 'atvEle',
        'check': 'atvEle'
      },
      {
        'type': 'input_value',
        'name': 'atvMec',
        'check': 'atvMec'
      },
    ],
    colour: 250,
    nextStatement: null,
    previousStatement: null
  }
],

generator: {
  'eletro': function (block, generator) {
    return JSON.stringify({
      type: 'eletro',
      image: block.getFieldValue('image'),
      estrutura: block.getFieldValue('estrutura'),
      efeito: block.getFieldValue('efeito')
    })
  },
  
  'mecanico': function (block, generator) {
    return JSON.stringify({
      type: 'mecanico',
      image: block.getFieldValue('image'),
      estrutura: block.getFieldValue('estrutura'),
      efeitoMec: block.getFieldValue('efeitoMec'),
      efeitoFis: block.getFieldValue('efeitoFis')
    })
  },

  'onda': function (block, generator) {
    return JSON.stringify({
      type: 'onda',
      image: block.getFieldValue('image')
    })
  },
  
  'sequence': function (block, generator) {
    let result = []
    let onda = generator.statementToCode(block, 'onda')
    onda = (onda.length == 0) ? null : JSON.parse(onda)
    let atvEle = generator.statementToCode(block, 'atvEle')
    atvEle = (atvEle.length == 0) ? null : JSON.parse(atvEle)
    let atvMec = generator.statementToCode(block, 'atvMec')
    atvMec = (atvMec.length == 0) ? null : JSON.parse(atvMec)
    result = [{
      type: 'sequence',
      onda: onda,
      atvEle: atvEle,
      atvMec: atvMec
    }]
    const nextBlock =
      block.nextConnection && block.nextConnection.targetBlock()
    if (nextBlock) {
      const nb = generator.blockToCode(nextBlock)
      if (nb.length > 0)
        result = result.concat(JSON.parse(nb))
    }
    return JSON.stringify(result)
  }
}

})