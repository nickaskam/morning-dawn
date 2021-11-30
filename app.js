
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

// reads

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

// inserts
app.post('/addBeansCoffee', function (req, res) {
  let data = req.body

  let query1 = `INSERT INTO BeansWithCoffees (beanID, coffeeID) VALUES ('${data.beanID}', '${data.coffeeID}')`

  db.pool.query(query1, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/beans-coffee')
    }
  })
})

app.post('/addCoffeeOrders', function (req, res) {
  let data = req.body

  let query1 = `INSERT INTO CoffeeOrders (orderID, coffeeID) VALUES ('${data.orderID}', '${data.coffeeID}')`

  db.pool.query(query1, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/coffee-orders')
    }
  })
})

app.post('/addTeaOrders', function (req, res) {
  let data = req.body

  let query1 = `INSERT INTO TeaOrders (orderID, teaID) VALUES ('${data.orderID}', '${data.teaID}')`

  db.pool.query(query1, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/tea-orders')
    }
  })
})

app.post('/newCoffee', function (req, res) {
  let data = req.body

  let query1 = `INSERT INTO Coffees (type, volumeOfCoffeeInGrams, volumeOfWaterInLiters, additive, brewTime, price, specialRequest) 
                VALUES ('${data.type}', '${data.volumeOfCoffeeInGrams}', '${data.volumeOfWaterInLiters}', '${data.additive}', '${data.brewTime}', '${data.price}', '${data.specialRequest}')`

  db.pool.query(query1, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/coffees')
    }
  })
})

app.post('/addBean', function (req, res) {
  let data = req.body

  let query1 = `INSERT INTO Beans (countryOfOrigin, roastType, roastDate)
                VALUES ('${data.countryOfOrigin}', '${data.roastType}', '${data.roastDate}')`

  db.pool.query(query1, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/beans')
    }
  })
})

app.post('/addCustomer', function (req, res) {
  let data = req.body

  let query1 = `INSERT INTO Customers (firstName, lastName, rewardSpend, email)
                VALUES ('${data.firstName}', '${data.lastName}', '${data.rewardSpend}', '${data.email}')`

  db.pool.query(query1, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/customers')
    }
  })
})

app.post('/addOrder', function (req, res) {
  let data = req.body

  let query1 = `INSERT INTO Orders (orderDate, orderTotal, customerID)
                VALUES ('${data.orderDate}', '${data.orderTotal}', '${data.customerID}')`

  db.pool.query(query1, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/orders')
    }
  })
})

app.post('/addTea', function (req, res) {
  let data = req.body

  let query1 = `INSERT INTO Teas (origin, color, matcha, flavor, season, price) 
                VALUES ('${data.origin}', '${data.color}', '${data.matcha}', '${data.flavor}', '${data.season}', '${data.price}')`

  db.pool.query(query1, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/teas')
    }
  })
})

app.listen(PORT, function(){
  console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});