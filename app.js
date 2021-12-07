
const express = require('express')
const app = express()
PORT = 11360

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
var bodyParser = require('body-parser')

const db = require('./database/db-connector')
const mysql = require('./database/db-connector.js')

const handlebars = require('express-handlebars').create({
  defaultLayout: 'main',
})

app.engine('handlebars', handlebars.engine)
app.use(bodyParser.urlencoded({extended:true}))
app.use('/static', express.static('public'))
app.set('view engine', 'handlebars')
app.set('mysql', mysql)
app.use('/customers', require('./customers.js'))
app.use('/orders', require('./orders.js'))
app.use('/beans', require('./beans.js'))
app.use('/coffees', require('./coffees.js'))
app.use('/', express.static('public'))

app.get('/', function (req, res) {
  res.render('index');
});

// reads

app.get('/teas', function(req, res) {
  let query = 'SELECT * FROM Teas;'

  db.pool.query(query, function (error, rows, fields) {
    res.render('teas', { data: rows });
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

app.delete('/deleteTea/:id', function (req, res) {
  // let data = req.body
  let query1 = `DELETE FROM Teas WHERE Teas.teaID = ?`
  db.pool.query(query1, [req.params.id], function(error, results, fields){
    if(error){
        console.log(error)
        res.write(JSON.stringify(error))
        res.status(400)
        res.end()
    }else{
        res.status(202).end()
    }
  })
})

app.delete('/coffeeOrders/coffeeID/:coffeeID/orderID/:orderID', function (req, res) {
  // let data = req.body
  let query1 = `DELETE FROM CoffeeOrders WHERE CoffeeOrders.orderID = ? AND CoffeeOrders.coffeeID = ?`
  let insert = [req.params.orderID, req.params.coffeeID]
  db.pool.query(query1, insert, function(error, results, fields){
    if(error){
        console.log(error)
        res.write(JSON.stringify(error))
        res.status(400)
        res.end()
    }else{
        res.status(202).end()
    }
  })
})

app.delete('/deleteTeaOrders/teaID/:teaID/orderID/:orderID', function (req, res) {
  // let data = req.body
  let query1 = `DELETE FROM TeaOrders WHERE TeaOrders.orderID = ? AND TeaOrders.teaID = ?`
  let insert = [req.params.orderID, req.params.teaID]
  db.pool.query(query1, insert, function(error, results, fields){
    if(error){
        console.log(error)
        res.write(JSON.stringify(error))
        res.status(400)
        res.end()
    }else{
        res.status(202).end()
    }
  })
})

app.delete('/deleteBeanCoffees/coffeeID/:coffeeID/beanID/:beanID', function (req, res) {
  // let data = req.body
  let query1 = `DELETE FROM BeansWithCoffees WHERE BeansWithCoffees.coffeeID = ? AND BeansWithCoffees.beanID = ?`
  let insert = [req.params.coffeeID, req.params.beanID]
  db.pool.query(query1, insert, function(error, results, fields){
    if(error){
        console.log(error)
        res.write(JSON.stringify(error))
        res.status(400)
        res.end()
    }else{
        res.status(202).end()
    }
  })
})

app.listen(PORT, function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu/' + PORT + '; press Ctrl-C to terminate.')
});