function validEmail(email){
    emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(email.match(emailFormat)){
        return true
    }
    else{
        false
    }
}

function formValidation(username, email, password, confirmPassword){
    //check username is not empty
    //check email is valid
    //check password is not empty
    //check passwords match

    let errorMsg = ""

    if(username == ""){ //if username is empty
            errorMsg = errorMsg + "*Username is a required field <br>"
    }
    if(username.includes(" ")){ //if user name contains space
        errorMsg = errorMsg + "*Username cannot contain spaces <br>"
    }
    if(password == ""){ //if password is empty
        errorMsg = errorMsg + "*Password is a required field <br>"
    }
    if(email == ""){ //if email is empty
        errorMsg = errorMsg + "*Email is a required field <br>"
    } 
    else{
        if(!validEmail(email)){ //if email is not valid format
            errorMsg = errorMsg + "*Please enter a valid email <br>"
        }
    }
    if(password != confirmPassword){ //if passwords do not match
        errorMsg = errorMsg + "*Passwords do not match <br>"
    }

    return errorMsg
}
