const DB = require('./database.js')

module.exports = {
    getComments(post_id, callback){
        DB.connect().then( db => {
            db.all('SELECT * FROM comments WHERE post_id = ? ORDER BY id ASC', post_id).then(
                result => {
                    callback(result)
                }
            )
        })
    },

    newComment(postId, commentBody, userId, callback){
        DB.connect().then( db => {
            db.run('INSERT INTO comments (body, post_id, user_id) values(?,?,?)', commentBody, postId, userId).then( () => {
                callback()
            })
        })

    }
}