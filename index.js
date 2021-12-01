const express = require('express')
const app = express()
const port = 3000

// You can require your own code as well...
const funcs = require('./src/funcs.js')
const user = require('./src/users')
const posts = require('./src/posts')
const { title } = require('process')

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
  user.login(req.body.username, req.body.password, result => {

    //if result is undefined
    if (!result) {
      result = false
    }

    res.json({token: result.token, username: result.username}) //sends response
  })
})

app.post('/api/getPost', function (req, res) { //api to get posts
  posts.getPost(req.body.post_id, result => {
    res.json({post_id: result.post_id, title: result.title, body: result.body})
  })
})

app.post('/api/newPost', function (req, res) {
  posts.newPost(req.body.postTitle, req.body.postBody, req.body.userId, result => {
    res.json(true)
  })
})

// Tell us where we're running from
console.log("Server running on http://localhost:" + port)
app.listen(port)

