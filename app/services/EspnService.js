"use strict";

var Promise = require('bluebird'),
  request = require('request-promise'),
  db = require('../models'),
  moment = require('moment-timezone'),
  cheerio = require("cheerio"),
  _ = require('lodash');

/**
 * Request scoreboard for NHL by date
 * @param options
 * @returns Promise
 * @private
 */
function _requestNHLScoreboard(options) {
  return request({
    uri: 'http://espn.go.com/nhl/scoreboard',
    method: 'GET',
    qs: {
      lang: 'en',
      region: 'us',
      date: options.date
    },
    json: true
  });
}

/**
 * Request scoreboard for NBA by date
 * @param options
 * @returns Promise
 * @private
 */
function _requestNBAScoreboard(options) {
  return request({
    uri: 'http://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
    method: 'GET',
    qs: {
      lang: 'en',
      region: 'us',
      calendartype: 'blacklist',
      limit: 1000,
      dates: options.date
    },
    json: true
  });
}

/**
 * Request scoreboard for MLB by date
 * @param options
 * @returns Promise
 * @private
 */
function _requestMLBScoreboard(options) {
  return request({
    uri: 'http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
    method: 'GET',
    qs: {
      lang: 'en',
      region: 'us',
      calendartype: 'blacklist',
      limit: 1000,
      dates: options.date
    },
    json: true
  });
}

/**
 * Request scoreboard for NFL by season year, type and week
 * @param options
 * @returns Promise
 * @private
 */
function _requestNFLScoreboard(options) {
  return request({
    uri: 'http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
    method: 'GET',
    qs: {
      lang: 'en',
      region: 'us',
      calendartype: 'blacklist',
      limit: 1000,
      dates: options.seasonYear || options.date,
      seasontype: options.seasonType || '',
      week: options.weekNumber || ''
    },
    json: true
  });
}

/**
 * Request Spread & Total, Moneyline, 1st and 2nd half and build DOM for each
 * @private
 */
function _requestNBAOdds() {
  return Promise.all([
      request({
        uri: 'http://www.covers.com/odds/basketball/nba-spreads.aspx',
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/basketball/nba-moneyline-odds.aspx',
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/basketball/nba-1st-half-lines.aspx',
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/basketball/nba-2nd-half-lines.aspx',
        method: 'GET',
        json: true
      })
    ])
    .then(function (results) {
      return {
        body: {
          spreadTotal: results[0],
          moneyline: results[1],
          firstHalf: results[2],
          secondHald: results[3]
        },
        dom: {
          spreadTotal: cheerio.load(results[0], {normalizeWhitespace: true}),
          moneyline: cheerio.load(results[1], {normalizeWhitespace: true}),
          firstHalf: cheerio.load(results[2], {normalizeWhitespace: true}),
          secondHald: cheerio.load(results[3], {normalizeWhitespace: true})
        }
      };
    })
    .catch(function (err) {
      console.error(err);
      return null;
    });
}

/**
 * Request Spread & Total, Moneyline, 1st and 2nd half and build DOM for each
 * @private
 */
function _requestNFLOdds() {
  return Promise.all([
      request({
        uri: 'http://www.covers.com/odds/basketball/nba-spreads.aspx',
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/basketball/nba-moneyline-odds.aspx',
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/basketball/nba-1st-half-lines.aspx',
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/basketball/nba-2nd-half-lines.aspx',
        method: 'GET',
        json: true
      })
    ])
    .then(function (results) {
      return {
        body: {
          spreadTotal: results[0],
          moneyline: results[1],
          firstHalf: results[2],
          secondHald: results[3]
        },
        dom: {
          spreadTotal: cheerio.load(results[0], {normalizeWhitespace: true}),
          moneyline: cheerio.load(results[1], {normalizeWhitespace: true}),
          firstHalf: cheerio.load(results[2], {normalizeWhitespace: true}),
          secondHald: cheerio.load(results[3], {normalizeWhitespace: true})
        }
      };
    })
    .catch(function (err) {
      console.error(err);
      return null;
    });
}

/**
 * Request Spread & Total, Moneyline, 1st and 2nd half and build DOM for each
 * @private
 */
function _requestNFLOdds() {
  return Promise.all([
      request({
        uri: 'http://www.covers.com/odds/football/nfl-spreads.aspx',
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/football/nfl-moneyline-odds.aspx',
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/football/nfl-1st-half-lines.aspx',
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/football/nfl-2nd-half-lines.aspx',
        method: 'GET',
        json: true
      })
    ])
    .then(function (results) {
      return {
        body: {
          spreadTotal: results[0],
          moneyline: results[1],
          firstHalf: results[2],
          secondHald: results[3]
        },
        dom: {
          spreadTotal: cheerio.load(results[0], {normalizeWhitespace: true}),
          moneyline: cheerio.load(results[1], {normalizeWhitespace: true}),
          firstHalf: cheerio.load(results[2], {normalizeWhitespace: true}),
          secondHald: cheerio.load(results[3], {normalizeWhitespace: true})
        }
      };
    })
    .catch(function (err) {
      console.error(err);
      return null;
    });
}

/**
 * FOR MLB: Request Moneyline, Runline and build DOM for each
 * @private
 */
function _requestMLBOdds() {
  return Promise.all([
      request({
        uri: 'http://www.covers.com/odds/baseball/mlb-odds.aspx', // Moneyline
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/baseball/mlb-runline-odds.aspx', // Runline
        method: 'GET',
        json: true
      })
    ])
    .then(function (results) {
      return {
        body: {
          moneyline: results[0],
          runline: results[1],
        },
        dom: {
          moneyline: cheerio.load(results[0], {normalizeWhitespace: true}),
          runline: cheerio.load(results[1], {normalizeWhitespace: true})
        }
      };
    })
    .catch(function (err) {
      console.error(err);
      return null;
    });
}

/**
 * FOR MLB: Request Moneyline, Runline and build DOM for each
 * @private
 */
function _requestNHLOdds() {
  return Promise.all([
      request({
        uri: 'http://www.covers.com/odds/hockey/nhl-odds.aspx', // Moneyline
        method: 'GET',
        json: true
      }),
      request({
        uri: 'http://www.covers.com/odds/hockey/nhl-puckline-odds.aspx', // Runline
        method: 'GET',
        json: true
      })
    ])
    .then(function (results) {
      return {
        body: {
          moneyline: results[0],
          puckline: results[1]
        },
        dom: {
          moneyline: cheerio.load(results[0], {normalizeWhitespace: true}),
          puckline: cheerio.load(results[1], {normalizeWhitespace: true})
        }
      };
    })
    .catch(function (err) {
      console.error(err);
      return null;
    });
}

/**
 * Request futures odds for MLB
 * @returns Promise
 * @private
 */
function _requestMLBFuturesOdds() {
  return request({
    uri: 'http://www.covers.com/odds/baseball/mlb-futures.aspx',
    method: 'GET',
    json: true
  })
    .then(function (result) {
      return {
        body: result,
        dom: cheerio.load(result, {normalizeWhitespace: true})
      };
    })
    .catch(function (err) {
      console.error(err);
      return null;
    });
}

/**
 * Request futures odds for NHL
 * @returns Promise
 * @private
 */
function _requestNHLFuturesOdds() {
  return request({
    uri: 'http://www.covers.com/odds/hockey/nhl-futures.aspx',
    method: 'GET',
    json: true
  })
    .then(function (result) {
      return {
        body: result,
        dom: cheerio.load(result, {normalizeWhitespace: true})
      };
    })
    .catch(function (err) {
      console.error(err);
      return null;
    });
}

/**
 * Request futures odds for NBA
 * @returns Promise
 * @private
 */
