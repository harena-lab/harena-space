/* Lively Talk DCC
 *****************/
class DCCLivelyTalk extends DCCVisual {
  constructor () {
    super()

    this._imageLoaded = this._imageLoaded.bind(this)
    this._imageWeb = null

    this.notify = this.notify.bind(this)

    if (this.hasAttribute('id')) {
      this._provides(this.id, 'action/speech', this.notify)
      this._provides(this.id, 'action/clear', this.notify)
    }
  }

  connectedCallback () {
    super.connectedCallback()

    if (this.hasAttribute('dialog'))
      this._dialog = document.querySelector('#' + this.dialog)
    else
      this._dialog = this._findAggregator(DCCLivelyDialog)

    if (this._dialog != null) {
      const schedule = this._dialog._animationSchedule()
      this._duration = schedule.duration
      this._delay = schedule.delay
      this._direction = schedule.direction
    } else {
      this._duration = (this.duration != null) ? this.duration : '0s'
      this._delay = (this.delay != null) ? this.delay : '0s'
      this._direction = (this.direction != null) ? this.direction : 'left'
    }
    this._bubble = (this.bubble != null) ? this.bubble : 'bubble'
    this._character = (this.character != null) ?
            this.character : 'images/character.png'
    this._speech = (this.speech != null) ? this.speech : ''
    this._buildVisual()
  }

  _buildVisual () {
    const animationDirection = {
      left: 'from {left: 100%;} to {left: 0%;}',
      right: 'from {left: -100%;} to {left: 0%;}'
    }
    const animationTransform = {
      left: '1, 1',
      right: '-1, 1'
    }

    const template = document.createElement('template')
    template.innerHTML =
      DCCLivelyTalk.templateHTML.replace('[duration]', this._duration)
        .replace('[delay]', this._delay)
        .replace(/\[direction\]/igm, animationDirection[this._direction])
        .replace(/\[transform\]/igm, animationTransform[this._direction])
        .replace('[align]', this._direction)
        .replace(/\[bubble-file\]/igm, this._bubble)
    this._shadow = this.attachShadow({ mode: 'open' })
    this._shadow.appendChild(template.content.cloneNode(true))

    this._setPresentation(this._shadow.querySelector('#presentation-dcc'))

    const imageHTML = "<div class='dcc-character'><img id='dcc-talk-character' src='" +
                        this._character + "' title='character' width='100px'></div>"
    const speechHTML = "<div class='dcc-bubble'><div id='dcc-talk-text' class='dcc-speech'>" + this._speech + '</div></div>'

    this._presentation.innerHTML = (this._direction == 'left') ? imageHTML + speechHTML : speechHTML + imageHTML
    this._presentation.querySelector('img').addEventListener('load', this._imageLoaded)

    this._presentationIsReady()
  }

  disconnectedCallback () {
    this.removeEventListener('schedule-animation', this._scheduleAnimation)
  }

  static get observedAttributes () {
    return DCCVisual.observedAttributes.concat(
      ['dialog', 'duration', 'delay', 'direction', 'character', 'bubble', 'speech'])
  }

  get dialog () {
    return this.getAttribute('dialog')
  }

  set dialog (newDialog) {
    this._dialog = newDialog
    this.setAttribute('dialog', newDialog)
  }

  get duration () {
    return this.getAttribute('duration')
  }

  set duration (newDuration) {
    this._duration = newDuration
    this.setAttribute('duration', newDuration)
  }

  get delay () {
    return this.getAttribute('delay')
  }

  set delay (newDelay) {
    this._delay = newDelay
    this.setAttribute('delay', newDelay)
  }

  get direction () {
    return this.getAttribute('direction')
  }

  set direction (newDirection) {
    this._direction = newDirection
    this.setAttribute('direction', newDirection)
  }

  get character () {
    return this.getAttribute('character')
  }

  set character (newCharacter) {
    this._character = newCharacter
    this.setAttribute('character', newCharacter)
  }

  get bubble () {
    return this.getAttribute('bubble')
  }

  set bubble (newBubble) {
    this._bubble = newBubble
    this.setAttribute('bubble', newBubble)
  }

  get speech () {
    return this.getAttribute('speech')
  }

