#!/bin/bash

beginDate="$(date --date='1 days ago' +'%Y%m%d')"
endDate="$(date --date='30 days' +'%Y%m%d')"
currentYear="$(date +'%Y')"

curl -s "http://107.161.30.139:4000/v2/scrap?sport=nba&type=scoreboard&begin=$beginDate&end=$endDate" > /dev/null
curl -s "http://107.161.30.139:4000/v2/scrap?sport=nba&type=odds" > /dev/null

curl -s "http://107.161.30.139:4000/v2/scrap?sport=nfl&type=scoreboard&seasonYear=$currentYear" > /dev/null
curl -s "http://107.161.30.139:4000/v2/scrap?sport=nfl&type=odds" > /dev/null

curl -s "http://107.161.30.139:4000/v2/scrap?sport=mlb&type=scoreboard&begin=$beginDate&end=$endDate" > /dev/null
curl -s "http://107.161.30.139:4000/v2/scrap?sport=mlb&type=odds" > /dev/null

curl -s "http://107.161.30.139:4000/v2/scrap?sport=nhl&type=scoreboard&begin=$beginDate&end=$endDate" > /dev/null
curl -s "http://107.161.30.139:4000/v2/scrap?sport=nhl&type=odds" > /dev/null
