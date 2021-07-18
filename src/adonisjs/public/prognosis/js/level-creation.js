class LevelCreationTool {
  constructor(){
    this.pacient = Object.create(null)
    this.preStart = this.preStart.bind(this)
    MessageBus.int.subscribe('control/html/ready', this.preStart)
  }

  async preStart(){
    MessageBus.int.unsubscribe('control/html/ready', this.preStart)
    this.start()
  }

  async start(){

    const navSelection = document.querySelector('#creation-selection-tab').querySelectorAll('.nav-link')
    const fnCascadeListener = function(){
      const cascadeCheck = document.querySelector(`#chck-cascade-option`)
      const creationWrapper = document.querySelector('#creation-container-wrapper')
      const childCreation = document.querySelector('#child-creation-container')

      if (cascadeCheck.checked) {
        if (this.nodeName == 'A' && !this.classList.contains('cascade-nav')) {
          if (childCreation) {
            childCreation.remove()
          }
        }
        if(!childCreation){
          let template = document.createElement('template')
          template.innerHTML = LevelCreationTool.cascadeDiv
          creationWrapper.appendChild(template.content.cloneNode(true))
        }
      }else{
        if (childCreation) {
          childCreation.remove()
        }
      }

    }
    const fnBundleListener = function(){

      if(event.target.getAttribute('href') == '#bundle' || event.target.id == 'input-number-bundle'){
        let bundleQuant = document.querySelector('#input-number-bundle')
        let template = document.createElement('template')
        let creationContainer = document.querySelector('#creation-container-wrapper')
        let bundleContainers = document.querySelectorAll('[id^="creation-container-bundle-"]')

        if (bundleQuant.value > bundleContainers.length+1) {
          for (let i = 1; i <= (bundleQuant.value - (bundleContainers.length+1)); i++) {
            template = document.createElement('template')
            if(bundleContainers.length > 1){
              template.innerHTML = LevelCreationTool.bundleDiv
              .replace(/\[id\]/ig, bundleContainers.length+1)
            }else{
              template.innerHTML = LevelCreationTool.bundleDiv
              .replace(/\[id\]/ig, i)
            }
            creationContainer.appendChild(template.content.cloneNode(true))
          }
        }else if (bundleContainers.length == 0) {
          for (let i = 1; i < bundleQuant.value; i++) {
            template.innerHTML = LevelCreationTool.bundleDiv
            .replace(/\[id\]/ig, i)
            creationContainer.appendChild(template.content.cloneNode(true))
          }
        }else{
          bundleContainers = document.querySelectorAll('[id^="creation-container-bundle-"]')
          for (let i = bundleQuant.value; i >= ((bundleContainers.length)); i--) {
            bundleContainers[i-1].remove()
          }
        }

      }else{
        let bundleContainers = document.querySelectorAll('[id^="creation-container-bundle-"]')
        for (let i = 0; i < bundleContainers.length; i++) {
          bundleContainers[i].remove()
        }
      }
    }
    const fnBuildLvlListener = function(){
      let rootOption = document.querySelectorAll('.pacient-info-wrapper')
      function download(filename, text) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }



      for (let i = 0; i < rootOption.length; i++) {
        let optionsWrapperLocked = rootOption[i].querySelector('.pacient-info-values[data-progn="locked"]')
        let optionsWrapperOpen = rootOption[i].querySelector('.pacient-info-values[data-progn="open"]')
        let optionsLocked = optionsWrapperLocked.querySelectorAll('[id^="option-group-"]')
        let optionsOpen = optionsWrapperOpen.querySelectorAll('[id^="option-group-"]')
        let groupName = optionsWrapperOpen.dataset.optionName

        optionsWrapperLocked.prognObj = {'locked':[]}
        optionsWrapperOpen.prognObj = {'open':[]}
        for (let k = 0; k < optionsOpen.length; k++) {
          // console.log('============ open option '+k)
          if (optionsOpen[k].prognObj.bundleCreator) {
            // console.log('============ bundle found')
            // console.log(optionsOpen[k].prognObj.bundleCreator)
            optionsWrapperOpen.prognObj['open'].push(optionsOpen[k].prognObj.bundleCreator)
          }else{
            // console.log(optionsOpen[k].prognObj)
            optionsWrapperOpen.prognObj['open'].push(optionsOpen[k].prognObj)
          }
        }
        for (let k = 0; k < optionsLocked.length; k++) {
          // console.log('============ locked option '+k)
          // console.log(optionsLocked[k].prognObj)
          optionsWrapperLocked.prognObj['locked'].push(optionsLocked[k].prognObj)
        }
        // console.log('============ open obj')
        // console.log(optionsWrapperOpen.prognObj['open'])
        // console.log('============ locked obj')
        // console.log(optionsWrapperLocked.prognObj['locked'])
        optionsWrapperOpen.parentElement.prognObj = {}
        optionsWrapperOpen.parentElement.prognObj[groupName] = {
          "open": optionsWrapperOpen.prognObj['open'],
          "closed": optionsWrapperLocked.prognObj['locked']
        }
        let currentGroupOptions = optionsWrapperOpen.parentElement.prognObj[groupName]
        // console.log('============ current group')
        // console.log(groupName)
        // console.log(currentGroupOptions)
        LevelCreationTool.i.pacient[groupName] = currentGroupOptions
        // console.log('============ pacient')
        // console.log(LevelCreationTool.i.pacient)
      }
      download("prognLvl.json",JSON.stringify(LevelCreationTool.i.pacient))
    }
    document.querySelector(`#chck-cascade-option`).addEventListener('click', fnCascadeListener)
    document.querySelector(`#input-number-bundle`).addEventListener('change', fnBundleListener)

    // document.querySelector('#btn-build-lvl').addEventListener('click', fnBuildLvlListener)
    for (let nav of navSelection) {
      nav.addEventListener('click', fnCascadeListener)
      nav.addEventListener('click', fnBundleListener)
    }

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
    // console.log(Object.keys(options['pacient']))
    for (let i = 0; i < Object.keys(options['pacient']).length; i++) {
      let parentKey = Object.keys(options['pacient'])[i]
      let template = document.createElement('template')
      const optionListWrapper = document.querySelector('#option-list-wrapper')
      template.innerHTML = optionList
      .replace(/\[field\]/ig, parentKey)
      .replace(/\[id\]/ig, i)
      optionListWrapper.appendChild(template.content.cloneNode(true))
      for (let x = 0; x < Object.keys(options['pacient'][parentKey]['values']).length; x++) {
        let parentObj = document.querySelector(`#option-${i}`)
        let childValue = Object.keys(options['pacient'][parentKey]['values'])[x]
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

  async buildPacient (){
    let rootOption = document.querySelectorAll('.pacient-info-wrapper')
    function download(filename, text) {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }

    for (let i = 0; i < rootOption.length; i++) {
      let optionsWrapperLocked = rootOption[i].querySelector('.pacient-info-values[data-progn="locked"]')
      let optionsWrapperOpen = rootOption[i].querySelector('.pacient-info-values[data-progn="open"]')
      let optionsLocked = optionsWrapperLocked.querySelectorAll('[id^="option-group-"]')
      let optionsOpen = optionsWrapperOpen.querySelectorAll('[id^="option-group-"]')
      let groupName = optionsWrapperOpen.dataset.optionName

      optionsWrapperLocked.prognObj = {'locked':[]}
      optionsWrapperOpen.prognObj = {'open':[]}
      for (let k = 0; k < optionsOpen.length; k++) {
        // console.log('============ open option '+k)
        if (optionsOpen[k].prognObj.bundleCreator) {
          console.log('============ bundle found')
          console.log(optionsOpen[k].prognObj.bundleCreator)
          let bundle = optionsOpen[k].prognObj.bundleCreator
          for (let z = 0; z < Object.keys(bundle).length; z++) {
            console.log('============ keys')
            console.log(Object.keys(bundle)[z])
            let capsule = {}
            capsule[Object.keys(bundle)[z]] = bundle[Object.keys(bundle)[z]]
            optionsWrapperOpen.prognObj['open'].push(capsule)
            console.log('============ opening..')
            console.log(optionsWrapperOpen.prognObj['open'])
          }
        }else{
          // console.log(optionsOpen[k].prognObj)
          optionsWrapperOpen.prognObj['open'].push(optionsOpen[k].prognObj)
        }
      }
      for (let k = 0; k < optionsLocked.length; k++) {
        // console.log('============ locked option '+k)
        // console.log(optionsLocked[k].prognObj)
        optionsWrapperLocked.prognObj['locked'].push(optionsLocked[k].prognObj)
      }
      // console.log('============ open obj')
      // console.log(optionsWrapperOpen.prognObj['open'])
      // console.log('============ locked obj')
      // console.log(optionsWrapperLocked.prognObj['locked'])
      optionsWrapperOpen.parentElement.prognObj = {}
      optionsWrapperOpen.parentElement.prognObj[groupName] = {
        "open": optionsWrapperOpen.prognObj['open'],
        "closed": optionsWrapperLocked.prognObj['locked']
      }
      let currentGroupOptions = optionsWrapperOpen.parentElement.prognObj[groupName]
      // console.log('============ current group')
      // console.log(groupName)
      // console.log(currentGroupOptions)
      LevelCreationTool.i.pacient[groupName] = currentGroupOptions
      // console.log('============ pacient')
      // console.log(LevelCreationTool.i.pacient)
    }
    download("prognLvl.json",JSON.stringify(LevelCreationTool.i.pacient))
  }

  addPadding (obj, padding, isClass){
    if (isClass)
      obj.classList.add(padding)
    else
      obj.style.padding = padding
  }

  async createPrognSelectObj (htmlWrapper, objName, optionsList, includeParentTitle){

    let optionValues = []
    htmlWrapper['prognObj'] = {}
    htmlWrapper['prognObj'][objName] = {"selectList":"true"}

    for (let i = 0; i < optionsList.length; i++) {
      let valueText = optionsList[i].dataset.parentTitle
      let value = optionsList[i].innerText

      if(includeParentTitle && valueText){
        let rootObj = {}
        rootObj[valueText] = {}

        if (value != null || value != '') {
          if(value !== 'Sim' && value !== 'Não'){
            rootObj[valueText]['values'] = [value]
            optionValues.push(rootObj)
          }else if(!optionValues.includes(valueText)){
            optionValues.push(valueText)
          }
        }
      }else{
        if (value != null || value != '') {
          if(value !== 'Sim' && value !== 'Não'){
            optionValues.push(value)
          }else if(!optionValues.includes(valueText)){
            optionValues.push(valueText)
          }

        }
      }
      htmlWrapper['prognObj'][objName]['values'] = optionValues
    }
  }

  async createPrognRadioObj (htmlWrapper, objName, optionsList, properties){
    console.log('============ properties')
    console.log(properties)
    let optionValues = []
    let childOptionValues = []
    htmlWrapper['prognObj'] = {}
    if(properties['uniqueValues'] == 'true')
      htmlWrapper['prognObj'][objName] = {"uniqueValues":"true"}
    else if(properties['multipleValues'] == 'true')
      htmlWrapper['prognObj'][objName] = {"multipleValues":"true"}
    if(properties.cascade == 'true')
      htmlWrapper['prognObj'][objName]['cascade'] = "true"
    if(properties.radioYN == 'true')
      htmlWrapper['prognObj'][objName]['radioYN'] = "true"

    for (let i = 0; i < optionsList['parentValues'].length; i++) {
      let valueText = optionsList['parentValues'][i].dataset.parentTitle
      let value = optionsList['parentValues'][i].innerText
      if (value != null || value != '') {
        optionValues.push(value)
      }

      htmlWrapper['prognObj'][objName]['values'] = optionValues
    }
    for (let i = 0; i < optionsList['childValues'].length; i++) {
      let valueText = optionsList['childValues'][i].dataset.parentTitle
      let value = optionsList['childValues'][i].innerText
      if (value != null || value != '') {
        childOptionValues.push(value)
      }

      htmlWrapper['prognObj'][objName]['child'] = childOptionValues
    }
  }

  async createPrognBundleObj (htmlWrapper, objName, optionsList, properties){
    let optionValues = []
    let bundleOption = {}
    htmlWrapper['prognObj'] = {"bundleCreator":{}}
    for (let k = 0; k < Object.keys(optionsList).length; k++) {

      bundleOption[`${objName} ${k+1}`] = {"groupedChoices":"true"}
      optionValues = []
      for (let i = 0; i < optionsList[Object.keys(optionsList)[k]].length; i++) {
        let valueText = optionsList[Object.keys(optionsList)[k]][i].dataset.parentTitle
        let value = optionsList[Object.keys(optionsList)[k]][i].innerText
        if (valueText) {
          let parentOption = {}
          parentOption[valueText] = {"values":[value]}
          optionValues.push(parentOption)
        }else {
          optionValues.push(value)
        }

        bundleOption[`${objName} ${k+1}`]['values'] = optionValues
      }
    }
    htmlWrapper['prognObj']['bundleCreator'] = bundleOption
    // console.log(htmlWrapper)
  }

  /* async createPrognRadioObj (htmlWrapper, objName, optionsList, properties){
  //   let optionValues = []
  //   let childOptionValues = []
  //   htmlWrapper['prognObj'] = {}
  //   htmlWrapper['prognObj'][objName] = {"multipleValues":"true"}
  //
  //   for (let i = 0; i < optionsList['parentValues'].length; i++) {
  //     let valueText = optionsList['parentValues'][i].dataset.parentTitle
  //     let value = optionsList['parentValues'][i].innerText
  //     if (value != null || value != '') {
  //       optionValues.push(value)
  //     }
  //
  //     htmlWrapper['prognObj'][objName]['values'] = optionValues
  //   }
}*/

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
    let currentTarget = ev.currentTarget
    let objData = document.querySelector(`#${data}`)
    console.log('============ data '+ data)
    if(currentTarget.classList.contains('drop-container')){
      if(objData.parentElement.childElementCount == 1 && objData.parentElement.id!= 'creation-dump')
        this.addPadding(objData.parentElement, 'pb-5',true)
      currentTarget.appendChild(objData)
      currentTarget.classList.remove('pb-5')
    }

    ////////////////////////////////////////////////////////////////////////////////////////////
    /*if (target.classList.contains('pancient-info-values')){
      let optionBuilt = document.querySelector(`#${data}`)
      optionBuilt['prognObj'] = {}
      if (optionBuilt.querySelector('select')) {
        let selectOptions = optionBuilt.querySelectorAll('select > option')
        let optionValues = []
        console.log('============ select list found')
        for (let i = 0; i < selectOptions.length; i++) {
          if(selectOptions[i].value != '')
          optionValues.push(selectOptions[i].value)
        }
        optionBuilt['prognObj'][target.dataset.optionName] = {"selectList":"true"}
        optionBuilt['prognObj'][target.dataset.optionName]['values'] = optionValues
        console.log('============ select list object')
        console.log(optionBuilt)

      }
    }*/
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
    //////////////////////////////////////////////////////////////////////////
    let optionCreated = document.querySelector(`#option-group-${id}`)
  }

  async selectListCreator(wrapper, keyId, keyText, optionsList, includeParent) {
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

    this.createPrognSelectObj (obj.parentElement, keyText, optionsList, includeParent)

    optionsList[0].parentElement.classList.add('pb-5')
    for (let z = 0; z < optionsList.length; z++) {
      let valueText = optionsList[z].dataset.parentTitle
      let value = optionsList[z].innerText
      //Check if select list must include id (because of complex values. e.g.(id'bilirrubina' value'3-4'), instead of just 'bilirrubina')
      if(includeParent && valueText){
        const selectList = document.querySelector("#" + keyId)
        let option = document.createElement('option')
        option.value = value

        if(valueText != null || valueText != ''){
          if (value == 'Sim' || value == 'Não') {
            option.innerText = valueText
            option.value = valueText
            if(!selectList.querySelector(`[value="${valueText}"]`)){
              selectList.appendChild(option)
            }
          }else {
            option.innerText = valueText+': '+value
            selectList.appendChild(option)
          }
        }
        else{
          option.innerText = value
          selectList.appendChild(option)
        }

      }else{
        const selectList = document.querySelector("#" + keyId)
        let option = document.createElement('option')

        if(value == 'Sim' || value == 'Não'){
          option.innerText = valueText
          option.value = valueText
          if(!selectList.querySelector(`[value="${valueText}"]`)){
            selectList.appendChild(option)
          }
        }else {
          option.innerText = value
          option.value = value
          selectList.appendChild(option)
        }
      }
      optionsList[z].remove()

    }
  }

  async radioCreator(wrapper, keyId, keyText, optionsList, properties) {
    let template = document.createElement('template')
    let obj = document.querySelector('#options-'+ keyId+'-wrapper')
    optionsList['parentValues'][0].parentElement.classList.add('pb-5')
    obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
    obj.prependTxt.copy = document.createElement('label')
    obj.prependTxt.copy.classList.add('input-group-text')
    obj.prependTxt.copy.textContent = keyText
    obj.prependTxt.appendChild(obj.prependTxt.copy)
    ///////////////////////////////////////////////////////////////////////////////
    if(properties['radioYN'] == 'true'){
      template = document.createElement('template')
      template.innerHTML = Prognosis.playerOptionRadio
      .replace(/\[id\]/ig, keyId+'-nao')
      .replace(/\[name\]/ig, keyId)
      .replace(/\[value\]/ig, 'Não')
      .replace(/\[valueText\]/ig, 'Não')
      obj.appendChild(template.content.cloneNode(true))

      template = document.createElement('template')
      template.innerHTML = Prognosis.playerOptionRadio
      .replace(/\[id\]/ig, keyId+'-sim')
      .replace(/\[name\]/ig, keyId)
      .replace(/\[value\]/ig, 'Sim')
      .replace(/\[valueText\]/ig, 'Sim')
      obj.appendChild(template.content.cloneNode(true))
    }
    ///////////////////////////////////////////////////////////////////////////////
    let cascadeDiv = document.createElement('div')
    if (properties['radioYN'] == 'true' || properties['cascade'] == 'true') {
      cascadeDiv.id = `${keyId}-wrapper`
      cascadeDiv.classList.add('progn-multi-wrapper', 'border', 'rounded')
      cascadeDiv.style.backgroundColor = "#b5b5b5"
      obj.appendChild(cascadeDiv)
    }

    ///////////////////////////////////////////////////////////////////////////////
    for (let z = 0; z < optionsList['parentValues'].length; z++) {
      let value = optionsList['parentValues'][z].innerText
      template = document.createElement('template')
      if(properties['uniqueValues'] == 'true'){
        template.innerHTML = Prognosis.playerOptionRadio
        .replace(/\[name\]/ig, keyId)
        .replace(/\[id\]/ig, (keyId+'-'+Prognosis.i.removeAccent(value)))
        .replace(/\[value\]/ig, (value))
        .replace(/\[valueText\]/ig, value)
      }else if(properties['multipleValues'] == 'true'){
        template.innerHTML = Prognosis.playerOptionCheckbox
        .replace(/\[id\]/ig, keyId)
        .replace(/\[value\]/ig, value)
        .replace(/\[valueText\]/ig, value)
      }
      if(properties['cascade'] == 'true' || properties['radioYN'] == 'true'){
        document.querySelector(`#${cascadeDiv.id}`).appendChild(template.content.cloneNode(true))
      }else{
        obj.appendChild(template.content.cloneNode(true))
      }

      optionsList['parentValues'][z].remove()

    }
    this.createPrognRadioObj (obj.parentElement, keyText, optionsList, properties)
    ///////////////////////////////////////////////////////////////////////////////
    if(properties.cascade == 'true'){
      optionsList['childValues'][0].parentElement.classList.add('pb-5')
      let cascadeDivChild = document.createElement('div')
      cascadeDivChild.id = `${keyId}-value-wrapper`
      cascadeDivChild.classList.add('progn-multi-wrapper','border', 'rounded')
      cascadeDivChild.style.backgroundColor = "#cebfbf"
      cascadeDiv.appendChild(cascadeDivChild)
      for (let z = 0; z < optionsList['childValues'].length; z++) {
        let childText = optionsList['childValues'][z].innerText
        let childId = Prognosis.i.removeAccent(childText).replace(new RegExp('[ ]','ig'), '-')
        if(properties['uniqueValues'] == 'true'){
          template = document.createElement('template')
          template.innerHTML = Prognosis.playerOptionRadio
          .replace(/\[id\]/ig, childId)
          .replace(/\[name\]/ig, childId+'-value')
          .replace(/\[valueText\]/ig, childText)
          document.querySelector(`#${cascadeDivChild.id}`).appendChild(template.content.cloneNode(true))

        }else if(properties['multipleValues'] == 'true'){
          template = document.createElement('template')
          template.innerHTML = Prognosis.playerOptionCheckbox
          .replace(/\[id\]/ig, childId)
          .replace(/\[value\]/ig, childText)
          .replace(/\[valueText\]/ig, childText)
          document.querySelector(`#${cascadeDivChild.id}`).appendChild(template.content.cloneNode(true))
        }
        optionsList['childValues'][z].remove()
      }
    }
  }

  async bundleCreator(wrapper, keyId, keyText, optionsList, properties) {
    let obj = document.querySelector(`#options-${keyId}-wrapper`)
    this.createPrognBundleObj(obj.parentElement, keyText, optionsList, properties)
    for (let i = 1; i <= Object.keys(optionsList).length; i++) {
      let template = document.createElement('template')

      template.innerHTML = Prognosis.playerGroupedOption
      .replace(/\[id\]/ig, (`${keyId}-${i}`))
      .replace(/\[prependText\]/ig, (`${keyText} ${i}`))
      .replace(/\[name\]/ig, (keyId.substring(0,8)+'-activator'))
      obj.appendChild(template.content.cloneNode(true))

      let fnGroupActivator = function (){
        let groupValues = document.querySelectorAll(`[id^="options-"] > .input-group >
        [id^="grouped-"] > div > input`)
        for (let elem of groupValues) {
          let parentActivator = elem.parentElement.parentElement.id
          elem.checked = document.querySelector(`#${parentActivator.substring(8,(parentActivator.length - 8))}`).checked
        }
      }
      // console.log('============')
      // console.log(`#${keyId}-${i}`)
      // console.log(optionsList)
      document.querySelector(`#${keyId}-${i}`).addEventListener('change', fnGroupActivator)
      ///////////////////////////////////////////////////////////////////////////////
      let currentBundle = optionsList[Object.keys(optionsList)[i-1]]
      currentBundle[0].parentElement.classList.add('pb-5')
      for (let k = 0; k < currentBundle.length; k++) {
        let baseKey = currentBundle[k]
        let valueText = baseKey.dataset.parentTitle
        let valueId
        if(valueText)
        valueId = Prognosis.i.removeAccent(valueText).replace(new RegExp('[ ]','ig'), '-')
        let value = baseKey.innerText

        template = document.createElement('template')
        if(valueText){
          template.innerHTML = Prognosis.playerOptionRadio
          .replace(/\[valueText\]/ig, valueText+`: ${value}`)
          .replace(/\[value\]/ig, value)
          .replace(/\[id\]/ig, valueId)
          .replace(/\[name\]/ig, valueId)
        }
        else {
          template.innerHTML = Prognosis.playerOptionRadio
          .replace(/\[valueText\]/ig, value)
          .replace(/\[value\]/ig, value)
          .replace(/\[id\]/ig, valueId)
          .replace(/\[name\]/ig, valueId)
        }
        let optionsWrapper = obj.querySelector(`#grouped-${keyId}-${i}-wrapper`)
        optionsWrapper.appendChild(template.content.cloneNode(true))
        document.querySelector('#'+valueId).removeAttribute('required')
        currentBundle[k].remove()
      }
    }
  }

  async checkListCreator(wrapper, keyId, keyText, optionsList, properties) {

    let template = document.createElement('template')
    let obj = document.querySelector('#options-'+ keyId+'-wrapper')
    optionsList['parentValues'][0].parentElement.classList.add('pb-5')
    obj.prependTxt = obj.parentElement.querySelector('.input-group-prepend')
    obj.prependTxt.copy = document.createElement('label')
    obj.prependTxt.copy.classList.add('input-group-text')
    obj.prependTxt.copy.textContent = keyText
    obj.prependTxt.appendChild(obj.prependTxt.copy)
    ///////////////////////////////////////////////////////////////////////////////
    for (let z = 0; z < optionsList['parentValues'].length; z++) {
      let value = optionsList['parentValues'][z].innerText
      template = document.createElement('template')
      template.innerHTML = Prognosis.playerOptionCheckbox
      .replace(/\[id\]/ig, keyId)
      .replace(/\[value\]/ig, value)
      .replace(/\[valueText\]/ig, value)
      obj.appendChild(template.content.cloneNode(true))

      optionsList['parentValues'][z].remove()

    }
  }

  async createSelectList (){
    let selectTitle = document.querySelector('#input-title-option').value
    if(document.querySelector('#'+Prognosis.i.removeAccent(selectTitle))) {
      let newTitle = prompt("Nome da opção duplicado, digite outro valor")

      if (Prognosis.i.removeAccent(newTitle) != Prognosis.i.removeAccent(selectTitle)) {
        selectTitle = newTitle
      }
    }
    let selectId = Prognosis.i.removeAccent(selectTitle)
    let optionsList = document.querySelectorAll('#creation-container > [id ^= "option-"] ')
    let insertParentName = document.querySelector('#chck-select-parent-name').checked
    await this.createOption ((document.querySelector('#creation-dump')), true, selectTitle, selectId)
    this.selectListCreator((document.querySelector('#creation-dump')), selectId, selectTitle, optionsList, insertParentName)
  }

  async createRadio (){

    let selectTitle = document.querySelector('#input-title-option').value

    if(document.querySelector('#'+Prognosis.i.removeAccent(selectTitle))) {
      let newTitle = prompt("Nome da opção duplicado, digite outro valor")

      if (Prognosis.i.removeAccent(newTitle) != Prognosis.i.removeAccent(selectTitle)) {
        selectTitle = newTitle
      }
    }
    let selectId = Prognosis.i.removeAccent(selectTitle)

    let optionsList = {}
    optionsList['parentValues'] = document.querySelectorAll('#creation-container > [id ^= "option-"] ')
    optionsList['childValues'] = document.querySelectorAll('#child-creation-container > [id ^= "option-"] ')
    let insertParentName = document.querySelector('#chck-select-parent-name').checked
    let cascade = document.querySelector('#chck-cascade-option').checked
    let insertRadioYN = document.querySelector('#chck-radioyn-option').checked
    let isChecklist = document.querySelector('#option-checklist').checked
    let isRadio = document.querySelector('#option-radio').checked
    let properties = {
      "parentName":`${insertParentName}`,
      "cascade":`${cascade}`,
      "radioYN":`${insertRadioYN}`,
      "multipleValues":`${isChecklist}`,
      "uniqueValues":`${isRadio}`
    }
    await this.createOption ((document.querySelector('#creation-dump')), true, selectTitle, selectId)
    this.radioCreator((document.querySelector('#creation-dump')), selectId, selectTitle, optionsList, properties)
  }

  async createBundle (){
    let selectTitle = document.querySelector('#input-title-option').value
    if(document.querySelector('#'+Prognosis.i.removeAccent(selectTitle))) {
      let newTitle = prompt("Nome da opção duplicado, digite outro valor")

      if (Prognosis.i.removeAccent(newTitle) != Prognosis.i.removeAccent(selectTitle)) {
        selectTitle = newTitle
      }
    }
    let selectId = Prognosis.i.removeAccent(selectTitle)
    let optionsList = {}
    let numBundles = document.querySelector('#input-number-bundle').value
    for (let i = 1; i <= numBundles; i++) {
      if (i==1)
        optionsList[`${selectTitle} ${i}`] = document.querySelectorAll(`#creation-container > [id ^= "option-"]`)
      else
        optionsList[`${selectTitle} ${i}`] = document.querySelectorAll(`#creation-container-bundle-${i-1} > [id ^= "option-"]`)
    }
    let insertParentName = document.querySelector('#chck-select-parent-name').checked

    let properties = {"parentName":`${insertParentName}`,"groupedChoices":'true'}
    await this.createOption ((document.querySelector('#creation-dump')), true, selectTitle, selectId)
    this.bundleCreator((document.querySelector('#creation-dump')), selectId, selectTitle, optionsList, properties)


  }

  async createCheckList (){
    let selectTitle = document.querySelector('#input-title-option').value
    if(document.querySelector('#'+Prognosis.i.removeAccent(selectTitle))) {
      let newTitle = prompt("Nome da opção duplicado, digite outro valor")

      if (Prognosis.i.removeAccent(newTitle) != Prognosis.i.removeAccent(selectTitle)) {
        selectTitle = newTitle
      }
    }
    let selectId = Prognosis.i.removeAccent(selectTitle)
    let optionsList = {}
    optionsList['parentValues'] = document.querySelectorAll('#creation-container > [id ^= "option-"] ')
    let insertParentName = document.querySelector('#chck-select-parent-name').checked
    let properties = {"parentName":`${insertParentName}`}
    await this.createOption ((document.querySelector('#creation-dump')), true, selectTitle, selectId)
    this.checkListCreator((document.querySelector('#creation-dump')), selectId, selectTitle, optionsList, properties)


  }

}

(function () {
  LevelCreationTool.i = new LevelCreationTool()

  LevelCreationTool.deleteOptBtn =`
  <button type="button" name="button" class="btn btn-danger btn-delete-option">X</button>`
  LevelCreationTool.cascadeDiv = `
  <div class="col h-100 border rounded pb-5 pt-1 drop-container" style="background-color:#cebfbf;"
  id="child-creation-container"
  ondrop="LevelCreationTool.i.drop_handler(event)" ondragover="LevelCreationTool.i.dragover_handler(event)">
  </div>`
  LevelCreationTool.bundleDiv = `
  <div class="col h-100 border rounded pb-5 pt-1 drop-container" style="background-color:#cebfbf;"
  id="creation-container-bundle-[id]"
  ondrop="LevelCreationTool.i.drop_handler(event)" ondragover="LevelCreationTool.i.dragover_handler(event)">
  </div>`

})()
