'use strict';
var forever = require('forever-monitor'),
	moment = require('moment'),
	sendMail = require('./app/services/sendErrorInMail');

var app = new (forever.Monitor)('app.js');

app.on('exit:code', function (code) {
	sendMail.error({
		text: moment().format('DD MMM, YYYY - hh:mm:ss') + ' Forever detected script exited with code ' + code,
		html: '<b>' + moment().format('DD MMM, YYYY - hh:mm:ss') + '</b> Forever detected script exited with code <b>' + code + '</b>'
	}, code);

});

app.start();
