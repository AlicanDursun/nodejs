var express = require('express');
var bodyParser = require('body-parser');
var sql = require("mssql");
var app = express();


var port = process.env.port || 3000
app.listen(port, () => {
    console.log("3000 portunda servis aktif");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

var dbConfig = {
    user: "sa",
    password: "j23xmh8v5",
    server: "PLEISTARCHOS",
    database: "FlutterDeneme",
};
var executeQuery = function(res, query) {
        sql.connect(dbConfig, function(err) {
            if (err) {
                console.log("Veri tabanına bağlanırken hata oluştu :- " + err);
                res.send(err);

            } else {
                // create Request object
                var request = new sql.Request();
                // query to the database
                request.query(query, function(err, rs) {
                    if (err) {
                        console.log("Sorgu hatası :- " + err);
                        res.send(err);
                        sql.close();
                    } else {
                        res.send(rs.recordset);
                        sql.close();
                    }
                });
            }
        });
    }
    //GET METODU
app.get("/api/users", function(req, res) {
    var query = "Select * from Login";
    executeQuery(res, query);
});

//POST METODU
app.post("/api/user", function(req, res) {
    var query = "INSERT INTO Login (kullaniciAdi,sifre) VALUES ('" + req.body.kullaniciAdi + "','" + req.body.sifre + "')";
    console.log(query);
    executeQuery(res, query);
});

//PUT METODU
app.put("/api/user/:id", function(req, res) {
    var query = "UPDATE Login SET kullaniciAdi= '" + req.body.kullaniciAdi + "' , sifre=  '" + req.body.sifre + "'  WHERE id= " + req.params.id;
    console.log(query);
    executeQuery(res, query);
});

// DELETE METODU
app.delete("/api/user/:id", function(req, res) {
    var query = "DELETE FROM Login WHERE id=" + req.params.id;
    console.log(query);
    executeQuery(res, query);
});