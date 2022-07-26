class CommandManager{
  constructor (editorName, author) {
    this._undoStack = new LocalStorageStack(editorName + 'UndoStack')
    this._redoStack = new LocalStorageStack(editorName + 'RedoStack')
    this._author = author
  };

  execute(action) {
    this.knots = this._author._compiledCase.knots
    action.execute(this.knots)
    this._undoStack.push(action.serialize(action))
    this._redoStack.clear()

  }

  undo(){
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
    this._undoStack.clear()
    this._redoStack.clear()
    this._undoStack = null
    this._redoStack = null
  }

}
