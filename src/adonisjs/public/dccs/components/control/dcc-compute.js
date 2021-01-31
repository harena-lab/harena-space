/* Compute DCC
 *************/
class DCCCompute extends DCCBase {
  constructor () {
    super()
  }

  async connectedCallback () {
    super.connectedCallback()

    if (this.hasAttribute('id')) {
      this.update = this.update.bind(this)
      MessageBus.page.provides(this.id, 'compute/update', this.update)
    }

    this._compiled = null
    if (this.hasAttribute('expression')) {
      this._compiled =
        DCCCompute.compileStatementSet(this.expression.toLowerCase())
      if (this._compiled != null && this.onload)
        await DCCCompute.computeExpression(this._compiled, true)
    }

    /*
    if (this.hasAttribute('expression')) {
      if (this.expression == 'case=0') {
        MessageBus.ext.publish('case/completed', '')
      } else {
        const trans = /(\w+)?[ \t]*([+\-/=])[ \t]*(\d+(?:\.\d+)?)/im
        const elements = trans.exec(this.expression)

        const variable = elements[1]
        const operation = elements[2]
        const value = parseInt(elements[3])

        let varValue = value
        if (operation != '=') {
          const varM = await MessageBus.ext.request('var/' + variable + '/get')
          varValue = parseInt(varM.message)

          switch (operation) {
            case '+': varValue += value; break
            case '-': varValue -= value; break
            case '*': varValue *= value; break
            case '/': varValue /= value; break
          }
        }

        MessageBus.ext.publish('var/' + variable + '/set', varValue)
      }
    }
    */
  }

  /*
    * Property handling
    */

  static get observedAttributes () {
    return DCCBase.observedAttributes.concat(['expression', 'onload'])
  }

  get expression () {
    return this.getAttribute('expression')
  }

  set expression (newValue) {
    this.setAttribute('expression', newValue)
  }

  get onload () {
    return this.hasAttribute('onload')
  }

  set onload (isOnload) {
    if (isOnload) { this.setAttribute('onload', '') } else { this.removeAttribute('onload') }
  }

  notify (topic, message) {
    if (message.role && message.role.toLowerCase() == 'update')
      this.update()
  }

  update() {
    console.log('=== update compute')
    DCCCompute.computeExpression(this._compiled, true)
  }

  /*
    * Static Expression Processing Methods
    */

  /*
    * Computes a expression that comes as object
    *
    * {
    *   type: <type of the expression>,
    *   <properties according to the type>
    * }
    */
  static computeExpressionObj (expression) {
    switch (expression.type) {
      case 'divert-script':
        let message
        if (expression.target.startsWith('Case.'))
          { message = 'case/' + expression.target.substring(5) + '/navigate' }
        else
          { message = 'knot/' + expression.target + '/navigate' }
        if (expression.parameter) {
          MessageBus.ext.publish(message, expression.parameter)
        } else {
          MessageBus.ext.publish(message) }
        break
    }
  }

  static compileStatementSet (statementSet) {
    const statementLines = statementSet.split(/;\r?\n?|\r?\n/)
    const compiledSet = []
    for (const l of statementLines) { compiledSet.push(DCCCompute.compileStatement(l)) }
    return compiledSet
  }

  static compileStatement (statement) {
    const compiled = []
    const assign = statement.match(DCCCompute.assignment)
    if (assign != null) {
      compiled[0] = assign[1].trim()
      compiled[1] =
            DCCCompute.compileExpression(statement.substring(assign[0].length))
    } else {
      compiled[0] = null
      compiled[1] = DCCCompute.compileExpression(statement)
    }
    return compiled
  }

