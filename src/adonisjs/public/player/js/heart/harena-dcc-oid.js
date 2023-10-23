import { Bus } from '/dccs/lib/oid/oid-full-dev.js'

export class HarenaDCCOid {
  start () {
    PlayerManager.player.startPlayer()
    Bus.i.subscribe('action/robot', this.reportBlocksUpdate.bind(this))
    Bus.i.subscribe('talk/robot', this.reportRobotTalk.bind(this))
  }

  reportBlocksUpdate (topic, message) {
    console.log('=== Harena to record')
    console.log(message)
    MessageBus.i.publish('input/changed/blocks',
                         {value: message}, true)
  }

  reportRobotTalk (topic, message) {
    console.log('=== Talk to record')
    console.log(message)
    MessageBus.i.publish('input/changed/talk',
                         {value: message}, true)
  }
}

HarenaDCCOid.i = new HarenaDCCOid()
window.harenaDCCOid = HarenaDCCOid.i