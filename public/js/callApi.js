function callApi(url, data){            
    return fetch(url, {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "X-API-Token": window.sessionStorage.getItem('token')
        }, 
        body:JSON.stringify(data)
    })
}

function callDelete(url, data){            
    return fetch(url, {
        method:"DELETE",
        headers:{
            "Content-Type": "application/json",
            "X-API-Token": window.sessionStorage.getItem('token')
        }, 
        body:JSON.stringify(data)
    })
}

