
const express = require('express')
const app = express()
PORT = 11360

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require('./database/db-connector')

const handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
})

app.engine('handlebars', handlebars.engine)
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'handlebars')

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/customers', function(req, res) {
  let query = 'SELECT * FROM Customers;'

  db.pool.query(query, function (error, rows, fields) {
    res.render('customers', { data: rows });
  })
})

app.get('/beans', function(req, res) {
  let query = 'SELECT * FROM Beans;'

  db.pool.query(query, function (error, rows, fields) {
    res.render('beans', { data: rows });
  })
})

app.get('/coffees', function(req, res) {
  let query = 'SELECT * FROM Coffees;'

  db.pool.query(query, function (error, rows, fields) {
    res.render('coffees', { data: rows });
  })
})

app.get('/teas', function(req, res) {
  let query = 'SELECT * FROM Teas;'

  db.pool.query(query, function (error, rows, fields) {
    res.render('teas', { data: rows });
  })
})

app.get('/orders', function(req, res) {
  let query = 'SELECT * FROM Orders;'

  db.pool.query(query, function (error, rows, fields) {
    res.render('orders', { data: rows });
  })
})

app.get('/beans-coffee', function(req, res) {
  let query = 'SELECT * FROM BeansWithCoffees;'

  db.pool.query(query, function (error, rows, fields) {
    res.render('beans-coffee', { data: rows });
  })
})

app.get('/tea-orders', function(req, res) {
  let query = 'SELECT * FROM TeaOrders;'

  db.pool.query(query, function (error, rows, fields) {
    res.render('tea-orders', { data: rows });
  })
})

app.get('/coffee-orders', function(req, res) {
  let query = 'SELECT * FROM CoffeeOrders;'

  db.pool.query(query, function (error, rows, fields) {
    res.render('coffee-orders', { data: rows });
  })
})

app.listen(PORT, function(){
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});