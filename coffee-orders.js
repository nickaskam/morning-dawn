module.exports = function(){
    var express = require('express')
    var router = express.Router()
    
    function getCoffees(res, mysql, context, complete){
        mysql.pool.query("SELECT coffeeID, type FROM Coffees", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.coffees = results
            complete()
        })
    }

    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT orderID, orderTotal FROM Orders", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.orders = results
            complete()
        })
    }

    function getCoffeeOrders(res, mysql, context, complete){
        let sql = "SELECT Coffees.coffeeID, Orders.orderID, Coffees.type as type, Orders.orderTotal as orderTotal FROM CoffeeOrders INNER JOIN Orders on CoffeeOrders.orderID = Orders.orderID INNER JOIN Coffees on CoffeeOrders.coffeeID = Coffees.coffeeID"
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.coffee_orders = results
            complete()
        })
    }

    router.get('/', function(req, res){
        var callbackCount = 0
        var context = {}
        var mysql = req.app.get('mysql')
        var handlebars_file = 'coffee-orders'

        getOrders(res, mysql, context, complete)
        getCoffees(res, mysql, context, complete)
        getCoffeeOrders(res, mysql, context, complete)
        function complete(){
            callbackCount++
            if(callbackCount >= 3){
                res.render(handlebars_file, context)
            }
        }
    })

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO CoffeeOrders (coffeeID, orderID) VALUES (?,?)";
        var inserts = [req.body.coffeeID, req.body.orderID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/coffee-orders/');
            }
        });
    });

    return router
}()