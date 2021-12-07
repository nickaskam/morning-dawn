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

function searchCoffeesByType() {
    var type_search_string = document.getElementById('type_search_string').value
    window.location = '/coffees/search/' + encodeURI(type_search_string)
}

function searchTeasByOrigin() {
    var origin_search_string = document.getElementById('origin_search_string').value
    window.location = '/teas/search/' + encodeURI(origin_search_string)
}