const { query } = require('express')

module.exports = function(){
    var express = require('express')
    var router = express.Router()

    function getBeans(res, mysql, context, complete){
        let query = "SELECT beanID, countryOfOrigin, roastType, DATE_FORMAT(roastDate,'%Y-%m-%d') AS roastDate FROM Beans"
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.beans = results
            complete()
        })
    }

    function getBean(res, mysql, context, id, complete){
        var sql = "SELECT beanID, countryOfOrigin, roastType, DATE_FORMAT(roastDate,'%Y-%m-%d') AS roastDate FROM Beans WHERE beanID = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.bean = results[0];
            complete();
        });
    }

    function getBeanWithCountry(req, res, mysql, context, complete){
        var query = "SELECT Beans.beanID, countryOfOrigin, roastType, DATE_FORMAT(roastDate,'%Y-%m-%d') AS roastDate FROM Beans WHERE countryOfOrigin = " + mysql.pool.escape(req.params.s)
        console.log(query)
        mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error))
                res.end()
            }
            context.beans = results
            console.log(context)
            complete()
        })
    }

    router.get('/', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getBeans(res, mysql, context, complete);
        function complete(){
            console.log(context)
            res.render('beans', context);
        }
    });

    /*Display all people whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getBeanWithCountry(req, res, mysql, context, complete);
        function complete(){
            res.render('beans', context);
        }
    });

    router.get('/:id', function(req, res){
        var context = {};
        var mysql = req.app.get('mysql');
        getBean(res, mysql, context, req.params.id, complete);
        function complete(){
            res.render('update-bean', context);
            console.log(context)
        }
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE Beans SET countryOfOrigin=?, roastType=?, roastDate=? WHERE beanID=?";
        var inserts = [req.body.countryOfOrigin, req.body.roastType, req.body.roastDate, req.params.id];
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
        var sql = "INSERT INTO Beans (countryOfOrigin, roastType, roastDate) VALUES (?,?,?)";
        var inserts = [req.body.countryOfOrigin, req.body.roastType, req.body.roastDate];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/beans/');
            }
        });
    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Beans WHERE beanID = ?";
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
