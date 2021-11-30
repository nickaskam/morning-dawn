function updateOrder(id){
    $.ajax({
        url: '/updateOrder/' + id,
        type: 'PUT',
        data: $('#update-order').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};