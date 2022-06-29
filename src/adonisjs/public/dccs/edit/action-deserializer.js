class ActionDeserializer{
  static deserialize(action){
    let properties = JSON.parse(action)
    switch (properties.type) {
      case 'ApplyProperties':
        action = ApplyPropertiesAction.deserialize(properties)
        break
    }
    return action
  }
}
