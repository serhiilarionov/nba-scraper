var express, router, moment, db, scrapper, ESPN;
express = require('express');
router = express.Router();
moment = require('moment');
db = require('../models');
ESPN = require('../services/EspnService');
var cleaner = require('../services/cleaner');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('api-docs', {
    title: 'API Docs:'
  });
});

router.get('/v1/scrap', function(req, res, next) {
  return res.status(400).send('Deprecated API V1');
});

router.get('/v2/scrap', function(req, res, next) {
  var sport = req.query.sport,
    type = req.query.type,
    date = req.query.date,
    begin = req.query.begin,
    end = req.query.end,
    seasonYear = Number(req.query.seasonYear),
    weekNumber = Number(req.query.weekNumber),
    seasonType = Number(req.query.seasonType);

  if(sport == 'nfl') {
    if(type == 'scoreboard') {
      return ESPN.getNFLScoreboardByPeriod({
          seasonType: seasonType,
          seasonYear: seasonYear,
          weekNumber: weekNumber
        })
        .then(function(results) {
          return res.json(results);
        })
        .catch(function(err) {
          console.error(err);
          return res.status(400).send(err.message);
        })
    } else if (type == "odds") {
      ESPN.getOdds(sport)
        .then(function(odds) {
          return res.json(odds);
        })
        .catch(function (err) {
          console.error(err);
          return res.status(400).send(err.message);
        });
    } else if(type == "futuresOdds") {
      ESPN.getFuturesOdds(sport)
        .then(function(odds) {
          return res.json(odds);
        })
        .catch(function (err) {
          console.error(err);
          return res.status(500).send(err.message);
        });
    } else {
      return res.status(501).send('Function is not implemented');
    }
  }
  else if(sport == 'nba') {
    if (type == "scoreboard") {
      if (begin && end && moment(begin, 'YYYYMMDD').isValid() && moment(end, 'YYYYMMDD').isValid()) {
        ESPN.getNBAScoreboardByPeriod(begin, end)
          .then(function (data) {
            return res.json(data);
          })
          .catch(function (err) {
            console.error(err);
            return res.status(500).send(err.message);
          });
      } else if(date && moment(date, 'YYYYMMDD').isValid()) {
        ESPN.getScoreboard(sport, {date: date})
          .then(function(results) {
            return res.json(results);
          });
      } else {
        return res.status(501).send('Not all params provided or some invalid params');
      }
    }
    else if (type == "odds") {
      ESPN.getOdds(sport)
        .then(function(odds) {
          return res.json(odds);
        })
        .catch(function (err) {
          console.error(err);
          return res.status(500).send(err.message);
        });
    }
    else if(type == "futuresOdds") {
      ESPN.getFuturesOdds(sport)
        .then(function(odds) {
          return res.json(odds);
        })
        .catch(function (err) {
          console.error(err);
          return res.status(500).send(err.message);
        });
    }
    else {
      return res.status(501).send('Function is not implemented');
    }
  }
  else if(sport == 'mlb') {
    if (type == "scoreboard") {
      if (begin && end && moment(begin, 'YYYYMMDD').isValid() && moment(end, 'YYYYMMDD').isValid()) {
        ESPN.getMLBScoreboardByPeriod(begin, end)
          .then(function (data) {
            return res.json(data);
          })
          .catch(function (err) {
            console.error(err);
            return res.status(500).send(err.message);
          });
      } else
      if(date && moment(date, 'YYYYMMDD').isValid()) {
        ESPN.getScoreboard(sport, {date: date})
          .then(function(results) {
            return res.json(results);
          });
      } else {
        return res.status(501).send('Not all params provided or some invalid params');
      }
    }
    else if (type == "odds") {
      ESPN.getOdds(sport)
        .then(function(odds) {
          return res.json(odds);
        })
        .catch(function (err) {
          console.error(err);
          return res.status(500).send(err.message);
        });
    }
    else if(type == "futuresOdds") {
      ESPN.getFuturesOdds(sport)
        .then(function(odds) {
          return res.json(odds);
        })
        .catch(function (err) {
          console.error(err);
          return res.status(500).send(err.message);
        });
    } else {
      return res.status(501).send('Function is not implemented');
    }
  }
  else if(sport == 'nhl') {
    if(type == 'scoreboard') {
      /*Get games by period*/
      if (begin && end && moment(begin, 'YYYYMMDD').isValid() && moment(end, 'YYYYMMDD').isValid()) {
        ESPN.getNHLScoreboard(begin, end)
          .then(function (data) {
            return res.json(data);
          })
          .catch(function (err) {
            console.error(err);
            return res.status(500).send(err.message);
          });
      }
      /*Get games by one date*/
      else {
        if (date && moment(date, 'YYYYMMDD').isValid()) {
          return ESPN.getNHLScoreboard(date)
            .then(function (results) {
              return res.json(results);
            })
            .catch(function (err) {
              console.error(err);
              return res.status(400).send(err.message);
            })
        }
      }
    }
    else if (type == "odds") {
      ESPN.getOdds(sport)
        .then(function(odds) {
          return res.json(odds);
        })
        .catch(function (err) {
          console.error(err);
          return res.status(500).send(err.message);
        });
    }
    else if(type == "futuresOdds") {
      ESPN.getFuturesOdds(sport)
        .then(function(odds) {
          return res.json(odds);
        })
        .catch(function (err) {
          console.error(err);
          return res.status(500).send(err.message);
        });
    }
    else {
      return res.status(501).send('Function is not implemented');
    }
  }
  else {
    return res.status(501).send('Function is not implemented');
  }
});

router.get('/cleaner' ,function (req, res, next) {
  cleaner().then(function () {
      res.json({status: 'completed'})
    })
    .catch(function (error) {
      res.status(500).json(error)
    })
});