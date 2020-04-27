(function() {
insertSource(
"Mechanical Ventilation",
`<dcc-image image="images/mv/mv-front-base.svg" style="width:600px"></dcc-image>
<dcc-image image="images/mv/mv-back-base.svg" style="width:600px"></dcc-image>
<dcc-state id="screen" value="off" rotate>
   <dcc-image role="off" image="images/mv/mv-screen-off.svg"
              style="position:absolute;left:72px;top:56px;width:386px;">
   </dcc-image>
   <dcc-image role="start" image="images/mv/mv-screen-start.svg"
              style="position:absolute;left:72px;top:56px;width:386px;">
   </dcc-image>
</dcc-state>
<dcc-image image="images/mv/mv-power.svg"
           style="position:absolute;left:380px;top:226px;width:40px;">
   <trigger-dcc event="click" target="screen" role="next"></trigger-dcc>
</dcc-image>`
);
})();