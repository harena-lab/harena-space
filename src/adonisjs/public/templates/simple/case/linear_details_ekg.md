* Description Cycle
===================

* Description (detailed)
------------------------

Present the case here.

* -> Generate hypothesis

* Generate hypothesis (input)
-----------------------------

? hypothesis
  What is your main diagnostic hypothesis?
  * vocabularies: mesh

? confidence
  How sure are you of your diagnosis?
  * type: slider
  * min: 0
  * max: 100
  * value: 50
  * index: true

* Submit hypothesis -> Flow.Next

* EKG Cycle
===========

## * EKG (exam_zoom)

@EKG
  ![EKG](template/ekg-template.svg)

* -> Generate hypothesis

## * Generate hypothesis: Description Cycle.Generate hypothesis

* Final
=======

Report (detailed,end)
---------------------

Congratulations, my young Dr., you could helped your patient providing his diagnosis.

* Next case -> Case.Next

___ Flow ___

* Description first:
  * Description Cycle.Description
  * EKG Cycle.EKG
  * Final.Report

* EKG first:
  * EKG Cycle.EKG
  * Description Cycle.Description
  * Final.Report

___ Data ___

* theme: simple
* namespaces:
  * evidence: http://purl.org/versum/evidence/
* templates:
  * categories:
    * detailed: simple/knot/description
