module.exports = function(){
    var express = require('express')
    var router = express.Router()

    function getTeas(res, mysql, context, complete){
        let query = "SELECT teaID, origin, color, matcha, flavor, season, price FROM Teas"
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.teas = results
            complete()
        })
    }

    function getTea(res, mysql, context, id, complete){
        var sql = "SELECT teaID, origin, color, matcha, flavor, season, price FROM Teas WHERE teaID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.tea = results[0];
            complete();
        });
    }

    function getTeaWithOrigin(req, res, mysql, context, complete){
        var query = "SELECT teaID, origin, color, matcha, flavor, season, price FROM Teas WHERE origin = " + mysql.pool.escape(req.params.s)
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.teas = results
            console.log(context)
            complete()
        })
    }

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getTeas(res, mysql, context, complete);
        function complete(){
            console.log(context)
            res.render('teas', context);
        }
    });

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getTeaWithOrigin(req, res, mysql, context, complete);
        function complete(){
            res.render('teas', context);
        }
    });

    router.get('/:id', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getTea(res, mysql, context, req.params.id, complete);
        function complete(){
            res.render('update-tea', context);
            console.log(context)
        }
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Teas SET origin=?, color=?, matcha=?, flavor=?, season=?, price=? WHERE teaID=?";
        var inserts = [req.body.origin, req.body.color, req.body.matcha, req.body.flavor, req.body.season, req.body.price, req.params.id];
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
        var sql = "INSERT INTO Teas (origin, color, matcha, flavor, season, price) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.origin, req.body.color, req.body.matcha, req.body.flavor, req.body.season, req.body.price];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/teas/');
            }
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Teas WHERE teaID = ?";
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