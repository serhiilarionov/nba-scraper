var path = require('path'),
	env = process.env.NODE_ENV || 'development',
	moment = require('moment');


var mailConfig = {
	development: {
		from : 'ScrapeApp  Guard <scrapguard@gmail.com>',
		//to : 'preedee@gmail.com, sunnystas@gmail.com',
    to : 'sunnystas@gmail.com',
		subject : 'NBA Scrap App crashed',
		text:  moment().format('DD MMM, YYYY - hh:mm:ss') + 'Forever detected script exited with error',
		html: '<b>' + moment().format('DD MMM, YYYY - hh:mm:ss') + '</b> Forever detected script exited with error'
	},

	test: {
		from : 'ScrapeApp Guard <scrapguard@gmail.com>',
		to : 'mr.malishuk@gmail.com, preedee@gmail.com, sunnystas@gmail.com',
		subject : 'NBA Scrap App crashed',
		text:  'Forever detected script exited with error',
		html: '<b>' + moment().format('DD MMM, YYYY - hh:mm:ss') + '</b> Forever detected script exited with error'
	},

	production: {
		from : 'ScrapeApp Guard <scrapguard@gmail.com>',
		to : 'mr.malishuk@gmail.com, preedee@gmail.com, sunnystas@gmail.com',
		subject : 'NBA Scrap App crashed',
		text:  moment().format('DD MMM, YYYY - hh:mm:ss') + 'Forever detected script exited with error',
		html: '<b>' + moment().format('DD MMM, YYYY - hh:mm:ss') + '</b> Forever detected script exited with error'
	}
};

module.exports = mailConfig[env];
