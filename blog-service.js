const { error } = require("console");
const fs = require("fs"); // required at the top of your module
const { type } = require("os");
var posts = [];
var categories = [];
var proxyPosts = new Array;
var cPosts = new Array;
var dPosts = new Array;
var idPosts = new Array;
module.exports = {

    initialize: function () {
        return new Promise(function (resolve, reject) {
            try {
                fs.readFile('data/posts.json', 'utf8', (err, data) => {
                    if (!err) {

                        posts = JSON.parse(data)
                        console.log(data);

                        try {
                            fs.readFile('data/categories.json', 'utf8', (err, data) => {
                                if (!err) {

                                    categories = JSON.parse(data)
                                    console.log(data);
                                    resolve();
                                }
                            });
                        } catch (err) {
                            reject("unable to read file");
                        }
                    }

                });
            } catch (err) {
                reject("unable to read file");
            }
        });
    },

    getAllPosts: function () {
        return new Promise(function (resolve, reject) {
            if (posts.length > 0) {
                resolve(posts)
            }
            else {
                reject("no results returned")
            }
        });
    },
    getPublishedPosts: function () {
        return new Promise(function (resolve, reject) {
            if (posts.length > 0) {

                for (var i = 0; i < posts.length; i++) {
                    {
                        if (posts[i].published = true)
                            proxyPosts.push(posts[i]);
                    }
                }
                resolve(proxyPosts)
            }
            else {
                reject("no results returned")
            }
        });
    },

    getCategories: function () {
        return new Promise(function (resolve, reject) {
            if (categories.length > 0) {
                resolve(categories)
            }
            else {
                reject("no results returned")
            }
        });
    },
    addPost: function (postData) {
        return new Promise(function (resolve, reject) {
            
            if (postData) {
                if (postData.published == undefined) {
                    postData.published = false;

                }
                else {
                    postData.published = true;
                }
                postData.id = posts.length + 1;
                postData.postDate= new Date().toJSON().slice(0,10);
                for(var i=0;i<categories.length;i++)
                {
                    if(postData.category==categories[i].category)
                    {
                        postData.category=categories[i].id;
                    }
                }
                posts.push(postData);
                resolve(postData);

            }
            else {
                reject("no results returned")
            }
        });
    },
    getPostsByCategory: function (category) {
        return new Promise(function (resolve, reject) {
            var found = false;
            category = parseInt(category);
            for (var i = 0; i < posts.length && !found; i++) {
                if (posts[i].category == category) {
                    found = true;
                }
            }
            if (found) {
                for (var i = 0; i < posts.length; i++) {
                    if (posts[i].category == category) {
                        cPosts.push(posts[i]);
                    }
                }
                console.log(cPosts);
                resolve(cPosts);
            }
            else {
                reject("no results returned")
            }
        });
    },
    getPostsByMinDate: function (minDate) {
        return new Promise(function (resolve, reject) {
            var found = false;
            for (var i = 0; i < posts.length && !found; i++) {
                if (new Date(posts[i].postDate) >= new Date(minDate)) {
                    found = true;
                }
            }
            if (found) {
                for (var i = 0; i < posts.length; i++) {
                    if (new Date(posts[i].postDate) >= new Date(minDate)) {
                        dPosts.push(posts[i]);
                    }
                }
                console.log(dPosts);
                resolve(dPosts);
            }
            else {
                reject("no results returned")
            }
        });
    },
    getPostsById: function (value) {
        return new Promise(function (resolve, reject) {
            var found = false;
            for (var i = 0; i < posts.length && !found; i++) {
                if (posts[i].id == value) {
                    found = true;
                }
            }
            if (found) {
                for (var i = 0; i < posts.length; i++) {
                    if (posts[i].id == value) {
                        idPosts.push(posts[i]);
                    }
                }
                console.log(idPosts);
                resolve(idPosts);
            }
            else {
                reject("no results returned")
            }
        });
    },
};