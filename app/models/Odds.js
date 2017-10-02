module.exports = function (sequelize, DataTypes) {

  var Odds = sequelize.define('Odds', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    game_id: DataTypes.INTEGER,
    espn_id: DataTypes.INTEGER,
    sportsbook_id: DataTypes.INTEGER,
    spread_date: DataTypes.DATE,
    spread: DataTypes.STRING(10),
    over_under: DataTypes.STRING(10),
    period: DataTypes.STRING(10),
    away_moneyline: DataTypes.STRING(10),
    home_moneyline: DataTypes.STRING(10),
    favorite: DataTypes.INTEGER,
    game_date: {
      type: DataTypes.DATE,
      comment: "Needed for detect odds in exceptions trigger if game_id in null"
    },
    sport_id: {
      type: DataTypes.INTEGER,
      comment: "Needed for detect odds in exceptions trigger if game_id in null"
    }
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'odds'
  });

  return Odds;
};

