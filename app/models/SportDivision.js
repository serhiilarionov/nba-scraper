module.exports = function (sequelize, DataTypes) {

  var SportDivision = sequelize.define('SportDivision', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    conf_id: DataTypes.INTEGER,
    name: DataTypes.STRING(25),
    desc: DataTypes.STRING(50)
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'sport_division'
  });

  return SportDivision;
};

