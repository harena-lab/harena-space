# Quiz 1 (quiz) #

Write here the **stem** of your question.

> Write here the **lead-in** of your question.
+ Answer-key <-> Answer A >((right))
+ Distractor 1 <-> Answer B
+ Distractor 2 <-> Answer C
+ Distractor 3 <-> Answer D

* Next Question -> Flow.Next ((right))?

## Answer A: Answer ##

Feedback for Answer-key.

* [Enter References](References)

## Answer B: Answer ##

Feedback for Distractor 1.

## Answer C: Answer ##

Feedback for Distractor 2.

## Answer D: Answer ##

Feedback for Distractor 3.

# Quiz 2 (quiz) #

Write here the **stem** of your question.

> Write here the **lead-in** of your question.
+ Answer-key <-> Answer A >((right))
+ Distractor 1 <-> Answer B
+ Distractor 2 <-> Answer C
+ Distractor 3 <-> Answer D

* Next Question -> Flow.Next ((right))?

## Answer A: Answer ##

Feedback for Answer-key.

* [Enter References](References)

## Answer B: Answer ##

Feedback for Distractor 1.

## Answer C: Answer ##

Feedback for Distractor 2.

## Answer D: Answer ##

Feedback for Distractor 3.

# Case1 (tbl_case) #

## History (input) ##

**Case 1**
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

## Physical Examination (input) ##

**Physical Examination**

{{stem
Write here the **stem**.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

> Write here the **lead-in**.
? conduct
  * type: text

* Next -> Flow.Next

## Complementary Exams (quiz) ##

**Complementary Exams**

> Choose the 3 most relevant complementary exams to solve this case:
? exams
  * type: choice
  * reveal: partial
* Exam 1 <-> Exam 1
* Exam 2 <-> Exam 2
* Exam 3 <-> Exam 3
* Exam 4 <-> Exam 4
* Exam 5 <-> Exam 5

* Next -> Conclusion

## Exam 1 (input) ##

**Exam 1**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Exam 2 (input) ##

**Exam 2**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Exam 3 (input) ##

**Exam 3**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Exam 4 (input) ##

**Exam 4**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Exam 5 (input) ##

**Exam 5**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Conclusion (input) ##

**Conclusion**

> Write here the **lead-in**.
? hypothesis
  * type: text

> Write here the **lead-in**.
? therapeutic_plan
  * type: text

* Next -> Flow.Next

# Case 2 (tbl_case) #

## History (input) ##

**Case**
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

## Physical Examination (input) ##

**Physical Examination**

{{stem
Write here the **stem**.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

> Write here the **lead-in**.
? conduct
  * type: text

* Next -> Flow.Next

## Complementary Exams (quiz) ##

**Complementary Exams**

> Choose the 3 most relevant complementary exams to solve this case:
? exams
  * type: choice
  * reveal: partial
* Exam 1 <-> Exam 1
* Exam 2 <-> Exam 2
* Exam 3 <-> Exam 3
* Exam 4 <-> Exam 4
* Exam 5 <-> Exam 5

* Next -> Conclusion

## Exam 1 (input) ##

**Exam 1**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Exam 2 (input) ##

**Exam 2**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Exam 3 (input) ##

**Exam 3**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Exam 4 (input) ##

**Exam 4**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Exam 5 (input) ##

**Exam 5**

{{stem
Exam.
}}

> Write here the **lead-in**.
? hypothesis
  * type: text

* Back -> Knot.Previous

## Conclusion (input) ##

**Conclusion**

> Write here the **lead-in**.
? hypothesis
  * type: text

> Write here the **lead-in**.
? therapeutic_plan
  * type: text

* Next -> Flow.Next

# Answer (note, division) #

**You answered:** ^Previous.input1^

___ Template ___

* template: simple/case/tbl
