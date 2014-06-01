$(document).ready(function(){

    $('#login_locally').on('click', function(){
        window.location.href = window.location.href + 'login'
    })

    $('#register_locally').on('click', function(){
        window.location.href = window.location.href + 'signup'
    })

    $('#chat_room').on('click', function(){
        window.location.href = window.location.href + 'rooms'
    })

    $('#logout').on('click', function(){
        window.location.href = window.location.href + 'logout'
    })

})