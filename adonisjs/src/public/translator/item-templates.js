(function() {
Translator.htmlTemplates = {
image:
`<img src='[path]'[alt]>`,
option:
`<dcc-trigger id='dcc[seq]'[author] type='[subtype]' link='[link]' label='[display]'[parameter][image][location]></dcc-trigger>`,
divert:
`<dcc-trigger id='dcc[seq]'[author] type='+' link='[link]' label='[display]'></dcc-trigger>`,
talk:
`<dcc-talk id='dcc[seq]'[author] character='[character]' speech='[speech]'>
</dcc-talk>`,
talkopen:
`

<dcc-talk id='dcc[seq]'[author] character='[character]'[image][alt]>

`,
talkclose:
`

</dcc-talk>

`,
input:
`<dcc-input id='dcc[seq]'[author] variable='[variable]'[rows][vocabulary]> 
</dcc-input>`,
compute:
`<dcc-compute sentence='[sentence]'></dcc-compute>`,
domain:
`[natural]`,
selctxopen:
`

<dcc-group-selector id='dcc[seq]'[author] context='[context]' [evaluation][states][colors]>

`,
selctxclose:
`

</dcc-group-selector>

`,
selector:
`<dcc-state-selector id='dcc[seq]'[author][answer]>[expression]</dcc-state-selector>`
};

Translator.htmlTemplatesEditable = {
text:
`


<dcc-markdown id='dcc[seq]'[author]>

[content]

</dcc-markdown>


`,
image:
`<dcc-image id='dcc[seq]'[author] image='[path]' alternative='[alternative]'[title]></dcc-image>`
};

Translator.markdownTemplates = {
knot:
`[level] [title][categories]`,
image:
`![{alternative}]({path}{title})`,
option:
`* {label}{rule}-> {target}`
};

Translator.objTemplates = {
text: {
   type: "text",
   content: "Type your text here"
},
image: {
   type: "image",
   alternative: "Image",
   path: "../templates/basic/images/landscape.svg",
   title: "Image"
},
option: {
   type: "option",
   subtype: "*",
   label: "Button",
   target: "Target"
}
};
})();