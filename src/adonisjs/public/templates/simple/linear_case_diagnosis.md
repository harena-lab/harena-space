Description Cycle
=================

## Descrição (detailed)

Apresente a descrição do caso aqui.

* Próximo -> Flow.Next

## Diagnóstico (input)

> Qual a sua principal hipótese de diagnóstico?
? hypothesis
  * vocabularies: mesh

> Quão certo você está do seu diagnóstico?
? confidence
  * type: slider
  * min: 0
  * max: 100
  * value: 50
  * index: true

* Submeter diagnóstico -> Flow.Next

Final
=====

## Relatório (detailed,end)

Escreva aqui o feedback.

* Próximo caso -> Case.Next

___ Flow ___

* Sequential:
  * _sequential_

___ Data ___

* theme: simple
* namespaces:
  * evidence: http://purl.org/versum/evidence/
* templates:
  * categories:
    * input: simple/input
    * detailed: simple/description