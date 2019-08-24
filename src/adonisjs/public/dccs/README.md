# Digital Content Components

# Digital Content Component Playground

Learn and try to instantiate and customize Digital Content Components (DCCs) at [DCC Playground](http://datasci4health.github.io/harena-space/src/adonisjs/public/dccs/playground/).

# Syntax and Examples to try in the playground

## Trigger DCC (`dcc-trigger`)

### Syntax

~~~html
<dcc-trigger id="id" label="label" image="image" action="action" parameter="parameter">
</dcc-trigger>
~~~

* `id` - unique id of the trigger;
* `label`:
  * textual button - textual label showed in the button;
  * image trigger - the title of the image;
* `image` (optional) - when the trigger is an image, it is the path of the image file;
* `action` (optional) - the topic of the message sent by the trigger to activate an action; when the action is not specified, the topic is built from the label ("trigger/<label>/clicked");
* `parameter` (optional) - the message body the accompanies the topic.

### Examples

Textual button trigger that sends the following message when clicked:
* topic - `button/on/clicked`
* message body - `"message to you"`

~~~html
<dcc-trigger label="On" action="button/on/clicked" parameter="message to you">
</dcc-trigger>
~~~

Image trigger with title `Check` and whose image is located in `icons/icon-check.svg`. Since the image ocupies all available area, a div surrounding it delimites the size to `100px`.

When clicked, the trigger will send a message with the topic: `trigger/Check/clicked`.

~~~html
<div style="width: 100px">
   <dcc-trigger label="Check" image="icons/icon-check.svg"></dcc-trigger>
</div>
~~~

### Lively Talk DCC (`dcc-lively-talk`)

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
