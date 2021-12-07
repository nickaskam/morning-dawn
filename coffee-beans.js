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

    function getBeans(res, mysql, context, complete){
        mysql.pool.query("SELECT beanID, countryOfOrigin, roastType FROM Beans", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.beans = results
            complete()
        })
    }

    function getBeansWithCoffees(res, mysql, context, complete){
        let sql = "SELECT Coffees.coffeeID, Beans.beanID, Coffees.type as type, Beans.countryOfOrigin as countryOfOrigin, Beans.roastType as roastType FROM BeansWithCoffees INNER JOIN Beans on BeansWithCoffees.beanID = Beans.beanID INNER JOIN Coffees on BeansWithCoffees.coffeeID = Coffees.coffeeID"
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.beans_with_Coffees = results
            complete()
        })
    }

    router.get('/', function(req, res){
        var callbackCount = 0
        var context = {}
        var mysql = req.app.get('mysql')
        var handlebars_file = 'beans-coffee'

        getBeans(res, mysql, context, complete)
        getCoffees(res, mysql, context, complete)
        getBeansWithCoffees(res, mysql, context, complete)
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
        var sql = "INSERT INTO BeansWithCoffees (coffeeID, beanID) VALUES (?,?)";
        var inserts = [req.body.coffeeID, req.body.beanID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/beans-coffee/');
            }
        });
    });

    return router
}()