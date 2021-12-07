module.exports = function(){
    var express = require('express')
    var router = express.Router()

    function getCustomers(res, mysql, context, complete){
        mysql.pool.query("SELECT customerID as id, firstName, lastName FROM Customers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.customers = results
            complete()
        })
    }

    function getOrders(res, mysql, context, complete){
        mysql.pool.query("SELECT Orders.orderID as orderID, DATE_FORMAT(orderDate,'%Y-%m-%d') AS niceDate, orderTotal, Customers.firstName as firstName, Customers.lastName as lastName, Customers.customerID as customerID FROM Orders INNER JOIN Customers ON Orders.customerID = Customers.customerID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.orders = results
            complete()
        })
    }

    function getOrder(res, mysql, context, id, complete){
        var sql = "SELECT Orders.orderID, DATE_FORMAT(orderDate,'%Y-%m-%d') AS orderDate, orderTotal, Orders.customerID FROM Orders WHERE orderID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.order = results[0];
            complete();
        });
    }

    function getOrderWithID(req, res, mysql, context, complete){
        var query = "SELECT Orders.orderID, DATE_FORMAT(orderDate,'%Y-%m-%d') AS orderDate, orderTotal, Orders.customerID FROM Orders WHERE orderID = " + mysql.pool.escape(req.params.s + '%')
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.orders = results
            console.log(context)
            complete()
        })
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        getOrders(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                console.log(context)
                res.render('orders', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getOrder(res, mysql, context, req.params.id, complete);
        getCustomers(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-orders', context);
            }
            console.log(context)

        }
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Orders SET orderDate=?, orderTotal=?, customerID=? WHERE orderID=?";
        var inserts = [req.body.orderDate, req.body.orderTotal, req.body.customerID, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
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

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getOrderWithID(req, res, mysql, context, complete);
        function complete(){
            res.render('orders', context);
        }
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders (orderDate, orderTotal, customerID) VALUES (?,?,?)";
        var inserts = [req.body.orderDate, req.body.orderTotal, req.body.customerID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/orders/');
            }
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Orders WHERE orderID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router
}()