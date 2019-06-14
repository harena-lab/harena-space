(function() {
Translator.htmlTemplates = {
image:
`<img src='[path]'[alt]>`,
option:
`<dcc-trigger id='dcc[seq]'[author] type='[subtype]' link='[link]' label='[display]' [image][location]></dcc-trigger>`,
divert:
`<dcc-trigger id='dcc[seq]'[author] type='+' link='[link]' label='[display]'></dcc-trigger>`,
talk:
`<dcc-talk id='dcc[seq]'[author] character='[character]' speech='[speech]'>
</dcc-talk>`,
talkopen:
`

<dcc-talk id='dcc[seq]'[author] character='[character]'>

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
})();