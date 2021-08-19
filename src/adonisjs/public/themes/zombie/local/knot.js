(function () {
  const localTheme = `
<div class="styt-pul-main">{knot}</div>
`

  MessageBus.i.publish('control/theme/knot/load/ready', localTheme)
})()
