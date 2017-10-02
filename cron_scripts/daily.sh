#!/bin/bash


# NBA Futures
# NHL Futures
MONTH=`date +%m`
if [ $MONTH -eq 5 -o $MONTH -eq 6 ]
then	# May 1 - June 30
	if [ ! -e ~/cr.txt ]
	then
		echo 1 > ~/cr.txt
	fi
	DAY=`cat ~/cr.txt`
	if [ $DAY -eq 1  ]	# Every 2 days
	then
		# NBA Futures
        curl -s "http://107.161.30.139:4000/v2/scrap?sport=nba&type=futuresOdds" > /dev/null
		# NHL Futures
        curl -s "http://107.161.30.139:4000/v2/scrap?sport=nhl&type=futuresOdds" > /dev/null
		echo 2 > ~/cr.txt
	elif [ $DAY -eq 2 ]
	then
		echo 1 > ~/cr.txt
	fi
else	# July 1 - April 30
	DAY=`date +%w`
	# NBA Futures
	if [ $DAY -eq 1 ]	# Every Monday
	then
		curl -s "http://107.161.30.139:4000/v2/scrap?sport=nba&type=futuresOdds" > /dev/null
	fi
	# NHL Futures
	if [ $DAY -eq 7 ]	# Every Sunday
	then
		curl -s "http://107.161.30.139:4000/v2/scrap?sport=nhl&type=futuresOdds" > /dev/null
	fi
fi


# NFL Futures
DAY=`date +%w`
if [ $DAY -eq 1 ]	# Weekly/Every Monday
then
    curl -s "http://107.161.30.139:4000/v2/scrap?sport=nfl&type=futuresOdds" > /dev/null
fi


# MLB Futures
if [ $MONTH -eq 12 -o $MONTH -le 9 ]	# Dec 1 - Sept 30
then
	if [ $DAY -eq 1 ]	# Every Monday
	then
    	curl -s "http://107.161.30.139:4000/v2/scrap?sport=mlb&type=futuresOdds" > /dev/null
	fi
fi

if [ $MONTH -eq 10 -o $MONTH -eq 11 ]	# Oct 1 - Nov 30
then
	if [ ! -e ~/cr1.txt ]
	then
		echo 1 > ~/cr1.txt
	fi
	DAY=`cat ~/cr1.txt`
	if [ $DAY -eq 1  ]	# Every 2 days
	then
        curl -s "http://107.161.30.139:4000/v2/scrap?sport=mlb&type=futuresOdds" > /dev/null
		echo 2 > ~/cr1.txt
	elif [ $DAY -eq 2 ]
	then
		echo 1 > ~/cr1.txt
	fi
fi

curl -s "http://107.161.30.139:4000/cleaner" > /dev/null