  set speech (newSpeech) {
    this._speech = newSpeech
    this.setAttribute('speech', newSpeech)
    this._updateSpeech('')
  }

  _updateSpeech (addSpeech) {
    if (this._presentation != null) {
      const speechText = this._presentation.querySelector('#dcc-talk-text')
      if (speechText != null) { speechText.innerHTML = this._speech + addSpeech }
    }
  }

  _imageLoaded () {
    this._presentation.classList.add('dcc-direction')
    this._presentation.classList.add('dcc-entrance')
    this._presentation.classList.remove('dcc-hidden')
  }

  notify (topic, message) {
    if (!topic.includes('/'))
      topic = 'action/' + topic
    switch (topic.toLowerCase()) {
      case 'action/speech':
        this._updateSpeech((message.value != null) ? message.value : (message.body != null) ? message.body : message)
        break
      case 'action/clear':
        this._updateSpeech('')
        break
    }
  }

  /* Editable Component */
  activateEditDCC () {
    if (!DCCLivelyTalk.editableCode) {
      editableDCCLivelyTalk()
      DCCLivelyTalk.editableCode = true
    }
    this._activateEditDCC()
  }
}

/* Lively Dialog DCC
 *******************/
class DCCLivelyDialog extends DCCBase {
  constructor () {
    super()

    this._sequenceCounter = 0
    this._duration = (this.duration != null) ? this.duration : '1'
    this._rate = (this.rate != null) ? this.rate : '2'
    this._direction = (this.direction != null) ? this.direction : 'left'
  }

  /* Attribute Handling */

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(['rate', 'duration'])
  }

  get rate () {
    return this.getAttribute('rate')
  }

  set rate (newRate) {
    this._rate = newRate
    this.setAttribute('rate', newRate)
  }

  get duration () {
    return this.getAttribute('duration')
  }

  set duration (newDuration) {
    this._duration = newDuration
    this.setAttribute('duration', newDuration)
  }

  /* Rendering */

  _animationSchedule () {
    const delayValue = (this._sequenceCounter == 0) ? 0
      : ((this._sequenceCounter * parseInt(this._rate)) - parseInt(this._duration))

    const schedule = {
      duration: this.duration,
      delay: delayValue + 's',
      direction: this._direction
    }

    this._sequenceCounter++
    this._direction = (this._direction == 'left') ? 'right' : 'left'
    return schedule
  }
}

(function () {
  DCCLivelyTalk.editableCode = false
  customElements.define('dcc-lively-talk', DCCLivelyTalk)
  DCCLivelyDialog.editableCode = false
  customElements.define('dcc-lively-dialog', DCCLivelyDialog)
  DCCLivelyTalk.templateHTML =
`<style>
 .dcc-hidden {
   position: relative;
   left: 100%;
 }

 @keyframes dcc-block-displacement {
   [direction]
 }

 .dcc-entrance-container {
   width: 100%;
   overflow: hidden;
 }

 .dcc-entrance {
   position: relative;
   left: 100%;
   font-family: "Trebuchet MS", Helvetica, sans-serif;
   animation-name: dcc-block-displacement;
   animation-duration: [duration];
   animation-delay: [delay];
   animation-fill-mode: forwards;
 }

  @media (orientation: landscape) {
    .dcc-direction {
      display: flex;
      flex-direction: row;
    }
  }

  @media (orientation: portrait) {
    .dcc-direction {
      display: flex;
      flex-direction: column;
    }
  }

 .dcc-character {
    flex-basis: 100px;
 }

 .dcc-bubble {
    background-repeat: no-repeat;
    background-size: 100% 100%;
    flex-basis: 100%;
    padding: 15px 15px 10px 80px;
    transform: scale([transform]);
 }

 @media (orientation: landscape) {
    .dcc-bubble {
       background-image: url("images/[bubble-file]-landscape.png");
    }
 }

 @media (orientation: portrait) {
    .dcc-bubble {
       background-image: url("images/[bubble-file]-portrait.png");
    }
 }

 .dcc-speech {
    transform: scale([transform]);
    text-align: [align];
 }

 </style>
 <div class="dcc-entrance-container">
    <div id="presentation-dcc" class="dcc-hidden"></div>
 </div>`
})()
