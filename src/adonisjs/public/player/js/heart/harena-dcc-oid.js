import { Bus } from '/dccs/lib/oid/oid-full-dev.js'

export class HarenaDCCOid {
  start () {
    PlayerManager.player.startPlayer()
    Bus.i.subscribe('action/robot', this.reportBlocksUpdate.bind(this))
    Bus.i.subscribe('talk/robot', this.reportRobotTalk.bind(this))
    Bus.i.publish('track/detailed')
  }

  reportBlocksUpdate (topic, message) {
    let cps = ''
    if (message.value == null || (message.value[0] != '{' && message.value[0] != '['))
      cps = message.value
    else {
      const jsonl = message.value.split('\n')
      const cpl = []
      for (const jl of jsonl) {
        let vj = JSON.parse(jl)
        let compact = {}
        if (!Array.isArray(vj))
          compact = this._mapFields(vj)
        else {
          compact = []
          for (const j of vj)
            compact.push(this._mapFields(j))
        }
        cpl.push(compact)
      }

      let sep = ''
      for (const cp of cpl) {
        cps += sep + JSON.stringify(cp)
        sep = '\n'
      }
    }

    MessageBus.i.publish('input/changed/blocks',
                         {value: cps}, true)
  }

  _mapFields (original) {
    const compact = {}
    for (const field in original) {
      let mapped = original[field]
      if (original[field] == null)
        mapped = 0
      else if (typeof original[field] === 'string') {
        if (HarenaDCCOid.mapValue[original[field]])
          mapped = HarenaDCCOid.mapValue[original[field]]
      } else if (typeof original[field] === 'object')
        mapped = this._mapFields(original[field])
      
      if (HarenaDCCOid.mapField[field])
        compact[HarenaDCCOid.mapField[field]] = mapped
      else
        compact[field] = mapped
    }
    return compact
  }

  reportRobotTalk (topic, message) {
    MessageBus.i.publish('input/changed/talk',
                         {value: message}, true)
  }
}

HarenaDCCOid.mapField = {
  'type': '1',
  'image': '2',
  'estrutura': '3',
  'efeito': '4',
  'efeitoMec': '5',
  'efeitoFis': '6',
  'onda': '7',
  'atvEle': '8',
  'atvMec': '9'
}

HarenaDCCOid.mapValue = {
  'sequence': 1,
  'eletro': 2,
  'mecanico': 3,
  'onda': 4,
  'fisico': 5,
  'ondaP': 6,
  'segmentoPR': 7,
  'ondaQRS': 8,
  'segmentoST': 9,
  'ondaT': 10,
  'ondaQRS': 11,
  'segmentoST/ondaT': 12,
  'segmentoPR/segmentoST': 13,
  'ondaQRS/segmentoST/ondaT': 14
}

HarenaDCCOid.i = new HarenaDCCOid()
window.harenaDCCOid = HarenaDCCOid.i