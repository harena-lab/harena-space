class LevelCreationTool {
  constructor(){
    this.pacient = Object.create(null)
    this.test()
    this.test = this.test.bind(this)
    MessageBus.int.subscribe('control/html/ready', this.test)
  }

  async test(){
    MessageBus.int.unsubscribe('control/html/ready', this.test)

    const optionList =
    `
    <div class="option-list mb-1 bg-warning border rounded" draggable="true"
    ondragstart="LevelCreationTool.i.dragStartHandler(event)" id="option-[id]">[field]</div>
    `
    const optionChild =
    `
    <div class="option-list mb-1 bg-info border rounded" draggable="true"
    ondragstart="LevelCreationTool.i.dragStartHandler(event)"
    id="option-[parentId]-value-[id]" data-parent-title="[parentValue]">[field]</div>
    `

    const options = Prognosis.sapsScoreValues
    console.log(Object.keys(options['pacient']))
    for (let i = 0; i < Object.keys(options['pacient']).length; i++) {
      let parentKey = Object.keys(options['pacient'])[i]
      let template = document.createElement('template')
      const optionListWrapper = document.querySelector('#option-list-wrapper')
      template.innerHTML = optionList
      .replace(/\[field\]/ig, parentKey)
      .replace(/\[id\]/ig, i)
      optionListWrapper.appendChild(template.content.cloneNode(true))
      for (let x = 0; x < Object.keys(options['pacient'][parentKey]).length; x++) {
        let parentObj = document.querySelector(`#option-${i}`)
        let childValue = Object.keys(options['pacient'][parentKey])[x]
        template = document.createElement('template')
        template.innerHTML = optionChild
        .replace(/\[field\]/ig, childValue)
        .replace(/\[parentValue\]/ig, parentKey)
        .replace(/\[parentId\]/ig, i)
        .replace(/\[id\]/ig, x)
        parentObj.appendChild(template.content.cloneNode(true))
      }
    }
  }

  async dragStartHandler (ev){
      console.log("dragStart: dropEffect = " + ev.dataTransfer.dropEffect + " ; effectAllowed = " + ev.dataTransfer.effectAllowed);
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.effectAllowed = "move";
  }

  async drop_handler(ev) {
    console.log("drop: dropEffect = " + ev.dataTransfer.dropEffect + " ; effectAllowed = " + ev.dataTransfer.effectAllowed);
    ev.preventDefault();

    // Get the id of the target and add the moved element to the target's DOM
    let data = ev.dataTransfer.getData("text")
    let target = ev.target
    console.log('============ data '+ data)
    if(target.classList.contains('drop-container'))
      target.appendChild(document.getElementById(data))
    else if (target.parentElement.classList.contains('drop-container')) {
      target.parentElement.appendChild(document.getElementById(data))
    }
    if (target.classList.contains('pancient-info-values')){
      console.log('============')
      this.pacient.new = {'key':'value'}
      console.log(this.pacient)
    }
  }

  async dragover_handler(ev) {
    console.log("dragOver: dropEffect = " + ev.dataTransfer.dropEffect + " ; effectAllowed = " + ev.dataTransfer.effectAllowed);
    ev.preventDefault();
    // Set the dropEffect to move
    ev.dataTransfer.dropEffect = "move"
  }

  async createOption (wrapper, isOpen, prependTxt, id){
    let template = document.createElement('template')
    if(isOpen){
      template.innerHTML = Prognosis.playerOption
      .replace(/\[prependText\]/ig, prependTxt)
      .replace(/\[id\]/ig, id)
      wrapper.appendChild(template.content.cloneNode(true))
    }else{
      template.innerHTML = Prognosis.playerOptionLocked
      .replace(/\[prependText\]/ig, prependTxt)
      .replace(/\[id\]/ig, id)
      wrapper.appendChild(template.content.cloneNode(true))

    }
    template = document.createElement('template')
    const optionContainer = wrapper.querySelector(`#options-${id}-wrapper`).parentElement
    optionContainer.classList.add('drag-option-built')
    optionContainer.setAttribute('draggable', 'true')
    optionContainer.setAttribute('ondragstart', 'LevelCreationTool.i.dragStartHandler(event)')
    optionContainer.setAttribute('id', `option-group-${id}`)

    template.innerHTML = LevelCreationTool.deleteOptBtn
    optionContainer.appendChild(template.content.cloneNode(true))
  }

  async selectListCreation(ev) {
    console.log(ev.target.parentElement)
    const optionList = ev.target.parentElement.children
    const template = document.createElement('template')
    template.innerHTML = Prognosis.playerSelectList
    .replace(/\[id\]/ig, 'idade')

    let obj = document.querySelector('#here-buddy')
    obj.appendChild(template.content.cloneNode(true))

    let selectList = document.querySelector('#idade')
    obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
    obj.prependTxt.copy = document.createElement('label')
    obj.prependTxt.copy.classList.add('input-group-text')
    obj.prependTxt.copy.textContent = 'Idade'
    obj.prependTxt.appendChild(obj.prependTxt.copy)

    for (let i = 0; i < optionList.length; i++) {
      if (optionList[i].classList.contains('option-list')) {
        console.log(optionList[i].innerHTML)
        let option = document.createElement('option')
        option.textContent = optionList[i].textContent + 'anos'
        option.value = optionList[i].textContent
        selectList.appendChild(option)
      }
    }
  }

  async protSelectList(wrapper, keyId, keyText, optionsList) {
    let template = document.createElement('template')
    let obj = document.querySelector('#options-'+ keyId+'-wrapper')

    template.innerHTML = Prognosis.playerSelectList
    .replace(/\[id\]/ig, (keyId))
    obj.appendChild(template.content.cloneNode(true))

    obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
    obj.prependTxt.copy = document.createElement('label')
    obj.prependTxt.copy.classList.add('input-group-text')
    obj.prependTxt.copy.innerText = keyText
    obj.prependTxt.appendChild(obj.prependTxt.copy)

    for (let z = 0; z < optionsList.length; z++) {

      //Check if select list must include id (because of complex values. e.g.(id'bilirrubina' value'3-4'), instead of just 'bilirrubina')
      if(1 ==2){
        let baseKey = selectedPacient[fnVariable].open[i][keyText]['values'][z]
        let valueText = optionsList[z].dataset.parentValue
        let value = optionsList[z].innerText

        const selectList = document.querySelector("#" + keyId)
        let option = document.createElement('option')
        option.innerText = valueText+': '+value
        option.value = value
        selectList.appendChild(option)
      }else{
        let value = optionsList[z].innerText
        const selectList = document.querySelector("#" + keyId)
        let option = document.createElement('option')
        option.innerText = value
        option.value = value
        selectList.appendChild(option)
      }
    }
  }

  async oneMoreToSelect (){
    let selectTitle = document.querySelector('#input-title-select-list').value
    let optionList = document.querySelectorAll('#select-list-creation-container > [id ^= "option-"] ')
    await this.createOption ((document.querySelector('#creation-dump')), true, selectTitle, 'idade')
    this.protSelectList((document.querySelector('#creation-dump')), 'idade', selectTitle, optionList)
  }
}


(function () {
  LevelCreationTool.i = new LevelCreationTool()
  LevelCreationTool.deleteOptBtn =`
  <button type="button" name="button" class="btn btn-danger btn-delete-option">X</button>`

})()
