(function() {
insertSource(
"Colors - Movement and Influence",
`<dcc-space-cellular id="cellular-space" rows="50" cell-width="7" cell-height="7" grid infinite>
r___r_____d__r____l_______d__l___r___d_r_u__r____d____l_r____u
_l_____l____d____d___u___l___d___l___d___u___l__l___r_uuu__l__
___r___l___d__d__l_____u____ll__rr__uu__dd__l__r__l__d___d__l_
r___r_____d__r____l_______d__l___r___d_r_u__r____d____l_r____u
_l_____l____d____d___u___l___d___l___d___u___l__l___r_uuu__l__
___r___l___d__d__l_____u____ll__rr__uu__dd__l__r__l__d___d__l_
r___r_____d__r____l_______d__l___r___d_r_u__r____d____l_r____u
_l_____l____d____d___u___l___d___l___d___u___l__l___r_uuu__l__
___r___l___d__d__l_____u____ll__rr__uu__dd__l__r__l__d___d__l_
r___r_____d__r____l_______d__l___r___d_r_u__r____d____l_r____u
_l_____l____d____d___u___l___d___l___d___u___l__l___r_uuu__l__
___r___l___d__d__l_____u____ll__rr__uu__dd__l__r__l__d___d__l_
r___r_____d__r____l_______d__l___r___d_r_u__r____d____l_r____u
_l_____l____d____d___u___l___d___l___d___u___l__l___r_uuu__l__
___r___l___d__d__l_____u____ll__rr__uu__dd__l__r__l__d___d__l_
r___r_____d__r____l_______d__l___r___d_r_u__r____d____l_r____u
_l_____l____d____d___u___l___d___l___d___u___l__l___r_uuu__l__
___r___l___d__d__l_____u____ll__rr__uu__dd__l__r__l__d___d__l_
r___r_____d__r____l_______d__l___r___d_r_u__r____d____l_r____u
_l_____l____d____d___u___l___d___l___d___u___l__l___r_uuu__l__
___r___l___d__d__l_____u____ll__rr__uu__dd__l__r__l__d___d__l_
</dcc-space-cellular>

<dcc-cell-color type="u" label="up" color="#ff0000">
   <rule-dcc-cell-neighbor label="follow down"
      probability="100" new-source="d" old-target="d" new-target="d">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="follow left"
      probability="100" new-source="l" old-target="l" new-target="l">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="follow right"
      probability="100" new-source="r" old-target="r" new-target="r">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn down"
      probability="1" new-source="d" old-target="u" new-target="d">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn left"
      probability="1" new-source="l" old-target="u" new-target="l">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn right"
      probability="1" new-source="r" old-target="u" new-target="r">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="move up"
      probability="100" new-source="_" old-target="_" new-target="u">
   _*_
   ___
   ___
   </rule-dcc-cell-neighbor>
</dcc-cell-color>

<dcc-cell-color type="d" label="down" color="#00ff00">
   <rule-dcc-cell-neighbor label="follow up"
      probability="100" new-source="u" old-target="u" new-target="u">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="follow left"
      probability="100" new-source="l" old-target="l" new-target="l">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="follow right"
      probability="100" new-source="r" old-target="r" new-target="r">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn up"
      probability="1" new-source="u" old-target="d" new-target="u">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn left"
      probability="1" new-source="l" old-target="d" new-target="l">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn right"
      probability="1" new-source="r" old-target="d" new-target="r">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="move down"
      probability="100" new-source="_" old-target="_" new-target="d">
   ___
   ___
   _*_
   </rule-dcc-cell-neighbor>
</dcc-cell-color>

<dcc-cell-color type="l" label="left" color="#0000ff">
   <rule-dcc-cell-neighbor label="follow up"
      probability="100" new-source="u" old-target="u" new-target="u">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="follow down"
      probability="100" new-source="d" old-target="d" new-target="d">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="follow right"
      probability="100" new-source="r" old-target="r" new-target="r">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn up"
      probability="1" new-source="u" old-target="l" new-target="u">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn down"
      probability="1" new-source="d" old-target="l" new-target="d">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn right"
      probability="1" new-source="r" old-target="l" new-target="r">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="move left"
      probability="100" new-source="_" old-target="_" new-target="l">
   ___
   *__
   ___
   </rule-dcc-cell-neighbor>
</dcc-cell-color>

<dcc-cell-color type="r" label="right" color="#ff00ff">
   <rule-dcc-cell-neighbor label="follow up"
      probability="100" new-source="u" old-target="u" new-target="u">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="follow down"
      probability="100" new-source="d" old-target="d" new-target="d">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="follow left"
      probability="100" new-source="l" old-target="l" new-target="l">
   ***
   *_*
   ***
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn up"
      probability="1" new-source="u" old-target="r" new-target="u">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn down"
      probability="1" new-source="d" old-target="r" new-target="d">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="turn left"
      probability="1" new-source="l" old-target="r" new-target="l">
   ___
   _*_
   ___
   </rule-dcc-cell-neighbor>
   <rule-dcc-cell-neighbor label="move right"
      probability="100" new-source="_" old-target="_" new-target="r">
   ___
   __*
   ___
   </rule-dcc-cell-neighbor>
</dcc-cell-color>

<dcc-trigger label="Next" action="state/next"></dcc-trigger>
<dcc-trigger label="Play" action="timer/start"></dcc-trigger>
<dcc-trigger label="Stop" action="timer/stop"></dcc-trigger>

<dcc-timer cycles="10000" interval="100" publish="state/next">
   <subscribe-dcc message="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc message="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" message="state/next" role="next"></subscribe-dcc>`
);
})();