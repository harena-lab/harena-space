Start
=====

## Case 001 (start,dialog_left)
:NURSE Agnes: Present the case.

* Let us go! -> Cycle 1.Begin

Cycle 1
=======

Begin (information)
-------------------

:PATIENT Jakob: Details about the patient.

:Jacinto:What do you want to do?

* -> Generate hypothesis
* -> More information
* Call the supervisor -> Call the supervisor.A

Generate hypothesis (input)
---------------------------
What is your main diagnostic hypothesis?
:PATIENT Jakob:.
{?1 hypothesis:mesh}

* Submit hypothesis -> Check hypothesis

More information (information)
------------------------------

More information about the patient.
:PATIENT Jakob:.

:Jacinto:What do you want to do?

* Back to the case -> Cycle 1.Begin

Call the supervisor
-------------------

### A (detailed)
:SUPERVISOR Harry:
Supervisor explanation.
::

* Back to the case -> Cycle 1.Begin

### Letter (expansion)

* template: standard_supervisor


Check hypothesis (selector)
---------------------------

:Jacinto:Let us check out your hypothesis. Highlight in green the findings that corroborate your hypothesis; in blue those that are neutral; and in red the ones speaking against your hypothesis.

{{symptoms#contribution to diagnostics: ,+,=,-
Nurse: {Symptom#=}, {symptom#=}.
}}

* Submit -> Review hypothesis 

Review hypothesis (input)
-------------------------
If you whant to review your hypothesis, type below the new hypothesis.
:PATIENT Jakob:.
{?1 hypothesis:mesh}

* Submit -> Cycle 2.Order EKG

Cycle 2
=======

## Order EKG (decision_exam)
Information related to the EKG.

:EKG:.

* Magnify -> Magnify EKG

:Game: What do you want to do?
* -> Generate hypothesis
* -> More information
* -> Call the supervisor

## Magnify EKG (note,magnify_exam)

:EKG:.

* Return -> Order EKG

## Generate hypothesis (input)
What is your main diagnostic hypothesis?
:PATIENT Jakob:.
{?1 hypothesis:mesh}

* Submit hypothesis -> Check hypothesis

## More information (decision_exam)

![EKG Description](/templates/jacinto/images/ekg-template.svg)

* EKG Analysis

:EKG:.

:Game: What do you want to do?
* Back -> Order EKG
* Analyze EKG -> EKG Analysis

## EKG Analysis (note,marker_exam)

![EKG Description](/templates/jacinto/images/ekg-template.svg)

* Return -> Order EKG

## Call the supervisor (decision_exam)

Supervisor explanation.

* -> EKG Analysis

:EKG:.

:Game: What do you want to do?
* Back -> Order EKG
* Analyze EKG -> EKG Analysis

## Check hypothesis (marker_exam)

![EKG Description](/templates/jacinto/images/ekg-template.svg)

* Submit -> Review hypothesis

## Review hypothesis (input)
If you whant to review your hypothesis, type below the new hypothesis.
:PATIENT Jakob:.
{?1 hypothesis:mesh}

* Submit -> Final.Report

Final
=====

Report (detailed)
-----------------

Congratulations, my young Dr. you could helped your patient providing his diagnosis. Now, Let's review all levels of this case.

:Computer:Select a final report level:

* -> Level 1
* -> Level 2.2a
* -> Level 3.3a

Level 1 (detailed)
------------------

Final report.

* Return -> Final.Report  

_Case_
======
* theme: jacinto