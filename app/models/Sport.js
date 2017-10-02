module.exports = function (sequelize, DataTypes) {

  var Sport = sequelize.define('Sport', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(10),
    desc: DataTypes.STRING(50)
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'sport',
    classMethods: {
      getSportIdByName: function(sportName) {
        return Sport.findOne({
          where: {
            name: sportName.toUpperCase()
          },
          attributes: ['id']
        })
          .then(function(result) {
            return result.id;
          })
          .catch(function(err) {
            console.error(err);
            return null;
          })
      }
    }
  });

  return Sport;
};

