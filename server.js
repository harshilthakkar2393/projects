/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Harshil Dineshbhai Thakkar Student ID: 160431219 Date: 21-feb-2023
*
*  Cyclic Web App URL: https://joyous-veil-hen.cyclic.app/
*
*  GitHub Repository URL: https://github.com/harshilthakkar2393/web322-app
*
********************************************************************************/

var express = require("express");
var app = express();
var path = require("path");
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const { getPublishedPosts, getAllPosts, getCategories, addPost } = require("./blog-service.js");
var blog_service = require("./blog-service.js")

var HTTP_PORT = process.env.PORT || 8080;

cloudinary.config({
    cloud_name: 'ddm7nnrzu',
    api_key: '912444766854669',
    api_secret: 'KRmvox96OlKSackUFOWwWP-g2gk',
    secure: true
});
const upload = multer(); // no { storage: storage }

// the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(express.static(path.join(__dirname, 'public')));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
    res.redirect("/about");
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});
// setup another route to listen on /blog
app.get("/blog", function (req, res) {
    getPublishedPosts().then((data) => { res.send(data) }).catch((err) => { res.send(`message:${err}`) });
    // console.log(blog_service.posts[2]);
});
// setup another route to listen on /categories
app.get("/categories", function (req, res) {
    getCategories().then((data) => { res.send(data) }).catch((err) => { res.send(`message:${err}`) });
});
// setup another route to listen on /posts
app.get("/posts", function (req, res) {

    // query by category 
    if (req.query.category) {

        blog_service.getPostsByCategory(req.query.category).then((data) => { res.send(data) }).catch((data) => { res.send(data) });

    }
    // query my date
    else if (req.query.minDate) {
        blog_service.getPostsByMinDate(req.query.minDate).then((data) => { res.send(data) }).catch((data) => { res.send(data) });

    }
    // all posts
    else {

        console.log(req.query.category);
        getAllPosts().then((data) => { res.send(data) }).catch((err) => { res.send(`message:${err}`) });
    }
});

// setup another route to listen on /posts/add
app.get("/posts/add", function (req, res) {

    res.sendFile(path.join(__dirname, "/views/addPost.html"));
});
// returns post by id 
app.get("/posts/:value", function (req, res) {
    console.log(req.params.value);
    if (toString(req.params.value) == "add") {
        res.redirect("/posts/add");
    }
    else if (isFinite(req.params.value)) {

        blog_service.getPostsById(req.params.value).then((data) => { res.send(data) }).catch((data) => { res.send(data) });
    }
    else {
        res.status(404).send("Page Not Found *404*");
    }
});


app.post("/posts/add", upload.single('featureImage'), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            processPost(uploaded.url);

        });
    } else {
        processPost("");
    }

    function processPost(imageUrl) {
        req.body.featureImage = imageUrl;
        var post = {};
        post.id=0;
        post.body = req.body.body;
        post.title = req.body.title;
        post.postDate=0;
        post.category = req.body.category;
        post.featureImage = req.body.featureImage;
        post.published = req.body.published;
        blog_service.addPost(post).then(() => { res.redirect("/posts") }).catch((error) => { console.log(error) });
    }

});


// 404 error
app.use((req, res) => {
    res.status(404).send("Page Not Found *404*");
});

// setup http server to listen on HTTP_PORT
blog_service.initialize().then(() => { app.listen(HTTP_PORT, onHttpStart); }).catch((error) => { console.log(error) });
