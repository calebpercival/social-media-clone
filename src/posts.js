const DB = require('./database.js')

module.exports = {
    getPost(post_id,callback){ //get single post by id
        DB.connect().then( db => {
            db.get('SELECT * FROM posts Where post_id = ?', post_id).then(
                result => {
                    console.log("post: ", result)
                    callback(result)
                }
            )
        })
    },

    getPosts(offset, limit, callback){//get range of posts
        DB.connect().then(db => {
            db.all('SELECT * FROM posts LEFT JOIN images ON posts.img_id = images.img_id ORDER BY post_id DESC LIMIT ? OFFSET ?',limit, offset).then(
                result => {
                    callback(result)
                }
            )
            // db.all('SELECT * FROM posts ORDER BY post_id DESC LIMIT ? OFFSET ?',limit, offset).then(
            //     result => {
            //         // callback(result)
            //     }
            // )
        })
    },

    oldestPost(callback){ //returns the id of the oldest post(smallest id)
        DB.connect().then( db => {
            db.get('SELECT MIN(post_id) FROM posts').then(
                result => {
                    
                    callback(result)
                }
            )
        })
    },

    newPost(postTitle, postBody, user, filepath, callback){
        DB.connect().then( db => {
            if(filepath){//if there is a image in post
                db.run('INSERT INTO images (filepath) values (?)', filepath).then( (lastID) => {
                    db.run("INSERT INTO posts (title, body, user_id, img_id) values (?,?,?,?)", postTitle, postBody, user.id, lastID.lastID).then( () => {
                        callback()
                    }) 
                })
            }
            else{ //if there is no image in post
                db.run("INSERT INTO posts (title, body, user_id) values (?,?,?)", postTitle, postBody, user.id).then( () => {
                    callback()
                }) 
            }
        })
    },

    editPost(postId, postTitle, postBody, callback){
        DB.connect().then( db => {
            db.run('UPDATE posts SET title = ?, body = ? WHERE post_id = ?', postTitle, postBody, postId).then( () => {
                callback()
            })
        })
    },

    deletePost(postId){
        DB.connect().then( db => {
            db.run('DELETE FROM posts WHERE post_id = ?', postId).then( () => {
                
            })
        })
    }
}