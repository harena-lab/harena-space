class CommandManager{
  constructor (editorName) {
    this._undoStack = new LocalStorageStack(editorName + 'UndoStack')
    this._redoStack = new LocalStorageStack(editorName + 'RedoStack')
  };

  execute(action) {
    this._undoStack.push(action)
    this._redoStack.clear()
    action.execute()
  }

  undo(){
    if(this._undoStack.length > 0){
      let action = this._undoStack.pop()
      this._redoStack.push(action)
      action.undo()
    }
  }

  redo(){
    if(this._redoStack.length > 0){
      let action = this._redoStack.pop()
      this._undoStack.push(action)
      action.execute()
    }
  }

  clear(){
    this._undoStack.clear()
    this._redoStack.clear()
    this._undoStack = null
    this._redoStack = null
  }

}
