function deleteOrder(id){
    $.ajax({
        url: '/deleteOrder/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true)
        }
    })
}

function deleteCustomer(id){
    $.ajax({
        url: '/deleteCustomer/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true)
        }
    })
}

function deleteCoffeeOrders(coffeeID, orderID){
    $.ajax({
        url: '/coffeeOrders/coffeeID/' + coffeeID + '/orderID/' + orderID,
        type: 'DELETE',
        success: function(result){
            if(result.responseText != undefined){
              alert(result.responseText)
            }
            else {
              window.location.reload(true)
            } 
        }
    })
  };