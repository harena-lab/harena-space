# Digital Content Components

## Playground

Learn and try to instantiate and customize Digital Content Components (DCCs) at [DCC Playground](http://datasci4health.github.io/harena-space/src/adonisjs/public/dccs/playground/).

# Syntax and Examples

## Trigger DCC (`<dcc-trigger>`)

A visual element that triggers an action. Its standard shape is a button, but it can be also an image or an element customized by the author.

### Syntax

~~~html
<dcc-trigger id="id"
             label="label"
             image="image"
             action="action"
             parameter="parameter">
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
<dcc-trigger label="On"
             action="button/on/clicked"
             parameter="message to you">
</dcc-trigger>
~~~

Image trigger with title `check` and whose image is located in `icons/icon-check.svg`. Since the image occupies all available area, a `<div>` surrounding it delimits the size to `100px`.

When clicked, the trigger will send a message with the topic: `trigger/Check/clicked`.

~~~html
<div style="width: 100px">
   <dcc-trigger label="Check" image="icons/icon-check.svg">
   </dcc-trigger>
</div>
~~~

## Lively Talk DCC (`<dcc-lively-talk>`)

An animated image that also displays a text inside a ballon. Usually adopted for animated dialogs.

### Syntax

~~~html
<dcc-lively-talk duration="duration" 
                 delay="delay"
                 direction="direction"
                 character="character"
                 speech="speech">
</dcc-lively-talk>
~~~

* `duration` - duration of the animation (duration=0 means a static image);
* `delay` - delay before the animation is started;
* `direction` - direction of the animation (`left` (default) or `right`);
* `character` - character that appears in the image;
* `speech` - text of the speech.

When a Lively Talk DCC receives a message, it shows the body of the message as a speech in the ballon.

### Examples

Available characters in the playground: nurse, doctor, and patient.

A static patient showing the speech "Please, help me!"

~~~html
<dcc-lively-talk duration="0"
                 character="patient"
                 speech="Please, help me!">
</dcc-lively-talk>
~~~

An animated nurse that enters in 2 seconds and shows the speech "Doctor, please you have to evaluate a man!"

~~~html
<dcc-lively-talk duration="2s"
                 character="nurse"
                 speech="Doctor, please you have to evaluate a man!">
</dcc-lively-talk>
~~~

An animated doctor that enters in 2 seconds after waiting 2 seconds and shows the speech "Ok, I'm on my way." The doctor's animation goes in the right direction.

~~~html
<dcc-lively-talk duration="2s"
                 delay="2s"
                 direction="right"
                 character="doctor"
                 speech="Ok, I'm on my way.">
</dcc-lively-talk>
~~~

### Talks Inside a Dialog

Talks can be grouped inside a `<dcc-lively-dialog>`, which define the parameters of the complete dialog.

~~~html
<dcc-lively-dialog rate="6s" duration="2s">
   <dcc-lively-talk character="nurse"
                    speech="Doctor, please you have to evaluate a man!">
   </dcc-lively-talk>
   <dcc-lively-talk character="doctor"
                    speech="Ok, I'm on my way.">
   </dcc-lively-talk>
</dcc-lively-dialog>
~~~

## Subscribing Messages and Connecting Components (`<subscribe-dcc>`)

A DCC can subscribe to message in such a way that whenever the message appears on the bus, it will receive it.

For each subscribed message a DCC declares a `<subscribe-dcc>` inside its element. With the following syntax:

~~~html
<subscribe-dcc message="message">
</subscribe>
~~~

* message - specifies the subscribed message

The following example shows the message `I am a doctor.` when the button with label `Talk` is triggered.

~~~html
<dcc-trigger label="Talk" action="send/message" parameter="I am a doctor.">
</dcc-trigger>

<dcc-lively-talk id="doctor"
                 duration="0s"
                 character="doctor"
                 speech="...">
  <subscribe-dcc message="send/message"></subscribe>
</dcc-lively-talk>
~~~

### Selective Publish/Subscribe

#### Topic Filters and Wildcards

In the subscription process, it is possible to specify a specific Topic Name or a Topic Filter, which works as a regular expression representing a set of possible Topic Names.

Wildcards are represented by the special `#` and/or `+` characters, appearing inside a Topic Name in the subscription process. They enable the subscription of a set of topics, since they generically represent one or more Topic Levels, according to the following rules:

#### Multilevel Wildcard `#`
The wildcard `#` can be used only in two positions in the Topic Filter:
* alone (the filter is only a `#`) - matches any Topic Name with any number of levels;
* end of the Topic Name (always preceded by a `/ `) -  matches any number of Topic Levels with the prefix specified before the wildcard.

#### Single Level Wildcard `+`
Only a single Topic Level can be matched by the wildcard  `+`, which represents any possible complete Topic Level Label. The `+` wildcard can appear only in four positions:
* alone (the filter is only a `+`) - matches any Topic Label in a single level (without slashes);
* beginning of the Topic Filter, always followed by a slash;
* end of the Topic Filter, always preceded by a slash;
* middle of the Topic Filter, always between two slashes.

The following example show messages selectively displayed.

~~~html
<dcc-trigger label="Disease"
             action="news/disease"
             parameter="New Disease">
</dcc-trigger>

<dcc-trigger label="Medication"
             action="news/medication"
             parameter="New Medication">
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

## Notice or Input (`<dcc-notice-input>`)

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
