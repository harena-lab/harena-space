(function () {
  const localTheme = `
  <div class="row ml-0 mr-0">
    <div class="styt-main-frame">
       <div class="styt-main">
          <div class="styt-main-text">
             <dcc-styler xstyle="out" distribution="generic" targeted="action">
                {knot}
             </dcc-styler>
             <div id="role-1-text" style="font-weight:bold"></div>
             <div id="role-1"></div>
          </div>
       </div>
    </div>

  </div>
  <div class="styt-button-frame" style="display:flex">
     <div id="action-1-wrapper" class="styt-button">
        <div id="action-1" ></div>
     </div>
     <div id="action-2-wrapper" class="styt-button" style="display:none">
        <div id="action-2"></div>
     </div>
  </div>
`

  MessageBus.i.publish('control/theme/input/load/ready', localTheme)
})()
