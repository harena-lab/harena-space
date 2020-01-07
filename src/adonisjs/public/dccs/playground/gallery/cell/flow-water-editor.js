(function() {
insertSource(
"Water Flow",
`<dcc-space-cellular-editor id="cellular-space" rows="30" cols="30" cell-width="10" cell-height="10" grid>
_
_
____________####
__________###__###
_________##______##
______####___w____###
_____##_____________######
__####___________________##
_###############__________##
_#_________________________#
##_________________________##
#___________________________#
##_________________________##
_#_________________________#
_##########__________#######
__________##________##
_______####__________####
_______#________________##
_______###_____________##
_________#####______####
_____________########
</dcc-space-cellular-editor>

<dcc-cell-color type="w" label="water" color="#0000ff" opacity="10">
  <property-dcc name="value" initial="500"></property-dcc>
</dcc-cell-color>
<dcc-cell-color type="#" label="wall" color="#aaaaaa"></dcc-cell-color>

<rule-dcc-cell-flow label="spread random 1" probability="100" transition="w_>ww">
   ***
   *_*
   ***
</rule-dcc-cell-flow>
<rule-dcc-cell-flow label="spread random 2" probability="100" transition="ww>ww">
   ***
   *_*
   ***
</rule-dcc-cell-flow>

<dcc-trigger label="Next" action="state/next"></dcc-trigger>
<dcc-trigger label="Play" action="timer/start"></dcc-trigger>
<dcc-trigger label="Stop" action="timer/stop"></dcc-trigger>

<dcc-trigger label="Empty" action="type/empty"></dcc-trigger>
<dcc-trigger label="Water" action="type/water"></dcc-trigger>
<dcc-trigger label="Wall" action="type/wall"></dcc-trigger>

<dcc-timer cycles="500" interval="100" publish="state/next">
   <subscribe-dcc message="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc message="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" message="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="type/#" role="type"></subscribe-dcc>`
);
})();