(function () {
  const localTheme = `
{knot}
`

  MessageBus.i.publish('control/theme/start/load/ready', localTheme)
})()
