function logout(){ //function logs the user out and removes the token
    sessionStorage.removeItem('token') //removes token from session storage
    window.location = "/index.html" //navigates back to home page
}