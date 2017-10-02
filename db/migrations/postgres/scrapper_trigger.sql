DROP FUNCTION IF EXISTS check_exception_update() CASCADE;
CREATE FUNCTION check_exception_update() RETURNS trigger AS $check_exception_update_sport_team_id$
DECLARE updated_game record;
BEGIN
	--For scores excaptions
	IF OLD.exception_type = 'S' THEN
		--If espn_id is null - search by game_date and sport_id
		IF OLD.espn_id IS NOT NULL THEN
			IF OLD.team_type = 'home' THEN
				UPDATE game SET home_id = NEW.sport_team_id WHERE game.espn_id = OLD.espn_id AND OLD.sport_id = (SELECT sport_id FROM season WHERE id = game.season_id) RETURNING * INTO updated_game;
				UPDATE score SET home_id = NEW.sport_team_id WHERE game_id = updated_game.id;
			ELSE
				UPDATE game SET away_id = NEW.sport_team_id WHERE game.espn_id = OLD.espn_id AND OLD.sport_id = (SELECT sport_id FROM season WHERE id = game.season_id) RETURNING * INTO updated_game;
				UPDATE score SET away_id = NEW.sport_team_id WHERE game_id = updated_game.id;
			END IF;
		END IF;
	END IF;

	--For odds excaptions
	IF OLD.exception_type = 'O' THEN
		--If espn_id is null - search by game_date and sport_id
		IF OLD.espn_id IS NOT NULL THEN
			--Update only favorite id in odds
			IF OLD.team_type = 'favorite' THEN
				UPDATE odds SET favorite = NEW.sport_team_id WHERE espn_id = OLD.espn_id AND sport_id = OLD.sport_id AND favorite != 0;
				UPDATE odds_run_puck_line SET favorite = NEW.sport_team_id WHERE espn_id = OLD.espn_id AND sport_id = OLD.sport_id AND favorite != 0;
			END IF;
		ELSE
			UPDATE odds SET
				favorite = NEW.sport_team_id,
				game_id = ( SELECT id FROM game WHERE datetime = OLD.game_datetime AND sport_id = OLD.sport_id LIMIT 1),
				espn_id = ( SELECT espn_id FROM game WHERE datetime = OLD.game_datetime AND sport_id = OLD.sport_id LIMIT 1)
			WHERE game_date = OLD.game_datetime AND sport_id = OLD.sport_id AND favorite IS NULL;

			UPDATE odds_run_puck_line SET
				favorite = NEW.sport_team_id,
				game_id = ( SELECT id FROM game WHERE "datetime" = OLD.game_datetime AND sport_id = OLD.sport_id LIMIT 1),
				espn_id = ( SELECT espn_id FROM game WHERE "datetime" = OLD.game_datetime AND sport_id = OLD.sport_id LIMIT 1)
			WHERE game_date = OLD.game_datetime AND favorite IS NULL;
		END IF;
	END IF;
	RETURN NEW;
END;
$check_exception_update_sport_team_id$ LANGUAGE plpgsql;


CREATE TRIGGER check_exception_update_sport_team_id
	AFTER UPDATE ON sport_team_exception
	FOR EACH ROW
	WHEN (OLD.sport_team_id IS DISTINCT FROM NEW.sport_team_id)
	EXECUTE PROCEDURE check_exception_update();