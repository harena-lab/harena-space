class ReportManager {
  async start () {
    const logger = await this._requestLogger()
    console.log(logger)
    this._displayUserSummary(logger)
  }

  async _requestLogger () {
    const logger1 = await MessageBus.i.request('logger/list/get',
      {caseId: new URL(document.location).searchParams.get('id1'),
       startingDateTime: new URL(document.location).searchParams.get('start'),
       endingDateTime: new URL(document.location).searchParams.get('end')})
    if (logger1.message.error) {
      console.log('--- error')
      console.log(logger1.message.error)
      return null
    }
    const logger2 = await MessageBus.i.request('logger/list/get',
      {caseId: new URL(document.location).searchParams.get('id2'),
       startingDateTime: new URL(document.location).searchParams.get('start'),
       endingDateTime: new URL(document.location).searchParams.get('end')})
    if (logger2.message.error) {
      console.log('--- error')
      console.log(logger2.message.error)
      return null
    }
    return {message: {logs: logger1.message.logs.concat(logger2.message.logs)}}
  }

  // Function to process logs and generate user summary HTML
  _generateUserSummary(jsonData) {
    const addressMap = { // remote
      'e7451e3b-507e-472e-a092-4a2e1d56483d': 'nl/podcast',
      '9d86ae9a-d582-4f03-bce8-ac73250047cf': 'nl/text',
      'c087573d-0490-445d-ae5f-7d7f953aeaa8': 'en/podcast',
      '341986cd-4781-4027-8360-1112bfd07cf0': 'en/text',
      '14a3f09b-773b-49d9-808c-69b714c24251': 'nl/podcast',
      'cf9e88f2-08b3-4376-8872-88f1fde12ce1': 'nl/text',
      'fa56b36e-d22b-403c-a841-7ef2cae5e0bc': 'en/podcast',
      'd10263f3-e97c-4033-b7e4-087eeaab3e90': 'en/text'
    }

    // Parse the JSON if it's a string
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData
    const logs = data.message.logs
    
    // Object to store user information
    const userSummary = {}
    
    // Process each log entry
    for (const log of logs) {
      const userId = log.user_id;
      const username = log.username;
      const createdAt = new Date(log.created_at)
      
      // If this is the first entry for this user, initialize their record
      if (!userSummary[userId]) {
        userSummary[userId] = {
          username: username,
          caseType: addressMap[log.case_id],
          entryCount: 0,
          mostRecentDate: new Date(0), // Start with epoch time
          log: null,
          stage: ''
        }
      }
      
      // Update the user's entry count
      userSummary[userId].entryCount++

      if (userSummary[userId].log === null)
        userSummary[userId].log = log
      
      // Update the most recent date if this entry is newer
      if (createdAt > userSummary[userId].mostRecentDate) {
        userSummary[userId].mostRecentDate = createdAt
        userSummary[userId].log = log
      }
    }

    for (const userId in userSummary) {
      let recent = new Date(0)
      if (userSummary[userId].log !== null) {
        const parsedLog = JSON.parse(userSummary[userId].log.log)
        console.log(parsedLog)
        for (const kt of parsedLog.knotTrack) {
          const start = new Date(kt.timeStart)
          if (start > recent) {
            recent = start
            userSummary[userId].stage = kt.knotid
          }
        }
      }
    }

    // Convert the user summary object to an array
    const userSummaryArray = Object.values(userSummary)
    
    const order = new URL(document.location).searchParams.get('order') || 'date'
   
    // Sort users by mostRecentDate (optional)
    switch (order) {
      case 'date':
        userSummaryArray.sort((a, b) => b.mostRecentDate - a.mostRecentDate)
        break
      case 'name':
        userSummaryArray.sort((a, b) => a.username.localeCompare(b.username))
        break
      case 'stage':
        userSummaryArray.sort((a, b) => a.stage.localeCompare(b.stage))
        break
    }
    
    // Generate HTML
    let html = `
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 100%;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
      </style>
    </head>
    <body>
      <h1>User Activity Summary</h1>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Case</th>
            <th>Entries</th>
            <th>Stage</th>
            <th>Most Recent</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    html += `<tr><td colspan="5">Total: ${userSummaryArray.length}</td></tr>`
    
    // Add a row for each user
    for (const user of userSummaryArray) {
      const formattedDate = user.mostRecentDate.toLocaleString();
      html += `
          <tr>
            <td>${user.username}</td>
            <td>${user.caseType}</td>
            <td>${user.entryCount}</td>
            <td>${user.stage}</td>
            <td>${formattedDate}</td>
          </tr>
      `;
    }

    // Close the HTML
    html += `
        </tbody>
      </table>
    `;
    
    return html;
  }

  // Example usage:
  _displayUserSummary(jsonString) {
    const html = this._generateUserSummary(jsonString);
    
    const report = document.querySelector('#report-area');
    report.style.width = '100%';
    report.style.height = '500px';
    report.style.border = '1px solid #ddd';
    report.innerHTML = html
  }

  // Usage example (assuming the JSON is in a variable called 'jsonData'):
  // displayUserSummary(jsonData);
}

(() => {
  ReportManager.i = new ReportManager()
})()
