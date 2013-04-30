var port = 8004; //Change to port for recipes

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

app.configure(function () {
    app.use(require('connect-restreamer')());
    app.use('/marklogic', marklogicProxy);
});

app.listen(3000);
