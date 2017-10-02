module.exports = function (sequelize, DataTypes) {

  var SportConference = sequelize.define('SportConference', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    sport_id: DataTypes.INTEGER,
    name: DataTypes.STRING(50),
    desc: DataTypes.STRING(50)
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'sport_conference'
  });

  return SportConference;
};

