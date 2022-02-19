(function () {
  AuthorCellManager.instance.insertSource(
    'Simulando Vírus',
    [],
`<block type="neighbor"></block>
<block type="action"></block>`,
`<dcc-space-cellular-editor id="cellular-space" rows="14" cols="20"
  cell-width="32" cell-height="32" background-color="#ebeba2" grid>
....................
....................
....................
....................
....................
....................
....................
....................
....................
....................
....................
....................
....................
....................
</dcc-space-cellular-editor>


<dcc-cell-image type="." label="sand" image="https://mc-unicamp.github.io/oficinas/simula/business/image/cell-yellow-green-black.png"></dcc-cell-image>

<dcc-cell-image type="h" label="healthy" image="https://mc-unicamp.github.io/oficinas/simula/business/image/icecream-cart-green.png"></dcc-cell-image>
<dcc-cell-image type="v" label="vaccinated" image="https://mc-unicamp.github.io/oficinas/simula/business/image/beach-umbrella.png"></dcc-cell-image>
<dcc-cell-image type="d" label="disease" image="https://mc-unicamp.github.io/oficinas/simula/business/image/relaxing-walk.png"></dcc-cell-image>
<dcc-cell-image type="r" label="recovered" image="https://mc-unicamp.github.io/oficinas/simula/business/image/relaxing-walk-woman.png"></dcc-cell-image>
<dcc-cell-image type="n" label="nurse" image="https://mc-unicamp.github.io/oficinas/simula/business/image/relaxing-walk-woman-icecream.png"></dcc-cell-image>
<dcc-cell-image type="g" label="ghost" image="https://mc-unicamp.github.io/oficinas/simula/business/image/relaxing-walk-men-icecream.png"></dcc-cell-image>
<dcc-cell-image type="w" label="wall" image="https://mc-unicamp.github.io/oficinas/simula/contagion/harena/scripts/playground/images/cell/waves.svg"></dcc-cell-image>
<dcc-cell-image type="t" label="tombstone" image="https://mc-unicamp.github.io/oficinas/simula/business/image/relaxing-walk.png"></dcc-cell-image>


<rule-dcc-cell-pair id="icecream"  label="icecream sold" probability="80" transition="hd>hg"
                    topic="icecream/sold">
   _*_
   *_*
   _*_
</rule-dcc-cell-pair>

<rule-dcc-cell-pair id="contagion" label="contagion" probability="40" transition="d.>.d">
   ***
   *_*
   ***
</rule-dcc-cell-pair>
<rule-dcc-cell-pair id="recovered" label="recovered" probability="50" transition="g.>.d">
   ***
   *_*
   ***
</rule-dcc-cell-pair>


<dcc-compute expression='sold:=0' active></dcc-compute>
<dcc-compute expression='sold:=sold+1' subscribe="icecream/sold:update"></dcc-compute>
<dcc-compute expression='stop:=1' condition="sold>=500" active></dcc-compute>

<dcc-compute expression='price:=8' autorun></dcc-compute>
<dcc-compute expression='probv:=80-(7*price)'  subscribe="input/changed/price:var/price" active></dcc-compute>

<dcc-compute expression='behaviour:=80' autorun></dcc-compute>
<dcc-compute expression='probb:=behaviour'  subscribe="input/changed/behaviour:var/behaviour" active></dcc-compute>
<dcc-compute expression='prob:=0.6*probv+0.4*probb-10'  active></dcc-compute>



<dcc-compute expression='single_cost:=2' autorun></dcc-compute>
<dcc-compute expression='income:=0' active></dcc-compute>
<dcc-compute expression='income:=price*sold' subscribe="icecream/sold:update"></dcc-compute>
<dcc-compute expression='cost:=0' active></dcc-compute>
<dcc-compute expression='cost:=single_cost*sold' subscribe="icecream/sold:update"></dcc-compute>
<dcc-compute expression='profit:=0' active></dcc-compute>
<dcc-compute expression='profit:=income-cost' subscribe="icecream/sold:update"></dcc-compute>
<dcc-compute expression='unity:=0' active></dcc-compute>
<dcc-compute expression='unity:=round(profit/sold)' condition='sold>=1' subscribe="icecream/sold:update"></dcc-compute>
Quantidade Vendida: <dcc-expression expression='sold' active></dcc-expression>
<br>
Lucro por sorvete: <dcc-expression expression='unity' active></dcc-expression>

<dcc-timer cycles="100000" interval="250" topic="state/next" >
   <subscribe-dcc topic="timer/start" map="start"></subscribe-dcc>
   <subscribe-dcc topic="timer/stop" map="stop"></subscribe-dcc>
</dcc-timer>
<div id="operation-panel" class="d-flex col-3" style="background-color:black">
  <div id="play-button" class="control-button">
    <dcc-button label="Play" topic="timer/start"
                 image="https://mc-unicamp.github.io/oficinas/simula/contagion/harena/scripts/playground/images/icon/play.svg"></dcc-button>
  </div>
  <div id="stop-button" class="control-button">
    <dcc-button label="Stop" topic="timer/stop"
                 image="https://mc-unicamp.github.io/oficinas/simula/contagion/harena/scripts/playground/images/icon/stop.svg"></dcc-button>
  </div>
  <div id="restart-button" class="control-button">
    <dcc-button label="Restart" topic="state/reset"
                 image="https://mc-unicamp.github.io/oficinas/simula/contagion/harena/scripts/playground/images/icon/restart.svg"></dcc-button>
  </div>
  <div id="next-button" class="control-button">
    <dcc-button label="Next" topic="state/next"
                 image="https://mc-unicamp.github.io/oficinas/simula/contagion/harena/scripts/playground/images/icon/step.svg"></dcc-button>
  </div>
</div>



<subscribe-dcc target="cellular-space" topic="type/#"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/next" map="next"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/save" map="save"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="state/reset" map="reset"></subscribe-dcc>
<subscribe-dcc target="cellular-space" topic="input/changed/space_scale" map="scale"></subscribe-dcc>`,
`Selecione um dos ícones abaixo para editar o ambiente:
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row; border:2px">
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Carrinho Sorvete" topic="type/healthy"
                  image="https://mc-unicamp.github.io/oficinas/simula/business/image/icecream-cart-green.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Guarda Sol" topic="type/vaccinated"
                   image="https://mc-unicamp.github.io/oficinas/simula/business/image/beach-umbrella.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Pessoa" topic="type/disease"
                   image="https://mc-unicamp.github.io/oficinas/simula/business/image/relaxing-walk.png">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Mar" topic="type/wall"
                   image="https://mc-unicamp.github.io/oficinas/simula/contagion/harena/scripts/playground/images/cell/waves.svg">
      </dcc-button>
   </div>
   <div style="flex:10%; max-width:48px; max-height:48px; margin-right:10px">
      <dcc-button label="Areia" topic="type/empty"
                   image="https://mc-unicamp.github.io/oficinas/simula/contagion/harena/scripts/playground/images/cell/cell-yellow-green.svg">
      </dcc-button>
   </div>
</div>
<br>
<hr>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
   Preço de venda:
       <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="price" min="1" max="15" value="8" index></dcc-slider>
   </div>
</div>
<br>
<hr>
<br>
<div style="flex:48px; max-height:48px; display:flex; flex-direction:row">
    Interesse das pessoas por sorvete:
       <div style="flex:50%; max-height:48px; margin-right:10px">
      <dcc-slider variable="behaviour" value="80" index></dcc-slider>
   </div>
</div>


<subscribe-dcc target="contagion" topic="input/changed/contagion" map="probability">
</subscribe-dcc>
<subscribe-dcc target="icecream" topic="var/set/prob" map="probability">
</subscribe-dcc>
<subscribe-dcc target="icecream2" topic="input/changed/icecream2" map="probability">
</subscribe-dcc>
<subscribe-dcc target="contagion-vaccinated" topic="input/changed/contagion_vaccinated" map="probability">
</subscribe-dcc>
<subscribe-dcc target="contagion-vaccinated" topic="input/changed/contagion_recovered" map="probability">
</subscribe-dcc>
<subscribe-dcc target="nurse-vaccinate" topic="input/changed/nurse_vaccinate" map="probability">
</subscribe-dcc>
<subscribe-dcc target="sick-cured" topic="input/changed/sick_cured" map="probability">
</subscribe-dcc>
<subscribe-dcc target="sick-dies" topic="input/changed/sick_dies" map="probability">
</subscribe-dcc>`
  )
})()
