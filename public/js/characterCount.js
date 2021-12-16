document.addEventListener("DOMContentLoaded", function(event) {
    const input = document.querySelector("form #postBody"),
    counter = document.querySelector("form .counter"),
    maxLength = input.getAttribute("maxlength");
    
    input.onkeyup = ()=>{
    counter.innerText = maxLength - input.value.length + "/"+ maxLength;
    }
    
    });