"use strict";

var async = require('async');

module.exports = function (sequelize, DataTypes) {

  var Game = sequelize.define('Game', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    datetime: DataTypes.DATE,
    away_id: DataTypes.INTEGER,
    home_id: DataTypes.INTEGER,
    away_score: DataTypes.INTEGER,
    home_score: DataTypes.INTEGER,
    winner_id: DataTypes.INTEGER,
    source_url: DataTypes.STRING(200),
    box_score_url: DataTypes.STRING(200),
    espn_id: DataTypes.INTEGER,
    season_id: DataTypes.INTEGER,
    sport_id: DataTypes.INTEGER,
    week_no: DataTypes.INTEGER
  }, {
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        name: 'get_current_season_games',
        fields: ['home_id', 'away_id', 'datetime',{attribute: 'datetime', order: 'ASC'}]
      },
      {
        unique: true,
        name: 'espn_id_index',
        fields: ['espn_id']
      }
    ],
    timestamps: true,
    freezeTableName: true,
    tableName: 'game',
    classMethods: {
      saveGame: function(game) {
        return Game.findOrCreate({
            where: {
              espn_id: game.espn_id
            },
            defaults: game
          })
          .spread(function (gameDBRecord, isCreated) {

            function updateScores(game, dbRecord, periods) {
              return new Promise(function (resolve, reject) {
                var scores = [];
                game.scores.away.forEach(function (score, index) {
                  if (!isNaN(game.scores.away[index]) && !isNaN(game.scores.home[index]) || game.scores.home[index] === '-' || game.scores.away[index] === '-') {
                    scores.push({
                      game_id: dbRecord.id,
                      period_id: periods[index].id,
                      period: index + 1,
                      away_id: game.away_id,
                      home_id: game.home_id,
                      away_score: game.scores.away[index],
                      home_score: game.scores.home[index]
                    });
                  }
                });
                async.waterfall([
                  function (cb) {
                    sequelize.models.Score.destroy({
                        where: {
                          game_id: dbRecord.id
                        }
                      })
                      .then(function (affectedRows) {
                        cb();
                      })
                      .catch(cb);
                  },
                  function (cb) {
                    sequelize.models.Score.bulkCreate(scores)
                      .then(function () {
                        cb(null, scores);
                      })
                      .catch(cb);
                  }
                ], function (err, scores) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(scores);
                  }
                });
              });
            }

            var sportId = game.sport_id;
            return sequelize.models.Period.findAll({
                where: {
                  sport_id: sportId
                },
                order: 'index ASC'
              })
              .then(function (periods) {
                if (isCreated) {
                  //  Add scores to newly created game
                  return updateScores(game, gameDBRecord, periods);
                } else {
                  //  Update already present game scores
                  gameDBRecord.away_score = game.away_score;
                  gameDBRecord.home_score = game.home_score;
                  gameDBRecord.away_id = game.away_id;
                  gameDBRecord.home_id = game.home_id;
                  gameDBRecord.winner_id = game.winner_id;
                  gameDBRecord.box_score_url = game.box_score_url;
                  gameDBRecord.espn_id = game.espn_id;
                  gameDBRecord.datetime = game.datetime;
                  gameDBRecord.season_id = game.season_id;
                  gameDBRecord.week_no = game.week_no;

                  return gameDBRecord.save()
                    .then(function () {
                      return updateScores(game, gameDBRecord, periods);
                    });
                }
              });
          });
      },
      resolveGame: function(sportId, gameDate, awayTeam, homeTeam) {
        return sequelize.query('SELECT \
          g.id  AS "game_id", \
          g.espn_id  AS "espn_id", \
          g.box_score_url AS "score_link", \
          at.id AS "away_team_id", \
          ht.id AS "home_team_id", \
          at.full_name, \
          ht.full_name \
        FROM game g \
          LEFT JOIN sport_team at ON g.away_id = at.id \
          LEFT JOIN sport_team ht ON g.home_id = ht.id \
        WHERE \
          (g.datetime AT TIME ZONE \'America/New_York\') :: DATE = :gameDate :: DATE \
          AND g.sport_id = :sportId \
          AND (at.full_name LIKE regexp_replace(:awayTeam, \'[^a-zA-Z\%\ ]\', \'%\', \'g\') \
          OR ht.full_name LIKE regexp_replace(:homeTeam, \'[^a-zA-Z\%\ ]\', \'%\', \'g\')) \
          LIMIT 1;',
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
              awayTeam: '%' + awayTeam + '%',
              homeTeam: '%' + homeTeam + '%',
              gameDate: '%' + gameDate + '%',
              sportId: sportId
            }
          })
          .then(function(result) {
            if(!result || result.length === 0) {
              return null;
            }
            return {
              gameId: result[0].game_id,
              espnId: result[0].espn_id,
              scoreLink: result[0].score_link,
              awayTeamId: result[0].away_team_id,
              homeTeamId: result[0].home_team_id
            }
          });
      },
      getOldGames: function (date) {
        return sequelize.query("SELECT id FROM game WHERE (SELECT COUNT(*) FROM score WHERE game_id = game.id) = 0 AND datetime <= :date",
          {
            type: sequelize.QueryTypes.SELECT,
            replacements: {
              date: date
            }
          })
      }
    }
  });

  return Game;
};
