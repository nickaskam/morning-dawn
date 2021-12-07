function searchCustomersByFirstName() {
    //get the first name 
    var first_name_search_string  = document.getElementById('first_name_search_string').value
    //construct the URL and redirect to it
    window.location = '/customers/search/' + encodeURI(first_name_search_string)
}

function searchOrdersByID() {
    var id_search_string  = document.getElementById('id_search_string').value
    window.location = '/orders/search/' + encodeURI(id_search_string)
}

function searchBeansByCountry() {
    var country_string = document.getElementById('country_search_string').value
    window.location = '/beans/search/' + encodeURI(country_string)
}