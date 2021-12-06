
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
app.use('/', express.static('public'))

app.get('/', function (req, res) {
  res.render('index');
});

// reads

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

// app.post('/addOrder', function (req, res) {
//   let data = req.body

//   let query1 = `INSERT INTO Orders (orderDate, orderTotal, customerID)
//                 VALUES ('${data.orderDate}', '${data.orderTotal}', '${data.customerID}')`

//   db.pool.query(query1, function (error, rows, fields) {
//     if (error) {
//       console.log(error)
//       res.sendStatus(400)
//     } else {
//       res.redirect('/orders')
//     }
//   })
// })

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

// get 1
// app.get('/orders/:id', function(req, res) {
//   let query = 'SELECT * FROM Orders WHERE Orders.orderID = ?'
//   inserts = [req.params.id]

//   db.pool.query(query, function (error, rows, fields) {
//     res.render('update-orders', { data: rows });
//   })
// })

app.get('/coffees/:id', function(req, res) {
  let query = 'SELECT * FROM Coffees WHERE Coffees.coffeeID = ?'
  inserts = [req.params.id]

  db.pool.query(query, function (error, rows, fields) {
    res.render('update-coffees', { data: rows });
  })
})

// updates
// app.put('/updateOrder/:id', function(req, res){
//   let query = `UPDATE Orders SET orderDate = ?, orderTotal = ?, customerID = ? WHERE Orders.orderID = ?;`
//   var inserts = [req.body.orderDate, req.body.orderTotal, req.body.customerID, req.params.id];
//   db.pool.query(query, inserts, function(error, results, fields){
//       if(error){
//           console.log(error)
//           res.write(JSON.stringify(error));
//           res.end();
//       }else{
//           res.status(200);
//           res.end();
//       }
//   });
// });

app.put('/updateCoffee/:id', function(req, res){
  let query = `UPDATE Coffees SET type = ?, volumeOfCoffeeInGrams = ?, volumeOfWaterInLiters = ?, additive = ?, brewTime = ?, price = ?, specialRequest = ? WHERE Coffees.coffeeID = ?;`
  let inserts = [req.body.type, req.body.volumeOfCoffeeInGrams, req.body.volumeOfWaterInLiters, req.body.additive, req.body.brewTime, req.body.price, req.body.specialRequest, req.params.id];
  db.pool.query(query, inserts, function(error, results, fields){
      if(error){
          console.log(error)
          res.write(JSON.stringify(error));
          res.end();
      }else{
          res.status(200);
          res.end();
      }
  });
});

// deletes
// app.delete('/deleteOrder/:id', function (req, res) {
//   // let data = req.body
//   let query1 = `DELETE FROM Orders WHERE Orders.orderID = ?`
//   db.pool.query(query1, [req.params.id], function(error, results, fields){
//     if(error){
//         console.log(error)
//         res.write(JSON.stringify(error))
//         res.status(400)
//         res.end()
//     }else{
//         res.status(202).end()
//     }
//   })
// })

app.delete('/deleteCoffee/:id', function (req, res) {
  // let data = req.body
  let query1 = `DELETE FROM Coffees WHERE Coffees.coffeeID = ?`
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

app.delete('/deleteBean/:id', function (req, res) {
  // let data = req.body
  let query1 = `DELETE FROM Beans WHERE Beans.beanID = ?`
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