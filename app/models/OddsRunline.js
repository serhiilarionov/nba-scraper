module.exports = function (sequelize, DataTypes) {

	var OddsRunline = sequelize.define('OddsRunline', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		game_id: DataTypes.INTEGER,
		espn_id: DataTypes.INTEGER,
		sportsbook_id: DataTypes.INTEGER,
		away_runline: DataTypes.STRING(10),
		away_runline_odds: DataTypes.STRING(10),
		home_runline: DataTypes.STRING(10),
		home_runline_odds: DataTypes.STRING(10),
		favorite: DataTypes.INTEGER,
		sport_id: DataTypes.INTEGER,
		game_date: DataTypes.DATE
	}, {
		timestamps: true,
		freezeTableName: true,
		tableName: 'odds_run_puck_line'
	});

	return OddsRunline;
};
