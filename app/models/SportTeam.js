module.exports = function (sequelize, DataTypes) {

  var SportTeam = sequelize.define('SportTeam', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sport_id: DataTypes.INTEGER,
    abbreviation: DataTypes.STRING(5),
    full_name: DataTypes.STRING(50),
    city: DataTypes.STRING(25),
    short_name: DataTypes.STRING(25),
    first_year: DataTypes.DATE,
    last_year: DataTypes.DATE,
    division_id: DataTypes.INTEGER,
    active: DataTypes.STRING(1)
  }, {
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        name: 'get_team_by_name_index',
        fields: ['full_name'],
        where: { full_name: sequelize.fn('lower', sequelize.col('full_name')) }
      }
    ],
    timestamps: false,
    freezeTableName: true,
    tableName: 'sport_team',
    classMethods: {
      resolveTeamId: function(sportId, abbreviation, fullname, teamType, datetime, espnId, type, scoreUrl) {
        //  Try to resolve team id from sport_team table
        return SportTeam.findOne({
            where: {
              sport_id: sportId,
              $or: {
                abbreviation: abbreviation,
                full_name: fullname
              },
              first_year: {
                $lte: datetime
              },
              last_year: {
                $gte: datetime
              }
            },
            attributes: ['id']
          })
          .then(function(team) {
            return team ? team.id : null;
          })
          .then(function(teamId) {
            if(teamId) {
              return teamId;
            } else {
              //  Try to resolve team id from sport_team_exceptions
              return sequelize.models.SportTeamException.findOne({
                  where: {
                    sport_team_name_exception: fullname
                  },
                  attributes: ['sport_team_id']
                })
                .then(function(team) {
                  if(team) {
                    return team.sport_team_id;
                  } else {
                    //  Add exception to sport_team_exception table
                    return sequelize.models.SportTeamException.create({
                        sport_id: sportId,
                        espn_id: espnId,
                        game_datetime: datetime,
                        sport_team_id: null,
                        sport_team_name_exception: fullname,
                        team_type: teamType,
                        exception_type: type,
                        box_score_url: scoreUrl
                      })
                      .then(function() {
                        return null;
                      });
                  }
                });
            }
          });
      },
      resolveTeamIdForOdds: function(sportId, city, datetime, type) {
        //  Try to resolve team id from sport_team table
        return SportTeam.findOne({
            where: {
              sport_id: sportId,
              city: city,
              first_year: {
                $lte: datetime
              },
              last_year: {
                $gte: datetime
              }
            },
            attributes: ['id']
          })
          .then(function(team) {
            return team ? team.id : null;
          })
          .then(function(teamId) {
            if(teamId) {
              return teamId;
            } else {
              //  Try to resolve team id from sport_team_exceptions
              return sequelize.models.SportTeamException.findOne({
                  where: {
                    sport_team_name_exception: city
                  },
                  attributes: ['sport_team_id']
                })
                .then(function(team) {
                  if(team) {
                    return team.sport_team_id;
                  } else {
                    //  Add exception to sport_team_exception table
                    return sequelize.models.SportTeamException.findOrCreate({
                        where: {
                          sport_team_name_exception: city,
                          sport_id: sportId
                        },
                        defaults: {
                          sport_team_id: null,
                          sport_team_name_exception: city,
                          exception_type: type
                        }
                      })
                      .then(function() {
                        return null;
                      });
                  }
                });
            }
          });
      },
      getTeamId: function(teamName, year) {
        return sequelize.query('SELECT sport_team.id, sport_team.full_name \
          FROM sport_team \
          WHERE concat(trim(city),\' \',trim(short_name)) LIKE \'%' + teamName + '%\' AND first_year <= \'' + year + '\' AND (last_year >= \'' + year + '\') LIMIT 1;', { type: sequelize.QueryTypes.SELECT });
      },
      getTeamIdByFullName: function(teamName, year) {
        return sequelize.query('SELECT sport_team.id, sport_team.full_name \
          FROM sport_team \
          WHERE full_name LIKE \'%' + teamName + '%\' AND first_year <= \'' + year + '\' AND (last_year >= \'' + year + '\') LIMIT 1;', { type: sequelize.QueryTypes.SELECT });
      }
    }
  });

  return SportTeam;
};

