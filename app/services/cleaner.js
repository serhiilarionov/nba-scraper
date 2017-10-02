'use strict';
var db = require('../models')
	, moment = require('moment');

module.exports = function () {
	return db.Game.getOldGames( moment().subtract(48, 'h').format('YYYY-MM-DD hh:mm') )
		.then(function (games) {
			var gameIds = [];
			for(var i = 0; i < games.length; i++) {
				gameIds.push(games[i].id);
			}
			return gameIds;
		})
		.tap(function (gameIds) {
			db.Game.destroy({
				where: {
					id: {
						$in: gameIds
					}
				}
			})
		})
		.tap(function (gameIds) {
			db.Odds.destroy({
				where: {
					game_id: {
						$in: gameIds
					}
				}
			})
		})
		.then(function (gameIds) {
			db.OddsRunline.destroy({
				where: {
					game_id: {
						$in: gameIds
					}
				}
			})
		})
};