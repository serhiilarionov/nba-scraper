'use strict';
var nodemailer = require('nodemailer'),
	  moment = require('moment'),
	mailConfig = require('../../config/mailConfig');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'scrapguard@gmail.com',
		pass: 'vlujqiMKFGyoI9x'
	}
});
var sendMail = {};

sendMail.error = function (mail, code) {

	!mail.from && (mail.from = mailConfig.from);
	!mail.to &&	(mail.to = mailConfig.to);
	!mail.subject  && (mail.subject = mailConfig.subject);
	!code && (code = '');

	mail.text && (mail.text = moment().format('DD MMM, YYYY - hh:mm:ss')+ ' ' + mail.text);
	mail.html && (mail.html = moment().format('DD MMM, YYYY - hh:mm:ss')+ ' ' + mail.html);

		transporter.sendMail(mail, function (err, info) {
		if (err) {
			return console.error(err);
		}
		console.log('Message sent: ' + info.response);
	});
	console.log(moment().format('DD MMM, YYYY - HH:MM:SS') + ' Forever detected script exited with code ' + code);
};

module.exports = sendMail;