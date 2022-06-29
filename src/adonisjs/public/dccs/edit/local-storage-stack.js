class LocalStorageStack{
  constructor(stackName){
    this._stackName = stackName
    this.length = localStorage.getItem(stackName)
    if(this.length == null){
      this.length = 0
      localStorage.setItem(stackName, 0)
    }
  }

  push(item){
    localStorage.setItem(this._stackName + this.length.toString(), item)
    this.length++
    localStorage.setItem(this._stackName, this.length)
  }

  pop(){
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
    while(this.length > 0){
      this.length--
      localStorage.removeItem(this._stackName + this.length.toString())
    }
    localStorage.removeItem(this._stackName)
  }
}
