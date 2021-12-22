document.addEventListener('DOMContentLoaded', function(event) {
    const input = document.querySelector('form .counted')
    counter = document.querySelector("form .counter")
    maxLength = input.getAttribute('maxlength')
    counter.innerText = maxLength - input.value.length + '/'+ maxLength
    
    input.onkeyup = ()=>{
    counter.innerText = maxLength - input.value.length + '/'+ maxLength
    }
});