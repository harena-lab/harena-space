(function () {
  Translator.htmlTemplates = {
    annotation:
'<dcc-annotation id=\'dcc[seq]\'[annotation][author]>[content]</dcc-annotation>',
    textBlock:
`


<dcc-markdown id='dcc[seq]'[author]>

[content]

</dcc-markdown>


`,
    script:
`


<dcc-markdown id='dcc[seq]'[author]>

[content]

</dcc-markdown>


`,
    image:
'<figure class="image[imgresized]"[resize]><img src="[path]"[alt]>[caption]</figure>',
    media:
'<[subtype]>[source]</[subtype]>',
    option:
'<dcc-button id=\'dcc[seq]\'[author] topic=\'[target]\' label=\'[display]\'[divert][message][image][connect][show]></dcc-button>[compute]',
    divert:
'<dcc-button id=\'dcc[seq]\'[author] topic=\'[target]\' label=\'[display]\' divert=\'[divert]\' location=\'#in\' inline></dcc-button>',
    'divert-script':
'-&gt; [target][parameter]<br>',
    entity:
'<dcc-entity id=\'dcc[seq]\'[author] entity=\'[entity]\'[image][alternative][title]>[text]</dcc-entity>',
    mention:
'<b>[entity]: </b>',
    input:
'<dcc-[dcc] id="dcc[seq]"[author][extra][show]>[statement]</dcc-[dcc]>',
    choice:
'<dcc-input-option parent="dcc[seq]" [target][value][compute]>[option]</dcc-input-option><br>',
    output:
'<dcc-expression id=\'dcc[seq]\'[author] expression=\'[variable][index]\'[variant] active></dcc-expression>',
    compute:
'<dcc-compute expression=\'[expression]\'[connect] onload></dcc-compute>',
    timer:
`<dcc-timer cycles="[cycles]" interval="1000" autostart>
  <connect-dcc trigger="begin" to="dcc[to]" topic="style/display/none"></connect-dcc>
  <connect-dcc trigger="cycle" to="dcc[to]" topic="style/display/none"></connect-dcc>
  <connect-dcc trigger="end" to="dcc[to]" topic="style/display/initial"></connect-dcc>
</dcc-timer>`,
    domain:
'[natural]',
    select:
'<dcc-state-select id=\'dcc[seq]\'[author][answer]>[expression]</dcc-state-select>'
  }

Translator.htmlSubTemplates = {
  compute: {
    connect: ' connect="click:dcc[seq]-compute:compute/update"',
    component: '<dcc-compute id="dcc[seq]-compute" expression="[expression]"></dcc-compute>'
  }
}

  Translator.htmlFlatTemplates = {
    entity:
'<p><b>[entity]: </b>[text]</p>'
  }

  Translator.htmlTemplatesEditable = {
    text:
`


<dcc-markdown id='dcc[seq]'[author]>

[content]

</dcc-markdown>


`,
    image:
'<dcc-image id=\'dcc[seq]\'[author] image=\'[path]\' alternative=\'[alternative]\'[title]></dcc-image>',
    media:
'<dcc-media id="dcc[seq]" type="[subtype]"[source] controls[author]></dcc-media>'
  }

  Translator.markdownTemplates = {
    layer:
'___ [title] ___',
    knot:
'[level] [unity][title][categories][inheritance]',
    image:
'![{alternative}]({path}{resize}{title})',
    media:
'<[subtype]><source src="[source]"></[subtype]>',
    option:
'{subtype}{label} {divert} {target}{message}{state}',
    entity:
'@{entity}',
    input:
'{statement}? {variable}{subtype}{extra}',
    choice:
'+ {label} <-> {target}{message}{state}'
  }

  Translator.objTemplates = {
    text: {
      type: 'text',
      content: 'Type your text here'
    },
    image: {
      type: 'image',
      alternative: 'Image',
      path: '../templates/basic/images/landscape.svg',
      title: 'Image'
    },
    option: {
      type: 'option',
      subtype: '*',
      label: 'Button',
      target: 'Target'
    },
    field: {
      type: 'field',
      field: 'name',
      value: 'content'
    }
  }
})()
