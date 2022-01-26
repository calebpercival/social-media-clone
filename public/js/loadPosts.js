fetch('/api/oldestPost').then( //calls api to get id of first/oldest post in posts table
    function(result){
        result.json().then(result => {
            oldestPostId = result['MIN(post_id)']
        })
    }
)

function editForm(post){ //sets the default form values to the post value 
    //set form values
    document.getElementById('editTitle').defaultValue = post.title
    document.getElementById('editBody').defaultValue = post.body

    //set character counter to correct value
    const input = document.querySelector('form .counted')
    counter = document.querySelector('form .counter')
    maxLength = input.getAttribute('maxlength')
    counter.innerText = maxLength - input.value.length + '/'+ maxLength

    let path
    
    let editImg = document.getElementById('editImg') //gets div containing img and delete btn
    let fileUploader = document.getElementById('fileUpload') //gets file uploader
    if(post.filepath){ //if post contains image
        path = post.filepath.substr(7,post.filepath.length - 7) //removes '/public/'
        editImg.classList.remove('hidden') //shows img and delete btn
        document.getElementById('imgPreview').src = path //sets image src
        fileUploader.classList.add('hidden') //hides file uploader
    }
    else{
        editImg.classList.add('hidden')
        fileUploader.classList.remove('hidden')
    }

    document.getElementById('deleteImgBtn').addEventListener('click', function() {
        document.getElementById('editImg').classList.add('hidden')
        editImg.src = ""
        document.getElementById('fileUpload').classList.remove('hidden')
    })
        
    //save edit
    let form = document.querySelector("form"); //gets form element from document

    document.getElementById('saveEdit').onclick = function(){ //when save edit button clicked
        let data = new FormData(form) //create new form data from edit form
        let newPath = post.filepath //sets new file path to current file path
        let newImgId = post.img_id 

        if(post.filepath && editImg.src == ""){//if there is img to be deleted
            callDelete('/api/deleteImg',{img_id:post.img_id}) //calls delete image api
            newPath = ""
            newImgId = null
        }
        
        if (fetch('/api/editPost', { //call api
            method: 'post',
            headers:{
                "X-API-Token": window.sessionStorage.getItem('token'),
                "X-Img-Id":newImgId, //store img id, path and post id in header as it is required but not part of form
                "X-Img-Path":newPath,
                "X-Post-Id":post.post_id
            },
            body: new FormData(form)
        })){ //if api returns true
            window.location ='/' //redirect to home page
        }
    }
}

function deletePost(id){
    document.getElementById('confirmDelete').onclick = function(){
        if(callDelete('/api/deletePost',{post_id:id})){ //calls delete post api
            window.location = "/" //refreshes page
        }
    }
}

function loadPosts(itemsPerPage, currentPage){
    let offset = itemsPerPage * currentPage
    let template = document.getElementById("postTemplate")
    let commentTemplate = document.getElementById('commentTemplate')
    let container = document.getElementById("postsContainer")
    
    fetch('/api/posts?offset=' + offset).then( function(result){
        result.json().then(result => { // convert result to json

            result.forEach(post => { //for each post in array
                let clone = template.content.firstElementChild.cloneNode(true) //create clone of template post

                callApi('/api/getUserById', {user_id:post.user_id}).then( //gets user using user id in post
                    function(result){
                        result.json().then(result => {
                            clone.getElementsByClassName('user')[0].textContent = result.username //sets username in post header
                        })
                    }
                )

                // callApi('/api/getPostImage',{img_id:post.img_id}).then( //gets imnage

                // )
                
                clone.getElementsByTagName('h5')[0].textContent = post.title //set post title
                clone.getElementsByClassName('body')[0].textContent = post.body //set post body
    
                if(post.filepath){//if the post has an image
                    let path = post.filepath.substr(6,post.filepath.length-6) // removes the '/public' from the start of the filepath
                    clone.getElementsByClassName('postImg')[0].src = path //sets image
                }

                let loggedIn = window.sessionStorage.getItem('token')// get current token from session

                if(loggedIn){ //user is logged in
                    callApi('/api/getUserByToken', {}).then( function(result){ //calls api to get user id of currently logged user using token
                        result.json().then( result => {
                            if(result.id == post.user_id){ //if post belongs to logged in user

                                //creates edit btn element
                                let editBtn = document.createElement('a') 
                                editBtn.innerHTML = "Edit"
                                editBtn.classList ='btn'
                                editBtn.setAttribute('data-bs-toggle', 'modal') 
                                editBtn.setAttribute('data-bs-target', '#editModal')
                                editBtn.onclick = function(){editForm(post)} //call function to set change default edit form values to post values
                                
                                clone.getElementsByClassName('edit')[0].appendChild(editBtn)//adds edit button to post header

                                //creates delete btn element
                                let deleteBtn = document.createElement('a')
                                deleteBtn.innerHTML = 'Delete'
                                deleteBtn.classList = 'btn'
                                deleteBtn.setAttribute('data-bs-toggle', 'modal') 
                                deleteBtn.setAttribute('data-bs-target', '#deleteModal')
                                deleteBtn.onclick = function(){deletePost(post.post_id)}

                                clone.getElementsByClassName('edit')[0].appendChild(deleteBtn)
                            } 
                        }) 
                    })
                }

                //comments
                fetch('/api/getComments?post_id='+post.post_id).then( function(result){
                    result.json().then(comments => { //calls api to get comments 
                        Object.values(comments).forEach(comment => {
                            let commentClone = commentTemplate.content.firstElementChild.cloneNode(true) //create clone of comment template

                            callApi('/api/getUserById', {user_id:comment.user_id}).then( //gets user using user id in post
                                function(result){
                                    result.json().then(result => {
                                        commentClone.getElementsByClassName('user')[0].textContent = result.username //sets username in post header
                                    })
                                }
                            )
                            commentClone.getElementsByClassName('commentBody')[0].textContent = comment.body
                            // commentClone.getElementsByClassName('comments')[0].appendChild()

                            clone.getElementsByClassName('comments')[0].appendChild(commentClone)
                        })
                    })
                })

                container.appendChild(clone)

                if(post.post_id == oldestPostId){ //if post is the first post
                    document.getElementById('loadPostsBtn').style.display = "none" //remove load more button
                }
            })
        })
    })
}