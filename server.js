var Hapi = require('hapi');
var server = new Hapi.Server();
var Handlebars = require('handlebars');
var routes = require ('./routes.js');

server.connection({
  port: process.env.PORT || 8000
});

server.views({
	engines: {
		html: require('handlebars')
	},
	path: __dirname + '/public/templates'
});

server.register(require('hapi-auth-cookie'), function (err) {
    server.auth.strategy('session', 'cookie', {
        password: 'password',
        cookie: 'sid-example',
        isSecure: false
    });
});

server.register(require('bell'), function(err){
    server.auth.strategy('github', 'bell', {
        provider: 'github',
        password: 'password',
        clientId: process.env.APPID,
        clientSecret: process.env.APPSECRET,
        isSecure: false,
        providerParams: {
            redirect_uri: server.info.uri + '/login'
        }
    });
});

server.route(routes);

server.start();
