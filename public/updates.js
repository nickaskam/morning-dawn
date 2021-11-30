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

function updateCustomer(id){
    $.ajax({
        url: '/updateCustomer/' + id,
        type: 'PUT',
        data: $('#update-customer').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function updateCoffee(id){
    $.ajax({
        url: '/updateCoffee/' + id,
        type: 'PUT',
        data: $('#update-coffee').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};