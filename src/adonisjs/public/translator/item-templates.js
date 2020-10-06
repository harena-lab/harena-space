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
'<figure><img src=\'[path]\'[alt][resize]>[caption]</figure>',
    option:
'<dcc-button id=\'dcc[seq]\'[author] type=\'[subtype]\' topic=\'[target]\' label=\'[display]\'[divert][message][image]></dcc-button>',
    divert:
'<dcc-button id=\'dcc[seq]\'[author] type=\'+\' topic=\'[target]\' label=\'[display]\' divert=\'[divert]\'></dcc-button>',
    'divert-script':
'-&gt; [target][parameter]<br>',
    entity:
'<dcc-entity id=\'dcc[seq]\'[author] entity=\'[entity]\'[image][alternative][title]>[text]</dcc-entity>',
    mention:
'<b>[entity]: </b>',
    input:
'<dcc-[dcc] id=\'dcc[seq]\'[author][extra]>[statement]</dcc-[dcc]>',
    choice:
'<dcc-input-option [target]value="[value]">[option]</dcc-input-option><br>',
    output:
'<dcc-expression id=\'dcc[seq]\'[author] expression=\'[variable][index]\'[variant]></dcc-expression>',
    compute:
'<dcc-compute instruction=\'[instruction]\'></dcc-compute>',
    domain:
'[natural]',
    select:
'<dcc-state-select id=\'dcc[seq]\'[author][answer]>[expression]</dcc-state-select>'
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
'<dcc-image id=\'dcc[seq]\'[author] image=\'[path]\' alternative=\'[alternative]\'[title]></dcc-image>'
  }

  Translator.markdownTemplates = {
    layer:
'___ [title] ___',
    knot:
'[level] [title][categories][inheritance]',
    image:
'![{alternative}]({path}{title})',
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
    }
  }
})()
