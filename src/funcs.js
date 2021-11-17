const { response } = require("express")

module.exports = {
    
    myFunction() {
        return "Hello from your API!"
    },

    checkLogin(username, password) {
        if(username == "test" && password == "password"){
            return "login successful";
        } else{
            return "login unsuccessful";
        }
    }
}
