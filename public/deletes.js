function deleteOrder(id){
    $.ajax({
        url: id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true)
        }
    })
}

function deleteCustomer(id){
    $.ajax({
        url: id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true)
        }
    })
}

function deleteCoffee(id){
    $.ajax({
        url: id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true)
        }
    })
  };

function deleteBean(id){
    $.ajax({
        url: id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true)
        }
    })
};

function deleteTea(id){
    $.ajax({
        url: id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true)
        }
    })
  };

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

function deleteTeaOrders(teaID, orderID){
    $.ajax({
        url: '/deleteTeaOrders/teaID/' + teaID + '/orderID/' + orderID,
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

function deleteBeanCoffees(coffeeID, beanID){
    $.ajax({
        url: '/deleteBeanCoffees/coffeeID/' + coffeeID + '/beanID/' + beanID,
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
