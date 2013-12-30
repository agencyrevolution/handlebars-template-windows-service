var restify = require('restify');
var Handlebars = require('handlebars');
var HandlebarsHelpers = require('handlebars-helpers');
var Moment = require('handlebars-helper-moment');
HandlebarsHelpers.register(Handlebars, {});
Moment.register(Handlebars, {});

Handlebars.registerHelper('compareNow', function(lvalue, options) {

    if (arguments.length < 2)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    firstDate = new Date(lvalue);

    operator = options.hash.operator || "==";

    var operators = {
        '==': function(l, r) {
            return l == r;
        },
        '===': function(l, r) {
            return l === r;
        },
        '!=': function(l, r) {
            return l != r;
        },
        '<': function(l, r) {
            return l < r;
        },
        '>': function(l, r) {
            return l > r;
        },
        '<=': function(l, r) {
            return l <= r;
        },
        '>=': function(l, r) {
            return l >= r;
        }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

    var result = operators[operator](firstDate, Date.now());

    if (result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('json', function(obj) {
    return JSON.stringify(obj, 4);
});


var server = restify.createServer({
    name: 'PowerTemplate'
});

server.use(restify.bodyParser({
    mapParams: true
}));

server.post('/PowerTemplate/full', respondFull);
server.post('/PowerTemplate/precompile', respondCompile);
server.post('/PowerTemplate/partial', respondPartial);
server.post('/PowerTemplate', respond);

server.listen(8888, '127.0.0.1', function() {
    console.log('%s listening at %s', server.name, server.url);
});

function respond(req, res, next) {

    var source, data;
    if (req.header('Content-Type') == 'application/json') {
        if (req.body.source) {
            source = req.body.source;
        } else {
            return res.send(400, {
                error: 'No Handlebars template. Please make sure that postedObject.source property is defined as string'
            });
        }
        if(typeof req.body.data === 'object') {
            data = req.body.data;
        } else {
            return res.send(400, {
                error: 'postedObject.data property is not a JSON object'
            });
        }
    } else {
        if (req.params.source) {
            source = req.params.source;
        } else {
            return res.send(400, {
                error: 'No Handlebars template. Please make sure that source is defined as string'
            });
        }
        try {
            data = JSON.parse(req.params.data);
        } catch (e) {
            return res.send(400, {
                error: 'data property is not a JSON object'
            });
        }
    }

    var template = Handlebars.compile(source);
    var data = template(data);
    res.contentType = 'text/html';
    res.header('Content-Type', 'text/html');
    res.send(data);
}

function respondFull(req, res, next) {
    var template = Handlebars.precompile(req.params.source);
    template = template.toString();
    //console.log(template);
    eval("var template2 = " + template);
    console.log(template2);
    var result = template2(JSON.parse(req.params.data));
    res.send(result);
    // var template = Handlebars.compile(req.params.source);
    // var result = template(JSON.parse(req.params.data));
    // res.send(result);
}

function respondCompile(req, res, next) {
    var template = Handlebars.precompile(req.params.source);
    template = template.toString();
    //var result = template(JSON.parse(req.params.data));
    res.send(template);
}

function respondPartial(req, res, next) {
    //console.log(req.params.source);
    eval("var template = " + req.params.source);
    var result = template(JSON.parse(req.params.data));
    res.send(result);
}