  /*
    * Compiles an expression and converts it to a polish reverse notation
    * * caseSensitive - converts all field in lower case
    *                   (avoid transformations during its execution)
    */
  static compileExpression (expression) {
    const compiled = []
    const stack = []
    let mdfocus = expression
    let matchStart
    do {
      matchStart = -1
      let selected = ''
      for (const el in DCCCompute.element) {
        const pos = mdfocus.search(DCCCompute.element[el])
        if (pos > -1 && (matchStart == -1 || pos < matchStart)) {
          selected = el
          matchStart = pos
        }
      }
      if (matchStart > -1) {
        const matchContent = mdfocus.match(DCCCompute.element[selected])[0]

        switch (selected) {
          case 'number':
            compiled.push([DCCCompute.role.number,
              (matchContent.includes('.'))
                ? parseFloat(matchContent) : parseInt(matchContent)])
            break
          case 'arithmetic':
            const pri = DCCCompute.precedence[matchContent]
            while (stack.length > 0 && pri <= stack[stack.length - 1][1]) { compiled.push([DCCCompute.role.arithmetic, stack.pop()[0]]) }
            stack.push([matchContent, pri])
            break
          case 'power':
            stack.push([matchContent, DCCCompute.precedence[matchContent]])
            break
          case 'openParentheses':
            stack.push([matchContent, DCCCompute.precedence[matchContent]])
            break
          case 'closeParentheses':
            while (stack.length > 0 && stack[stack.length - 1][0] != '(') { compiled.push([DCCCompute.role.arithmetic, stack.pop()[0]]) }
            if (stack.length > 0) {
              stack.pop()
              if (stack.length > 0 && stack[stack.length - 1][1] ==
                           DCCCompute.precedence.function) {
                const label = stack.pop()[0]
                compiled.push([DCCCompute.role.function, label])
              }
            }
            break
          case 'variable':
            compiled.push([DCCCompute.role.variable, matchContent, 0])
            break
          case 'function':
            stack.push([matchContent, DCCCompute.precedence.function])
            break
        }

        const matchSize = matchContent.length
        if (matchStart + matchSize >= mdfocus.length) { matchStart = -1 } else { mdfocus = mdfocus.substring(matchStart + matchSize) }
      }
    } while (matchStart > -1)
    const size = stack.length
    for (let s = 0; s < size; s++) {
      const op = stack.pop()
      compiled.push([(op[1] == DCCCompute.precedence.function)
        ? DCCCompute.role.function : DCCCompute.role.arithmetic, op[0]])
    }
    return compiled
  }

  /*
   * Computes a set of expressions, updating variables.
   * It returns the value of the last variable.
   */
  static async computeExpression (compiledSet, autoAssign) {
    let result = null
    for (let s of compiledSet) {
      await DCCCompute.updateVariables(s[1])
      if (s[0] != null) {
        result = DCCCompute.computeCompiled(s[1])
        await MessageBus.ext.request('var/' + s[0] + '/set', result)
      } else if (compiledSet.length == 1) {
        result = DCCCompute.computeCompiled(s[1])
        // looks for a variable inside the expression
        if (autoAssign) {
          let variable = s[1].find(el => el[0] == 3)
          if (variable)
            await MessageBus.ext.request('var/' + variable[1] + '/set', result)
        }
      }
    }
    return result
  }

  static filterVariables (compiledSet) {
    let variables = []
    for (let s of compiledSet) {
      for (let c of s[1])
        if (c[0] == DCCCompute.role.variable && !variables.includes(c[1]))
          variables.push(c[1])
    }
    return variables
  }

  static async updateVariables (compiled) {
    for (let c of compiled)
      if (c[0] == DCCCompute.role.variable) {
        if (MessageBus.ext.hasSubscriber('var/' + c[1] + '/get')) {
          const mess = await MessageBus.ext.request('var/' + c[1] + '/get')
          if (mess.message != null) {
            const value = (mess.message.body != null)
              ? mess.message.body : mess.message
            c[2] = Number(value)
            if (isNaN(c[2]))
              c[2] = value
          }
        }
      }
  }

  /*
   Computes a single compiled expression - without updating variables.
   number: 1
   arithmetic: 2
   variable: 3
   function: 4
   */
  static computeCompiled (compiled) {
    const stack = []
    for (const c of compiled) {
      switch (c[0]) {
        case 1: stack.push(c[1]); break
        case 2: const b = stack.pop()
          const a = stack.pop()
          switch (c[1]) {
            case '+': stack.push(a + b); break
            case '-': stack.push(a - b); break
            case '*': stack.push(a * b); break
            case '/': stack.push(a / b); break
            case '^': stack.push(Math.pow(a, b)); break
          }
          break
        case 3: stack.push(c[2]); break
        case 4: switch (c[1]) {
          case 'sin':
            stack.push(
              Math.round(
                Math.sin(stack.pop() / 180 * Math.PI) * 1000) / 1000)
            break
          case 'cos':
            stack.push(
              Math.round(
                Math.cos(stack.pop() / 180 * Math.PI) * 1000) / 1000)
            break
          case 'sqrt':
            stack.push(Math.sqrt(stack.pop()))
            break
        }
      }
    }
    return stack.pop()
  }
}

(function () {
  DCCCompute.elementTag = 'dcc-compute'
  customElements.define(DCCCompute.elementTag, DCCCompute)

  DCCCompute.role = {
    number: 1,
    arithmetic: 2,
    variable: 3,
    function: 4
  }

  DCCCompute.precedence = {
    '(': 1,
    '-': 2,
    '+': 2,
    '/': 3,
    '*': 3,
    '^': 4,
    function: 5
  }

  DCCCompute.element = {
    number: /([\d]*\.[\d]+)|([\d]+)/im,
    arithmetic: /[\+\-*/]/im,
    power: /\^/im,
    openParentheses: /\(/im,
    closeParentheses: /\)/im,
    function: /[\w \t\.]+(?=\()/im,
    variable: /[\w \t\.]+(?!\()/im
  }

  DCCCompute.assignment = /([\w \t\.]+)=/im
})()
