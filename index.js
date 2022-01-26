const express = require('express')
const UUID = require('uuid')
const multer = require('multer')
const app = express()
const port = 3000

// You can require your own code as well...
const funcs = require('./src/funcs.js')
const user = require('./src/users')
const posts = require('./src/posts')
const comments = require('./src/comments')
const { title } = require('process')
const { findByToken } = require('./src/users')
const users = require('./src/users')

//multer code from slide
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads')
  },
  filename: function (req, file, callback) {
    callback(null, UUID.v4() + '-' + file.originalname)
  }
})
const upload = multer({
  storage: storage
})

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
    if (!result) {//if result is undefined
      result = false
    }
    res.json({token: result.token, username: result.username}) //sends response
  })
})

app.post('/api/newUser', function (req, res) {
  users.newUser(req.body.username, req.body.password, req.body.email, result => {
    res.json(true)
  })
})

app.post('/api/checkUsername', function (req, res) {
  users.findByName(req.body.username, result => {
    res.json({username: result.username})
  })
})

app.post('/api/getPost', function (req, res) { //api to get posts
  posts.getPost(req.body.post_id, result => {
    res.json({post_id: result.post_id, title: result.title, body: result.body})
  })
})

app.get('/api/getComments', function (req, res){
  comments.getComments(req.query.post_id, result => {
    res.json(result)//{comment_id: result.id, body:result.body, user_id:result.user_id})
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

app.post('/api/newPost', upload.single('imageUpload'), function (req, res) {
  let apiToken = req.get('X-API-Token') //gets the api token from the header in the callApi fetch request

  if(apiToken){ //if there is a token
    user.findByToken(apiToken, userdata => {
      if(userdata){ //if there is a user
        if(req.file){//if there is a image in post
          posts.newPost(req.body.postTitle, req.body.postBody, userdata, req.file.path, result => {
          res.send({})
          })
        } else{ //if post does not contain image
          posts.newPost(req.body.postTitle, req.body.postBody, userdata, null, result => {
            res.send({})
            })
        }
      }
    })
  }
})

app.post('/api/newComment', function (req,res) {
  let apiToken = req.get('X-API-Token') //gets token
  user.findByToken(apiToken, userdata => { //gets user from token
    if(userdata){ //if there is a user
      comments.newComment(req.body.postId, req.body.commentBody, userdata.id, result => {
        res.send({})
      })
    }
  })
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

app.post('/api/editPost', upload.single('fileUpload'), (req, res) => {
  let apiToken = req.get('X-API-Token') //gets the api token from the header in the callApi fetch request

  if(apiToken){ //if there is a token
    user.findByToken(apiToken, userdata => {
      if(userdata){ //if there is a user
        if(req.file){//if there is a image in edit form data
          posts.editPost(req.get('X-Post-Id'), req.body.postTitle, req.body.postBody, req.file.path, req.get('X-Img-Id'), result => {
            res.send({})
          })
        } 
        else if(req.get('X-Img-Id')){//else if x-posr-imageid in header 
          posts.editPost(req.get('X-Post-Id'), req.body.postTitle, req.body.postBody, req.get('X-Img-Path'), req.get('X-Img-Id'), result => {
            res.send({})
          })
        }
        else{ //if post does not contain image
          posts.editPost(req.get('X-Post-Id'), req.body.postTitle, req.body.postBody, '', null, result => {
            res.send({})
          })
        }
      }
    })
  }
})

app.delete('/api/deletePost', (req, res) => {
  posts.deletePost(req.body.post_id, result => {
    console.error();
    res.json(true)
  })
})

app.delete('/api/deleteImg', (req,res) => {
  posts.deleteImg(req.body.img_id, result => {
    console.error()
    res.json(true)
  })
})

// Tell us where we're running from
console.log("Server running on http://localhost:" + port)
app.listen(port)

