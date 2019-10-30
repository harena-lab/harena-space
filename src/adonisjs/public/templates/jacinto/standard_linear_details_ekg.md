Cycle 1
=======

Begin (start, detailed_role)
--------------------------
  ![Emergency room](theme/background-emergency-room-1.png)

Present the case.

* -> Generate hypothesis

Generate hypothesis (input)
---------------------------

? hypothesis
  What is your main diagnostic hypothesis?
  * vocabularies: mesh

* Submit hypothesis -> Cycle 2.Order EKG

Cycle 2
=======

## Order EKG (exam)
@Emergency room

@EKG
  ![EKG](template/ekg-template.svg)

* Magnify -> Magnify EKG

@SYSTEM: What do you want to do?
* -> Generate hypothesis

## Magnify EKG (notice_exam_zoom)

@EKG

## Generate hypothesis (input)

@SYSTEM: What is your main diagnostic hypothesis?

? hypothesis

* Submit hypothesis -> Final.Report

Final
=====

Report (detailed)
-----------------
~ case=0

Congratulations, my young Dr. you could helped your patient providing his diagnosis. Now, Let's review all levels of this case.

Your first answer was ^Cycle 1.Generate hypothesis.hypothesis^.

Your second answer was ^Cycle 2.Generate hypothesis.hypothesis^.

Feedback.

____ Data _____
* theme: jacinto
* namespaces:
  * evidence: http://purl.org/versum/evidence/