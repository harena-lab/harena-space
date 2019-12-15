(function() {
insertSource(
"Falling Rocks (simple movement)",
`<dcc-space-cellular id="cellular-space" grid>
r__r_r
__r_r_
______
______
t_t__t
</dcc-space-cellular>

<dcc-cell-image type="r" label="rock" image="images/cell/rock01.svg">
   <rule-dcc-cell-neighbor label="fall" probability="100" new-source="_" old-target="_" new-target="r">
   ___
   ___
   _*_
   </rule-dcc-cell-neighbor>
</dcc-cell-image>

<dcc-cell-image type="t" label="tree" image="images/cell/tree01.svg"></dcc-cell-image>

<dcc-trigger label="Next" action="state/next"></dcc-trigger>
<dcc-trigger label="Play" action="timer/start"></dcc-trigger>

<dcc-timer cycles="10" interval="1000" publish="state/next">
   <subscribe-dcc message="timer/start" role="start"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" message="state/next" role="next"></subscribe-dcc>`
);
})();