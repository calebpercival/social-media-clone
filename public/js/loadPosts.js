fetch('/api/oldestPost').then( //calls api to get id of first/oldest post in posts table
    function(result){
        result.json().then(result => {
            oldestPostId = result['MIN(post_id)']
        })
    }
)

function editFormValue(post){ //sets the default form values to the post value 
    //set form values
    document.getElementById('editTitle').defaultValue = post.title
    document.getElementById('editBody').defaultValue = post.body

    //set character counter to correct value
    const input = document.querySelector('form .counted')
    counter = document.querySelector('form .counter')
    maxLength = input.getAttribute('maxlength')
    counter.innerText = maxLength - input.value.length + '/'+ maxLength
}

function loadPosts(itemsPerPage, currentPage){
    let offset = itemsPerPage * currentPage
    let template = document.getElementById("postTemplate")
    let container = document.getElementById("postsContainer")
    
    fetch('/api/posts?offset=' + offset).then( function(result){
        result.json().then(result => { // convert result to json

            result.forEach(post => { //for each item in array
                let clone = template.content.firstElementChild.cloneNode(true) //create clone of template post

                callApi('/api/getUserById', {user_id:post.user_id}).then( //gets user using user id in post
                    function(result){
                        result.json().then(result => {
                            clone.getElementsByClassName('user')[0].textContent = result.username //sets username in post header
                        })
                    }
                )
                
                clone.getElementsByTagName('h5')[0].textContent = post.title //set post title
                clone.getElementsByClassName('body')[0].textContent = post.body //set post body
                
                let loggedIn = window.sessionStorage.getItem('token')// get current token from session

                if(loggedIn){ //user is logged in
                    callApi('/api/getUserByToken', {}).then( function(result){ //calls api to get user id of currently logged user using token
                        result.json().then( result => {
                            if(result.id == post.user_id){ //if post belongs to logged in user
                                let editBtn = document.createElement('a') //creates edit btn element
                                editBtn.innerHTML = "Edit"
                                editBtn.classList ='btn'
                                editBtn.setAttribute('data-bs-toggle', 'modal') 
                                editBtn.setAttribute('data-bs-target', '#editModal')
                                editBtn.onclick = function(){editFormValue(post)} //call function to set change default edit form values to post values
                                clone.getElementsByClassName('edit')[0].appendChild(editBtn)
                                
                            } 
                        }) 
                    })
                }

                container.appendChild(clone)

                if(post.post_id == oldestPostId){ //if post is the first post
                    document.getElementById('loadPostsBtn').style.display = "none" //remove load more button
                }
            })
        })
    })
}