DROP PROCEDURE IF EXISTS score_sport_team_exception_update;
CREATE PROCEDURE score_sport_team_exception_update (IN sport_team_id INT, sport_team_name_exception VARCHAR(100))
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE _espn_id, _game_id INT;
  DECLARE _type BOOLEAN;
  DECLARE _game_date DATETIME;
  DECLARE _score_exception CURSOR FOR SELECT espn_id, game_id, type, game_date FROM score_exception WHERE exception LIKE CONCAT(sport_team_name_exception, '%');
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;
  OPEN _score_exception;

  WHILE done = 0 DO
    FETCH _score_exception INTO _espn_id, _game_id, _type, _game_date;
    IF _type THEN
      UPDATE game SET game.home_id = sport_team_id WHERE game.id = _game_id AND game.espn_id = _espn_id AND game.date = _game_date;
    ELSE
      UPDATE game SET game.away_id = sport_team_id WHERE game.id = _game_id AND game.espn_id = _espn_id AND game.date = _game_date;
    END IF;
  END WHILE;
  CLOSE _score_exception;
END;

DROP PROCEDURE IF EXISTS odds_sport_team_exception_update;
CREATE PROCEDURE odds_sport_team_exception_update (IN sport_team_id INT, sport_team_name_exception VARCHAR(100))
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE _espn_id, _game_id INT;
  DECLARE _type BOOLEAN;
  DECLARE _game_date DATETIME;
  DECLARE _odds_exception CURSOR FOR SELECT espn_id, game_id, type, game_date FROM odds_exception WHERE exception LIKE CONCAT(sport_team_name_exception, '%');
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;
  OPEN _odds_exception;

  WHILE done = 0 DO
    FETCH _odds_exception INTO _espn_id, _game_id, _type, _game_date;
    IF _type THEN
      UPDATE game SET game.home_id = sport_team_id WHERE game.id = _game_id AND game.espn_id = _espn_id AND game.date = _game_date;
    ELSE
      UPDATE game SET game.away_id = sport_team_id WHERE game.id = _game_id AND game.espn_id = _espn_id AND game.date = _game_date;
    END IF;
  END WHILE;
  CLOSE _odds_exception;
END;

DELIMITER $$
DROP TRIGGER IF EXISTS sport_team_exception_update $$
CREATE TRIGGER sport_team_exception_update AFTER INSERT ON sport_team_exception
FOR EACH ROW
  BEGIN
    CALL score_sport_team_exception_update(NEW.sport_team_id, NEW.sport_team_name_exception);
    CALL odds_sport_team_exception_update(NEW.sport_team_id, NEW.sport_team_name_exception);
  END $$
DELIMITER ;