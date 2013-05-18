var port = 8004; //Change to port for recipes
var oldPort = 10100; //Change to port for old recipes

var express = require('express');
var fs = require('fs');
var httpProxy = require('http-proxy');

var app = express();

//development environment
app.configure('development', function () {
    //serve the static assets
    app.use(express.static('app'));
    //use requirejs-glob middleware
    app.use(require('requirejs-glob')());
});

app.use(express.bodyParser());

var marklogicProxy = httpProxy.createServer(port, 'localhost');
var oldMarklogicProxy = httpProxy.createServer(oldPort, 'localhost');

app.configure(function () {
    app.use(require('connect-restreamer')());
    app.use('/marklogic', marklogicProxy);
    app.use('/oldmarklogic', oldMarklogicProxy);
});

app.listen(3000);
