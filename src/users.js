const DB = require('./database.js')
const UUID = require('uuid')
const bcrypt = require('bcrypt')

module.exports = {
    
    login(username, password, callback){
        DB.connect().then(db => {
            db.get('SELECT password FROM users Where username = ?', username).then( hash => { //get hashed password from database
                bcrypt.compare(password, JSON.stringify(hash)).then(response => { //returns true if passwords match
                    if(response = true){//if input password matched hash
                        db.get('SELECT * FROM users Where username = ?', username).then(result => {
                            if (result && !result.token){ //if there is a result and the user does not have a token
                                let token = UUID.v4(); //create an api token for the user
                                db.run('UPDATE users SET token = ? WHERE id = ?', token, result.id).then(() => { // set token in db
                                    result.token = token
                                    callback(result)
                                })
                            } 
                            else {
                                callback(result)
                            }
                        })
                    }
                    else{ //else if password/username incorrect
                        callback()
                    }
                })
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
    },

    findById(user_id, callback) {
        DB.connect().then(db => {
            db.get('SELECT * FROM users WHERE id = ?', user_id).then(result => {
                callback(result)
            })
            .catch(err => {
                console.log("users.findById failed with error " + err)
            })
        })
    },

    newUser(username, password, callback) {
        DB.connect().then( db=> {
            bcrypt.genSalt(12).then( salt => { //generate salt (unique string of letters/numbers)
                bcrypt.hash(password, salt).then( hash => { //concatinate salt to password and hash
                    db.run("INSERT INTO users (username, password) values (?,?)", username, hash).then( () => { //add username and hash to database
                        callback()
                    })
                })
            })
        })
    }
}