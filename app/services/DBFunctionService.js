'use strict';

var Promise = require('bluebird');
var Sequelize = require('sequelize'),
	config = require('../../config/config');

var sequelize = new Sequelize(config.db.connString);

var DBFunctionService = {};

DBFunctionService.getSportId = function(name) {
	return new Promise(function(resolve, reject){
		sequelize.query('SELECT id FROM sport WHERE	 LOWER("name") = \''+ name.toLowerCase() + '\'')
			.then(function(data) {
				if(data[0].length) {
					resolve(data[0][0].id)
				} else {
					resolve(null);
				}
			})
			.catch(function(err) {
				reject(err);
			});
	});
};

DBFunctionService.getPeriodId = function(sport_id, desc) {
	return new Promise(function(resolve, reject){
    if (sport_id == 0) sport_id = 1;
		sequelize.query('SELECT id FROM period WHERE "sport_id" = ' + sport_id + ' AND LOWER("desc") = \'' + desc.toLowerCase() + '\'' )
			.then(function(data) {
				if(data[0].length) {
					resolve(data[0][0].id)
				} else {
					resolve(null);
				}
			})
			.catch(function(err) {
				reject(err);
			});
	});
};

module.exports =  DBFunctionService;
