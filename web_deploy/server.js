/*global require,process,__dirname*/
(function () {

    var express = require('express');
    var http = require('http');
    var path = require('path');

    var app = express();

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/docs');

    app.set('view engine', 'html');
    app.engine('html', require('ejs').renderFile);
    //app.use(expressLayouts);
    //app.set('layout', 'layout');

    //app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'docs')));

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    app.get('/', function (req, res) {
        res.render('index.html', { title: '' });
    });
    app.get('/guide*', function (req, res) {
        res.render('index.html', { title: '' });
    });
    app.get('/api*', function (req, res) {
        res.render('index.html', { title: '' });
    });
    app.get('/tutorial*', function (req, res) {
        res.render('index.html', { title: '' });
    });

    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

})();