function _requestNBAFuturesOdds() {
  return request({
    uri: 'http://www.covers.com/odds/basketball/nba-futures.aspx',
    method: 'GET',
    json: true
  })
    .then(function (result) {
      return {
        body: result,
        dom: cheerio.load(result, {normalizeWhitespace: true})
      };
    })
    .catch(function (err) {
      console.error(err);
      return null;
    });
}

/**
 * Request futures odds for NBA
 * @returns Promise
 * @private
 */
function _requestNFLFuturesOdds() {
  return request({
    uri: 'http://www.covers.com/odds/football/nfl-futures.aspx',
    method: 'GET',
    json: true
  })
    .then(function (result) {
      return {
        body: result,
        dom: cheerio.load(result, {normalizeWhitespace: true})
      };
    })
    .catch(function (err) {
      console.error(err);
      return null;
    });
}

module.exports = {
  /**
   * Get scoreboard for sport
   * @param sport - type [NFL | NBA]
   * @param options
   * @returns Promise
   */
  getScoreboard: function (sport, options) {
    var sportId = null;
    sport = sport.toUpperCase();
    var warnings = [];

    return Promise.resolve()
      .then(function () {
        return db.Sport.getSportIdByName(sport);
      })
      .then(function (sport_id) {
        sportId = sport_id;
        if (sport === 'NBA') {
          return _requestNBAScoreboard(options);
        } else if (sport === 'NFL') {
          return _requestNFLScoreboard(options);
        } else if (sport === 'MLB') {
          return _requestMLBScoreboard(options);
        } else {
          return Promise.resolve([]);
        }
      })
      .then(function (response) {
        //  Parse games
        var weekNumber = response.week ? response.week.number : null;
        var events = response.events;
        if (!events || events.length === 0) {
          return Promise.resolve([]);
        }
        return Promise.map(events, function (event) {
          var datetime = moment.tz(new Date(event.date), "America/New_York").format();

          return db.Season.getSeasonId(sport, datetime)
            .then(function (seasonId) {
              var winner;
              var competitors = event.competitions[0].competitors;
              for (var j = 0; j < competitors.length; j++) {
                if (competitors[j].homeAway == "home") {
                  var home_abbreviation = competitors[j].team.abbreviation;
                  var home_full_name = competitors[j].team.displayName;
                  var home_final_score = competitors[j].score;
                  var home_scores = [];
                  if (competitors[j].winner) {
                    winner = competitors[j].team.abbreviation;
                  }
                  var linescores = competitors[j].linescores;
                  if (linescores == undefined) {
                    continue;
                  }
                  for (var k = 0; k < linescores.length; k++) {
                    var score = linescores[k].value;
                    if (score) {
                      home_scores.push(score);
                    } else {
                      home_scores.push(0);
                    }
                  }
                }
                if (competitors[j].homeAway == "away") {
                  var away_abbreviation = competitors[j].team.abbreviation;
                  var away_full_name = competitors[j].team.displayName;
                  var away_final_score = competitors[j].score;
                  var away_scores = [];
                  if (competitors[j].winner) {
                    winner = competitors[j].team.abbreviation;
                  }
                  linescores = competitors[j].linescores;
                  if (linescores == undefined) {
                    continue;
                  }
                  for (k = 0; k < linescores.length; k++) {
                    score = linescores[k].value;
                    if (score) {
                      away_scores.push(score);
                    } else {
                      away_scores.push(0);
                    }
                  }
                }
              }
              var espn_id = event.id;
              var links = event.links;
              var box_score_url = 'http://espn.go.com/' + sport.toLowerCase() + '/boxscore?gameId=' + espn_id;

              /*
              * If count of away_scores > home_scores, add '-' periods to home_scores
              * else conversely, add '-' periods to away_scores
              */
              if (away_scores.length > home_scores.length) {
                let difference = away_scores.length - home_scores.length;
                for (let i = 0; i < difference; i++) {
                  home_scores.push('-');
                }
              } else if (away_scores.length < home_scores.length) {
                let difference = home_scores.length - away_scores.length;
                for (let i = 0; i < difference; i++) {
                  away_scores.push('-');
                }
              }

              return {
                season_id: seasonId,
                sport_id: sportId,
                //source_url: url,
                //period_id: game.period_id,
                //period: game.status.period,
                //time: game.time,
                datetime: datetime,
                away_id: null,
                home_id: null,
                away_score: parseInt(away_final_score) || 0,
                home_score: parseInt(home_final_score) || 0,
                box_score_url: box_score_url,
                espn_id: espn_id || null,
                winner_id: null,
                scores: {
                  away: away_scores,
                  home: home_scores
                },
                team_away_abbreviation: away_abbreviation,
                team_home_abbreviation: home_abbreviation,
                team_away_full_name: away_full_name,
                team_home_full_name: home_full_name,
                team_winner: winner,
                postponed: event.status.type.name === 'STATUS_POSTPONED',
                week_no: weekNumber || null
              };
            });
        });
      })
      .then(function (games) {
        if (!games || !games.length) {
          return Promise.resolve([]);
        }
        return Promise.map(games, function (game) {
          return Promise.all([
              db.SportTeam.resolveTeamId(
                sportId,
                game.team_away_abbreviation,
                game.team_away_full_name,
                "away",
                game.datetime,
                game.espn_id,
                "S",
                game.box_score_url
              ),
              db.SportTeam.resolveTeamId(
                sportId,
                game.team_home_abbreviation,
                game.team_home_full_name,
                "home",
                game.datetime,
                game.espn_id,
                "S",
                game.box_score_url
              )
            ])
            .then(function (teamIds) {
              game.away_id = teamIds[0];
              game.home_id = teamIds[1];
              if (game.team_winner == game.team_away_abbreviation) {
                game.winner_id = game.away_id;
              }
              if (game.team_winner == game.team_home_abbreviation) {
                game.winner_id = game.home_id;
              }

              if (!game.away_id) {
                warnings.push({
                  message: 'Team ' + game.team_away_full_name + ' not found in DB and added to exceptions'
                });
              }
              if (!game.home_id) {
                warnings.push({
                  message: 'Team ' + game.team_home_full_name + ' not found in DB and added to exceptions'
                });
              }
              delete game.team_away_abbreviation;
              delete game.team_home_abbreviation;
              delete game.team_away_full_name;
              delete game.team_home_full_name;
              delete game.team_winner;
              return game;
            });
        });
      })
      //  Remove postponed games from DB and games array
      .then(function (games) {
        if (!games || !games.length) {
          return Promise.resolve([]);
        }
        return Promise.filter(games, function (game) {
          if (game.postponed) {
            db.Game.destroy({
              where: {
                espn_id: game.espn_id
              }
            });
          }
          var filtered = game.postponed === false;
          delete game.postponed;
          return filtered;
        });
      })
      //  Save games to DB
      .then(function (games) {
        if (!games || !games.length) {
          return Promise.resolve([]);
        }
        return Promise.each(games, function (game) {
          return db.Game.saveGame(game);
        })
      })
      .then(function (games) {
        return {
          results: games,
          warnings: warnings
        };
      })
      .catch(function (err) {
        console.error(err);
        return err;
      });
  },

  _getScoreboardForNHL: function (options) {
    var sportId = null;
    var sport = 'NHL';
    var warnings = [];

    function getTeamScores(object) {
      var scores = object.children();
      var scoresArray = [];
      for (var i = 1; i < object.children().length-1; i++) {
        var scoreValue = +scores.eq(i).text();

        if (scoreValue)scoresArray.push(scoreValue);
        else scoresArray.push(0);
      }
      return scoresArray;
    }

    return Promise.resolve()
      /*Get sport id*/
      .then(function () {
        return db.Sport.getSportIdByName(sport);
      })
      /*Send request*/
      .then(function (sport_id) {
        sportId = sport_id;
        return _requestNHLScoreboard(options);
      })
      /*Parse games from html*/
      .then(function (response) {
        var parsedGames = [];
        var $ = cheerio.load(response, {
          normalizeWhitespace: true
        });
        var games = $('.mod-scorebox');
        for (var i = 0; i < games.length; i++) {
          var game = games[i];
          var isHome = /^.*-homeHeader$/g;
          var gameId = $('.game-header', game).attr('id');
          gameId = gameId.replace(/^(.*)-.*$/g, '$1');
          parsedGames.push({
            id: gameId,
            boxScoreURL: 'http://espn.go.com/' + sport.toLowerCase() + '/boxscore?gameId=' + gameId
          });
          var teams = [
            {
              abbreviation: $('.game-header-table tr', game).eq(0).text(),
              fullName: $('.game-details .team a', game).eq(0).text(),
              homeAway: isHome.test( $('.game-header-table tr', game).eq(0).attr('id') ) ? 'home' : 'away',
              scores: getTeamScores( $('.game-details tr', game).eq(1) ),
              finalScore: $('.game-details tr', game).eq(1).children().last().text()
            },
            {
              abbreviation: $('.game-header-table tr', game).eq(2).text(),
              fullName: $('.game-details .team a', game).eq(1).text(),
              homeAway: isHome.test( $('.game-header-table tr', game).eq(2).attr('id') ) ? 'home' : 'away',
              scores: getTeamScores( $('.game-details tr', game).eq(2) ),
              finalScore: $('.game-details tr', game).eq(2).children().last().text()
            }
          ];

          if (teams[0].finalScore > teams[1].finalScore)
            parsedGames[i].winner = teams[0].abbreviation;
          else
            parsedGames[i].winner = teams[1].abbreviation;

          if (teams[0].homeAway === 'home') {
            parsedGames[i].homeTeam = teams[0];
            parsedGames[i].awayTeam = teams[1];
          }
          else {
            parsedGames[i].awayTeam = teams[0];
            parsedGames[i].homeTeam = teams[1];
          }
        }
        return parsedGames;
      })
      /*Get games date*/
      .then(function (games) {
        return Promise.each(games, function (item, index) {
          return request({
            uri: item.boxScoreURL,
            method: 'GET',
            qs: {
              lang: 'en',
              region: 'us'
            }
          }).then(function (response) {
            var $ = cheerio.load(response, {
              normalizeWhitespace: true
            });
            var date = $('.game-time-location p').eq(0).text();
            if (date.toLowerCase().indexOf('tba') !== -1) {
              date = date.toLowerCase().replace('tba,', '').trim();
              games[index].datetime = moment.tz(date, "MMMM DD, YYYY", "America/New_York").format();
            } else {
              games[index].datetime = moment.tz(date, "h:mm A z, MMMM DD, YYYY", "America/New_York").format();
            }
          });
        })
      })
      /*Mapping data*/
      .then(function (games) {
        if (!games || games.length === 0) {
          return Promise.resolve([]);
        }
        return Promise.map(games, function (event) {
          return db.Season.getSeasonId(sport, event.datetime)
            .then(function (seasonId) {
              return {
                season_id: seasonId,
                sport_id: sportId,
                datetime: event.datetime,
                away_id: null,
                home_id: null,
                away_score: parseInt(event.awayTeam.finalScore) || 0,
                home_score: parseInt(event.homeTeam.finalScore) || 0,
                box_score_url: event.boxScoreURL,
                espn_id: event.id || null,
                winner_id: null,
                scores: {
                  away: event.awayTeam.scores,
                  home: event.homeTeam.scores
                },
                team_away_abbreviation: event.awayTeam.abbreviation,
                team_home_abbreviation: event.homeTeam.abbreviation,
                team_away_full_name: event.awayTeam.fullName,
                team_home_full_name: event.homeTeam.fullName,
                team_winner: event.winner,
                postponed: event.status === 'STATUS_POSTPONED',
                week_no: null
              };
            });
        });
      })
      .then(function (games) {
        if (!games || !games.length) {
          return Promise.resolve([]);
        }
        return Promise.map(games, function (game) {
          return Promise.all([
              db.SportTeam.resolveTeamId(
                sportId,
                game.team_away_abbreviation,
                game.team_away_full_name,
                "away",
                game.datetime,
                game.espn_id,
                "S",
                game.box_score_url
              ),
              db.SportTeam.resolveTeamId(
                sportId,
                game.team_home_abbreviation,
                game.team_home_full_name,
                "home",
                game.datetime,
                game.espn_id,
                "S",
                game.box_score_url
              )
            ])
            .then(function (teamIds) {
              game.away_id = teamIds[0];
              game.home_id = teamIds[1];
              if (game.team_winner == game.team_away_abbreviation) {
                game.winner_id = game.away_id;
              }
              if (game.team_winner == game.team_home_abbreviation) {
                game.winner_id = game.home_id;
              }

              if (!game.away_id) {
                warnings.push({
                  message: 'Team ' + game.team_away_full_name + ' not found in DB and added to exceptions'
                });
              }
              if (!game.home_id) {
                warnings.push({
                  message: 'Team ' + game.team_home_full_name + ' not found in DB and added to exceptions'
                });
              }
              delete game.team_away_abbreviation;
              delete game.team_home_abbreviation;
              delete game.team_away_full_name;
              delete game.team_home_full_name;
              delete game.team_winner;
              return game;
            });
        });
      })
      //  Remove postponed games from DB and games array
      .then(function (games) {
        if (!games || !games.length) {
          return Promise.resolve([]);
        }
        return Promise.filter(games, function (game) {
          if (game.postponed) {
            db.Game.destroy({
              where: {
                espn_id: game.espn_id
              }
            });
          }
          var filtered = game.postponed === false;
          delete game.postponed;
          return filtered;
        });
      })
      //  Save games to DB
      .then(function (games) {
        if (!games || !games.length) {
          return Promise.resolve([]);
        }
        return Promise.each(games, function (game) {
          return db.Game.saveGame(game);
        })
      })
      .then(function (games) {
        return {
          results: games,
          warnings: warnings
        };
      })
      .catch(function (err) {
        console.error(err);
        return err;
      });
  },

  /**
   * Get scoreboards from date to date with HTMl parsing
   * @param fromDate
   * @param [toDate]
   * @returns Promise
   */
  getNHLScoreboard: function (fromDate, toDate) {
    var self = this;

    return Promise.resolve()
      .then(function () {
        var dates = [];
        var gamesData = [];
        var warnings = [];
        var from = moment(fromDate, 'YYYYMMDD');
        var to = toDate ? moment(toDate, 'YYYYMMDD') : moment(fromDate, 'YYYYMMDD');
        dates.push(from.format('YYYYMMDD'));

        while (from.isBefore(to)) {
          dates.push(from.add(1, 'd').format('YYYYMMDD'));
        }

        return Promise.each(dates, function (date) {
            return self._getScoreboardForNHL({
                date: date
              })
              .then(function (data) {
                if (data instanceof Error) {
                  warnings.push(data);
                } else if (data && data.warnings && data.warnings.length) {
                  warnings.concat(data.warnings);
                }
                if (data.results) {
                  gamesData = gamesData.concat(data.results);
                }
              });
          })
          .then(function () {
            return {
              results: gamesData,
              warnings: warnings
            };
          });
      })
      .catch(function (err) {
        console.error(err);
        return err;
      });
  },

  /**
   * Get scoreboards from date to date
   * @param fromDate
   * @param toDate
   * @returns Promise
   */
  getMLBScoreboardByPeriod: function (fromDate, toDate) {
    var self = this;
    var gamesData = [];

    return Promise.resolve()
      .then(function () {
        var dates = [];
        var warnings = [];
        var from = moment(fromDate, 'YYYYMMDD');
        var to = moment(toDate, 'YYYYMMDD');
        dates.push(from.format('YYYYMMDD'));

        while (from.isBefore(to)) {
          dates.push(from.add(1, 'd').format('YYYYMMDD'));
        }

        return Promise.each(dates, function (date) {
            return self.getScoreboard('mlb', {
                date: date
              })
              .then(function (data) {
                if (data instanceof Error) {
                  warnings.push(data);
                } else if (data && data.warnings && data.warnings.length) {
                  warnings.concat(data.warnings);
                }
                if (data.results) {
                  gamesData = gamesData.concat(data.results);
                }
              });
          })
          .then(function () {
            return gamesData;
          });
      })
      .catch(function (err) {
        console.error(err);
        return err;
      });
  },

  /**
   * Get scoreboards from date to date
   * @param fromDate
   * @param toDate
   * @returns Promise
   */
  getNBAScoreboardByPeriod: function (fromDate, toDate) {
    var self = this;

    return Promise.resolve()
      .then(function () {
        var dates = [];
        var warnings = [];
        var gamesData = [];
        var from = moment(fromDate, 'YYYYMMDD');
        var to = moment(toDate, 'YYYYMMDD');
        dates.push(from.format('YYYYMMDD'));

        while (from.isBefore(to)) {
          dates.push(from.add(1, 'd').format('YYYYMMDD'));
        }

        return Promise.each(dates, function (date) {
            return self.getScoreboard('nba', {
                date: date
              })
              .then(function (data) {
                if (data instanceof Error) {
                  warnings.push(data);
                } else if (data && data.warnings && data.warnings.length) {
                  warnings.concat(data.warnings);
                }
                if (data.results) {
                  gamesData = gamesData.concat(data.results);
                }
              });
          })
          .then(function () {
            return {
              results: gamesData,
              warnings: warnings
            };
          });
      })
      .catch(function (err) {
        console.error(err);
        return err;
      });
  },

  /**
   * Get scoreboards by some period (year; year and season; year, season and week)
   * @param options
   * @returns Promise
   */
  getNFLScoreboardByPeriod: function (options) {
    var sport = 'nfl';
    var self = this;
    var seasons = [
      //  Preseason weeks
      [1,2,3,4,5],
      //  Regular season weeks
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
      //  Postseason weeks
      [1,2,3,4,5]
    ];
    var scoreboards = [];
    //  Year handling
    if(options.seasonYear && isNaN(options.seasonType) && isNaN(options.weekNumber)) {
      return Promise.each(seasons, function(weeks, index) {
          var seasonType = index + 1;
          return Promise.each(weeks, function(weekNumber) {
            return self.getScoreboard(sport, {
                seasonYear: options.seasonYear,
                seasonType: seasonType,
                weekNumber: weekNumber
              })
              .then(function(scoreboard) {
                scoreboards.push(scoreboard);
              });
          });
        })
        .then(function() {
          return scoreboards;
        });
    }
    //  Year and season type handling
    if(options.seasonYear && options.seasonType && isNaN(options.weekNumber)) {
      var weeks = seasons[options.seasonType - 1];
      return Promise.each(weeks, function(weekNumber) {
          return self.getScoreboard(sport, {
              seasonYear: options.seasonYear,
              seasonType: options.seasonType,
              weekNumber: weekNumber
            })
            .then(function(scoreboard) {
              scoreboards.push(scoreboard);
            });
        })
        .then(function() {
          return scoreboards;
        });
    }
    //  Year, season type and week handling
    if(options.seasonYear && options.seasonType && options.weekNumber) {
      return self.getScoreboard(sport, {
        seasonYear: options.seasonYear,
        seasonType: options.seasonType,
        weekNumber: options.weekNumber
      })
    }
    return Promise.reject(new Error('Not all params provided or some invalid params'));
  },

  /**
   * Get Odds for sport
   * @param sport - type [NFL | NBA | MLB]
   * @returns Promise
   */
  getOdds: function (sport) {
    var self = this;
    var warnings = [];
    var scoreboard;
    var sportsbooks;
    var odds = [];
    var runlines_pucklines = [];
    var sportId;
    sport = sport.toUpperCase();
    return Promise.resolve()
      .then(function () {
        return db.Sport.getSportIdByName(sport);
      })
      .then(function(sport_id) {
        sportId = sport_id;
        return db.Sportsbook.getSportsbooks();
      })
      .then(function (_sportsbooks) {
        sportsbooks = _sportsbooks;
        switch(sport) {
          case 'NBA':
            //  Get scoreboard for current month
            return self.getScoreboard(sport, {
                date: moment.tz("America/New_York").format('YYYYMM'),
                exception_type: "O"
              })
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'MLB':
            //  Get scoreboard for current month
            return self.getScoreboard(sport, {
                date: moment.tz("America/New_York").format('YYYYMM')
              })
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'NHL':
            //  Get scoreboard for current month
            var startDate = moment.tz("America/New_York").subtract(1, 'days').format('YYYYMMDD');
            var endDate = moment.tz("America/New_York").endOf('month').format('YYYYMMDD');
            return self.getNHLScoreboard(startDate, endDate)
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'MLB':
            //  Get scoreboard for current month
            return self.getScoreboard(sport, {
              date: moment.tz("America/New_York").format('YYYYMM')
            })
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'NHL':
            //  Get scoreboard for current month
            var startDate = moment.tz("America/New_York").subtract(1, 'days').format('YYYYMMDD');
            var endDate = moment.tz("America/New_York").endOf('month').format('YYYYMMDD');
            return self.getNHLScoreboard(startDate, endDate)
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'NFL':
            //  Get scoreboard for current year
            return self.getNFLScoreboardByPeriod({
                seasonYear: moment.tz("America/New_York").format('YYYY')
              })
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
        }
      })
      .then(function (results) {
        scoreboard = results;
        switch (sport) {
          case 'NBA':
            return _requestNBAOdds();
            break;
          case 'MLB':
            return _requestMLBOdds();
            break;
          case 'NHL':
            return _requestNHLOdds();
            break;
          case 'NFL':
            return _requestNFLOdds();
            break;
          default:
            return Promise.resolve(null);
        }
      })
      .then(function(results) {
        if(!results) {
          return Promise.reject(new Error({
            message: 'Error while loading game odds'
          }));
        }

        if (sport === 'MLB' || sport === 'NHL') {
          var $moneylineDOM = results.dom.moneyline;
          if (sport === 'MLB')
            var $runlineDOM = results.dom.runline;
          if (sport === 'NHL')
            var $pucklineDOM = results.dom.puckline;

          var MLGames = $moneylineDOM('#content div.CustomOddsContainer table tr.bg_row');
          if (sport === 'MLB')
            var RLGames = $runlineDOM('#content div.CustomOddsContainer table tr.bg_row');
          if (sport === 'NHL')
            var PLGames = $pucklineDOM('#content div.CustomOddsContainer table tr.bg_row');

          /*Scraping moneyline for MLB and NHL*/
          MLGames.each(function () {
            var game = $moneylineDOM(this);
            var team_home = $moneylineDOM('td:first-child .team_home', game).text().trim().substring(1),
              team_away = $moneylineDOM('td:first-child .team_away', game).text().trim(),
              game_date = moment.tz(
                $moneylineDOM('td:nth-child(2) > div > div.team_away', game).text().trim() + ' ' + $moneylineDOM('td:nth-child(2) > div > div.team_home', game).text().trim(),
                'ddd, MMM DD h:mm A z', "America/New_York").format(),
              spread_date = moment.tz("America/New_York").format();

            // Covers
            var away_moneyline_covers = $moneylineDOM('td.covers_top div.line_top', game).text().trim();
            var home_moneyline_covers = $moneylineDOM('td.covers_top div.covers_bottom', game).text().trim();

            var over_under = null;
            if (sport === 'MLB') {
              over_under = away_moneyline_covers;
              away_moneyline_covers = null;
            }

            var favorite = null;
            if (parseFloat(away_moneyline_covers) < parseFloat(home_moneyline_covers))
              favorite = team_away;
            else if (parseFloat(away_moneyline_covers) > parseFloat(home_moneyline_covers))
              favorite = team_home;
            else
              favorite = 0;
            var game_struct_covers = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.covers || null,
              period: 'Totals',
              away_moneyline: away_moneyline_covers,
              home_moneyline: home_moneyline_covers,
              over_under: over_under,
              // a FAVORITE is a team with the least moneyline value, so if we got -120 and -150, then a team with -150 is a FAVORITE
              favorite: favorite,
              spread_date: spread_date
            };

            // Open
            var away_moneyline_open = $moneylineDOM('td:nth-child(5) div.line_top', game).text().trim();
            var home_moneyline_open = $moneylineDOM('td:nth-child(5) div.offshore', game).text().trim();

            over_under = null;
            if (sport === 'MLB') {
              over_under = away_moneyline_open;
              away_moneyline_open = null;
            }

            favorite = null;
            if (parseFloat(away_moneyline_open) < parseFloat(home_moneyline_open))
              favorite = team_away;
            else if (parseFloat(away_moneyline_open) > parseFloat(home_moneyline_open))
              favorite = team_home;
            else
              favorite = 0;
            var game_struct_open = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.open || null,
              period: 'Totals',
              away_moneyline: away_moneyline_open,
              home_moneyline: home_moneyline_open,
              over_under: over_under,
              // a FAVORITE is a team with the least moneyline value, so if we got -120 and -150, then a team with -150 is a FAVORITE
              favorite: favorite,
              spread_date: spread_date
            };

            // Bet365
            var away_moneyline_bet365 = $moneylineDOM('td:nth-child(7) div.line_top', game).text().trim();
            var home_moneyline_bet365 = $moneylineDOM('td:nth-child(7) div.offshore', game).text().trim();

            over_under = null;
            if (sport === 'MLB') {
              over_under = away_moneyline_bet365;
              away_moneyline_bet365 = null;
            }

            favorite = null;
            if (parseFloat(away_moneyline_bet365) < parseFloat(home_moneyline_bet365))
              favorite = team_away;
            else if (parseFloat(away_moneyline_bet365) > parseFloat(home_moneyline_bet365))
              favorite = team_home;
            else
              favorite = 0;
            var game_struct_bet365 = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.bet365 || null,
              period: 'Totals',
              away_moneyline: away_moneyline_bet365,
              home_moneyline: home_moneyline_bet365,
              over_under: over_under,
              // a FAVORITE is a team with the least moneyline value, so if we got -120 and -150, then a team with -150 is a FAVORITE
              favorite: parseFloat(away_moneyline_bet365) < parseFloat(home_moneyline_bet365) ? team_away : team_home,
              spread_date: spread_date
            };

            odds.push(game_struct_covers);
            odds.push(game_struct_open);
            odds.push(game_struct_bet365);

          });

          /*Scrping runlines for MLB*/
          if (sport === 'MLB')
            RLGames.each(function () {
              var game = $runlineDOM(this);
              var team_home = $runlineDOM('td:first-child .team_home', game).text().trim().substring(1),
                team_away = $runlineDOM('td:first-child .team_away', game).text().trim(),
                game_date = moment.tz(
                  $moneylineDOM('td:nth-child(2) > div.team_away', game).text().trim() + ' ' + $moneylineDOM('td:nth-child(2) > div.team_home', game).text().trim(),
                  'ddd, MMM DD h:mm A z', "America/New_York").format(),
                spread_date = moment.tz("America/New_York").format();

              // Covers
              var away_runline_covers = $runlineDOM('td.covers_top div.line_top', game).text().trim().split(' ');
              var home_runline_covers = $runlineDOM('td.covers_top div.covers_bottom', game).text().trim().split(' ');

              var favorite = null;
              if (parseFloat(away_runline_covers[0]) < parseFloat(home_runline_covers[0]))
                favorite = team_away;
              else if (parseFloat(away_runline_covers[0]) > parseFloat(home_runline_covers[0]))
                favorite = team_home;
              else
                favorite = 0;
              var game_struct_covers = {
                game_id: null,
                team_away: team_away,
                team_home: team_home,
                game_date: game_date,
                sportsbook_id: sportsbooks.covers || null,
                away_runline: away_runline_covers[0],
                away_runline_odds: away_runline_covers[1],
                home_runline: home_runline_covers[0],
                home_runline_odds: home_runline_covers[1],
                // a FAVORITE is a team with the least moneyline value, so if we got -120 and -150, then a team with -150 is a FAVORITE
                favorite: favorite
              };

              // Open
              var away_runline_open = [
                $runlineDOM('td:nth-child(5) div.line_top tr td:nth-child(1)', game).text().trim(),
                $runlineDOM('td:nth-child(5) div.line_top tr td:nth-child(2)', game).text().trim()
              ];
              var home_runline_open = [
                $runlineDOM('td:nth-child(5) div.offshore tr td:nth-child(1)', game).text().trim(),
                $runlineDOM('td:nth-child(5) div.offshore tr td:nth-child(2)', game).text().trim()
              ];

              favorite = null;
              if (parseFloat(away_runline_open[0]) < parseFloat(home_runline_open[0]))
                favorite = team_away;
              else if (parseFloat(away_runline_open[0]) > parseFloat(home_runline_open[0]))
                favorite = team_home;
              else
                favorite = 0;
              var game_struct_open = {
                game_id: null,
                team_away: team_away,
                team_home: team_home,
                game_date: game_date,
                sportsbook_id: sportsbooks.open || null,
                away_runline: away_runline_open[0],
                away_runline_odds: away_runline_open[1],
                home_runline: home_runline_open[0],
                home_runline_odds: home_runline_open[1],
                // a FAVORITE is a team with the least moneyline value, so if we got -120 and -150, then a team with -150 is a FAVORITE
                favorite: favorite
              };

              // Bet365
              var away_runline_bet365 = [
                $runlineDOM('td:nth-child(7) div.line_top tr td:nth-child(1)', game).text().trim(),
                $runlineDOM('td:nth-child(7) div.line_top tr td:nth-child(2)', game).text().trim()
              ];
              var home_runline_bet365 = [
                $runlineDOM('td:nth-child(7) div.offshore tr td:nth-child(1)', game).text().trim(),
                $runlineDOM('td:nth-child(7) div.offshore tr td:nth-child(2)', game).text().trim()
              ];

              favorite = null;
              if (parseFloat(away_runline_bet365[0]) < parseFloat(home_runline_bet365[0]))
                favorite = team_away;
              else if (parseFloat(away_runline_bet365[0]) > parseFloat(home_runline_bet365[0]))
                favorite = team_home;
              else
                favorite = 0;
              var game_struct_bet365 = {
                game_id: null,
                team_away: team_away,
                team_home: team_home,
                game_date: game_date,
                sportsbook_id: sportsbooks.bet365 || null,
                away_runline: away_runline_bet365[0],
                away_runline_odds: away_runline_bet365[1],
                home_runline: home_runline_bet365[0],
                home_runline_odds: home_runline_bet365[1],
                // a FAVORITE is a team with the least moneyline value, so if we got -120 and -150, then a team with -150 is a FAVORITE
                favorite: favorite
              };

              runlines_pucklines.push(game_struct_covers);
              runlines_pucklines.push(game_struct_open);
              runlines_pucklines.push(game_struct_bet365);

            });

          /*Scraping pucklines for NHL*/
          if (sport === 'NHL')
            PLGames.each(function () {
              var game = $pucklineDOM(this);
              var team_home = $pucklineDOM('td:first-child .team_home', game).text().trim().substring(1),
                team_away = $pucklineDOM('td:first-child .team_away', game).text().trim(),
                game_date = moment.tz(
                  $moneylineDOM('td:nth-child(2) div.team_away', game).text().trim() + ' ' + $moneylineDOM('td:nth-child(2) div.team_home', game).text().trim(),
                  'ddd, MMM DD h:mm A z', "America/New_York").format(),
                spread_date = moment.tz("America/New_York").format();

              // Covers
              var over_under_covers = $pucklineDOM('td.covers_top div.line_top', game).text().trim();
              var home_puckine_covers = $pucklineDOM('td.covers_top div.covers_bottom', game).text().trim();

              var game_struct_covers = {
                game_id: null,
                team_away: team_away,
                team_home: team_home,
                game_date: game_date,
                sportsbook_id: sportsbooks.covers || null,
                over_under: over_under_covers,
                away_runline: null,
                away_runline_odds: null,
                home_runline: home_puckine_covers,
                home_runline_odds: null,
                // a FAVORITE is a team with the least moneyline value, so if we got -120 and -150, then a team with -150 is a FAVORITE
                favorite: null
              };

              // Open
              var over_under_open = $pucklineDOM('td:nth-child(5) div.line_top', game).text().trim();
              var home_puckine_open = $pucklineDOM('td:nth-child(5) div.offshore', game).text().trim();

              var game_struct_open = {
                game_id: null,
                team_away: team_away,
                team_home: team_home,
                game_date: game_date,
                sportsbook_id: sportsbooks.open || null,
                over_under: over_under_open,
                away_runline: null,
                away_runline_odds: null,
                home_runline: home_puckine_open,
                home_runline_odds: null,
                // a FAVORITE is a team with the least moneyline value, so if we got -120 and -150, then a team with -150 is a FAVORITE
                favorite: null
              };

              // Bet365
              var over_under_bet365 = $pucklineDOM('td:nth-child(7) div.line_top', game).text().trim();
              var home_puckine_bet365 = $pucklineDOM('td:nth-child(7) div.offshore', game).text().trim();

              var game_struct_bet365 = {
                game_id: null,
                team_away: team_away,
                team_home: team_home,
                game_date: game_date,
                sportsbook_id: sportsbooks.bet365 || null,
                over_under: over_under_bet365,
                away_runline: null,
                away_runline_odds: null,
                home_runline: home_puckine_bet365,
                home_runline_odds: null,
                // a FAVORITE is a team with the least moneyline value, so if we got -120 and -150, then a team with -150 is a FAVORITE
                favorite: null
              };

              runlines_pucklines.push(game_struct_covers);
              runlines_pucklines.push(game_struct_open);
              runlines_pucklines.push(game_struct_bet365);

            });

        }
        else {

          var $spreadTotalDOM = results.dom.spreadTotal;
          var $moneylineDOM = results.dom.moneyline;
          var $1stHalfDOM = results.dom.firstHalf;
          var $2ndHalfDOM = results.dom.secondHald;

          var STGames = $spreadTotalDOM('#content > div.CustomOddsContainer > table tr.bg_row');
          var MLGames = $moneylineDOM('#content > div.CustomOddsContainer > table tr.bg_row');
          var H1Games = $1stHalfDOM('#content > div.CustomOddsContainer > table tr.bg_row');
          var H2Games = $2ndHalfDOM('#content > div.CustomOddsContainer > table tr.bg_row');

          STGames.each(function () {
            var game = $spreadTotalDOM(this);

            var team_home = $spreadTotalDOM('td:first-child .team_home', game).text().trim().substring(1),
              team_away = $spreadTotalDOM('td:first-child .team_away', game).text().trim(),
              game_date = moment(
                $spreadTotalDOM('td:nth-child(2) > div > div.team_away', game).text().trim(),
                'ddd, MMM DD').format('YYYY-MM-DD'),
              spread_date = moment.tz("America/New_York").format();

            var spread_covers = $spreadTotalDOM('td.covers_top div.covers_bottom', game).text().trim();
            var noFavorite = spread_covers.search(/[+-]/) == -1;
            var game_struct_covers = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.covers || null,
              spread_date: spread_date,
              over_under: $spreadTotalDOM('td.covers_top div.line_top', game).text().trim(),
              spread: spread_covers,
              period: 'Totals',
              away_moneyline: null,
              home_moneyline: null,
              favorite: noFavorite ? null : spread_covers.indexOf('+') != -1 ? team_away: team_home
            };

            var spread_open = $spreadTotalDOM('td:nth-child(5) div.offshore', game).text().trim();
            noFavorite = spread_open.search(/[+-]/) == -1;
            var game_struct_open = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.open || null,
              spread_date: spread_date,
              over_under: $spreadTotalDOM('td:nth-child(5) div.line_top', game).text().trim(),
              spread: spread_open,
              period: 'Totals',
              away_moneyline: null,
              home_moneyline: null,
              favorite: noFavorite ? null : spread_open.indexOf('+') != -1 ? team_away: team_home
            };

            var spread_bet365 = $spreadTotalDOM('td:nth-child(7) div.offshore', game).text().trim();
            noFavorite = spread_bet365.search(/[+-]/) == -1;
            var game_struct_bet365 = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.bet365 || null,
              spread_date: spread_date,
              over_under: $spreadTotalDOM('td:nth-child(7) div.line_top', game).text().trim(),
              spread: spread_bet365,
              period: 'Totals',
              away_moneyline: null,
              home_moneyline: null,
              favorite: noFavorite ? null : spread_open.indexOf('+') != -1 ? team_away: team_home
            };

            odds.push(game_struct_covers);
            odds.push(game_struct_open);
            odds.push(game_struct_bet365);
          });

          MLGames.each(function () {
            var game = $moneylineDOM(this);
            var team_home = $moneylineDOM('td:first-child .team_home', game).text().trim().substring(1),
              team_away = $moneylineDOM('td:first-child .team_away', game).text().trim(),
              game_date = moment(
                $moneylineDOM('td:nth-child(2) > div > div.team_away', game).text().trim(),
                'ddd, MMM DD').format('YYYY-MM-DD');

            _.find(odds, function (value, index) {
              if (value.team_away == team_away && value.team_home == team_home && value.game_date == game_date) {
                //  Moneyline Covers
                if (value.sportsbook_id === sportsbooks.covers) {
                  odds[index].away_moneyline = $moneylineDOM('td.covers_top div.line_top', game).text().trim();
                  odds[index].home_moneyline = $moneylineDOM('td.covers_top div.covers_bottom', game).text().trim();
                }
                //  Moneyline Open
                if (value.sportsbook_id === sportsbooks.open) {
                  odds[index].away_moneyline = $moneylineDOM('td:nth-child(5) div.line_top', game).text().trim();
                  odds[index].home_moneyline = $moneylineDOM('td:nth-child(5) div.offshore', game).text().trim();
                }

                //  Moneyline Bet365
                if (value.sportsbook_id === sportsbooks.bet365) {
                  odds[index].away_moneyline = $moneylineDOM('td:nth-child(7) div.line_top', game).text().trim();
                  odds[index].home_moneyline = $moneylineDOM('td:nth-child(7) div.offshore', game).text().trim();
                }
              }
              return false;
            });

          });

          H1Games.each(function () {
            var game = $1stHalfDOM(this);

            var team_home = $1stHalfDOM('td:first-child .team_home', game).text().trim().substring(1),
              team_away = $1stHalfDOM('td:first-child .team_away', game).text().trim(),
              game_date = moment(
                $1stHalfDOM('td:nth-child(2) > div > div.team_away', game).text().trim(),
                'ddd, MMM DD').format('YYYY-MM-DD'),
              spread_date = moment.tz("America/New_York").format();

            var spread_covers = $1stHalfDOM('td.covers_top div.covers_bottom', game).text().trim();
            var noFavorite = spread_covers.search(/[+-]/) == -1;
            var game_struct_covers = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.covers || null,
              spread_date: spread_date,
              over_under: $1stHalfDOM('td.covers_top div.line_top', game).text().trim(),
              spread: spread_covers,
              period: '1stHalf',
              away_moneyline: null,
              home_moneyline: null,
              favorite: noFavorite ? null : spread_covers.indexOf('+') != -1 ? team_away : team_home
            };

            var spread_open = $1stHalfDOM('td:nth-child(5) div.offshore', game).text().trim();
            noFavorite = spread_open.search(/[+-]/) == -1;
            var game_struct_open = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.open || null,
              spread_date: spread_date,
              over_under: $1stHalfDOM('td:nth-child(5) div.line_top', game).text().trim(),
              spread: spread_open,
              period: '1stHalf',
              away_moneyline: null,
              home_moneyline: null,
              favorite: noFavorite ? null : spread_open.indexOf('+') != -1 ? team_away : team_home
            };

            var spread_bet365 = $1stHalfDOM('td:nth-child(5) div.offshore', game).text().trim();
            noFavorite = spread_bet365.search(/[+-]/) == -1;
            var game_struct_bet365 = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.bet365 || null,
              spread_date: spread_date,
              over_under: $1stHalfDOM('td:nth-child(7) div.line_top', game).text().trim(),
              spread: spread_bet365,
              period: '1stHalf',
              away_moneyline: null,
              home_moneyline: null,
              favorite: noFavorite ? null : spread_open.indexOf('+') != -1 ? team_away : team_home
            };

            odds.push(game_struct_covers);
            odds.push(game_struct_open);
            odds.push(game_struct_bet365);
          });

          H2Games.each(function () {
            var game = $2ndHalfDOM(this);

            var team_home = $2ndHalfDOM('td:first-child .team_home', game).text().trim().substring(1),
              team_away = $2ndHalfDOM('td:first-child .team_away', game).text().trim(),
              game_date = moment(
                $2ndHalfDOM('td:nth-child(2) > div > div.team_away', game).text().trim(),
                'ddd, MMM DD').format('YYYY-MM-DD'),
              spread_date = moment.tz("America/New_York").format();

            var spread_covers = $2ndHalfDOM('td.covers_top div.covers_bottom', game).text().trim();
            var noFavorite = spread_covers.search(/[+-]/) == -1;
            var game_struct_covers = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.covers || null,
              spread_date: spread_date,
              over_under: $2ndHalfDOM('td.covers_top div.line_top', game).text().trim(),
              spread: spread_covers,
              period: '2ndHalf',
              away_moneyline: null,
              home_moneyline: null,
              favorite: noFavorite ? null : spread_covers.indexOf('+') != -1 ? team_away : team_home
            };

            var spread_open = $2ndHalfDOM('td:nth-child(5) div.offshore', game).text().trim();
            noFavorite = spread_open.search(/[+-]/) == -1;
            var game_struct_open = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.open || null,
              spread_date: spread_date,
              over_under: $2ndHalfDOM('td:nth-child(5) div.line_top', game).text().trim(),
              spread: spread_open,
              period: '2ndHalf',
              away_moneyline: null,
              home_moneyline: null,
              favorite: noFavorite ? null : spread_open.indexOf('+') != -1 ? team_away : team_home
            };

            var spread_bet365 = $2ndHalfDOM('td:nth-child(5) div.offshore', game).text().trim();
            noFavorite = spread_open.search(/[+-]/) == -1;
            var game_struct_bet365 = {
              game_id: null,
              team_away: team_away,
              team_home: team_home,
              game_date: game_date,
              sportsbook_id: sportsbooks.bet365 || null,
              spread_date: spread_date,
              over_under: $2ndHalfDOM('td:nth-child(5) div.line_top', game).text().trim(),
              spread: spread_bet365,
              period: '2ndHalf',
              away_moneyline: null,
              home_moneyline: null,
              favorite: noFavorite ? null : spread_open.indexOf('+') != -1 ? team_away : team_home
            };

            odds.push(game_struct_covers);
            odds.push(game_struct_open);
            odds.push(game_struct_bet365);
          });
        }

        return Promise.resolve({odds: odds, runlines: runlines_pucklines});
      })
      /*Find game and defined favorite*/
      .then(function(results) {
        var odds = results.odds;
        if (sport === 'MLB' || sport === 'NHL')
          var runlines = results.runlines;

        //  Resolve game and teams IDs and
        return Promise.each(odds, function(odd, index) {
          var runline = null;
          if (sport === 'MLB' || sport === 'NHL')
            runline = runlines_pucklines[index];
          return db.Game.resolveGame(sportId, odd.game_date, odd.team_away, odd.team_home)
            .then(function(resolvedGame) {
              if (resolvedGame) {
                if (odd.favorite === odd.team_away) {
                  odd.favorite = resolvedGame.awayTeamId;
                } else if (odd.favorite === odd.team_home) {
                  odd.favorite = resolvedGame.homeTeamId;
                } else {
                  odd.favorite = 0;
                }

                /*Define favorite team id, if team not found favorite = 0*/
                if (sport === 'MLB' || sport === 'NHL') {
                  if (runline.favorite === runline.team_away) {
                    runline.favorite = resolvedGame.awayTeamId;
                  } else if (runline.favorite === runline.team_home) {
                    runline.favorite = resolvedGame.homeTeamId;
                  } else {
                    runline.favorite = 0;
                  }
                }

                let teamAway = odd.team_away,
                  teamHome = odd.team_home;
                odd.game_id = resolvedGame.gameId;
                odd.espn_id = resolvedGame.espnId;
                odd.team_away = resolvedGame.awayTeamId;
                odd.team_home = resolvedGame.homeTeamId;
                odd.sport_id = sportId;
                if (sport === 'NHL')
                  odd.over_under = runline.over_under;

                if (sport === 'MLB' || sport === 'NHL') {
                  runline.game_id = resolvedGame.gameId;
                  runline.espn_id = resolvedGame.espnId;
                  runline.team_away = resolvedGame.awayTeamId;
                  runline.team_home = resolvedGame.homeTeamId;
                  runline.sport_id = sportId;
                }

                /*If one of command id = null insert exception*/
                if (!resolvedGame.awayTeamId) {
                  return db.SportTeamException.insertException({
                      sportId: sportId,
                      gameDate: odd.game_date,
                      espnId: resolvedGame.espnId,
                      team: teamAway,
                      teamType: odd.favorite === odd.team_away ? 'favorite' : 'away',
                      type: 'O',
                      scoreUrl: resolvedGame.scoreLink
                    })
                    .then(function () {
                      return [];
                    });
                }
                else if (!resolvedGame.homeTeamId) {
                  return db.SportTeamException.insertException({
                      sportId: sportId,
                      gameDate: odd.game_date,
                      espnId: resolvedGame.espnId,
                      team: teamHome,
                      teamType: odd.favorite === odd.team_home ? 'favorite' : 'home',
                      type: 'O',
                      scoreUrl: resolvedGame.scoreLink
                    })
                    .then(function () {
                      return [];
                    });
                }
                /*If game not found - insert two exceptions*/
              } else {
                return Promise.all([
                    db.SportTeamException.insertException({
                      sportId: sportId,
                      gameDate: odd.game_date,
                      team: odd.team_away,
                      teamType: odd.favorite === odd.team_away ? 'favorite' : 'away',
                      type: "O"
                    }),
                    db.SportTeamException.insertException({
                      sportId: sportId,
                      gameDate: odd.game_date,
                      team: odd.team_home,
                      teamType: odd.favorite === odd.team_home ? 'favorite' : 'home',
                      type: "O"
                    })
                  ])
                  .then(function () {
                    odd.favorite = null;
                    odd.game_id = null;
                    odd.team_away = null;
                    odd.team_home = null;
                    odd.sport_id = sportId;

                    if (sport === 'MLB') {
                      runline.favorite = null;
                      runline.game_id = null;
                      runline.team_away = null;
                      runline.team_home = null;
                      runline.sport_id = sportId;
                    }
                    return [];
                  });
              }
            });
        });
      })
      .then(function(odds) {
        return Promise.each(odds, function(odd, index) {
          var runline = null;
          if (sport === 'MLB' || sport === 'NHL')
            runline = runlines_pucklines[index];
          var promiseAll = [
            /*Add or update odds*/
            db.Odds.findOrCreate({
                where: {
                  game_id: odd.game_id,
                  sportsbook_id: odd.sportsbook_id,
                  period: odd.period,
                  game_date: odd.game_date
                },
                defaults: odd
              })
              .spread(function(record, isCreated) {
                if(!isCreated) {
                  record.spread_date = odd.spread_date;
                  record.over_under = odd.over_under;
                  record.spread = odd.spread;
                  record.away_moneyline = odd.away_moneyline;
                  record.home_moneyline = odd.home_moneyline;
                  record.favorite = odd.favorite;
                  record.game_date = odd.game_date;
                  return record.save();
                }
                return record;
              })
          ];
          /*Add or updte runline/puckline*/
          if (sport === 'MLB' || sport === 'NHL') {
            promiseAll.push(
              db.OddsRunline.findOrCreate({
                  where: {
                    game_id: odd.game_id,
                    sportsbook_id: odd.sportsbook_id
                  },
                  defaults: runline
                })
                .spread(function(record, isCreated) {
                  if(!isCreated) {
                    record.away_runline = runline.away_runline;
                    record.away_runline_odds = runline.away_runline_odds;
                    record.home_runline = runline.home_runline;
                    record.home_runline_odds = runline.home_runline_odds;
                    record.favorite = runline.favorite;
                    record.game_date = runline.game_date;
                    return record.save();
                  }
                  return record;
                })
            )
          }
          return Promise.all(promiseAll);
        });
      })
      .then(function () {
        var result = null;
        if (runlines_pucklines[0])
          result = {odds: odds, runlines: runlines_pucklines};
        else result = odds;
        return result;
      })
      .catch(function(err) {
        console.error(err);
        return err;
      })
  },

  /**
   * Get FuturesOdds for sport
   * @param sport - type [NFL | NBA]
   * @returns Promise
   */
  getFuturesOdds: function (sport) {
    var self = this,
      warnings = [],
      scoreboard,
      sportsbooks,
      futures_odds = [],
      future_id = null,
      capture_date = null,
      sportId = null;
    sport = sport.toUpperCase();
    return Promise.resolve()
      .then(function () {
        return db.Sport.getSportIdByName(sport);
      })
      .then(function(sport_id) {
        sportId = sport_id;
        return db.Sportsbook.getSportsbooks();
      })
      .then(function (_sportsbooks) {
        sportsbooks = _sportsbooks;
        switch(sport) {
          case 'NBA':
            //  Get scoreboard for current month
            return self.getScoreboard(sport, {
                date: moment.tz("America/New_York").format('YYYYMM')
              })
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'MLB':
            //  Get scoreboard for current month
            return self.getScoreboard(sport, {
                date: moment.tz("America/New_York").format('YYYYMM')
              })
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'NHL':
            //  Get scoreboard for current month
            var startDate = moment.tz("America/New_York").subtract(1, 'days').format('YYYYMMDD');
            var endDate = moment.tz("America/New_York").endOf('month').format('YYYYMMDD');
            return self.getNHLScoreboard(startDate, endDate)
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'MLB':
            //  Get scoreboard for current month
            return self.getScoreboard(sport, {
              date: moment.tz("America/New_York").format('YYYYMM')
            })
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'NHL':
            //  Get scoreboard for current month
            var startDate = moment.tz("America/New_York").subtract(1, 'days').format('YYYYMMDD');
            var endDate = moment.tz("America/New_York").endOf('month').format('YYYYMMDD');
            return self.getNHLScoreboard(startDate, endDate)
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
          case 'NFL':
            //  Get scoreboard for current year
            return self.getNFLScoreboardByPeriod({
                seasonYear: moment.tz("America/New_York").format('YYYY')
              })
              .then(function(scoreboard) {
                return scoreboard.results;
              });
            break;
        }
      })
      .then(function (results) {
        scoreboard = results;
        switch (sport) {
          case 'NBA':
            return _requestNBAFuturesOdds();
            break;
          case 'MLB':
            return _requestMLBFuturesOdds();
            break;
          case 'NHL':
            return _requestNHLFuturesOdds();
            break;
          case 'NFL':
            return _requestNFLFuturesOdds();
            break;
          default:
            return Promise.resolve(null);
        }
      })
      .then(function(result) {
        if (!result) {
          return Promise.reject(new Error({
            message: 'Error while loading game futures odds'
          }));
        }
        var $futuresOddsDOM = result.dom,
          FutureOdds = $futuresOddsDOM('#content > div.CustomOddsContainer > div.element'),
          capture_date = moment.tz("America/New_York").format();


        FutureOdds.each(function () {
          var futureOdd = $futuresOddsDOM(this),
            FutureLines = $futuresOddsDOM('table tr.bg_row, table tr.bg_row_2', futureOdd),
            betting = $futuresOddsDOM('.logos img', futureOdd).attr('title');
          future_id = futureOdd.prev().text().trim();
          betting = betting.split(' - ',1)[0].toLowerCase();

          FutureLines.each(function () {
            var FutureLine = $futuresOddsDOM(this),
              sport_team = $futuresOddsDOM('td:first-child .futures', FutureLine).text().trim(),
              future_line = $futuresOddsDOM('td.offshore_first', FutureLine).text().trim();

            if(future_line != "" && sport_team != "") {
              var futures_odd = {
                id: null,
                sport_id: sportId,
                sport_team_id: sport_team,
                sportsbook_id: sportsbooks[betting] || null,
                capture_date: capture_date,
                future_id: future_id,
                future_line: future_line
              };
              futures_odds.push(futures_odd);
            }
          });

        });

        return futures_odds;
      })
      .then(function (futures_odds) {
        if (!futures_odds || !futures_odds.length) {
          return Promise.resolve([]);
        }
        return Promise.map(futures_odds, function (futures_odd) {
          return db.SportTeam.resolveTeamIdForOdds(
            sportId,
            futures_odd.sport_team_id,
            futures_odd.capture_date,
            "F"
            )
            .then(function (teamId) {
              if (!teamId) {
                warnings.push({
                  message: 'Team ' + futures_odd.sport_team_id + ' not found in DB and added to exceptions'
                });
              }
              futures_odd.sport_team_id = teamId;
              return futures_odd;
            });
        });
      })
      .then(function (futures_odds) {
        if (!futures_odds || !futures_odds.length) {
          return Promise.resolve([]);
        }
        return Promise.map(futures_odds, function (futures_odd) {
          return db.FuturesNames.findOrCreate({
              where: {
                name: futures_odd.future_id
              },
              defaults: futures_odd
            })
            .spread(function(record, isCreated) {
              futures_odd.future_id = record.id;
              return futures_odd;
            });
        });
      })
      .then(function(futures_odds) {
        return db.OddsFutures.bulkCreate(futures_odds)
          .then(function () {
            return futures_odds;
          });
      })
      .then(function (futures_odds) {
        return {
          results: futures_odds,
          warnings: warnings
        };
      })
      .catch(function(err) {
        console.error(err);
        return err;
      })

  }
};