'use strict';


module.exports = function (sequelize, DataTypes) {

  var Period = sequelize.define('Period', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    sport_id: DataTypes.INTEGER,
    abbreviation: DataTypes.STRING(15),
    desc: DataTypes.STRING(25),
    index: DataTypes.INTEGER
  }, {
    indexes: [
      {
        name: 'ui_period_abbr_desc',
        fields: ['abbreviation', 'desc']
      }
    ],
    timestamps: false,
    freezeTableName: true,
    tableName: 'period',
    classMethods: {}
  });

  return Period;
};

