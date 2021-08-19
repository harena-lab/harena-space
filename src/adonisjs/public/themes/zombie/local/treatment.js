(function () {
  const localTheme = `
<div class="styt-pul-main">{knot}</div>
`

  MessageBus.i.publish('control/theme/treatment/load/ready', localTheme)
})()
