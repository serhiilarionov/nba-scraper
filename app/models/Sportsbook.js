module.exports = function (sequelize, DataTypes) {

  var Sportsbook = sequelize.define('Sportsbook', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING(10)
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'sportsbook',
    classMethods: {
      getSportsbooks: function() {
        return Sportsbook.findAll()
          .then(function(sportbooks) {
            var results = {};
            sportbooks.forEach(function(sportsbook) {
              results[sportsbook.name.toLowerCase()] = sportsbook.id;
            });
            return results;
          });
      }
    }
  });

  return Sportsbook;
};

