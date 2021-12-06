module.exports = function(){
    var express = require('express')
    var router = express.Router()

    function getCustomers(res, mysql, context, complete){
        let query = "SELECT customerID, firstName, lastName, rewardSpend, email FROM Customers"
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.customers = results
            complete()
        })
    }

    function getCustomerWithNameLike(req, res, mysql, context, complete){
        var query = "SELECT customerID, firstName, lastName, rewardSpend, email FROM Customers WHERE Customers.firstName LIKE " + mysql.pool.escape(req.params.s + '%')
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.customers = results
            console.log(context)
            complete()
        })
    }

    function getCustomer(res, mysql, context, id, complete){
        var sql = "SELECT customerID, firstName, lastName, rewardSpend, email FROM Customers WHERE customerID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customer = results[0];
            complete();
        });
    }

    /* Display all Customers */
    router.get('/', function(req, res){
        var context = {}
        var mysql = req.app.get('mysql')
        getCustomers(res, mysql, context, complete)
        function complete(){
            res.render('customers', context)
        }
    })

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getCustomerWithNameLike(req, res, mysql, context, complete);
        function complete(){
            res.render('customers', context);
        }
    });

    /* Display one person for the specific purpose of updating people */

    router.get('/:id', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, req.params.id, complete);
        function complete(){
            res.render('update-customers', context)
        }
    });

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customers (firstName, lastName, rewardSpend, email) VALUES (?,?,?,?)";
        var inserts = [req.body.firstName, req.body.lastName, req.body.rewardSpend, req.body.email];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/customers');
            }
        });
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Customers SET firstName=?, lastName=?, rewardSpend=?, email=? WHERE customerID=?";
        var inserts = [req.body.firstName, req.body.lastName, req.body.rewardSpend, req.body.email, req.params.id];
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

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customers WHERE customerID = ?";
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