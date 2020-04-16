Description Cycle
=================

## Descrição (detailed)

Apresente a descrição do caso aqui.

* Próximo -> Flow.Next

## Diagnóstico (input)

? hypothesis
  Qual a sua principal hipótese de diagnóstico?
  * vocabularies: mesh

? confidence
  Quão certo você está do seu diagnóstico?
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
    * detailed: simple/description
    * input: simple/input
