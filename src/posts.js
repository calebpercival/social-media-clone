const DB = require('./database.js')

module.exports = {
    getPost(post_id,callback){
        DB.connect().then( db => {
            db.get('SELECT * FROM posts Where post_id = ?', post_id).then(
                result => {
                    console.log("post: ", result)
                    callback(result)
                }
            )
        })
    },

    newPost(postTitle, postBody, user, callback){
        DB.connect().then( db => {
            db.run("INSERT INTO posts (title, body, user_id) values (?,?,?)", postTitle, postBody, user.id).then( () => {
                    callback()
            })
        })
    }
}