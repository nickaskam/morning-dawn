function updateOrder(id){
    $.ajax({
        url: id,
        type: 'PUT',
        data: $('#update-order').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function updateCustomer(id){
    $.ajax({
        url: id,
        type: 'PUT',
        data: $('#update-customer').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function updateCoffee(id){
    $.ajax({
        url: id,
        type: 'PUT',
        data: $('#update-coffee').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function updateBean(id){
    $.ajax({
        url: id,
        type: 'PUT',
        data: $('#update-bean').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
