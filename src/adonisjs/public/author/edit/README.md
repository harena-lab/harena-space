# Element Profiles (`Properties.elProfiles`)

## Schema

~~~
{
  element_type:
    element_subtype (optional):
      default | expand: according to the action that triggered the event; clicking on the element usually triggers a "default" profile; clicking on a special expand button usually triggers a "expand" profile.
        type: defined the element editor type
          void - not editable element
          text - textual content that can result in a complex textBlock
          textField - textual content to fill one single field
          variable - editor constrained to accept the name of an existing variable
          select - presents a set of options to be selected
        options (optional): define the source of options when the type is select
        label: the label of the property
        visual:
          inline - straight on the element
          panel - presented in a side panel
          inline-panel - both ways
        role: role assigned to the visual element that triggers the event; it is used to define the visual element to be edited
}
~~~
