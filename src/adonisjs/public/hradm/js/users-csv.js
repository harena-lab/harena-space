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
    if (message.value) {
      const parameters = message.value
      console.log('===== user parameters')
      console.log(parameters)
      for (let line = 1; line < this._table.length; line++) {
      if (this._table[line][2]) {
        let lp = this._table[line][2].substring(0, this._table[line][2].indexOf('@'))
        console.log('========== creating user ==========')
        let user = await MessageBus.i.request('user/create/post',
          {
            username: this._table[line][1],
            email: this._table[line][2],
            password: lp,
            login: lp,
            institution: parameters.institution,
            grade: parameters.grade
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
              roleId: parameters.role
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
                groupId: parameters.group
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
