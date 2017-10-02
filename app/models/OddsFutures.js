module.exports = function (sequelize, DataTypes) {

  var OddsFutures = sequelize.define('OddsFutures', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sport_id: DataTypes.INTEGER,
    sport_team_id: DataTypes.INTEGER,
    sportsbook_id: DataTypes.INTEGER,
    capture_date: DataTypes.DATE,
    future_id: {
      type: DataTypes.INTEGER,
      references: 'odds_futures_names',
      referencesKey: 'id'
    },
    future_line: DataTypes.STRING(10)
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'odds_futures'
  });

  return OddsFutures;
};
