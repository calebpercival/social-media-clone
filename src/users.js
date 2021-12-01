const DB = require('./database.js')
const UUID = require('uuid')

module.exports = {
    
    login(username, password, callback){
        DB.connect().then(db => {
            db.get('SELECT * FROM users Where username = ? AND password = ?', username, password).then(
            result => {

                if (result && !result.token){
                    let token = UUID.v4(); //create an api token for the user
                    db.run('UPDATE users SET token = ? WHERE id = ?', token, result.id).then(() => { //
                        result.token = token
                        callback(result)
                    })
                } 
                else {
                    callback(result)
                }
            })
        })
        .catch(err => {
            console.log("username.login failed with error" + err)
        })
    },

    findByToken(token, callback) { //gets user by token
        DB.connect().then(db => {
            db.get('SELECT * FROM users WHERE token = ?', token).then(result => {
                callback(result)
            })
            .catch(err => {
                console.log("users.findByToken failed with error " + err)
            })
        })
    }
}