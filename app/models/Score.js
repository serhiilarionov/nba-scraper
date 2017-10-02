module.exports = function (sequelize, DataTypes) {

  var Score = sequelize.define('Score', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    game_id: DataTypes.INTEGER,
    period_id: {type : DataTypes.INTEGER, references: 'period'},
    period: DataTypes.INTEGER,
    away_id: DataTypes.INTEGER,
    home_id: DataTypes.INTEGER,
    away_score: DataTypes.STRING(3),
    home_score: DataTypes.STRING(3)
  }, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'score'
  });

  return Score;
};

