(function() {
AuthorCellManager.instance.insertSource(
"Zombie Venom Desafio 3",
[],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" cell-width="50" cell-height="50" background-color="#aaffaa" grid>
_________
_ttttttt_
_trrrrwt_
_trwrrrt_
_trrwrrt_
_trrwrrt_
_trrrrrt_
_ttttttt_
_________
</dcc-space-cellular-editor>

<dcc-cell-image type="1" label="zombie1" image="images/cell/zumbi_10.png">
</dcc-cell-image>
<dcc-cell-image type="a" label="zombie1r" image="images/cell/zumbi_10.png">
</dcc-cell-image>
<dcc-cell-image type="2" label="zombie2" image="images/cell/zumbi_3.png">
</dcc-cell-image>
<dcc-cell-image type="b" label="zombie2r" image="images/cell/zumbi_3.png">
</dcc-cell-image>
<dcc-cell-image type="w" label="wall" image="images/cell/wall.svg"></dcc-cell-image>
<dcc-cell-image type="r" label="roof" image="images/cell/cell-tile.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="border" image="images/cell/cell-tile.svg"></dcc-cell-image>

<rule-dcc-cell-pair label="walk4" probability="100" transition="1t>_a">
___
___
_*_
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk4" probability="100" transition="ar>ra">
___
___
_*_
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk3" probability="100" transition="at>ta">
___
___
_*_
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk3" probability="100" transition="a_>t1">
___
___
_*_
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk3" probability="100" transition="1_>_1">
___
___
_*_
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk2" probability="100" transition="2t>_b">
___
__*
___
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk2" probability="100" transition="br>rb">
___
__*
___
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk1" probability="100" transition="bt>tb">
___
__*
___
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk1" probability="100" transition="b_>t2">
___
__*
___
</rule-dcc-cell-pair>

<rule-dcc-cell-pair label="walk2" probability="100" transition="2_>_2">
___
__*
___
</rule-dcc-cell-pair>

<dcc-timer cycles="100000" interval="1000" publish="state/next">
   <subscribe-dcc message="timer/start" role="start"></subscribe-dcc>
   <subscribe-dcc message="timer/stop" role="stop"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" message="type/#" role="type"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/next" role="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/save" role="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" message="state/reset" role="reset"></subscribe-dcc>`,
`Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Zumbi" action="type/zombie1"
                   image="images/cell/zumbi_10.png">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Zumbi" action="type/zombie2"
                   image="images/cell/zumbi_3.png">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Parede" action="type/wall"
                   image="images/cell/wall.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Telhado" action="type/roof"
                   image="images/cell/cell-tile.svg">
      </dcc-trigger>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-trigger label="Nada" action="type/empty"
                   image="images/cell/cell-green.svg">
      </dcc-trigger>
   </div>
</div>`
);
})();