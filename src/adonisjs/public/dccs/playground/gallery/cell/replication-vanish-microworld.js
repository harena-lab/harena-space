(function() {
insertSource(
"Microworld - Replication and Predation",
`<dcc-space-cellular id="cellular-space" cell-width="32" cell-height="32" grid>
______c___
__a_c_____
___cc_____
_______c__
____ac____
_c____c___
______c___
</dcc-space-cellular>

<dcc-cell-image type="c" label="cyanobacteria" image="images/cell/cyanobacteria.svg">
   <rule-dcc-cell-neighbor label="cyanobacteria replication"
      probability="30" new-source="c" old-target="_" new-target="c">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
</dcc-cell-image>

<dcc-cell-image type="a" label="amoeba" image="images/cell/amoeba.svg">
   <rule-dcc-cell-neighbor label="amoeba replication"
      probability="5" new-source="a" old-target="_" new-target="a">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="eat"
      probability="50" new-source="_" old-target="c" new-target="a">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
</dcc-cell-image>

<dcc-trigger label="Next" action="state/next"></dcc-trigger>
<dcc-trigger label="Play" action="timer/start"></dcc-trigger>
<dcc-trigger label="Stop" action="timer/stop"></dcc-trigger>

<dcc-timer cycles="100" interval="500" publish="state/next">
   <subscribe-dcc message="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc message="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" message="state/next" role="next"></subscribe-dcc>`
);
})();