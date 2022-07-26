class CommandManager{
  //This Class is resposible for calling and managing actions. The Undo/Redo feature is here implemented by using the LocalStorageStack class to controll the
  //undo and redo stacks so that the actions are stored in the brower local memory of the users computer and can later be retrieved.
  constructor (editorName, author) {
    //Create stacks and instatiate author
    this._undoStack = new LocalStorageStack(editorName + 'UndoStack')
    this._redoStack = new LocalStorageStack(editorName + 'RedoStack')
    this._author = author
  };

  execute(action) {
    //Call the execute item, push the action to the undo stack and clear the redo stack
    this.knots = this._author._compiledCase.knots
    action.execute(this.knots)
    this._undoStack.push(action.serialize(action))
    this._redoStack.clear()
  }

  undo(){
    //Get the top item from the undo stack, add it on the redo stack, select the element and undo the action.
    this.knots = this._author._compiledCase.knots
    if(this._undoStack.length > 0){
      let action = this._undoStack.pop()
      this._redoStack.push(action)
      action = ActionDeserializer.deserialize(action)
      action.selectElement()
      action.undo(this.knots)
    }
  }

  redo(){
    //Get the top action from the redo stack, add it to the undo stack, select the element and execute the action.
    this.knots = this._author._compiledCase.knots
    if(this._redoStack.length > 0){
      let action = this._redoStack.pop()
      this._undoStack.push(action)
      action = ActionDeserializer.deserialize(action)
      action.selectElement()
      action.execute(this.knots)
    }
  }

  clear(){
    //Clear stacks and pointers to them.
    this._undoStack.clear()
    this._redoStack.clear()
    this._undoStack = null
    this._redoStack = null
  }

}
