$(document).ready(function(){

    $('#room_create').on('click', function(event) {
        console.log(this);
        $('#room_create_window').toggleClass('room_create_window')
        event.preventDefault();
    })

    $('#room_create_submit').on('click', function(event){
        var name     = $(this).parent().parent().children('.modal-body').children('form').children('#name').children('input').val();
        var password = $(this).parent().parent().children('.modal-body').children('form').children('#password').children('input').val();

        var request = $.ajax({
            url: "/rooms/create",
            type: "POST",
            cache: false,
            data: {
                name    : name,
                password: password
            },
            dataType: "json",
            success: function(results){
                results = JSON.parse(results);
                $('.modal-header-errors').empty();
                results.errorList.forEach(function(result){
                    $('.modal-header-errors').append(
                        "<div class=\"alert alert-" + results.type + "\">" + result + "</div>"
                    )
                })

                if(results.type == "success"){

                }
            },
            error: function(err){
                console.log(err);
            }
        });
    })

})