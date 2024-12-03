(() => {
  AuthorCellManager.instance.insertSource(
    'Mutantes',
    [['empty', '_', { src: 'images/cell/cell-yellow-green.svg', width: 25, height: 25, alt: 'empty' }],
    ['stage-1', '1', { src: 'images/cell/cell-4.png', width: 25, height: 25, alt: 'stage-1' }],
    ['stage-2', '2', { src: 'images/cell/cell-3.png', width: 25, height: 25, alt: 'stage-2' }],
    ['stage-3', '3', { src: 'images/cell/cell-2.png', width: 25, height: 25, alt: 'stage-3' }],
    ['stage-4', '4', { src: 'images/cell/cell-6.png', width: 25, height: 25, alt: 'stage-4' }],
    ['mut-3',   '7', { src: 'images/cell/mela-1.png', width: 25, height: 25, alt: 'mut-3' }],
    ['mut-1',   '5', { src: 'images/cell/mela-2.png', width: 25, height: 25, alt: 'mut-1' }],
    ['mut-2',   '6', { src: 'images/cell/mela-3.png', width: 25, height: 25, alt: 'mut-2' }],
    ['mut-4',   '8', { src: 'images/cell/mela-4.png', width: 25, height: 25, alt: 'mut-4' }],
    ['purple',  'p', { src: 'images/cell/cell-purple.svg', width: 25, height: 25, alt: 'purple' }],
    ['tile',    't', { src: 'images/cell/cell-transparent.svg', width: 25, height: 25, alt: 'tile' }],
    ['yellow',  'y', { src: 'images/cell/cell-yellow.svg', width: 25, height: 25, alt: 'yellow' }],
    ['brown',   'b', { src: 'images/cell/cell-brown.svg', width: 25, height: 25, alt: 'brown' }],
    ['red',     'r', { src: 'images/cell/cell-red.svg', width: 25, height: 25, alt: 'red' }],
    ['gray-darker', 'z', { src: 'images/cell/cell-gray-darker.svg', width: 25, height: 25, alt: 'darker gray' }]
    ],
'',
`<dcc-space-cellular-editor id="cellular-space" rows="15" cols="20"
cell-width="40" cell-height="40" background-color="#dddddd" cover-image="images/photo/epidermis-dermis-zoom.jpg" cover-opacity="100" grid analysis>
____________________
____________________
____________________
____________________
tttttttttttttttttttt
__44_____44_4__444__
44434444433434433344
33333333333333333333
22322222222222322322
57212121275275212121
bbbbbbbbbbbbbbbbbbbb
yyyyyyyyyyyyyyyyyyyy
yypyyyyypyyypyyyyyyy
ypypyyypypypypyyyyyy
yypyyyyypyyypyyyyyyy
</dcc-space-cellular-editor>

<subscribe-dcc target="cellular-space" topic="input/changed/cover_opacity" map="cover-opacity">
</subscribe-dcc>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Green" topic="type/stage-1"
                   image="images/cell/cell-4.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Red" topic="type/stage-2"
                   image="images/cell/cell-3.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Blue" topic="type/stage-3"
                   image="images/cell/cell-2.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Darker Blue" topic="type/stage-4"
                   image="images/cell/cell-6.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Pink" topic="type/mut-3"
                   image="images/cell/mela-1.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Pink" topic="type/mut-1"
                   image="images/cell/mela-2.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Pink" topic="type/mut-2"
                   image="images/cell/mela-3.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Pink" topic="type/mut-4"
                   image="images/cell/mela-4.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Purple" topic="type/purple"
                   image="images/cell/cell-purple.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Red" topic="type/tile"
                   image="images/cell/cell-tile.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Yellow" topic="type/yellow"
                   image="images/cell/cell-yellow.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Yellow-Green" topic="type/brown"
                   image="images/cell/cell-brown.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Red" topic="type/red"
                   image="images/cell/cell-red.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Darker Gray" topic="type/gray-darker"
                   image="images/cell/cell-gray-darker.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Gray" topic="type/empty"
                   image="images/cell/cell-gray.svg">
      </dcc-button>
   </div>
</div>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
 <div style="flex:20%; max-width:96px; max-height:48px">
    <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
         src="images/icon/clock.svg">
 </div>
 <div style="flex:50%; max-height:48px; margin-right:10px; padding-top: 15px">
   <dcc-input-choice variable="timer_interval" reveal="horizontal" exclusive><dcc-input-option value="1000" checked>1</dcc-input-option><dcc-input-option value="500">2</dcc-input-option><dcc-input-option value="200">3</dcc-input-option><dcc-input-option value="100">4</dcc-input-option><dcc-input-option value="1">5</dcc-input-option></dcc-input-choice>
 </div>
</div>

<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
 <div style="flex:20%; max-width:96px; max-height:48px">
    <img style="max-width:48px; max-height:48px; margin-left:24px; margin-right:24px"
         src="images/icon/zoom.svg">
 </div>
 <div style="flex:50%; max-height:48px; margin-right:10px; padding-top: 15px">
   <dcc-input-choice variable="space_scale" reveal="horizontal" exclusive><dcc-input-option checked>1</dcc-input-option><dcc-input-option>2</dcc-input-option><dcc-input-option>3</dcc-input-option></dcc-input-choice>
 </div>
</div>

<dcc-cell-image type="1" label="stage-1" image="images/cell/cell-4.png"></dcc-cell-image>
<dcc-cell-image type="2" label="stage-2" image="images/cell/cell-3.png"></dcc-cell-image>
<dcc-cell-image type="3" label="stage-3" image="images/cell/cell-2.png"></dcc-cell-image>
<dcc-cell-image type="4" label="stage-4" image="images/cell/cell-6.png"></dcc-cell-image>
<dcc-cell-image type="7" label="mut-3" image="images/cell/mela-1.png"></dcc-cell-image>
<dcc-cell-image type="5" label="mut-1" image="images/cell/mela-2.png"></dcc-cell-image>
<dcc-cell-image type="6" label="mut-2" image="images/cell/mela-3.png"></dcc-cell-image>
<dcc-cell-image type="8" label="mut-4" image="images/cell/mela-4.png"></dcc-cell-image>
<dcc-cell-image type="p" label="purple" image="images/cell/cell-purple.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="tile" image="images/cell/cell-transparent.svg"></dcc-cell-image>
<dcc-cell-image type="y" label="yellow" image="images/cell/cell-yellow.svg"></dcc-cell-image>
<dcc-cell-image type="b" label="brown" image="images/cell/cell-brown.svg"></dcc-cell-image>
<dcc-cell-image type="r" label="red" image="images/cell/cell-red.svg"></dcc-cell-image>
<dcc-cell-image type="z" label="gray-darker" image="images/cell/cell-gray-darker.svg"></dcc-cell-image>


<rule-dcc-cell-pair probability="2" transition="4_>_4" neighbors="_*_______"></rule-dcc-cell-pair>
<rule-dcc-cell-pair probability="50" transition="4_>__" neighbors="_______*_"></rule-dcc-cell-pair>
<rule-dcc-cell-pair probability="5" transition="44>4_" neighbors="_*_______"></rule-dcc-cell-pair>

<rule-dcc-cell-pair id="c1-duplicates" probability="0" transition="7_>75" neighbors="_*_*_*___"></rule-dcc-cell-pair>
<subscribe-dcc target="c1-duplicates" topic="input/changed/c1duplicates" map="probability"></subscribe-dcc>

<rule-dcc-cell-pair id="c1-dies" probability="0" transition="55>__" neighbors="____*____"></rule-dcc-cell-pair>
<subscribe-dcc target="c1-dies" topic="input/changed/c1dies" map="probability"></subscribe-dcc>

<rule-dcc-cell-pair probability="50" transition="5_>53" neighbors="_*_______"></rule-dcc-cell-pair>
<rule-dcc-cell-pair probability="50" transition="1_>12" neighbors="_*_*_*___"></rule-dcc-cell-pair>
<rule-dcc-cell-pair probability="50" transition="3_>_3" neighbors="_*_______"></rule-dcc-cell-pair>
<rule-dcc-cell-pair probability="50" transition="34>44" neighbors="___*_*___"></rule-dcc-cell-pair>

<rule-dcc-cell-pair id="c1-mutant" probability="0" transition="55>66" neighbors="____*____"></rule-dcc-cell-pair>
<subscribe-dcc target="c1-mutant" topic="input/changed/c1mutant" map="probability"></subscribe-dcc>

<rule-dcc-cell-pair id="c2-duplicates-a" probability="0" transition="65>66" neighbors="_*_*_*_*_"></rule-dcc-cell-pair>
<subscribe-dcc target="c2-duplicates-a" topic="input/changed/c2duplicates" map="probability"></subscribe-dcc>
<rule-dcc-cell-pair id="c2-duplicates-b" probability="0" transition="6_>66" neighbors="_*_*_*___"></rule-dcc-cell-pair>
<subscribe-dcc target="c2-duplicates-b" topic="input/changed/c2duplicates" map="probability"></subscribe-dcc>
<rule-dcc-cell-pair id="c2-duplicates-c" probability="0" transition="62>66" neighbors="_*_*_*___"></rule-dcc-cell-pair>
<subscribe-dcc target="c2-duplicates-c" topic="input/changed/c2duplicates" map="probability"></subscribe-dcc>
<rule-dcc-cell-pair id="c2-duplicates-d" probability="0" transition="61>66" neighbors="_*_*_*___"></rule-dcc-cell-pair>
<subscribe-dcc target="c2-duplicates-d" topic="input/changed/c2duplicates" map="probability"></subscribe-dcc>

<rule-dcc-cell-pair id="c2-dies" probability="0" transition="66>__" neighbors="____*____"></rule-dcc-cell-pair>
<subscribe-dcc target="c2-dies" topic="input/changed/c2dies" map="probability"></subscribe-dcc>

<rule-dcc-cell-pair probability="50" transition="22>23" neighbors="_*_______"></rule-dcc-cell-pair>
<rule-dcc-cell-pair probability="50" transition="2_>_2" neighbors="_*_______"></rule-dcc-cell-pair>

<rule-dcc-cell-pair id="c2-mutant" probability="0" transition="66>88" neighbors="____*____"></rule-dcc-cell-pair>
<subscribe-dcc target="c2-mutant" topic="input/changed/c2mutant" map="probability"></subscribe-dcc>

<rule-dcc-cell-pair id="c3-duplicates-a" probability="0" transition="86>88" neighbors="****_*_*_"></rule-dcc-cell-pair>
<subscribe-dcc target="c3-duplicates-a" topic="input/changed/c3duplicates" map="probability"></subscribe-dcc>
<rule-dcc-cell-pair id="c3-duplicates-b" probability="0" transition="82>88" neighbors="_______*_"></rule-dcc-cell-pair>
<subscribe-dcc target="c3-duplicates-b" topic="input/changed/c3duplicates" map="probability"></subscribe-dcc>
<rule-dcc-cell-pair id="c3-duplicates-c" probability="0" transition="81>88" neighbors="_______*_"></rule-dcc-cell-pair>
<subscribe-dcc target="c3-duplicates-c" topic="input/changed/c3duplicates" map="probability"></subscribe-dcc>

<rule-dcc-cell-pair id="c3-dies" probability="0" transition="88>__" neighbors="____*____"></rule-dcc-cell-pair>
<subscribe-dcc target="c3-dies" topic="input/changed/c3dies" map="probability"></subscribe-dcc>

<rule-dcc-cell-pair probability="100" transition="3t>4t" neighbors="_*_______"></rule-dcc-cell-pair>
<rule-dcc-cell-pair probability="100" transition="2t>4t" neighbors="_*_______"></rule-dcc-cell-pair>

<rule-dcc-cell-pair id="c3-moves-a" probability="0" transition="8b>b8" neighbors="___*_*_*_"></rule-dcc-cell-pair>
<subscribe-dcc target="c3-moves-a" topic="input/changed/c3moves" map="probability"></subscribe-dcc>
<rule-dcc-cell-pair id="c3-moves-b" probability="0" transition="8y>y8" neighbors="___*_*_*_"></rule-dcc-cell-pair>
<subscribe-dcc target="c3-moves-b" topic="input/changed/c3moves" map="probability"></subscribe-dcc>
<rule-dcc-cell-pair id="c3-moves-c" probability="0" transition="8p>y8" neighbors="___*_*_*_"></rule-dcc-cell-pair>
<subscribe-dcc target="c3-moves-c" topic="input/changed/c3moves" map="probability"></subscribe-dcc>

<dcc-timer cycles="100000" interval="1000" topic="state/next">
 <subscribe-dcc topic="timer/start" map="start"></subscribe-dcc>
 <subscribe-dcc topic="timer/stop" map="stop"></subscribe-dcc>
 <subscribe-dcc topic="input/changed/timer_interval" map="interval"></subscribe-dcc>
</dcc-timer>

<subscribe-dcc target="cellular-space" topic="type/#"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/next" map="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/save" map="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/reset" map="reset"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="input/changed/space_scale" map="scale"></subscribe-dcc>`,
`<div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="images/cell/mela-1-duplicates-2.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c1duplicates" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="images/cell/mela-2-dies.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c1dies" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="images/cell/mela-2-to-3.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c1mutant" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="0.5">1</dcc-input-option><dcc-input-option value="2">3</dcc-input-option><dcc-input-option value="5">5</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="images/cell/mela-3-double.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c2duplicates" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="images/cell/mela-3-dies.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c2dies" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="images/cell/mela-3-to-4.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c2mutant" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="0.5">1</dcc-input-option><dcc-input-option value="2">3</dcc-input-option><dcc-input-option value="5">5</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="images/cell/mela-4-double.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c3duplicates" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="images/cell/mela-4-dies.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c3dies" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="20">2</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="60">4</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr><div style="flex:36px; max-height:36px; display:flex; flex-direction:row">
   <img src="images/cell/mela-4-move.png" style="flex:10%; max-width:72px; max-height:36px">
   &nbsp;
   <div style="flex:40%; max-height:48px; margin-right:10px; font-size: 2vh">
      <dcc-input-choice variable="c3moves" reveal="horizontal" exclusive><dcc-input-option value="0" checked>0</dcc-input-option><dcc-input-option value="5">1</dcc-input-option><dcc-input-option value="30">3</dcc-input-option><dcc-input-option value="80">5</dcc-input-option></dcc-input-choice>
   </div>
</div>
<hr>`
  )
})()
