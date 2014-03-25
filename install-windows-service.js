var Service = require('node-windows').Service;
var Path = require("path");

var nodeAppPath = Path.resolve('./powertemplate.js');
console.log(nodeAppPath);

// Create a new service object
var svc = new Service({
	name: 'Agency Rev Power Template Engine',
	description: 'Using Handlebars to convert template and JSON to Html content.',
	script: nodeAppPath,
	wait: 2,
	grow: 0.5,
	maxRetries: 3
});

// Listen for the "install" event, which indicates the process is available as a service.
svc.on('install', function() {
	console.log('Starting service...');
	svc.start();
	console.log('Service started');
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function() {
	console.log('Uninstall complete.');
	console.log('The service exists: ', svc.exists);
});

// install the service
setTimeout(function() {
	console.log('Installing service...');
	svc.install();
}, 3000);

// Uninstall the service.
//svc.uninstall();