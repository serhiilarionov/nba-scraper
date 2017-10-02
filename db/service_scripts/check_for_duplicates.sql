-- Check for duplicates
SELECT
  count(*)                AS "All records count",
  count(DISTINCT espn_id) AS "Unique records count",
  count(*) - count(DISTINCT espn_id) AS "Duplicates count",
  count(*) > count(DISTINCT espn_id) AS "Duplicates!!!"
FROM game;

-- Duplicates by espn_id
SELECT count(*), "game".espn_id FROM game
GROUP BY "espn_id"
HAVING count(*) > 1
ORDER BY "count" DESC;

-- Delete duplicated records
DELETE
FROM game
WHERE id
      NOT IN (
        SELECT max(id)
        FROM game
        GROUP BY "espn_id"
        HAVING count(*) >= 1
        ORDER BY count(*)
      );
