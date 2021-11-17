const express = require('express')
const app = express()
const port = 3000

// You can require your own code as well...
const funcs = require('./src/funcs.js')
const user = require('./src/users')

// Tell Express to server HTML, JS, CSS etc from the public/ folder
// See: http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))
app.use(express.json())

// Our API routes will be here
app.get('/api/hello', function (req, res) {
  // Return the response by calling our function
  res.send(funcs.myFunction());
})

app.post('/api/login', function (req, res) {

  // funcs.checkLogin(req.body.user, req.body.pass)
  //res.send(JSON.stringify(funcs.checkLogin(req.body.user, req.body.pass)));
  user.login(req.body.username, req.body.password, result => {

    //if result is undefined
    if (!result) {
      result = false
    }

    res.json({token: result.token, username: result.username})
  })
})

// Tell us where we're running from
console.log("Server running on http://localhost:" + port)
app.listen(port)

