module.exports = function (sequelize, DataTypes) {

  var SportTeamException = sequelize.define('SportTeamException', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sport_id: DataTypes.INTEGER,
    espn_id: {
      type: DataTypes.INTEGER,
      comment: "Needed for detect certain game"
    },
    game_datetime: {
      type: DataTypes.DATE,
      comment: "Game date needed for update odds without game_id in trigger"
    },
    sport_team_id: DataTypes.INTEGER,
    sport_team_name_exception: DataTypes.STRING,
    team_type: {
      type: DataTypes.STRING(10),
      comment: "Used in trigger for define exception type and update certain field(away_id or home_id)"
    },
    exception_type: {
      type: DataTypes.STRING(1),
      comment: "Used in trigger for define exception type and update certain table"
    },
    box_score_url: DataTypes.STRING(200)
  }, {
    indexes: [
      {
        name: 'sport_team_exception_index',
        unique: true,
        fields: ['sport_id', 'game_datetime', 'sport_team_name_exception', 'exception_type']
      }
    ],
    timestamps: false,
    freezeTableName: true,
    tableName: 'sport_team_exception',
    classMethods: {
      insertException: function (params) {
        return sequelize.models.SportTeamException.findOrCreate({
            where: {
              sport_id: params.sportId,
              sport_team_name_exception: params.team,
              exception_type: params.type
            },
            defaults: {
              espn_id: params.espnId || null,
              game_datetime: params.gameDate,
              box_score_url: params.scoreUrl || null,
              team_type: params.teamType
            }
          })
          .then(function() {
            return null;
          });
      }
    }
  });
 
  return SportTeamException;
};

