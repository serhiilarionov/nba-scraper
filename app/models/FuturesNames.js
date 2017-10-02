module.exports = function (sequelize, DataTypes) {

  var FuturesNames = sequelize.define('FuturesNames', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(100)
  }, {
    indexes: [
      {
        unique: true,
        fields: ['name']
      }
    ],
    timestamps: false,
    freezeTableName: true,
    tableName: 'odds_futures_names'
  });

  return FuturesNames;
};
