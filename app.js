var express = require("express");
var bodyParser = require("body-parser");

var app = express();

var models = require("./models");

models.sequelize.sync({force:true}).then(function(){
    console.log("Tables were created.");

    app.set("view engine", "ejs");
    app.set("views", __dirname + "/views");
    
    app.use(bodyParser.urlencoded({
        extended:true
    }));

    app.use("/public", express.static("public"));
    
    app.get("/", function(req, res, next) {
        var id = parseInt(req.query.q,10);
        console.log(req);
        if(isNaN(id)){
            res.render("pages/landing");
        }else{
            models.Url.findById(id).then(function(obj){ 
                if (obj == null){
                   var error = new Error("ERROR! Object doesn't found at database.");
                   error.status = 404;
                   next(error);
                }else{
                    res.render("pages/redirect", {
                        url:obj
                    });
                }
            });
        }
    });

    app.post("/create", function(req,res){
        models.Url.create({
            url: req.body.url,
            desc: req.body.desc
        }).then(function(obj){ 
            res.redirect("/created?id=" + obj.id); 
        });
    });

    app.get("/created", function(req, res){
        var id = parseInt(req.query.id,10);
        models.Url.findById(id).then(function(obj){
            if(obj == null){
                res.end("Error")
            } else{
                res.render("pages/created", {
                    url:obj
                });
            }
        });
    
    })

    app.get("/test-error", function(req,res){
        var error = new Error ("TEST123");
        error.status = 404;
        throw error;
    });

    app.use(function(err, req, res, next){
        var status = 500;
        if(err.status){
            status=err.status;
        }
        console.log("ERROR aufgetreten");
        console.error(err.stack);
        res.status(status).send('Something broke :/');
    });
    
    app.listen(8080, function(){
        console.log("Webserver was started on port 8080.")
    });
})