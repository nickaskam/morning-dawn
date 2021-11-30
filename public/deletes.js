function deleteOrder(id){
    $.ajax({
        url: '/deleteOrder/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true)
        }
    })
}