const express = require('express')
const app = express()
const port = 3000

// You can require your own code as well...
const funcs = require('./src/funcs.js')
const user = require('./src/users')
const posts = require('./src/posts')
const { title } = require('process')
const { findByToken } = require('./src/users')
const users = require('./src/users')

// Tell Express to server HTML, JS, CSS etc from the public/ folder
// See: http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))
app.use(express.json())

// Our API routes will be here
app.get('/api/hello', function (req, res) {
  // Return the response by calling our function
  res.send(funcs.myFunction())
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

app.post('/api/newUser', function (req, res) {
  users.newUser(req.body.username, req.body.password, result => {
    res.json(true)
  })
})

app.post('/api/getPost', function (req, res) { //api to get posts
  posts.getPost(req.body.post_id, result => {
    res.json({post_id: result.post_id, title: result.title, body: result.body})
  })
})

app.get('/api/posts', (req, res) => {
  let limit = 5
  let offset = req.query.offset

  posts.getPosts(offset, limit, (result) => {
    res.json(result)
  })
})

app.get('/api/oldestPost', (req, res) => {
  posts.oldestPost( result => {
    res.json(result)
  })
})

app.post('/api/newPost', function (req, res) {
  let apiToken = req.get('X-API-Token') //gets the api token from the header in the callApi fetch request

  if(apiToken){ //if there is a token
    user.findByToken(apiToken, userdata => {
      if(userdata){ //if there is a user
        posts.newPost(req.body.postTitle, req.body.postBody, userdata, result => {
          res.json(true)
        })
      }
    })
  }
  
})


app.post('/api/getUserById', (req, res) => {
  user.findById(req.body.user_id, result => {
    res.json({username:result.username})
  })
})

app.post('/api/getUserByToken', (req, res) => {
  user.findByToken(req.get('X-API-Token'), result => {
    if(result){ //if user logged in
      res.json({id:result.id, username:result.username})
    }
  })
})

// Tell us where we're running from
console.log("Server running on http://localhost:" + port)
app.listen(port)

