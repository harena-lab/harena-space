(function() {
Translator.htmlTemplates = {
image:
`<img src='[path]'[alt]>`,
option:
`<dcc-trigger id='dcc[seq]'[author] type='[subtype]' action='[target]' label='[display]'[parameter][image][location]></dcc-trigger>`,
divert:
`<dcc-trigger id='dcc[seq]'[author] type='+' action='[target]' label='[display]'></dcc-trigger>`,
talk:
`<dcc-talk id='dcc[seq]'[author] character='[character]'[image]>
[speech]
</dcc-talk>`,
/*
"talk-open":
`

<dcc-talk id='dcc[seq]'[author] character='[character]'[image][alt]>

`,
"talk-close":
`

</dcc-talk>

`,
*/
input:
`<dcc-input id='dcc[seq]'[author] variable='[variable]'[rows][vocabularies]></dcc-input>`,
output:
`<dcc-expression id='dcc[seq]'[author] expression='[variable]'[variant]></dcc-expression>`,
compute:
`<dcc-compute sentence='[sentence]'></dcc-compute>`,
domain:
`[natural]`,
"input-group-select":
`<dcc-group-select id='dcc[seq]'[author] variable='[variable]'[states][labels]></dcc-group-select>`,
/*
selctxopen:
`

<dcc-group-select id='dcc[seq]'[author] context='[context]'[input]>

`,
selctxclose:
`

</dcc-group-select>

`,
*/
select:
`<dcc-state-select id='dcc[seq]'[author]>[expression]</dcc-state-select>`
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