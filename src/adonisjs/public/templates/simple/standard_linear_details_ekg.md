Cycle 1
=======

Begin (start, detailed)
--------------------------

Present the case.

* -> Generate hypothesis

Generate hypothesis (input)
---------------------------

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

* Submit hypothesis -> Cycle 2.EKG

Cycle 2
=======

## EKG (exam_zoom)

@EKG
  ![EKG](template/ekg-template.svg)

* -> Generate hypothesis

## Generate hypothesis (input)

? hypothesis
  What is your main diagnostic hypothesis?

? confidence
  How sure are you of your diagnosis?
  * type: slider
  * min: 0
  * max: 100
  * value: 50
  * index: true

* Submit hypothesis -> Final.Report

Final
=====

Report (detailed)
-----------------
~ case=0

Congratulations, my young Dr. you could helped your patient providing his diagnosis.

____ Data _____
* theme: simple
* namespaces:
  * evidence: http://purl.org/versum/evidence/