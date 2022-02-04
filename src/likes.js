const DB = require('./database.js')

module.exports = {

    create(postId, user){
        DB.connect().then(db => {
            db.run('INSERT INTO likes (post_id, user_id) values (?,?)', postId, user)
        })
    },

    delete(likeId){
        DB.connect().then(db => {
            db.run('DELETE FROM likes WHERE id = ?', likeId)
        })
    },
    
    toggleLike(postId, userId, callback){
        DB.connect().then(db => {
            db.get('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', userId, postId).then(result => {
                if(result){
                    this.delete(result.id)
                    callback({like:false})
                }
                else {
                    this.create(postId, userId)
                    callback({like:true})
                }
            })
        })
    },

    isLiked(postId, userId, callback){
        DB.connect().then(db => {
            db.get('SELECT * FROM likes WHERE user_id = ? AND post_id = ?', userId, postId).then(result => {
                if(result){
                    callback(true)
                }
                else {
                    callback(false)
                }
            })
        })
    },

    likeCount(postId, callback){
        DB.connect().then(db => {
            db.get('SELECT COUNT (*) FROM likes WHERE post_id = ?',postId).then(result => {
                callback(result)
            })
        })
    }
}