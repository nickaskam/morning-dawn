module.exports = function(){
    var express = require('express')
    var router = express.Router()

    function getCoffees(res, mysql, context, complete){
        let query = "SELECT coffeeID, type, volumeOfCoffeeInGrams, volumeOfWaterInLiters, additive, brewTime, price, specialRequest FROM Coffees"
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.coffees = results
            complete()
        })
    }

    function getCoffee(res, mysql, context, id, complete){
        var sql = "SELECT coffeeID, type, volumeOfCoffeeInGrams, volumeOfWaterInLiters, additive, brewTime, price, specialRequest FROM Coffees WHERE coffeeID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.coffee = results[0];
            complete();
        });
    }

    function getCoffeeWithType(req, res, mysql, context, complete){
        var query = "SELECT coffeeID, type, volumeOfCoffeeInGrams, volumeOfWaterInLiters, additive, brewTime, price, specialRequest FROM Coffees WHERE type = " + mysql.pool.escape(req.params.s)
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.coffees = results
            console.log(context)
            complete()
        })
    }

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getCoffees(res, mysql, context, complete);
        function complete(){
            console.log(context)
            res.render('coffees', context);
        }
    });

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getCoffeeWithType(req, res, mysql, context, complete);
        function complete(){
            res.render('coffees', context);
        }
    });

    router.get('/:id', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getCoffee(res, mysql, context, req.params.id, complete);
        function complete(){
            res.render('update-coffee', context);
            console.log(context)
        }
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Coffees SET type=?, volumeOfCoffeeInGrams=?, volumeOfWaterInLiters=?, additive=?, brewTime=?, price=?, specialRequest=? WHERE coffeeID=?";
        var inserts = [req.body.type, req.body.volumeOfCoffeeInGrams, req.body.volumeOfWaterInLiters, req.body.additive, req.body.brewTime, req.body.price, req.body.specialRequest, req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log(results)
                console.log(fields)
                res.status(200);
                res.end();
            }
        });
    });


    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Coffees (type, volumeOfCoffeeInGrams, volumeOfWaterInLiters, additive, brewTime, price, specialRequest) VALUES (?,?,?,?,?,?,?)";
        var inserts = [req.body.type, req.body.volumeOfCoffeeInGrams, req.body.volumeOfWaterInLiters, req.body.additive, req.body.brewTime, req.body.price, req.body.specialRequest];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/coffees/');
            }
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Coffees WHERE coffeeID = ?";
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