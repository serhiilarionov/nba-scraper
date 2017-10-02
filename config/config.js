var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'test';

function timezone() {
  var time = new Date();
  return (- time.getTimezoneOffset() > 0 ? '+' : '-') +
    (Math.abs(time.getTimezoneOffset() / 60) > 9 ? '' : '0' ) +
    (Math.abs(time.getTimezoneOffset() / 60) + ':00');
}

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'sportsscraper'
    },
    port: 3000,
    db: {
      connString: 'postgres://postgres:test123@localhost/sandlot_sports',
      options: {
        logging: console.log,
        timezone: '+00:00'
      }
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'sportsscraper'
    },
    port: 4000,
    db: {
      connString: 'postgres://postgres:test123@localhost/sandlot_test',
      options: {
        logging: console.log,
        timezone: '+00:00'
      }
    }
    
  },

  production: {
    root: rootPath,
    app: {
      name: 'sportsscraper'
    },
    port: process.env.PORT || 3000,
    db: {
    //TODO set config in production 
      //connString: 'mysql://sports_dba:Nba135Nfl@mysql.sandlotapps.com/sandlot_sports',
      options: {
        logging: false,
        timezone: '+00:00'
      }
    }
  }
};

module.exports = config[env];
