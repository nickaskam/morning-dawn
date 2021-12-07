
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
app.use('/teas', require('./teas.js'))
app.use('/beans-coffee', require('./coffee-beans.js'))
app.use('/tea-orders', require('./tea-orders.js'))
app.use('/coffee-orders', require('./coffee-orders.js'))
app.use('/', express.static('public'))

app.get('/', function (req, res) {
  res.render('index');
});

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