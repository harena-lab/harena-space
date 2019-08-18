# Digital Content Components

# Digital Content Component Playground

Learn and try to instantiate and customize Digital Content Components (DCCs) at [DCC Playground](http://datasci4health.github.io/harena-space/src/adonisjs/public/dccs/playground/).

## Examples to try in the playground

### `Trigger DCC`

~~~html
<dcc-trigger label="On" action="button/on/clicked" parameter="message to you"></dcc-trigger>

<div style="width: 100px">
   <dcc-trigger label="Check" image="icons/icon-check.svg"></dcc-trigger>
</div>
~~~

### `Lively Talk DCC`

~~~html
<dcc-lively-talk duration="2s" character="nurse" speech="Doctor, please you have to evaluate a man!">
</dcc-lively-talk>

<dcc-lively-talk duration="2s" delay="2s" direction="right"
         character="doctor"
         speech="Ok.">
</dcc-lively-talk>
~~~

## `Talks Inside a Dialog`
~~~html
<dcc-lively-dialog rate="6s" duration="2s">
   <dcc-lively-talk 
      character="nurse"
      speech="Doctor, please you have to evaluate a man!">
   </dcc-lively-talk>
   <dcc-lively-talk
      character="doctor" bubble="bubble"
      speech="Ok.">
   </dcc-lively-talk>
</dcc-lively-dialog>
~~~

### `Connecting two components`

~~~html
<dcc-trigger label="Message" action="send/message" parameter="Hello man!">
</dcc-trigger>

<dcc-lively-talk id="doctor" duration="0s"
         character="doctor"
         speech="...">
  <subscribe-dcc message="send/message"></subscribe>
</dcc-lively-talk>
~~~

### `Selective Publish/Subscribe`

~~~html
<dcc-trigger label="Disease" action="news/disease" parameter="New Disease">
</dcc-trigger>

<dcc-trigger label="Medication" action="news/medication" parameter="New Medication">
</dcc-trigger>

<dcc-lively-talk duration="0s"
         character="doctor"
         speech="...">
  <subscribe-dcc message="news/#"></subscribe>
</dcc-lively-talk>

<dcc-lively-talk duration="0s"
         character="nurse"
         speech="...">
  <subscribe-dcc message="news/disease"></subscribe>
</dcc-lively-talk>

<dcc-lively-talk duration="0s"
         character="patient"
         speech="...">
  <subscribe-dcc message="news/soccer"></subscribe>
</dcc-lively-talk>
~~~

## `Notice or Input`

~~~html
<dcc-notice-input text="Hello">
</dcc-notice-input>

<dcc-notice-input text="Do you agree?" buttona="Yes" buttonb="No">
</dcc-notice-input>

<dcc-notice-input itype="input" text="Type your name:">
</dcc-notice-input>
~~~

# Code Patterns

## Properties
Getter and setter approach based on:
> [Attributes and Properties in Custom Elements, Alligator.io, September 13, 2017](https://alligator.io/web-components/attributes-properties/)
