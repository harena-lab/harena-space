class ReportManager {
  async start () {
    const logger = await this._requestLogger()
    console.log(logger)
    this._displayUserSummary(logger)
  }

  async _requestLogger () {
    const logger = await MessageBus.i.request('logger/list/get',
      {caseId: new URL(document.location).searchParams.get('id'),
       startingDateTime: new URL(document.location).searchParams.get('start'),
       endingDateTime: new URL(document.location).searchParams.get('end')})
    if (logger.message.error) {
      console.log('--- error')
      console.log(logger.message.error)
      return null
    }
    return logger
  }

  // Function to process logs and generate user summary HTML
  _generateUserSummary(jsonData) {
    // Parse the JSON if it's a string
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    const logs = data.message.logs;
    
    // Object to store user information
    const userSummary = {};
    
    // Process each log entry
    logs.forEach(log => {
      const userId = log.user_id;
      const username = log.username;
      const createdAt = new Date(log.created_at);
      
      // If this is the first entry for this user, initialize their record
      if (!userSummary[userId]) {
        userSummary[userId] = {
          userId: userId,
          username: username,
          entryCount: 0,
          mostRecentDate: new Date(0) // Start with epoch time
        };
      }
      
      // Update the user's entry count
      userSummary[userId].entryCount++;
      
      // Update the most recent date if this entry is newer
      if (createdAt > userSummary[userId].mostRecentDate) {
        userSummary[userId].mostRecentDate = createdAt;
      }
    });
    
    // Convert the user summary object to an array
    const userSummaryArray = Object.values(userSummary);
    
    // Sort users by username (optional)
    userSummaryArray.sort((a, b) => a.username.localeCompare(b.username));
    
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
            <th>Username</th>
            <th>User ID</th>
            <th>Entry Count</th>
            <th>Most Recent Activity</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    // Add a row for each user
    userSummaryArray.forEach(user => {
      const formattedDate = user.mostRecentDate.toLocaleString();
      html += `
          <tr>
            <td>${user.username}</td>
            <td>${user.userId}</td>
            <td>${user.entryCount}</td>
            <td>${formattedDate}</td>
          </tr>
      `;
    });
    
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
