module.exports = function(){
    var express = require('express')
    var router = express.Router()
    
    function getTeas(res, mysql, context, complete){
        mysql.pool.query("SELECT teaID, origin FROM Teas", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.teas = results
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

    function getTeaOrders(res, mysql, context, complete){
        let sql = "SELECT Teas.teaID, Orders.orderID, Teas.origin as origin, Orders.orderTotal as orderTotal FROM TeaOrders INNER JOIN Teas on TeaOrders.teaID = Teas.teaID INNER JOIN Orders on TeaOrders.orderID = Orders.orderID"
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.tea_orders = results
            complete()
        })
    }

    router.get('/', function(req, res){
        var callbackCount = 0
        var context = {}
        var mysql = req.app.get('mysql')
        var handlebars_file = 'tea-orders'

        getTeas(res, mysql, context, complete)
        getOrders(res, mysql, context, complete)
        getTeaOrders(res, mysql, context, complete)
        function complete(){
            callbackCount++
            if(callbackCount >= 3){
                res.render(handlebars_file, context)
                console.log(context)
            }
        }
    })

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO TeaOrders (teaID, orderID) VALUES (?,?)";
        var inserts = [req.body.teaID, req.body.orderID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/tea-orders/');
            }
        });
    });

    return router
}()