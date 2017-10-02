module.exports = function (sequelize, DataTypes) {

  var Season = sequelize.define('Season', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sport_id: DataTypes.INTEGER,
    name: DataTypes.STRING(25),
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    type: DataTypes.INTEGER
  }, {
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        name: 'get_current_season',
        fields: ['start', 'end']
      }
    ],
    timestamps: false,
    freezeTableName: true,
    tableName: 'season',
    classMethods: {
      getSeasonId: function(sportName, date) {
        return sequelize.query('SET timezone = \'America/New_York\'; SELECT season.id FROM season LEFT JOIN sport ON season.sport_id = sport.id WHERE sport.name LIKE \'%' + sportName + '%\' AND CAST(\'' + date + '\' AS DATE) BETWEEN season.start AND season.end;', { type: sequelize.QueryTypes.SELECT })
          .then(function(result) {
            if(result.length && result[0].id) {
              return result[0].id;
            } else {
              return null;
            }
          })
          .catch(function(err) {
            console.error(err);
            return null;
          });
      },
      getNBASeasonId: function(date) {
        return sequelize.query('SELECT season.id FROM season LEFT JOIN sport ON season.sport_id = sport.id WHERE sport.name LIKE \'%NBA%\' AND CAST(\'' + date + '\' AS DATE) BETWEEN season.start AND season.end;', { type: sequelize.QueryTypes.SELECT });
      },
      getNFLSeasonId: function(date) {
        return sequelize.query('SELECT season.id FROM season LEFT JOIN sport ON season.sport_id = sport.id WHERE sport.name LIKE \'%NFL%\' AND CAST(\'' + date + '\' AS DATE) BETWEEN season.start AND season.end;', { type: sequelize.QueryTypes.SELECT });
      }
    }
  });

  return Season;
};

