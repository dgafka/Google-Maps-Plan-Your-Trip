$(document).ready(function(){

    $('#login_locally').on('click', function(){
        window.location.href = window.location.href + 'login'
    })

    $('#anonymous_locally').on('click', function(){
       window.location.href = window.location.href + 'login/anonymous'
    })

    $('#login_facebook').on('click', function(){
        window.location.href = window.location.href + 'auth/facebook/callback';
    })

    $('#login_google').on('click', function(){
        window.location.href = window.location.href + 'auth/google/callback';
    })

    $('#login_twitter').on('click', function(){
        window.location.href = window.location.href + 'auth/twitter/callback';
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