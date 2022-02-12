class UsersCSVManager {
  start () {
    this._updateCSV = this._updateCSV.bind(this)
    MessageBus.i.subscribe('table/updated', this._updateCSV)
    this._addUsers = this._addUsers.bind(this)
    MessageBus.i.subscribe('/adm/add/users', this._addUsers)
  }

  _updateCSV (topic, message) {
    console.log('===== CSV received')
    console.log(message)
    this._table = message.table
  }

  async _addUsers (topic, message) {
    let nameC = -1
    let emailC = -1
    let schema = this._table[0]
    for (let s in schema) {
      switch (schema[s].toLowerCase()) {
        case 'nome':
        case 'name': nameC = s; break;
        case 'e-mail':
        case 'email': emailC = s; break;
      }
    }
    if (nameC > -1 && emailC > -1) {
      for (let line = 1; line < this._table.length; line++) {
        if (this._table[line][emailC]) {
          let lp = this._table[line][emailC].substring(0, this._table[line][emailC].indexOf('@'))
          console.log('========== creating user ==========')
          let user = await MessageBus.i.request('user/create/post',
            {
              username: this._table[line][nameC],
              email: this._table[line][emailC],
              password: lp,
              login: this._table[line][emailC],
              institution: new URL(document.location).searchParams.get('institution'),
              grade: new URL(document.location).searchParams.get('grade')
            }
          )
          if (user.message.error) {
            console.log('--- error')
            console.log(user.message.error)
          } else {
            console.log(user.message.username)
            console.log(user.message.id)
            let role = await MessageBus.i.request('link/role/post',
              {
                userId: user.message.id,
                roleId: new URL(document.location).searchParams.get('role')
              }
            )
            if (role.message.error) {
              console.log('--- error')
              console.log(role.message.error)
            } else {
              console.log('--- link role success')
              let group = await MessageBus.i.request('link/group/post',
                {
                  userId: user.message.id,
                  groupId: new URL(document.location).searchParams.get('group')
                }
              )
              if (group.message.error) {
                console.log('--- error')
                console.log(group.message.error)
              } else
                console.log('--- link group success')
            }
          }
        }
      }
    }
  }
}

(function () {
  UsersCSVManager.i = new UsersCSVManager()
})()
