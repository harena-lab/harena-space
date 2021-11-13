# Case _knot_number_ (tbl_case) #

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
+ Exam 1 <-> Exam 1
+ Exam 2 <-> Exam 2
+ Exam 3 <-> Exam 3
+ Exam 4 <-> Exam 4
+ Exam 5 <-> Exam 5

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
