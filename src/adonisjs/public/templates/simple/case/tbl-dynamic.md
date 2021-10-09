# Case 1

## History (input)

Title
{{stem
Write here the **stem**.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

> Write here the **lead-in**.
? physical_examination
  * type: text

* Next -> Flow.Next

## Physical Examination (input)

<h2>Physical Examination</h2>

> Write here the **lead-in**.
? hypothesis
  * type: text

> Write here the **lead-in**.
? conduct
  * type: text

* Next -> Flow.Next

## Complementary Exams (quiz)

<h2>Complementary Exams</h2>

> Choose the 3 most relevant complementary exams to solve this case:
+ Exam 1 <-> Exam 1
+ Exam 2 <-> Exam 2
+ Exam 3 <-> Exam 3
+ Exam 4 <-> Exam 4
+ Exam 5 <-> Exam 5

* Next -> Conclusion

## Exam 1 (detailed)

Exam 1

Exam.

* Back -> Knot.Previous

## Exam 2 (detailed)

Exam 2

Exam.

* Back -> Knot.Previous

## Exam 3 (detailed)

<h2>Exam 3</h2>

Exam.

* Back -> Knot.Previous

## Exam 4 (detailed)

<h2>Exam 4</h2>

Exam.

* Back -> Knot.Previous

## Exam 5 (detailed)

<h2>Exam 5</h2>

Exam.

* Back -> Knot.Previous

## Conclusion (input)

<h2>Conclusion</h2>

> Write here the **lead-in**.
? hypothesis
  * type: text

> Write here the **lead-in**.
? therapeutic_plan
  * type: text

* Next Virtual Visit -> Case.Next

___ Template ___

* template: simple/case/tbl
