//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const res = require("express/lib/response");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////// REQUESTS TARGETING ALL ARTICLES ///////////////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });

        newArticle.save((err) => {
            if (!err) {
                res.send("A new article is successfully added.");
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("All documents are successfully deleted.");
            } else {
                res.send(err);
            }
        });
    });

/////////////////////////// REQUESTS TARGETING A SPECIFIC ARTICLE ///////////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (req.params.articleTitle) {
                res.send(req.params.articleTitle);
            } else {
                res.send("No articles with the name " + req.params.articleTitle + " is found.");
            }
        });
    })

    .put((req, res) => {
        Article.replaceOne({
                title: req.params.articleTitle
            }, req.body,
            (err) => {
                if (!err) {
                    res.send("A document successfully updated.");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .patch((req, res) => {
        Article.updateOne({
                title: req.params.articleTitle
            }, req.body,
            (err) => {
                if (!err) {
                    res.send("A document successfully updated.");
                } else {
                    res.send(err);
                }
            }
        );
    })
    
    .delete((req,res) => {
        Article.deleteOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (err) {
                res.send(err);
            } else {
                res.send(req.params.articleTitle + " is successfully deleted.");
            }
        });
    });



app.listen(3000, function () {
    console.log("Server started on port 3000");
});