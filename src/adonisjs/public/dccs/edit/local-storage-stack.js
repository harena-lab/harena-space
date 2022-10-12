class LocalStorageStack{
  //Class that simulates stack operations for using the local storage key-value database.
  //The length of the stack is stored in a item with it's name, the items are stored in a item named stackName + length
  constructor(stackName){
    //Get item with stack name to get the stored stack if it exists, otherwise create a stack with this name and store 0 as length.
    this._stackName = stackName
    this.length = localStorage.getItem(stackName)
    if(this.length == null){
      this.length = 0
      localStorage.setItem(stackName, 0)
    }
  }

  push(item){
    //push item, increase length and store it
    localStorage.setItem(this._stackName + this.length.toString(), item)
    this.length++
    localStorage.setItem(this._stackName, this.length)
  }

  pop(){
    //Get top item, descrease length and store it
    let item = null
    if(this.length > 0){
      this.length--
      localStorage.setItem(this._stackName, this.length)
      item = localStorage.getItem(this._stackName + this.length.toString())
      localStorage.removeItem(this._stackName + this.length.toString())
    }
    return item
  }

  clear(){
    //Remove all items from the stack and it's length
    while(this.length > 0){
      this.length--
      localStorage.removeItem(this._stackName + this.length.toString())
    }
    localStorage.removeItem(this._stackName)
  }
}
