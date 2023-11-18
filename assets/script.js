var scheduleContent = document.getElementById('schedule'); var gameId; var inputVal = '2021';
const homeRosterArray = []; const awayRosterArray = []; const homeRosterIdArray = []; const awayRosterIdArray = [];
const homeRosterDArray = []; const awayRosterDArray = []; pairingsArray4 = [];

// lines below will allow user to search by year
function getInputValue() {
  var inputVal = document.getElementById('datepicker').value; var date = inputVal.split('/');
  var formatted = date[2] + '-' + date[0] + '-' + date[1]; console.log(formatted)
  var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/schedule/' + formatted; // old version https://statsapi.web.nhl.com/api/v1/schedule/?date=
  fetch(requestURL, { "method": "GET", "headers": {}
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('I am in schedule then');
      console.log(data.gameWeek[0]);
      var numberOfGames = data.gameWeek[0].games.length; scheduleContent.textContent = '';
      for (var i = 0; i < numberOfGames; i++) {
        var gameName = document.createElement('button');
        gameName.setAttribute('id', 'game' + i); var idx = gameName.getAttribute('id');
        gameName.innerHTML = 'Game ' + i + ': ' + data.gameWeek[0].games[i].awayTeam.abbrev + ' vs ' + data.gameWeek[0].games[i].homeTeam.abbrev;
        document.getElementById('schedule').appendChild(gameName); gameName.addEventListener('click', displayGameData);
      }
      //  + data.gameWeek[0].games[i].teams.away.leagueRecord.wins + 'W ' + data.dates[0].games[i].teams.away.leagueRecord.losses + 'L ' + data.dates[0].games[i].teams.away.leagueRecord.ot + 

      function displayGameData(event) {
        idx = event.currentTarget; idxString = event.currentTarget.textContent; 
        idxArray = idxString.split(':'); idxNumber = idxArray[0].split(' ');
         gameNumber = idxNumber[1];
         const gameId = data.gameWeek[0].games[gameNumber].id;
        console.log(gameId);
        // var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/gamecenter/2023020159/boxscore'
        var requestURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/gamecenter/' + gameId + '/boxscore';
        fetch(requestURL, { "method": "GET", "headers": { }
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) { const gameInfo = document.createElement('section'); gameInfo.setAttribute('id', 'gameInfo');
            document.getElementById('schedule').appendChild(gameInfo); const gameInfoHome = document.createElement('section');
            gameInfoHome.setAttribute('id', 'gameInfoHome'); document.getElementById('schedule').appendChild(gameInfoHome);
            const gameInfoAway = document.createElement('section'); gameInfoAway.setAttribute('id', 'gameInfoAway');
            document.getElementById('schedule').appendChild(gameInfoAway);
            var gameTitle = document.createElement('h2'); gameTitle.textContent = '';
            console.log(data);
            gameTitle.innerHTML = 'You are watching stats for ' + data.awayTeam.abbrev + ' at ' + data.homeTeam.abbrev + ' game';
            document.getElementById('gameInfo').appendChild(gameTitle);
          });
        } // end displayGameData 
        getShifts();
        function getShifts(event) {
          var rosterURL = 'https://cors-anywhere.herokuapp.com/https://api-web.nhle.com/v1/gamecenter/' + gameId + '/boxscore';
          fetch(rosterURL, {
            "method": "GET", "headers": {}
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (data) { console.log(data);
              console.log(data.liveData.boxscore.teams.away.skaters, data.liveData.boxscore.teams.home.skaters, data.gameData.players);
              skatersHome = data.liveData.boxscore.teams.home.skaters; skatersAway = data.liveData.boxscore.teams.away.skaters;
              goaliesHome = data.liveData.boxscore.teams.home.goalies; goaliesAway = data.liveData.boxscore.teams.away.goalies;
              var obj = data.gameData.players; var keys = Object.keys(obj);

              for (var i = 0; i < keys.length; i++) {
                var val = obj[keys[i]];
                if (skatersAway.includes(val.id) || goaliesAway.includes(val.id))// if (val.currentTeam.id == data.gameData.teams.away.id) 
                { awayRosterArray.push(val.primaryNumber); awayRosterArray.push(val.fullName);
                  awayRosterArray.push(val.primaryPosition.abbreviation); awayRosterArray.push(val.shootsCatches);
                  awayRosterArray.push(keys[i]); awayRosterIdArray.push(val.id);
                }
                else if (skatersHome.includes(val.id) || goaliesHome.includes(val.id))// else if (val.currentTeam.id == data.gameData.teams.home.id) 
                { homeRosterArray.push(val.primaryNumber); homeRosterArray.push(val.fullName);
                  homeRosterArray.push(val.primaryPosition.abbreviation); homeRosterArray.push(val.shootsCatches);
                  homeRosterArray.push(keys[i]); homeRosterIdArray.push(val.id);
                }
                else { console.log(val.id, 'player probably changed team') }
              }
              // fiveOnFive structure: array elements 0-2 and 3-5 are home and away team penalties; elements 6-8 and 9-11 are home and away team goals
              // elements 12 and 13 are each array of 3 or 6; home and away goalie on-ice times for three periods
              fiveOnFive = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []]; 

              for (i = 0; i < data.liveData.plays.penaltyPlays.length; i++) { penaltyPlay = data.liveData.plays.penaltyPlays[i];
                if ((homeRosterIdArray.includes(data.liveData.plays.allPlays[penaltyPlay].players[0].player.id)) && (data.liveData.plays.allPlays[penaltyPlay].about.period < 4)) { fiveOnFive[data.liveData.plays.allPlays[penaltyPlay].about.period - 1].push(data.liveData.plays.allPlays[penaltyPlay].about.periodTime, data.liveData.plays.allPlays[penaltyPlay].result.penaltyMinutes); }
                else if ((awayRosterIdArray.includes(data.liveData.plays.allPlays[penaltyPlay].players[0].player.id)) && (data.liveData.plays.allPlays[penaltyPlay].about.period < 4)) { fiveOnFive[data.liveData.plays.allPlays[penaltyPlay].about.period + 2].push(data.liveData.plays.allPlays[penaltyPlay].about.periodTime, data.liveData.plays.allPlays[penaltyPlay].result.penaltyMinutes); }
                else { console.log('home', data.liveData.plays.allPlays[penaltyPlay].players[0].player.id) }
              }
                
              for (i = 0; i < data.liveData.plays.scoringPlays.length; i++) { scoringPlay = data.liveData.plays.scoringPlays[i];
                if ((homeRosterIdArray.includes(data.liveData.plays.allPlays[scoringPlay].players[0].player.id) && (data.liveData.plays.allPlays[scoringPlay].result.strength.code === 'PPG') && (data.liveData.plays.allPlays[scoringPlay].about.period < 4))) { fiveOnFive[data.liveData.plays.allPlays[scoringPlay].about.period + 5].push(data.liveData.plays.allPlays[scoringPlay].about.periodTime); }
                else if ((awayRosterIdArray.includes(data.liveData.plays.allPlays[scoringPlay].players[0].player.id) && (data.liveData.plays.allPlays[scoringPlay].result.strength.code === 'PPG' && (data.liveData.plays.allPlays[scoringPlay].about.period < 4)))) { fiveOnFive[data.liveData.plays.allPlays[scoringPlay].about.period + 8].push(data.liveData.plays.allPlays[scoringPlay].about.periodTime); }
              } 
              console.log('fiveOnFive', fiveOnFive);
              realFiveOnFive = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]]; // penalties for home and road team, PPG for road and home teams: unmutable
              realFiveOnFive2 = [[[],[],[]], [[],[],[]], [[],[],[]], [[],[],[]]]; // mutable copy of realFiveOnFive
              realFiveOnFive3 = [[],[],[],[]]; // will change it back to avoid periods
              realFiveOnFive4 = [[],[],[],[]]; // unmutable copy of realIveOnFive3
              for (i = 0; i < 3; i++) { // home penalties
                for (j = 0; j < fiveOnFive[i].length / 2; j++) { timeStamp = fiveOnFive[i][2 * j].split(':');
                  timeInSeconds = i * 1200 + Number(timeStamp[0]) * 60 + Number(timeStamp[1]);
                  penaltyLengthSeconds = fiveOnFive[i][2 * j + 1] * 60;
                  if (timeInSeconds + penaltyLengthSeconds < 3600) {realFiveOnFive[0][i].push(timeInSeconds, timeInSeconds + penaltyLengthSeconds);
                    realFiveOnFive2[0][i].push(timeInSeconds, timeInSeconds + penaltyLengthSeconds)}
                }
              }
              for (k = 0; k < 2; k++){ // home and away team penalties
              for (i = 3*k; i < 3*k + 3; i++) { for (j = 0; j < fiveOnFive[i].length / 2; j++) { timeStamp = fiveOnFive[i][2 * j].split(':');
                  timeInSeconds = i * 1200 + Number(timeStamp[0]) * 60 + Number(timeStamp[1]) - 3600 * k;
                  penaltyLengthSeconds = fiveOnFive[i][2 * j + 1] * 60;
                  if (timeInSeconds + penaltyLengthSeconds < 7200) {realFiveOnFive3[k].push(timeInSeconds, timeInSeconds + penaltyLengthSeconds);
                    realFiveOnFive4[k].push(timeInSeconds, timeInSeconds + penaltyLengthSeconds)}
                }
              }
              }
                for (i = 3; i < 6; i++) { // away penalties
                for (j = 0; j < fiveOnFive[i].length / 2; j++) {timeStamp = fiveOnFive[i][2 * j].split(':');
                  timeInSeconds = (i - 3) * 1200 + Number(timeStamp[0]) * 60 + Number(timeStamp[1]);
                  penaltyLengthSeconds = fiveOnFive[i][2 * j + 1] * 60;
                  if (timeInSeconds + penaltyLengthSeconds < 3600) {
                    realFiveOnFive[1][i-3].push(timeInSeconds, timeInSeconds + penaltyLengthSeconds);
                    realFiveOnFive2[1][i-3].push(timeInSeconds, timeInSeconds + penaltyLengthSeconds)}
                }
              }
              for (i = 9; i < 12; i++) { // away PPG
                for (j = 0; j < fiveOnFive[i].length; j++) {timeStamp = fiveOnFive[i][j].split(':');
                  timeInSeconds = (i - 9) * 1200 + Number(timeStamp[0]) * 60 + Number(timeStamp[1]);
                  realFiveOnFive[2][i-9].push(timeInSeconds); realFiveOnFive2[2][i-9].push(timeInSeconds)}
              }
              for (i = 6; i < 9; i++) { // home PPG
                for (j = 0; j < fiveOnFive[i].length; j++) { timeStamp = fiveOnFive[i][j].split(':');
                  timeInSeconds = (i - 6) * 1200 + Number(timeStamp[0]) * 60 + Number(timeStamp[1]);
                  realFiveOnFive[3][i-6].push(timeInSeconds); realFiveOnFive2[3][i-6].push(timeInSeconds)}
              }
              for (k = 2; k < 4; k++) {
              for (i = 3*k ; i < 3*k+3; i++) { // home PPG
                for (j = 0; j < fiveOnFive[i].length; j++) { timeStamp = fiveOnFive[i][j].split(':');
                  timeInSeconds = (i - 6) * 1200 + Number(timeStamp[0]) * 60 + Number(timeStamp[1]) - 3600 * (k-2);
                  realFiveOnFive3[k].push(timeInSeconds); realFiveOnFive4[k].push(timeInSeconds)}
              }
              }
              console.log(realFiveOnFive);
              console.log('realFiveOnFive3', realFiveOnFive3)
            });
          // console.log(gameId); https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + gameId
          var shiftURL = 'https://cors-anywhere.herokuapp.com/https://api.nhle.com/stats/rest/en/shiftcharts?cayenneExp=gameId=' + gameId;
          fetch(shiftURL, {
            "method": "GET", "headers": {}
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {console.log('I am in third then'); playerChart1 = []; playerChart2 = []; 
              playerChart3 = []; startingLineup = []; totalChart = []; idChart = [];

              // that's a complex loop that creates arrays of each player time shifts in each of three periods, also array of playerIDs who actually played the game, not just were in the roster, also starting lineups are created
              for (i = 0; i < data.data.length - 1; i++) {
                if (data.data[i].typeCode == 517) {
                  const playerId = data.data[i].playerId;
                  if (data.data[i].playerId == data.data[i + 1].playerId) {
                    if (data.data[i].period == 1) {shiftStart = data.data[i].startTime; shiftStart1 = shiftStart.split(':'); minutes = Number(shiftStart1[0]); 
                      seconds = Number(shiftStart1[1]); shiftStart2 = minutes * 60 + seconds; playerChart1.push(shiftStart2);
                      shiftEnd = data.data[i].endTime; shiftEnd1 = shiftEnd.split(':'); minutes = Number(shiftEnd1[0]); 
                      seconds = Number(shiftEnd1[1]); shiftEnd2 = minutes * 60 + seconds; playerChart1.push(shiftEnd2)
                      if (shiftStart2 == 0) { startingLineup.push(data.data[i].playerId) }
                    }

                    else if (data.data[i].period == 2) {shiftStart = data.data[i].startTime; shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]); seconds = Number(shiftStart1[1]); shiftStart2 = minutes * 60 + seconds;
                      playerChart2.push(shiftStart2); shiftEnd = data.data[i].endTime; shiftEnd1 = shiftEnd.split(':'); minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]); shiftEnd2 = minutes * 60 + seconds; playerChart2.push(shiftEnd2)
                    }

                    else if (data.data[i].period == 3) {shiftStart = data.data[i].startTime; shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]); seconds = Number(shiftStart1[1]); shiftStart2 = minutes * 60 + seconds;
                      playerChart3.push(shiftStart2); shiftEnd = data.data[i].endTime; shiftEnd1 = shiftEnd.split(':'); minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]); shiftEnd2 = minutes * 60 + seconds; playerChart3.push(shiftEnd2)
                    }
                    else { console.log('overtime shift not added') }
                  }

                  else {if (data.data[i].period == 3) {
                      shiftStart = data.data[i].startTime;
                      shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]);
                      seconds = Number(shiftStart1[1]);
                      shiftStart2 = minutes * 60 + seconds;
                      playerChart3.push(shiftStart2);
                      shiftEnd = data.data[i].endTime;
                      shiftEnd1 = shiftEnd.split(':');
                      minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]);
                      shiftEnd2 = minutes * 60 + seconds;
                      playerChart3.push(shiftEnd2)
                    }
                    else if (data.data[i].period == 2) {
                      shiftStart = data.data[i].startTime;
                      shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]);
                      seconds = Number(shiftStart1[1]);
                      shiftStart2 = minutes * 60 + seconds;
                      playerChart2.push(shiftStart2);
                      shiftEnd = data.data[i].endTime;
                      shiftEnd1 = shiftEnd.split(':');
                      minutes = Number(shiftEnd1[0]);
                      seconds = Number(shiftEnd1[1]);
                      shiftEnd2 = minutes * 60 + seconds;
                      playerChart2.push(shiftEnd2)
                    }
                    else if (data.data[i].period == 1) {
                      shiftStart = data.data[i].startTime;
                      shiftStart1 = shiftStart.split(':');
                      minutes = Number(shiftStart1[0]);
                      seconds = Number(shiftStart1[1]);
                      shiftStart2 = minutes * 60 + seconds;
                      playerChart1.push(shiftStart2);
                      shiftEnd = data.data[i].endTime;
                      shiftEnd1 = shiftEnd.split(':');
                      minutes = Number(shiftEnd1[0]); 
                      seconds = Number(shiftEnd1[1]);
                      shiftEnd2 = minutes * 60 + seconds;
                      playerChart1.push(shiftEnd2)
                    }
                    else { console.log('error in adding last shift', data.data[i].period) }
                    totalChart.push(playerChart1, playerChart2, playerChart3);
                    idChart.push(playerId);
                    playerChart1 = []; playerChart2 = []; playerChart3 = [];
                  }                  

                  if (i == data.data.length - 2) {
                    totalChart.push(playerChart1, playerChart2, playerChart3);
                    console.log(i, playerId, idChart.length); idChart.push(playerId);
                  }
                }
              } // end for cycle for shift processing data next five lines just last shift of last pleyer
              if (data.data[data.data.length - 1].period == 3) {playerChart3.push(data.data[data.data.length - 1].startTime);
                console.log(data.data[data.data.length - 1].startTime)
              }
              else if (data.data[data.data.length - 1].period == 2) {playerChart2.push(data.data[data.data.length - 1].startTime)}
              else if (data.data[data.data.length - 1].period == 1) {playerChart1.push(data.data[data.data.length - 1].startTime)}
              // lines 286-302 disabled on 02/05/2023 i do not need starting lineup for now

              homeRosterGArray = []; homeRosterFArray = []; awayRosterGArray = []; awayRosterFArray = [];
              for (i = 0; i < idChart.length; i++) {
                tempValue = 'ID' + idChart[i];
                if (homeRosterArray.includes(tempValue)) { tempVariable = homeRosterArray.indexOf(tempValue);
                  if (homeRosterArray[tempVariable - 2] == 'D') { homeRosterDArray.push(idChart[i]) }
                  else if (homeRosterArray[tempVariable - 2] == 'G') { homeRosterGArray.push(idChart[i]);
                    fiveOnFive[12].push(totalChart[3 * i], totalChart[3 * i + 1], totalChart[3 * i + 2]);
                  }
                  else if (homeRosterArray[tempVariable - 2] == 'C') { homeRosterFArray.push(idChart[i]) }
                  else if (homeRosterArray[tempVariable - 2] == 'RW') { homeRosterFArray.push(idChart[i]) }
                  else if (homeRosterArray[tempVariable - 2] == 'LW') { homeRosterFArray.push(idChart[i]) }
                  else (console.log('he does not have a position', tempValue));
                }
              } // end for  home idChart loop

              for (i = 0; i < idChart.length; i++) {
                tempValue = 'ID' + idChart[i];
                if (awayRosterArray.includes(tempValue)) {
                  tempVariable = awayRosterArray.indexOf(tempValue);
                  if (awayRosterArray[tempVariable - 2] == 'D') { awayRosterDArray.push(idChart[i]) }
                  else if (awayRosterArray[tempVariable - 2] == 'G') {
                    awayRosterGArray.push(idChart[i]);
                    fiveOnFive[13].push(totalChart[3 * i], totalChart[3 * i + 1], totalChart[3 * i + 2])
                  }
                  else if (awayRosterArray[tempVariable - 2] == 'C') { awayRosterFArray.push(idChart[i]) }
                  else if (awayRosterArray[tempVariable - 2] == 'RW') { awayRosterFArray.push(idChart[i]); }
                  else if (awayRosterArray[tempVariable - 2] == 'LW') { awayRosterFArray.push(idChart[i]); }
                  else (console.log('he does not have a position', tempValue))
                }
              } // end for away idChart loop
              console.log(homeRosterDArray, homeRosterGArray, homeRosterFArray);
              console.log(awayRosterDArray, awayRosterGArray, awayRosterFArray);
             
              counterArray = [[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]]] // this array collects data on mutual penalties; it is empty if there were no mutual penalties
              counterArray2 = [[],[],[],[]] // same as counterArray but without division to periods
              for (m = 0; m < 3; m++) {
              for (i = 0; i < realFiveOnFive[0][m].length / 2; i++) {
                for (j = 0; j < realFiveOnFive[1][m].length / 2; j++) {
                  if ((realFiveOnFive[0][m][2 * i] === realFiveOnFive[1][m][2 * j]) && (realFiveOnFive[0][m][2 * i + 1] === realFiveOnFive[1][m][2 * j + 1]))  // 
                  { countHome = 0; countAway = 0;
                  for (k = 0; k < realFiveOnFive[0][m].length / 2; k++) {if ((realFiveOnFive[0][m][2 * k] === realFiveOnFive[0][m][2 * i]) && (realFiveOnFive[0][m][2 * k + 1] === realFiveOnFive[0][m][2 * i + 1])) {countHome++}}
                  for (l = 0; l < realFiveOnFive[1][m].length / 2; l++) {if ((realFiveOnFive[1][m][2 * l] === realFiveOnFive[1][m][2 * j]) && (realFiveOnFive[1][m][2 * l + 1] === realFiveOnFive[1][m][2 * j + 1])) {countAway++}}
                //}
                counterArray[0][m].push(i, realFiveOnFive[0][m][2*i] )
                counterArray[1][m].push(j, realFiveOnFive[1][m][2*j] )
                  } 
                }
              }
            }
            
              for (i = 0; i < realFiveOnFive3[0].length / 2; i++) { // mutual penalties
                for (j = 0; j < realFiveOnFive3[1].length / 2; j++) {
                  if ((realFiveOnFive3[0][2 * i] === realFiveOnFive3[1][2 * j]) && (realFiveOnFive3[0][2 * i + 1] === realFiveOnFive3[1][2 * j + 1]))  // 
                  { countHome = 0; countAway = 0;
                  for (k = 0; k < realFiveOnFive3[0].length / 2; k++) {if ((realFiveOnFive3[0][2 * k] === realFiveOnFive3[0][2 * i]) && (realFiveOnFive3[0][2 * k + 1] === realFiveOnFive3[0][2 * i + 1])) {countHome++}}
                  for (l = 0; l < realFiveOnFive3[1].length / 2; l++) {if ((realFiveOnFive3[1][2 * l] === realFiveOnFive3[1][2 * j]) && (realFiveOnFive3[1][2 * l + 1] === realFiveOnFive3[1][2 * j + 1])) {countAway++}}
                //}
                counterArray2[0].push(i, realFiveOnFive3[0][2*i] )
                counterArray2[1].push(j, realFiveOnFive3[1][2*j] )
                  } 
                }
              }
              console.log(counterArray2)
              tempArray9 = [[],[],[]];
              tempArray91 = [];
              for (m = 0; m < 3; m++) {for (i = 0; i < counterArray[0][m].length / 2; i++)  { if (tempArray9[m].includes(counterArray[0][m][2 * i + 1])) {}
              else {tempArray9[m].push(counterArray[0][m][2 * i + 1])} 
              }}
              for (i = 0; i < counterArray2[0].length / 2; i++)  { if (tempArray91.includes(counterArray2[0][2 * i + 1])) {}
              else {tempArray91.push(counterArray2[0][2 * i + 1])} 
              }
              console.log('tempArray91', tempArray9, tempArray91); // array of mutual penalties start times
          
              for (m = 0; m < 3; m++)  {
              for (i = 0; i < tempArray9[m].length; i++) {tempArray10 = []; tempArray1 = []; tempArray12 = []; tempArray11 = []; tempArray13 =[]; tempArray14 = [];
                for (j = 0; j < counterArray[0][m].length / 2; j++) {
                if (counterArray[0][m][2 * j + 1] === tempArray9[m][i]) { 
                  if (tempArray10.includes(counterArray[0][m][2 * j])) {}             
                else { 
                  if (realFiveOnFive[0][m][2 * counterArray[0][m][2 * j] + 1] - realFiveOnFive[0][m][2 * counterArray[0][m][2 * j]] === 120 ) {
                tempArray10.push(counterArray[0][m][2 * j]); tempArray11.push(counterArray[0][m][2 * j])
              console.log(tempArray10, tempArray11)}
                else if (realFiveOnFive[0][m][2 * counterArray[0][m][2 * j] + 1] - realFiveOnFive[0][m][2 * counterArray[0][m][2 * j]] === 300 ) {
                tempArray13.push(counterArray[0][m][2 * j]); tempArray10.push(counterArray[0][m][2 * j])}
                else {console.log('not 2 or 5 minutes')}
                  }}}
                for (j = 0; j < counterArray[1][m].length / 2; j++) { 
                  if (counterArray[1][m][2 * j + 1] === tempArray9[m][i]) {
                    if (tempArray1.includes(counterArray[1][m][2 * j])) {}
                  else { if (realFiveOnFive[1][m][2 * counterArray[1][m][2 * j] + 1] - realFiveOnFive[1][m][2 * counterArray[1][m][2 * j]] === 120 ) {
                    tempArray1.push(counterArray[1][m][2 * j]); tempArray12.push(counterArray[1][m][2 * j])} 
                    else if (realFiveOnFive[1][m][2 * counterArray[1][m][2 * j] + 1] - realFiveOnFive[1][m][2 * counterArray[1][m][2 * j]] === 300 ) {
                    tempArray1.push(counterArray[1][m][2 * j]); tempArray14.push(counterArray[1][m][2 * j])}
                    else {console.log('not 2 or 5 minutes')}
                  }}}
                counterArray[2][m].push(tempArray11, tempArray13);
                counterArray[3][m].push(tempArray12, tempArray14); 
                } //end i loop 
              } //end m loop 

              for (k = 0; k < 2; k++){
              for (i = 0; i < tempArray91.length; i++) {tempArray10 = []; tempArray1 = []; tempArray12 = []; tempArray11 = []; tempArray13 =[]; tempArray14 = [];
                for (j = 0; j < counterArray2[0].length / 2; j++) {
                if (counterArray2[k][2 * j + 1] === tempArray91[i]) {
                  if (tempArray10.includes(counterArray2[k][2 * j])) {}            
                else { 
                  if (realFiveOnFive3[k][2 * counterArray2[k][2 * j] + 1] - realFiveOnFive3[k][2 * counterArray2[k][2 * j]] === 120 ) {
                tempArray10.push(counterArray2[k][2 * j]); tempArray11.push(counterArray2[k][2 * j])
              console.log(tempArray10, tempArray11)} 
                else if (realFiveOnFive3[k][2 * counterArray2[k][2 * j] + 1] - realFiveOnFive3[k][2 * counterArray2[k][2 * j]] === 300 ) {
                tempArray13.push(counterArray2[k][2 * j]); tempArray10.push(counterArray2[k][2 * j])} 
                else {console.log('not 2 or 5 minutes')} //assume there will never be mutual 4 minutes penalty
                  }}}                
                counterArray2[2].push(tempArray11, tempArray13);
                counterArray2[3].push(tempArray12, tempArray14);
                } // end i loop
              } // end k loop for home & away teams
                    console.log('CounterArray2', counterArray, counterArray2);                
                for (m = 2; m > -1; m--){ // this loop filters out mutual penalties out of penalties array; compare realFiveOnFive unfiltered and realFiveOnFive2 filtered and check if there were mutual penalties (tempArray9 is not empty)
              for (i = tempArray9[m].length - 1; i > -1; i--) { if (counterArray[2][m][2*i].length >= counterArray[3][m][2*i].length) 
                { tempArray11 = counterArray[2][m][2*i].slice(0,counterArray[3][m][2*i].length);
                  tempArray12 = counterArray[3][m][2*i] }
                  else if (counterArray[2][m][2*i].length < counterArray[3][m][2*i].length)
                  {tempArray11 = counterArray[2][m][2*i];
                  tempArray12 = counterArray[3][m][2*i].slice(0,counterArray[2][m][2*i].length)}
                  if (counterArray[2][m][2*i + 1].length >= counterArray[3][m][2*i + 1].length) 
                { tempArray13 = counterArray[2][m][2*i + 1].slice(0,counterArray[3][m][2*i + 1].length);
                  tempArray14 = counterArray[3][m][2*i + 1]}
                  else if (counterArray[2][m][2*i + 1].length < counterArray[3][m][2*i + 1].length)
                  {tempArray13 = counterArray[2][m][2*i + 1];
                  tempArray14 = counterArray[3][m][2*i + 1].slice(0,counterArray[2][m][2*i + 1].length)}
                  tempArray7 = tempArray11.concat(tempArray13);
                  tempArray8 = tempArray12.concat(tempArray14);
                  tempArray7.sort(function(a, b){return a - b});
                  tempArray8.sort(function(a, b){return a - b});
                    for (j = tempArray7.length - 1; j > -1; j--){
                    realFiveOnFiveBefore = realFiveOnFive2[0][m].slice(0, 2 * tempArray7[j]);
                    realFiveOnFiveAfter = realFiveOnFive2[0][m].slice(2 * tempArray7[j] + 2);
                    realFiveOnFive2[0][m] = realFiveOnFiveBefore.concat(realFiveOnFiveAfter);
                    realFiveOnFiveBefore = realFiveOnFive2[1][m].slice(0, 2 * tempArray8[j]);
                    realFiveOnFiveAfter = realFiveOnFive2[1][m].slice(2 * tempArray8[j] + 2);
                    realFiveOnFive2[1][m] = realFiveOnFiveBefore.concat(realFiveOnFiveAfter);
                  }                    
                } // end i loop
              } // end m loop 3 periods descending

              for (i = tempArray91.length - 1; i > -1; i--) { if (counterArray2[2][2*i].length >= counterArray2[3][2*i].length) 
                { tempArray11 = counterArray2[2][2*i].slice(0,counterArray[3][2*i].length);
                  tempArray12 = counterArray2[3][2*i] }
                  else if (counterArray2[2][2*i].length < counterArray[3][m][2*i].length)
                  {tempArray11 = counterArray2[2][2*i];
                  tempArray12 = counterArray2[3][2*i].slice(0,counterArray2[2][2*i].length)}
                  if (counterArray2[2][2*i + 1].length >= counterArray2[3][2*i + 1].length) 
                { tempArray13 = counterArray2[2][2*i + 1].slice(0,counterArray2[3][2*i + 1].length);
                  tempArray14 = counterArray2[3][2*i + 1]}
                  else if (counterArray2[2][2*i + 1].length < counterArray2[3][2*i + 1].length)
                  {tempArray13 = counterArray2[2][2*i + 1];
                  tempArray14 = counterArray2[3][2*i + 1].slice(0,counterArray2[2][2*i + 1].length)}
                  tempArray7 = tempArray11.concat(tempArray13);
                  tempArray8 = tempArray12.concat(tempArray14);
                  tempArray7.sort(function(a, b){return a - b});
                  tempArray8.sort(function(a, b){return a - b});
                    for (j = tempArray7.length - 1; j > -1; j--){
                    realFiveOnFiveBefore = realFiveOnFive3[0].slice(0, 2 * tempArray7[j]);
                    realFiveOnFiveAfter = realFiveOnFive3[0].slice(2 * tempArray7[j] + 2);
                    realFiveOnFive3[0] = realFiveOnFiveBefore.concat(realFiveOnFiveAfter);
                    realFiveOnFiveBefore = realFiveOnFive3[1].slice(0, 2 * tempArray8[j]);
                    realFiveOnFiveAfter = realFiveOnFive3[1].slice(2 * tempArray8[j] + 2);
                    realFiveOnFive3[1] = realFiveOnFiveBefore.concat(realFiveOnFiveAfter);
                  }} // end i loop
              for (k = 0; k < 3; k++){ // this loop will change time end of penalty time if a PPG is scored by road team
              for (i = 0; i < realFiveOnFive2[2][k].length; i++) {tempArray11 = []; tempArray12 = []; // tempArray11 and tempArray12 are different to count for 5x3 or 4x3 goals
                    for (j = 0; j < realFiveOnFive2[0][k].length/2; j++){if ((realFiveOnFive2[2][k][i] > realFiveOnFive2[0][k][2*j])&&(realFiveOnFive2[2][k][i] < realFiveOnFive2[0][k][2*j + 1]))
                    {if (realFiveOnFive2[0][k][2*j+1] - realFiveOnFive2[0][k][2*j] === 120){tempArray11.push(j)}}
                    }
                    for (j = 0; j < realFiveOnFive2[1][k].length/2; j++){if ((realFiveOnFive2[2][k][i] > realFiveOnFive2[1][k][2*j])&&(realFiveOnFive2[2][k][i] < realFiveOnFive2[1][k][2*j + 1]))
                    {if (realFiveOnFive2[1][k][2*j+1] - realFiveOnFive2[1][k][2*j] === 120) {tempArray12.push(j)}}
                    } 
                    if (tempArray11 === []) {}
                    else {realFiveOnFive2[0][k][2*tempArray11[0]+1] = realFiveOnFive2[2][k][i]}
                    console.log(k, i, tempArray11, tempArray12)
                    }
                  } // end k loop
                  for (k = 0; k < 3; k++){ // this loop will change time end of penalty time if a PPG is scored by home team
                  for (i = 0; i < realFiveOnFive2[3][k].length; i++) {tempArray13 = []; tempArray14 = []; // tempArray13 and tempArray14 are different to count for 5x3 or 4x3 goals
                    for (j = 0; j < realFiveOnFive2[1][k].length/2; j++){if ((realFiveOnFive2[3][k][i] > realFiveOnFive2[1][k][2*j])&&(realFiveOnFive2[3][k][i] < realFiveOnFive2[1][k][2*j + 1]))
                    {if (realFiveOnFive2[1][k][2*j+1] - realFiveOnFive2[1][k][2*j] === 120) {tempArray13.push(j)}}
                    }
                    for (j = 0; j < realFiveOnFive2[0][k].length/2; j++){if ((realFiveOnFive2[3][k][i] > realFiveOnFive2[0][k][2*j])&&(realFiveOnFive2[3][k][i] < realFiveOnFive2[0][k][2*j + 1]))
                    {if (realFiveOnFive2[0][k][2*j+1] - realFiveOnFive2[0][k][2*j] === 120) {tempArray14.push(j)}}
                    }
                    if (tempArray13 === []) {}
                    else {realFiveOnFive2[1][k][2*tempArray13[0]+1] = realFiveOnFive2[3][k][i]}
                    console.log(k, i, tempArray13, tempArray14);
                    }} // end k loop
                    console.log('realFiveOnFive', realFiveOnFive, realFiveOnFive2);

                    for (i = 12; i < 14; i++) { if (fiveOnFive[i].length > 3) { let tempArray8 = []; 
                    for (j = 0; j < 3; j++) { if (fiveOnFive[i][j].length === 0) { tempArray8.push(fiveOnFive[i][j+3]) }
                    else if (fiveOnFive[i][j+3].length === 0) { tempArray8.push(fiveOnFive[i][j]) }
                    else if ((fiveOnFive[i][j].length > 0) && (fiveOnFive[i][j + 3].length > 0)) { 
                    if (fiveOnFive[i][j][0] === 0) { tempArray8[j] = fiveOnFive[i][j].concat(fiveOnFive[i][j + 3]) } 
                    else if (fiveOnFive[i][j + 3][0] === 0) { tempArray8[j] = fiveOnFive[i][j + 3].concat(fiveOnFive[i][j])
                  }
                }
                  for (k = 0; k < tempArray8[j].length/2 - 1; k++) {if (tempArray8[j][2*k+1] === tempArray8[j][2*k+2]){tempArray9 = tempArray8[j].splice(2*k+1, 2)}}
                  fiveOnFive[i][j] = tempArray8[j]
                }} // end j loop period goalies changes loop, end i loop                 
              }
              console.log(fiveOnFive[12], fiveOnFive[13]);
              for (i = 0; i < 2; i++) { // home 0 and away 1 teams
              for (j = 0; j < 3; j++) { tempArray11 = [];
                for (k = 0; k < realFiveOnFive2[i][j].length/2 - 1; k++) { 
                for (l=k+1; l < realFiveOnFive2[i][j].length/2 - 1; l++) {
                if (realFiveOnFive2[i][j][2*k+1] < realFiveOnFive2[i][j][2*l]) {}
              else {tempArray11.push(l, realFiveOnFive2[i][j][2*k+1], realFiveOnFive2[i][j][2*l])
                console.log('ijk', i, j, k, tempArray11)}
              } // end l loop
              }
            }}

              getDPairs();
              function getDPairs() {shiftsFArray = []; awayShiftsFArray = [];
                TOIArray = []; TOIFArray = []; TOIAwayArray = []; shiftsArray2 = [[],[],[]]; // shiftsArray = [];
                pairingsArray = []; pairingsAwayArray = []; linesArray = []; awayLinesArray = []; awayShiftsArray2 = [[],[],[]]
                // for (i = 0; i < homeRosterDArray.length; i++) { shiftsArray.push(totalChart[3 * idChart.indexOf(homeRosterDArray[i])]) }
                // for (i = 0; i < homeRosterDArray.length; i++) { shiftsArray.push(totalChart[3 * idChart.indexOf(homeRosterDArray[i]) + 1]) }
                // for (i = 0; i < homeRosterDArray.length; i++) { shiftsArray.push(totalChart[3 * idChart.indexOf(homeRosterDArray[i]) + 2]) } // end first three for defense loops
                for (i = 0; i < 3; i++) {for (j = 0; j < homeRosterDArray.length; j++) {shiftsArray2[i].push(totalChart[3 * idChart.indexOf(homeRosterDArray[j])+i])}}
                // for (i = 0; i < awayRosterDArray.length; i++) { awayShiftsArray.push(totalChart[3 * idChart.indexOf(awayRosterDArray[i])]) }
                // for (i = 0; i < awayRosterDArray.length; i++) { awayShiftsArray.push(totalChart[3 * idChart.indexOf(awayRosterDArray[i]) + 1]) }
                // for (i = 0; i < awayRosterDArray.length; i++) { awayShiftsArray.push(totalChart[3 * idChart.indexOf(awayRosterDArray[i]) + 2]) } // end first three for defense loops
                for (i = 0; i < 3; i++) {for (j = 0; j < awayRosterDArray.length; j++) {awayShiftsArray2[i].push(totalChart[3 * idChart.indexOf(awayRosterDArray[j])+i])}}
                for (i = 0; i < homeRosterFArray.length; i++) { shiftsFArray.push(totalChart[3 * idChart.indexOf(homeRosterFArray[i])]) }
                for (i = 0; i < homeRosterFArray.length; i++) { shiftsFArray.push(totalChart[3 * idChart.indexOf(homeRosterFArray[i]) + 1]) }
                for (i = 0; i < homeRosterFArray.length; i++) { shiftsFArray.push(totalChart[3 * idChart.indexOf(homeRosterFArray[i]) + 2]) } // end first three for forward loops
                for (i = 0; i < awayRosterFArray.length; i++) { awayShiftsFArray.push(totalChart[3 * idChart.indexOf(awayRosterFArray[i])]) }
                for (i = 0; i < awayRosterFArray.length; i++) { awayShiftsFArray.push(totalChart[3 * idChart.indexOf(awayRosterFArray[i]) + 1]) }
                for (i = 0; i < awayRosterFArray.length; i++) { awayShiftsFArray.push(totalChart[3 * idChart.indexOf(awayRosterFArray[i]) + 2]) } // end first three for forward loops
                //TOIArray is not used currently later in the script. May be deleted along with TOIFarray, TOIAwayArray
                
                for (i = 0; i < shiftsArray2.length; i++) {
                  totalShiftLength = 0;
                  tempArray = shiftsArray2[i];
                  for (j = 0; j < tempArray.length / 3; j++) {
                    const shiftLength = tempArray[2 * j + 1] - tempArray[2 * j];
                    totalShiftLength = totalShiftLength + shiftLength;
                  } // end j loop
                  TOIArray.push(totalShiftLength);
                } // end i TOIArray D loop
                for (i = 0; i < shiftsFArray.length; i++) {
                  totalShiftLength = 0; tempArray = shiftsFArray[i];
                  for (j = 0; j < tempArray.length / 3; j++) {
                    const shiftLength = tempArray[2 * j + 1] - tempArray[2 * j];
                    totalShiftLength = totalShiftLength + shiftLength;
                  } // end j loop
                  TOIFArray.push(totalShiftLength); 
                } // end i TOIFArray loop
                for (i = 0; i < awayShiftsArray2.length; i++) {
                  totalShiftLength = 0;
                  tempArray = awayShiftsArray2[i];
                  // console.log(tempArray);
                  for (j = 0; j < tempArray.length / 3; j++) {
                    const shiftLength = tempArray[2 * j + 1] - tempArray[2 * j];
                    totalShiftLength = totalShiftLength + shiftLength;
                  } // end j loop
                  TOIAwayArray.push(totalShiftLength);
                } // end i TOIArray D loop

                // tempArray6 = []; tempArray4 = shiftsArray.splice(shiftsArray.length / 3); tempArray5 = tempArray4.splice(tempArray4.length / 2);
                // tempArray6[1] = tempArray4; tempArray6[2] = tempArray5; tempArray6[0] = shiftsArray; 
                // console.log('tempArray6', tempArray6, 'shiftsArray', shiftsArray);
                console.log('shiftsarray2', shiftsArray2);
                for (i = 0; i < 3; i++) {for (j = 0; j < shiftsArray2[i].length; j++)
                {for (k = j + 1; k < shiftsArray2[i].length; k++) {tempTime = [];
                  for (l = 0; l < shiftsArray2[i][j].length/2; l++) {
                  for (m = 0; m < shiftsArray2[i][k].length/2; m++)
                  {if ((shiftsArray2[i][k][2*m] >= shiftsArray2[i][j][2*l]) && (shiftsArray2[i][k][2*m] <= shiftsArray2[i][j][2*l+1])) {
                    if (shiftsArray2[i][k][2*m+1] >= shiftsArray2[i][j][2*l + 1]) {tempTime.push(shiftsArray2[i][j][2*l + 1] -shiftsArray2[i][k][2*m])}
                    else {tempTime.push(shiftsArray2[i][k][2*m + 1] - shiftsArray2[i][k][2*m])}   
                  }
                  else if ((shiftsArray2[i][k][2*m] <= shiftsArray2[i][j][2*l]) && (shiftsArray2[i][k][2*m+1] >= shiftsArray2[i][j][2*l])) {
                    if (shiftsArray2[i][k][2*m+1] >= shiftsArray2[i][j][2*l+1]) {tempTime.push(shiftsArray2[i][j][2*l+1] - shiftsArray2[i][j][2*l])}
                    else {tempTime.push(shiftsArray2[i][k][2*m+1] - shiftsArray2[i][j][2*l])}
                  }}}   // end l loop
                shifts = 0; const sum = tempTime.reduce((partialSum, a) => partialSum + a, 0);
                      for (n = 0; n < tempTime.length; n++) { if (tempTime[n] >= 10) { shifts = shifts + 1 }
                      }
                      pairingsArray.push(sum); pairingsArray.push(shifts); // console.log(i, j, k, tempTime);
                }}} // end i loop
                
                // pairingsArray = [];
                for (i = 0; i < 3; i++) {for (j = 0; j < awayShiftsArray2[i].length; j++)
                  {for (k = j + 1; k < awayShiftsArray2[i].length; k++) {tempTime = [];
                    for (l = 0; l < awayShiftsArray2[i][j].length/2; l++) {
                    for (m = 0; m < awayShiftsArray2[i][k].length/2; m++)
                    {if ((awayShiftsArray2[i][k][2*m] >= awayShiftsArray2[i][j][2*l]) && (awayShiftsArray2[i][k][2*m] <= awayShiftsArray2[i][j][2*l+1])) {
                      if (awayShiftsArray2[i][k][2*m+1] >= awayShiftsArray2[i][j][2*l + 1]) {tempTime.push(awayShiftsArray2[i][j][2*l + 1] -awayShiftsArray2[i][k][2*m])}
                      else {tempTime.push(awayShiftsArray2[i][k][2*m + 1] - awayShiftsArray2[i][k][2*m])}   
                    }
                    else if ((awayShiftsArray2[i][k][2*m] <= awayShiftsArray2[i][j][2*l]) && (awayShiftsArray2[i][k][2*m+1] >= awayShiftsArray2[i][j][2*l])) {
                      if (awayShiftsArray2[i][k][2*m+1] >= awayShiftsArray2[i][j][2*l+1]) {tempTime.push(awayShiftsArray2[i][j][2*l+1] - awayShiftsArray2[i][j][2*l])}
                      else {tempTime.push(awayShiftsArray2[i][k][2*m+1] - awayShiftsArray2[i][j][2*l])}
                    }}}   // end l loop
                  shifts = 0; const sum = tempTime.reduce((partialSum, a) => partialSum + a, 0);
                        for (n = 0; n < tempTime.length; n++) { if (tempTime[n] >= 10) { shifts = shifts + 1 }
                        }
                        pairingsAwayArray.push(sum); pairingsAwayArray.push(shifts);   
                  }}} // end i loop
                // pairingsArray = [];         
                // for (i = 0; i < tempArray6.length; i++) {
                //   for (j = 0; j < tempArray6[i].length; j++) {
                //     tempArray5 = tempArray6[i];
                //     for (k = j + 1; k < tempArray6[i].length; k++) {
                //       tempTime = [];
                //       for (l = 0; l < 0.5 * tempArray5[j].length; l++) {
                //         tempArray = tempArray5[j];
                //         for (m = 0; m < 0.5 * tempArray5[k].length; m++) {
                //           tempArray2 = tempArray5[k];
                //           if (tempArray2[2 * m] >= tempArray[2 * l] && tempArray2[2 * m] <= tempArray[2 * l + 1]) {
                //             if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { tempTime.push(tempArray[2 * l + 1] - tempArray2[2 * m]) }
                //             else { tempTime.push(tempArray2[2 * m + 1] - tempArray2[2 * m]) }
                //           }
                //           else if (tempArray2[2 * m] <= tempArray[2 * l] && tempArray2[2 * m + 1] >= tempArray[2 * l]) {
                //             if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { tempTime.push(tempArray[2 * l + 1] - tempArray[2 * l]) }
                //             else { tempTime.push(tempArray2[2 * m + 1] - tempArray[2 * l]) }
                //           }
                //         }
                //       } // end l cycle
                //       shifts = 0;
                //       const sum = tempTime.reduce((partialSum, a) => partialSum + a, 0);
                //       for (n = 0; n < tempTime.length; n++) {
                //         if (tempTime[n] >= 10) { shifts = shifts + 1 }
                //       }
                //       pairingsArray.push(sum);
                //       pairingsArray.push(shifts); console.log('tempTime2', i, j, k, tempTime) 
                //     }
                //   }  // end j loop each D player
                // } // end i loop for 3 periods 
                console.log('pairingsSrray', pairingsArray)
                // tempArray4 = shiftsFArray.splice(shiftsFArray.length / 3); tempArray5 = tempArray4.splice(tempArray4.length / 2);
                // tempArray6[1] = tempArray4; tempArray6[2] = tempArray5; tempArray6[0] = shiftsFArray;
                // tempArray5 = []; tempTime2 = [];

                // console.log(shiftsFArray, tempArray4, tempArray5, tempArray6);
                // for (i = 0; i < 3; i++) { // i < tempArray6.length
                //   for (j = 0; j < tempArray6[i].length - 2; j++) {
                //     tempArray5 = tempArray6[i];
                //     for (k = j + 1; k < tempArray6[i].length - 1; k++) {
                //       shiftsPair = [];
                //       for (l = 0; l < 0.5 * tempArray5[j].length; l++) {
                //         tempArray = tempArray5[j];
                //         for (m = 0; m < 0.5 * tempArray5[k].length; m++) {
                //           tempArray2 = tempArray5[k];
                //           if (tempArray2[2 * m] >= tempArray[2 * l] && tempArray2[2 * m] < tempArray[2 * l + 1]) {
                //             if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { shiftsPair.push(tempArray2[2 * m], tempArray[2 * l + 1]) }
                //             else { shiftsPair.push(tempArray2[2 * m], tempArray2[2 * m + 1]) }
                //           }
                //           else if (tempArray2[2 * m] <= tempArray[2 * l] && tempArray2[2 * m + 1] > tempArray[2 * l]) {
                //             if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { shiftsPair.push(tempArray[2 * l], tempArray[2 * l + 1]) }
                //             else { shiftsPair.push(tempArray[2 * l], tempArray2[2 * m + 1]) }
                //           }
                //         }
                //       } // end l F loop 
                //       for (l = k + 1; l < tempArray6[i].length; l++) {//shiftsPair =[]; this is player #3 compared to pair
                //         tempTime = [];
                //         for (m = 0; m < 0.5 * shiftsPair.length; m++) {
                //           for (n = 0; n < 0.5 * tempArray5[l].length; n++) {
                //             tempArray3 = tempArray5[l];
                //             if (tempArray3[2 * n] >= shiftsPair[2 * m] && tempArray3[2 * n] < shiftsPair[2 * m + 1]) {
                //               if (tempArray3[2 * n + 1] >= shiftsPair[2 * m + 1]) { tempTime.push(shiftsPair[2 * m + 1] - tempArray3[2 * n],) }
                //               else { tempTime.push(tempArray3[2 * n + 1] - tempArray3[2 * n]) }
                //             }
                //             else if (tempArray3[2 * n] <= shiftsPair[2 * m] && tempArray3[2 * n + 1] > shiftsPair[2 * m]) {
                //               if (tempArray3[2 * n + 1] >= shiftsPair[2 * m + 1]) { tempTime.push(shiftsPair[2 * m + 1] - shiftsPair[2 * m]) }
                //               else { tempTime.push(tempArray3[2 * n + 1] - shiftsPair[2 * m]) }
                //             }
                //           } // end n F loop
                //         } // end m F loop 
                //         shifts = 0;
                //         const sum = tempTime.reduce((partialSum, a) => partialSum + a, 0);
                //         for (n = 0; n < tempTime.length; n++) {
                //           if (tempTime[n] >= 10) {
                //             shifts = shifts + 1;
                //             tempTime2.push(tempTime[n])
                //           }
                //         }
                //         linesArray.push(sum, shifts, j, k, l);
                //       } // end l F loop
                //     } // end k F loop
                //   } // end j F loop
                // } // end i F loop

                // tempArray6 = []; tempArray4 = awayShiftsArray.splice(awayShiftsArray.length / 3);
                // tempArray5 = tempArray4.splice(tempArray4.length / 2);
                // tempArray6[1] = tempArray4; tempArray6[2] = tempArray5; tempArray6[0] = awayShiftsArray;

                // for (i = 0; i < tempArray6.length; i++) { // for each period
                //   for (j = 0; j < tempArray6[i].length; j++) { // for each player
                //     tempArray5 = tempArray6[i];
                //     player1 = tempArray5[j];
                //     for (k = j + 1; k < tempArray6[i].length; k++) { // for second player
                //       tempTime = [];
                //       player2 = tempArray5[k];
                //       for (l = 0; l < 0.5 * player1.length; l++) {
                //         tempArray = tempArray5[j];
                //         for (m = 0; m < 0.5 * player2.length; m++) {
                //           tempArray2 = tempArray5[k];
                //           if (tempArray2[2 * m] >= tempArray[2 * l] && tempArray2[2 * m] <= tempArray[2 * l + 1]) {
                //             if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { tempTime.push(tempArray[2 * l + 1] - tempArray2[2 * m]) }
                //             else { tempTime.push(tempArray2[2 * m + 1] - tempArray2[2 * m]) }
                //           }
                //           else if (tempArray2[2 * m] <= tempArray[2 * l] && tempArray2[2 * m + 1] >= tempArray[2 * l]) {
                //             if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { tempTime.push(tempArray[2 * l + 1] - tempArray[2 * l]) }
                //             else { tempTime.push(tempArray2[2 * m + 1] - tempArray[2 * l]) }
                //           }
                //         }
                //       } // end l cycle
                //       shifts = 0;
                //       const sum = tempTime.reduce((partialSum, a) => partialSum + a, 0);
                //       for (n = 0; n < tempTime.length; n++) {
                //         if (tempTime[n] >= 10) { shifts = shifts + 1 }
                //       }
                //       pairingsAwayArray.push(sum);
                //       pairingsAwayArray.push(shifts);
                //     }
                //   }  // end j loop each D player
                // } // end i loop for 3 periods   

                // tempArray4 = awayShiftsFArray.splice(awayShiftsFArray.length / 3); tempArray5 = tempArray4.splice(tempArray4.length / 2);
                // tempArray6[1] = tempArray4; tempArray6[2] = tempArray5; tempArray6[0] = awayShiftsFArray;
                // tempArray5 = []; tempTime2 = [];

                // for (i = 0; i < 3; i++) { // i < tempArray6.length
                //   for (j = 0; j < tempArray6[i].length - 2; j++) {
                //     tempArray5 = tempArray6[i];
                //     for (k = j + 1; k < tempArray6[i].length - 1; k++) {
                //       shiftsPair = [];
                //       for (l = 0; l < 0.5 * tempArray5[j].length; l++) {
                //         tempArray = tempArray5[j];
                //         for (m = 0; m < 0.5 * tempArray5[k].length; m++) {
                //           tempArray2 = tempArray5[k];
                //           if (tempArray2[2 * m] >= tempArray[2 * l] && tempArray2[2 * m] < tempArray[2 * l + 1]) {
                //             if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { shiftsPair.push(tempArray2[2 * m], tempArray[2 * l + 1]) }
                //             else { shiftsPair.push(tempArray2[2 * m], tempArray2[2 * m + 1]) }
                //           }
                //           else if (tempArray2[2 * m] <= tempArray[2 * l] && tempArray2[2 * m + 1] > tempArray[2 * l]) {
                //             if (tempArray2[2 * m + 1] >= tempArray[2 * l + 1]) { shiftsPair.push(tempArray[2 * l], tempArray[2 * l + 1]) }
                //             else { shiftsPair.push(tempArray[2 * l], tempArray2[2 * m + 1]) }
                //           }
                //         }
                //       } // end l F loop 
                //       for (l = k + 1; l < tempArray6[i].length; l++) {//shiftsPair =[]; this is player #3 compared to pair
                //         tempTime = [];
                //         for (m = 0; m < 0.5 * shiftsPair.length; m++) {
                //           for (n = 0; n < 0.5 * tempArray5[l].length; n++) {
                //             tempArray3 = tempArray5[l];
                //             if (tempArray3[2 * n] >= shiftsPair[2 * m] && tempArray3[2 * n] < shiftsPair[2 * m + 1]) {
                //               if (tempArray3[2 * n + 1] >= shiftsPair[2 * m + 1]) { tempTime.push(shiftsPair[2 * m + 1] - tempArray3[2 * n],) }
                //               else { tempTime.push(tempArray3[2 * n + 1] - tempArray3[2 * n]) }
                //             }
                //             else if (tempArray3[2 * n] <= shiftsPair[2 * m] && tempArray3[2 * n + 1] > shiftsPair[2 * m]) {
                //               if (tempArray3[2 * n + 1] >= shiftsPair[2 * m + 1]) { tempTime.push(shiftsPair[2 * m + 1] - shiftsPair[2 * m]) }
                //               else { tempTime.push(tempArray3[2 * n + 1] - shiftsPair[2 * m]) }
                //             }
                //           } // end n F loop
                //         } // end m F loop 
                //         shifts = 0;
                //         const sum = tempTime.reduce((partialSum, a) => partialSum + a, 0);
                //         for (n = 0; n < tempTime.length; n++) {
                //           if (tempTime[n] >= 10) {
                //             shifts = shifts + 1;
                //             tempTime2.push(tempTime[n])
                //           }
                //         }
                //         awayLinesArray.push(sum, shifts, j, k, l);
                //       } // end l F loop
                //     } // end k F loop
                //   } // end j F loop
                // } // end i F loop

                pairingsArray2 = pairingsArray.splice(pairingsArray.length / 3); pairingsArray3 = pairingsArray2.splice(pairingsArray2.length / 2);
                linesArray2 = linesArray.splice(linesArray.length / 3); linesArray3 = linesArray2.splice(linesArray2.length / 2);

                pairingsAwayArray2 = pairingsAwayArray.splice(pairingsAwayArray.length / 3);
                pairingsAwayArray3 = pairingsAwayArray2.splice(pairingsAwayArray2.length / 2);
                awayLinesArray2 = awayLinesArray.splice(awayLinesArray.length / 3);
                awayLinesArray3 = awayLinesArray2.splice(awayLinesArray2.length / 2);

                pairingsArray4[0] = pairingsArray; pairingsArray4[1] = pairingsArray2; pairingsArray4[2] = pairingsArray3;
                linesArray4 = [];
                linesArray4[0] = linesArray; linesArray4[1] = linesArray2; linesArray4[2] = linesArray3;
                pairingsArray4[3] = pairingsAwayArray; pairingsArray4[4] = pairingsAwayArray2; pairingsArray4[5] = pairingsAwayArray3;
                linesArray4[3] = awayLinesArray; linesArray4[4] = awayLinesArray2; linesArray4[5] = awayLinesArray3;
                // console.log(linesArray4, pairingsArray4, tempArray5);

                homeRosterDIDArray = []; homeRosterFIDArray = []; awayRosterDIDArray = []; awayRosterFIDArray = [];
                for (i = 0; i < homeRosterDArray.length; i++) {
                  DManIndex = 'ID' + homeRosterDArray[i];
                  homeRosterDIDArray.push(DManIndex);
                  DManIndexZ = homeRosterArray.indexOf(DManIndex);
                  homeRosterDIDArray.push(DManIndexZ);
                }
                for (i = 0; i < homeRosterFArray.length; i++) {
                  FManIndex = 'ID' + homeRosterFArray[i];
                  homeRosterFIDArray.push(FManIndex);
                  FManIndexZ = homeRosterArray.indexOf(FManIndex);
                  homeRosterFIDArray.push(FManIndexZ);
                }
                for (i = 0; i < awayRosterDArray.length; i++) {
                  DManIndex = 'ID' + awayRosterDArray[i];
                  awayRosterDIDArray.push(DManIndex);
                  DManIndexZ = awayRosterArray.indexOf(DManIndex);
                  awayRosterDIDArray.push(DManIndexZ);
                }
                for (i = 0; i < awayRosterFArray.length; i++) {
                  FManIndex = 'ID' + awayRosterFArray[i];
                  awayRosterFIDArray.push(FManIndex);
                  FManIndexZ = awayRosterArray.indexOf(FManIndex);
                  awayRosterFIDArray.push(FManIndexZ);
                }
                console.log(homeRosterDIDArray, awayRosterDIDArray, homeRosterFIDArray, awayRosterFIDArray);

                firstDNumber.innerHTML = homeRosterArray[homeRosterDIDArray[1] - 4] + ' ' + homeRosterArray[homeRosterDIDArray[1] - 1] + ' ' + homeRosterArray[homeRosterDIDArray[1] - 3];
                firstD1.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                var firstD2 = document.createElement('p3');
                firstD2.innerHTML = pairingsArray4[0][1] + ' sh ' + pairingsArray4[0][0] + ' sec ' + '<br>' + pairingsArray4[1][1] + ' sh ' + pairingsArray4[1][0] + ' sec ' + '<br>' + pairingsArray4[2][1] + ' sh ' + pairingsArray4[2][0] + ' sec ';
                document.getElementById('firstD2').appendChild(firstD2);
                var firstD3 = document.createElement('p2');
                firstD3.innerHTML = pairingsArray4[0][3] + ' sh ' + pairingsArray4[0][2] + ' sec ' + '<br>' + pairingsArray4[1][3] + ' sh ' + pairingsArray4[1][2] + ' sec ' + '<br>' + pairingsArray4[2][3] + ' sh ' + pairingsArray4[2][2] + ' sec ';
                document.getElementById('firstD3').appendChild(firstD3);
                var firstD4 = document.createElement('p3');
                firstD4.innerHTML = pairingsArray4[0][5] + ' sh ' + pairingsArray4[0][4] + ' sec ' + '<br>' + pairingsArray4[1][5] + ' sh ' + pairingsArray4[1][4] + ' sec ' + '<br>' + pairingsArray4[2][5] + ' sh ' + pairingsArray4[2][4] + ' sec ';
                document.getElementById('firstD4').appendChild(firstD4);
                var firstD5 = document.createElement('p2');
                firstD5.innerHTML = pairingsArray4[0][7] + ' sh ' + pairingsArray4[0][6] + ' sec ' + '<br>' + pairingsArray4[1][7] + ' sh ' + pairingsArray4[1][6] + ' sec ' + '<br>' + pairingsArray4[2][7] + ' sh ' + pairingsArray4[2][6] + ' sec ';
                document.getElementById('firstD5').appendChild(firstD5);
                var firstD6 = document.createElement('p3');
                firstD6.innerHTML = pairingsArray4[0][9] + ' sh ' + pairingsArray4[0][8] + ' sec ' + '<br>' + pairingsArray4[1][9] + ' sh ' + pairingsArray4[1][8] + ' sec ' + '<br>' + pairingsArray4[2][9] + ' sh ' + pairingsArray4[2][8] + ' sec ';
                document.getElementById('firstD6').appendChild(firstD6);

                secondDNumber.innerHTML = homeRosterArray[homeRosterDIDArray[3] - 4] + ' ' + homeRosterArray[homeRosterDIDArray[3] - 1] + ' ' + homeRosterArray[homeRosterDIDArray[3] - 3];
                secondD1.innerHTML = pairingsArray4[0][1] + ' shifts ' + pairingsArray4[0][0] + ' sec ' + '<br>' + pairingsArray4[1][1] + ' sh ' + pairingsArray4[1][0] + ' sec ' + '<br>' + pairingsArray4[2][1] + ' sh ' + pairingsArray4[2][0] + ' sec ';
                secondD2.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                thirdDNumber.innerHTML = homeRosterArray[homeRosterDIDArray[5] - 4] + ' ' + homeRosterArray[homeRosterDIDArray[5] - 1] + ' ' + homeRosterArray[homeRosterDIDArray[5] - 3];
                thirdD1.innerHTML = pairingsArray4[0][3] + ' shifts ' + pairingsArray4[0][2] + ' sec ' + '<br>' + pairingsArray4[1][3] + ' sh ' + pairingsArray4[1][2] + ' sec ' + '<br>' + pairingsArray4[2][3] + ' sh ' + pairingsArray4[2][2] + ' sec ';
                thirdD3.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                forthDNumber.innerHTML = homeRosterArray[homeRosterDIDArray[7] - 4] + ' ' + homeRosterArray[homeRosterDIDArray[7] - 1] + ' ' + homeRosterArray[homeRosterDIDArray[7] - 3];
                forthD1.innerHTML = pairingsArray4[0][5] + ' sh ' + pairingsArray4[0][4] + ' sec ' + '<br>' + pairingsArray4[1][5] + ' sh ' + pairingsArray4[1][4] + ' sec ' + '<br>' + pairingsArray4[2][5] + ' sh ' + pairingsArray4[2][4] + ' sec ';
                forthD4.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                fifthDNumber.innerHTML = homeRosterArray[homeRosterDIDArray[9] - 4] + ' ' + homeRosterArray[homeRosterDIDArray[9] - 1] + ' ' + homeRosterArray[homeRosterDIDArray[9] - 3];
                fifthD1.innerHTML = pairingsArray4[0][7] + ' sh ' + pairingsArray4[0][6] + ' sec ' + '<br>' + pairingsArray4[1][7] + ' sh ' + pairingsArray4[1][6] + ' sec ' + '<br>' + pairingsArray4[2][7] + ' sh ' + pairingsArray4[2][6] + ' sec ';
                fifthD5.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                sixthDNumber.innerHTML = homeRosterArray[homeRosterDIDArray[11] - 4] + ' ' + homeRosterArray[homeRosterDIDArray[11] - 1] + ' ' + homeRosterArray[homeRosterDIDArray[11] - 3];;
                sixthD1.innerHTML = pairingsArray4[0][9] + ' sh ' + pairingsArray4[0][8] + ' sec ' + '<br>' + pairingsArray4[1][9] + ' sh ' + pairingsArray4[1][8] + ' sec ' + '<br>' + pairingsArray4[2][9] + ' sh ' + pairingsArray4[2][8] + ' sec ';
                sixthD6.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';

                var secondD3 = document.createElement('p3'); var secondD4 = document.createElement('p2');
                var secondD5 = document.createElement('p3'); var secondD6 = document.createElement('p2');
                var thirdD4 = document.createElement('p3'); var thirdD5 = document.createElement('p2');
                var thirdD6 = document.createElement('p3'); var forthD5 = document.createElement('p3');
                var forthD6 = document.createElement('p2'); var fifthD6 = document.createElement('p3');

                if (homeRosterDArray.length == 7) {
                  seventhDNumber.innerHTML = homeRosterArray[homeRosterDIDArray[13] - 4] + ' ' + homeRosterArray[homeRosterDIDArray[13] - 1] + ' ' + homeRosterArray[homeRosterDIDArray[13] - 3];
                  var firstD7 = document.createElement('p2');
                  firstD7.innerHTML = pairingsArray4[0][11] + ' sh ' + pairingsArray4[0][10] + ' sec ' + '<br>' + pairingsArray4[1][11] + ' sh ' + pairingsArray4[1][10] + ' sec ' + '<br>' + pairingsArray4[2][11] + ' sh ' + pairingsArray4[2][10] + ' sec ';
                  var thirdD7 = document.createElement('p2'); var fifthD7 = document.createElement('p2');
                  document.getElementById('firstD7').appendChild(firstD7);
                  seventhD1.innerHTML = pairingsArray4[0][11] + ' sh ' + pairingsArray4[0][10] + ' sec ' + '<br>' + pairingsArray4[1][11] + ' sh ' + pairingsArray4[1][10] + ' sec ' + '<br>' + pairingsArray4[2][11] + ' sh ' + pairingsArray4[2][10] + ' sec ';
                  var seventhD7 = document.createElement('p2'); seventhD7.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                  document.getElementById('seventhD7').appendChild(seventhD7);
                  secondD3.innerHTML = pairingsArray4[0][13] + ' sh ' + pairingsArray4[0][12] + ' sec ' + '<br>' + pairingsArray4[1][13] + ' sh ' + pairingsArray4[1][12] + ' sec ' + '<br>' + pairingsArray4[2][13] + ' sh ' + pairingsArray4[2][12] + ' sec ';
                  secondD4.innerHTML = pairingsArray4[0][15] + ' sh ' + pairingsArray4[0][14] + ' sec ' + '<br>' + pairingsArray4[1][15] + ' sh ' + pairingsArray4[1][14] + ' sec ' + '<br>' + pairingsArray4[2][15] + ' sh ' + pairingsArray4[2][14] + ' sec ';
                  secondD5.innerHTML = pairingsArray4[0][17] + ' sh ' + pairingsArray4[0][16] + ' sec ' + '<br>' + pairingsArray4[1][17] + ' sh ' + pairingsArray4[1][16] + ' sec ' + '<br>' + pairingsArray4[2][17] + ' sh ' + pairingsArray4[2][16] + ' sec ';
                  secondD6.innerHTML = pairingsArray4[0][19] + ' sh ' + pairingsArray4[0][18] + ' sec ' + '<br>' + pairingsArray4[1][19] + ' sh ' + pairingsArray4[1][18] + ' sec ' + '<br>' + pairingsArray4[2][19] + ' sh ' + pairingsArray4[2][18] + ' sec ';
                  secondD7.innerHTML = pairingsArray4[0][21] + ' sh ' + pairingsArray4[0][20] + ' sec ' + '<br>' + pairingsArray4[1][21] + ' sh ' + pairingsArray4[1][20] + ' sec ' + '<br>' + pairingsArray4[2][21] + ' sh ' + pairingsArray4[2][20] + ' sec ';
                  thirdD2.innerHTML = secondD3.innerHTML;
                  thirdD4.innerHTML = pairingsArray4[0][23] + ' sh ' + pairingsArray4[0][22] + ' sec ' + '<br>' + pairingsArray4[1][23] + ' sh ' + pairingsArray4[1][22] + ' sec ' + '<br>' + pairingsArray4[2][23] + ' sh ' + pairingsArray4[2][22] + ' sec ';
                  thirdD5.innerHTML = pairingsArray4[0][25] + ' sh ' + pairingsArray4[0][24] + ' sec ' + '<br>' + pairingsArray4[1][25] + ' sh ' + pairingsArray4[1][24] + ' sec ' + '<br>' + pairingsArray4[2][25] + ' sh ' + pairingsArray4[2][24] + ' sec ';
                  thirdD6.innerHTML = pairingsArray4[0][27] + ' sh ' + pairingsArray4[0][26] + ' sec ' + '<br>' + pairingsArray4[1][27] + ' sh ' + pairingsArray4[1][26] + ' sec ' + '<br>' + pairingsArray4[2][27] + ' sh ' + pairingsArray4[2][26] + ' sec ';
                  thirdD7.innerHTML = pairingsArray4[0][29] + ' sh ' + pairingsArray4[0][28] + ' sec ' + '<br>' + pairingsArray4[1][29] + ' sh ' + pairingsArray4[1][28] + ' sec ' + '<br>' + pairingsArray4[2][29] + ' sh ' + pairingsArray4[2][28] + ' sec ';
                  document.getElementById('thirdD7').appendChild(thirdD7);
                  forthD2.innerHTML = secondD4.innerHTML; forthD3.innerHTML = thirdD4.innerHTML;
                  forthD5.innerHTML = pairingsArray4[0][31] + ' sh ' + pairingsArray4[0][30] + ' sec ' + '<br>' + pairingsArray4[1][31] + ' sh ' + pairingsArray4[1][30] + ' sec ' + '<br>' + pairingsArray4[2][31] + ' sh ' + pairingsArray4[2][30] + ' sec ';
                  forthD6.innerHTML = pairingsArray4[0][33] + ' sh ' + pairingsArray4[0][32] + ' sec ' + '<br>' + pairingsArray4[1][33] + ' sh ' + pairingsArray4[1][32] + ' sec ' + '<br>' + pairingsArray4[2][33] + ' sh ' + pairingsArray4[2][32] + ' sec ';
                  forthD7.innerHTML = pairingsArray4[0][35] + ' sh ' + pairingsArray4[0][34] + ' sec ' + '<br>' + pairingsArray4[1][35] + ' sh ' + pairingsArray4[1][34] + ' sec ' + '<br>' + pairingsArray4[2][35] + ' sh ' + pairingsArray4[2][34] + ' sec ';
                  fifthD2.innerHTML = secondD5.innerHTML; fifthD3.innerHTML = thirdD5.innerHTML;
                  fifthD4.innerHTML = forthD5.innerHTML
                  fifthD6.innerHTML = pairingsArray4[0][37] + ' sh ' + pairingsArray4[0][36] + ' sec ' + '<br>' + pairingsArray4[1][37] + ' sh ' + pairingsArray4[1][36] + ' sec ' + '<br>' + pairingsArray4[2][37] + ' sh ' + pairingsArray4[2][36] + ' sec ';
                  fifthD7.innerHTML = pairingsArray4[0][39] + ' sh ' + pairingsArray4[0][38] + ' sec ' + '<br>' + pairingsArray4[1][39] + ' sh ' + pairingsArray4[1][38] + ' sec ' + '<br>' + pairingsArray4[2][39] + ' sh ' + pairingsArray4[2][38] + ' sec ';
                  document.getElementById('fifthD7').appendChild(fifthD7);
                  sixthD2.innerHTML = secondD6.innerHTML; sixthD3.innerHTML = thirdD6.innerHTML;
                  sixthD4.innerHTML = forthD6.innerHTML; sixthD5.innerHTML = fifthD6.innerHTML;
                  sixthD7.innerHTML = pairingsArray4[0][41] + ' sh ' + pairingsArray4[0][40] + ' sec ' + '<br>' + pairingsArray4[1][41] + ' sh ' + pairingsArray4[1][40] + ' sec ' + '<br>' + pairingsArray4[2][41] + ' sh ' + pairingsArray4[2][40] + ' sec ';
                  seventhD2.innerHTML = secondD7.innerHTML; seventhD3.innerHTML = thirdD7.innerHTML;
                  seventhD4.innerHTML = forthD7.innerHTML; seventhD5.innerHTML = fifthD7.innerHTML;
                  seventhD6.innerHTML = sixthD7.innerHTML;
                } // end if seven D men

                else if (homeRosterDArray.length == 6) {
                  secondD3.innerHTML = pairingsArray4[0][11] + ' sh ' + pairingsArray4[0][10] + ' sec ' + '<br>' + pairingsArray4[1][11] + ' sh ' + pairingsArray4[1][10] + ' sec ' + '<br>' + pairingsArray4[2][11] + ' sh ' + pairingsArray4[2][10] + ' sec ';
                  secondD4.innerHTML = pairingsArray4[0][13] + ' sh ' + pairingsArray4[0][12] + ' sec ' + '<br>' + pairingsArray4[1][13] + ' sh ' + pairingsArray4[1][12] + ' sec ' + '<br>' + pairingsArray4[2][13] + ' sh ' + pairingsArray4[2][12] + ' sec ';
                  secondD5.innerHTML = pairingsArray4[0][15] + ' sh ' + pairingsArray4[0][14] + ' sec ' + '<br>' + pairingsArray4[1][15] + ' sh ' + pairingsArray4[1][14] + ' sec ' + '<br>' + pairingsArray4[2][15] + ' sh ' + pairingsArray4[2][14] + ' sec ';
                  secondD6.innerHTML = pairingsArray4[0][17] + ' sh ' + pairingsArray4[0][16] + ' sec ' + '<br>' + pairingsArray4[1][17] + ' sh ' + pairingsArray4[1][16] + ' sec ' + '<br>' + pairingsArray4[2][17] + ' sh ' + pairingsArray4[2][16] + ' sec ';
                  thirdD2.innerHTML = secondD3.innerHTML;
                  thirdD4.innerHTML = pairingsArray4[0][19] + ' sh ' + pairingsArray4[0][18] + ' sec ' + '<br>' + pairingsArray4[1][19] + ' sh ' + pairingsArray4[1][18] + ' sec ' + '<br>' + pairingsArray4[2][19] + ' sh ' + pairingsArray4[2][18] + ' sec ';
                  thirdD5.innerHTML = pairingsArray4[0][21] + ' sh ' + pairingsArray4[0][20] + ' sec ' + '<br>' + pairingsArray4[1][21] + ' sh ' + pairingsArray4[1][20] + ' sec ' + '<br>' + pairingsArray4[2][21] + ' sh ' + pairingsArray4[2][20] + ' sec ';
                  thirdD6.innerHTML = pairingsArray4[0][23] + ' sh ' + pairingsArray4[0][22] + ' sec ' + '<br>' + pairingsArray4[1][23] + ' sh ' + pairingsArray4[1][22] + ' sec ' + '<br>' + pairingsArray4[2][23] + ' sh ' + pairingsArray4[2][22] + ' sec ';
                  forthD2.innerHTML = secondD4.innerHTML; forthD3.innerHTML = thirdD4.innerHTML;
                  forthD5.innerHTML = pairingsArray4[0][25] + ' sh ' + pairingsArray4[0][24] + ' sec ' + '<br>' + pairingsArray4[1][25] + ' sh ' + pairingsArray4[1][24] + ' sec ' + '<br>' + pairingsArray4[2][25] + ' sh ' + pairingsArray4[2][24] + ' sec ';
                  forthD6.innerHTML = pairingsArray4[0][27] + ' sh ' + pairingsArray4[0][26] + ' sec ' + '<br>' + pairingsArray4[1][27] + ' sh ' + pairingsArray4[1][26] + ' sec ' + '<br>' + pairingsArray4[2][27] + ' sh ' + pairingsArray4[2][26] + ' sec ';
                  fifthD2.innerHTML = secondD5.innerHTML; fifthD3.innerHTML = thirdD5.innerHTML;
                  fifthD4.innerHTML = forthD5.innerHTML
                  fifthD6.innerHTML = pairingsArray4[0][29] + ' sh ' + pairingsArray4[0][28] + ' sec ' + '<br>' + pairingsArray4[1][29] + ' sh ' + pairingsArray4[1][28] + ' sec ' + '<br>' + pairingsArray4[2][29] + ' sh ' + pairingsArray4[2][28] + ' sec ';
                  sixthD2.innerHTML = secondD6.innerHTML; sixthD3.innerHTML = thirdD6.innerHTML;
                  sixthD4.innerHTML = forthD6.innerHTML; sixthD5.innerHTML = fifthD6.innerHTML;
                } // end if sixth D men

                document.getElementById('secondD3').appendChild(secondD3); document.getElementById('secondD4').appendChild(secondD4);
                document.getElementById('secondD5').appendChild(secondD5); document.getElementById('secondD6').appendChild(secondD6);
                document.getElementById('thirdD4').appendChild(thirdD4); document.getElementById('thirdD5').appendChild(thirdD5);
                document.getElementById('thirdD6').appendChild(thirdD6); document.getElementById('forthD5').appendChild(forthD5);
                document.getElementById('forthD6').appendChild(forthD6); document.getElementById('fifthD6').appendChild(fifthD6);

                firstDNumberA.innerHTML = awayRosterArray[awayRosterDIDArray[1] - 4] + ' ' + awayRosterArray[awayRosterDIDArray[1] - 1] + ' ' + awayRosterArray[awayRosterDIDArray[1] - 3];
                firstD1A.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                var firstD2A = document.createElement('p3');
                firstD2A.innerHTML = pairingsArray4[3][1] + ' sh ' + pairingsArray4[3][0] + ' sec ' + '<br>' + pairingsArray4[4][1] + ' sh ' + pairingsArray4[4][0] + ' sec ' + '<br>' + pairingsArray4[5][1] + ' sh ' + pairingsArray4[5][0] + ' sec ';
                document.getElementById('firstD2A').appendChild(firstD2A);
                var firstD3A = document.createElement('p2');
                firstD3A.innerHTML = pairingsArray4[3][3] + ' sh ' + pairingsArray4[3][2] + ' sec ' + '<br>' + pairingsArray4[4][3] + ' sh ' + pairingsArray4[4][2] + ' sec ' + '<br>' + pairingsArray4[5][3] + ' sh ' + pairingsArray4[5][2] + ' sec ';
                document.getElementById('firstD3A').appendChild(firstD3A);
                var firstD4A = document.createElement('p3');
                firstD4A.innerHTML = pairingsArray4[3][5] + ' sh ' + pairingsArray4[3][4] + ' sec ' + '<br>' + pairingsArray4[4][5] + ' sh ' + pairingsArray4[4][4] + ' sec ' + '<br>' + pairingsArray4[5][5] + ' sh ' + pairingsArray4[5][4] + ' sec ';
                document.getElementById('firstD4A').appendChild(firstD4A);
                var firstD5A = document.createElement('p2');
                firstD5A.innerHTML = pairingsArray4[3][7] + ' sh ' + pairingsArray4[3][6] + ' sec ' + '<br>' + pairingsArray4[4][7] + ' sh ' + pairingsArray4[4][6] + ' sec ' + '<br>' + pairingsArray4[5][7] + ' sh ' + pairingsArray4[5][6] + ' sec ';
                document.getElementById('firstD5A').appendChild(firstD5A);



                secondDNumberA.innerHTML = awayRosterArray[awayRosterDIDArray[3] - 4] + ' ' + awayRosterArray[awayRosterDIDArray[3] - 1] + ' ' + awayRosterArray[awayRosterDIDArray[3] - 3];
                secondD1A.innerHTML = pairingsArray4[3][1] + ' shifts ' + pairingsArray4[3][0] + ' sec ' + '<br>' + pairingsArray4[4][1] + ' sh ' + pairingsArray4[4][0] + ' sec ' + '<br>' + pairingsArray4[5][1] + ' sh ' + pairingsArray4[5][0] + ' sec ';
                secondD2A.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                thirdDNumberA.innerHTML = awayRosterArray[awayRosterDIDArray[5] - 4] + ' ' + awayRosterArray[awayRosterDIDArray[5] - 1] + ' ' + awayRosterArray[awayRosterDIDArray[5] - 3];
                thirdD1A.innerHTML = pairingsArray4[3][3] + ' shifts ' + pairingsArray4[3][2] + ' sec ' + '<br>' + pairingsArray4[4][3] + ' sh ' + pairingsArray4[4][2] + ' sec ' + '<br>' + pairingsArray4[5][3] + ' sh ' + pairingsArray4[5][2] + ' sec ';
                thirdD3A.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                forthDNumberA.innerHTML = awayRosterArray[awayRosterDIDArray[7] - 4] + ' ' + awayRosterArray[awayRosterDIDArray[7] - 1] + ' ' + awayRosterArray[awayRosterDIDArray[7] - 3];
                forthD1A.innerHTML = pairingsArray4[3][5] + ' sh ' + pairingsArray4[3][4] + ' sec ' + '<br>' + pairingsArray4[4][5] + ' sh ' + pairingsArray4[4][4] + ' sec ' + '<br>' + pairingsArray4[5][5] + ' sh ' + pairingsArray4[5][4] + ' sec ';
                forthD4A.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                fifthDNumberA.innerHTML = awayRosterArray[awayRosterDIDArray[9] - 4] + ' ' + awayRosterArray[awayRosterDIDArray[9] - 1] + ' ' + awayRosterArray[awayRosterDIDArray[9] - 3];
                fifthD1A.innerHTML = pairingsArray4[3][7] + ' sh ' + pairingsArray4[3][6] + ' sec ' + '<br>' + pairingsArray4[4][7] + ' sh ' + pairingsArray4[4][6] + ' sec ' + '<br>' + pairingsArray4[5][7] + ' sh ' + pairingsArray4[5][6] + ' sec ';
                fifthD5A.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';


                var secondD3A = document.createElement('p3'); var secondD4A = document.createElement('p2');
                var secondD5A = document.createElement('p3');
                var thirdD4A = document.createElement('p3'); var thirdD5A = document.createElement('p2');
                var thirdD6A = document.createElement('p3'); var forthD5A = document.createElement('p3');
                var forthD6A = document.createElement('p2'); var fifthD6A = document.createElement('p3');

                if (awayRosterDArray.length == 7) {
                  sixthDNumberA.innerHTML = awayRosterArray[awayRosterDIDArray[11] - 4] + ' ' + awayRosterArray[awayRosterDIDArray[11] - 1] + ' ' + awayRosterArray[awayRosterDIDArray[11] - 3];;
                  sixthD1A.innerHTML = pairingsArray4[3][9] + ' sh ' + pairingsArray4[3][8] + ' sec ' + '<br>' + pairingsArray4[4][9] + ' sh ' + pairingsArray4[4][8] + ' sec ' + '<br>' + pairingsArray4[5][9] + ' sh ' + pairingsArray4[5][8] + ' sec ';
                  sixthD6A.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                  seventhDNumberA.innerHTML = awayRosterArray[awayRosterDIDArray[13] - 4] + ' ' + awayRosterArray[awayRosterDIDArray[13] - 1] + ' ' + awayRosterArray[awayRosterDIDArray[13] - 3];
                  var firstD6A = document.createElement('p3');
                  firstD6A.innerHTML = pairingsArray4[3][9] + ' sh ' + pairingsArray4[3][8] + ' sec ' + '<br>' + pairingsArray4[4][9] + ' sh ' + pairingsArray4[4][8] + ' sec ' + '<br>' + pairingsArray4[5][9] + ' sh ' + pairingsArray4[5][8] + ' sec ';
                  document.getElementById('firstD6A').appendChild(firstD6A);
                  var secondD6A = document.createElement('p2'); document.getElementById('secondD6A').appendChild(secondD6A);
                  var firstD7A = document.createElement('p2');
                  firstD7A.innerHTML = pairingsArray4[3][11] + ' sh ' + pairingsArray4[3][10] + ' sec ' + '<br>' + pairingsArray4[4][11] + ' sh ' + pairingsArray4[4][10] + ' sec ' + '<br>' + pairingsArray4[5][11] + ' sh ' + pairingsArray4[5][10] + ' sec ';
                  var thirdD7A = document.createElement('p2'); var fifthD7A = document.createElement('p2'); document.getElementById('firstD7A').appendChild(firstD7A);
                  seventhD1A.innerHTML = pairingsArray4[3][11] + ' sh ' + pairingsArray4[3][10] + ' sec ' + '<br>' + pairingsArray4[4][11] + ' sh ' + pairingsArray4[4][10] + ' sec ' + '<br>' + pairingsArray4[5][11] + ' sh ' + pairingsArray4[5][10] + ' sec ';
                  var seventhD7A = document.createElement('p2'); seventhD7A.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                  document.getElementById('seventhD7A').appendChild(seventhD7A);
                  secondD4A.innerHTML = pairingsArray4[3][15] + ' sh ' + pairingsArray4[3][14] + ' sec ' + '<br>' + pairingsArray4[4][15] + ' sh ' + pairingsArray4[4][14] + ' sec ' + '<br>' + pairingsArray4[5][15] + ' sh ' + pairingsArray4[5][14] + ' sec ';
                  secondD5A.innerHTML = pairingsArray4[3][17] + ' sh ' + pairingsArray4[3][16] + ' sec ' + '<br>' + pairingsArray4[4][17] + ' sh ' + pairingsArray4[4][16] + ' sec ' + '<br>' + pairingsArray4[5][17] + ' sh ' + pairingsArray4[5][16] + ' sec ';
                  secondD6A.innerHTML = pairingsArray4[3][19] + ' sh ' + pairingsArray4[3][18] + ' sec ' + '<br>' + pairingsArray4[4][19] + ' sh ' + pairingsArray4[4][18] + ' sec ' + '<br>' + pairingsArray4[5][19] + ' sh ' + pairingsArray4[5][18] + ' sec ';
                  secondD7A.innerHTML = pairingsArray4[3][21] + ' sh ' + pairingsArray4[3][20] + ' sec ' + '<br>' + pairingsArray4[4][21] + ' sh ' + pairingsArray4[4][20] + ' sec ' + '<br>' + pairingsArray4[5][21] + ' sh ' + pairingsArray4[5][20] + ' sec ';
                  thirdD2A.innerHTML = secondD3.innerHTML;
                  thirdD4A.innerHTML = pairingsArray4[3][23] + ' sh ' + pairingsArray4[3][22] + ' sec ' + '<br>' + pairingsArray4[4][23] + ' sh ' + pairingsArray4[4][22] + ' sec ' + '<br>' + pairingsArray4[5][23] + ' sh ' + pairingsArray4[5][22] + ' sec ';
                  thirdD5A.innerHTML = pairingsArray4[3][25] + ' sh ' + pairingsArray4[3][24] + ' sec ' + '<br>' + pairingsArray4[4][25] + ' sh ' + pairingsArray4[4][24] + ' sec ' + '<br>' + pairingsArray4[5][25] + ' sh ' + pairingsArray4[5][24] + ' sec ';
                  thirdD6A.innerHTML = pairingsArray4[3][27] + ' sh ' + pairingsArray4[3][26] + ' sec ' + '<br>' + pairingsArray4[4][27] + ' sh ' + pairingsArray4[4][26] + ' sec ' + '<br>' + pairingsArray4[5][27] + ' sh ' + pairingsArray4[5][26] + ' sec ';
                  thirdD7A.innerHTML = pairingsArray4[3][29] + ' sh ' + pairingsArray4[3][28] + ' sec ' + '<br>' + pairingsArray4[4][29] + ' sh ' + pairingsArray4[4][28] + ' sec ' + '<br>' + pairingsArray4[5][29] + ' sh ' + pairingsArray4[5][28] + ' sec ';
                  document.getElementById('thirdD7A').appendChild(thirdD7A);
                  forthD2A.innerHTML = secondD4A.innerHTML; forthD3A.innerHTML = thirdD4A.innerHTML;
                  forthD5A.innerHTML = pairingsArray4[3][31] + ' sh ' + pairingsArray4[3][30] + ' sec ' + '<br>' + pairingsArray4[4][31] + ' sh ' + pairingsArray4[4][30] + ' sec ' + '<br>' + pairingsArray4[5][31] + ' sh ' + pairingsArray4[5][30] + ' sec ';
                  forthD6A.innerHTML = pairingsArray4[3][33] + ' sh ' + pairingsArray4[3][32] + ' sec ' + '<br>' + pairingsArray4[4][33] + ' sh ' + pairingsArray4[4][32] + ' sec ' + '<br>' + pairingsArray4[5][33] + ' sh ' + pairingsArray4[5][32] + ' sec ';
                  forthD7A.innerHTML = pairingsArray4[3][35] + ' sh ' + pairingsArray4[3][34] + ' sec ' + '<br>' + pairingsArray4[4][35] + ' sh ' + pairingsArray4[4][34] + ' sec ' + '<br>' + pairingsArray4[5][35] + ' sh ' + pairingsArray4[5][34] + ' sec ';
                  fifthD2A.innerHTML = secondD5A.innerHTML; fifthD3A.innerHTML = thirdD5A.innerHTML;
                  fifthD4A.innerHTML = forthD5A.innerHTML;
                  fifthD6A.innerHTML = pairingsArray4[3][37] + ' sh ' + pairingsArray4[3][36] + ' sec ' + '<br>' + pairingsArray4[4][37] + ' sh ' + pairingsArray4[4][36] + ' sec ' + '<br>' + pairingsArray4[5][37] + ' sh ' + pairingsArray4[5][36] + ' sec ';
                  fifthD7A.innerHTML = pairingsArray4[3][39] + ' sh ' + pairingsArray4[3][38] + ' sec ' + '<br>' + pairingsArray4[4][39] + ' sh ' + pairingsArray4[4][38] + ' sec ' + '<br>' + pairingsArray4[5][39] + ' sh ' + pairingsArray4[5][38] + ' sec ';
                  document.getElementById('fifthD7A').appendChild(fifthD7A);
                  sixthD2A.innerHTML = secondD6A.innerHTML; sixthD3A.innerHTML = thirdD6A.innerHTML;
                  sixthD4A.innerHTML = forthD6A.innerHTML; sixthD5A.innerHTML = fifthD6A.innerHTML;
                  sixthD7A.innerHTML = pairingsArray4[3][41] + ' sh ' + pairingsArray4[3][40] + ' sec ' + '<br>' + pairingsArray4[4][41] + ' sh ' + pairingsArray4[4][40] + ' sec ' + '<br>' + pairingsArray4[5][41] + ' sh ' + pairingsArray4[5][40] + ' sec ';
                  seventhD2A.innerHTML = secondD7A.innerHTML; seventhD3A.innerHTML = thirdD7A.innerHTML;
                  seventhD4A.innerHTML = forthD7A.innerHTML; seventhD5A.innerHTML = fifthD7A.innerHTML;
                  seventhD6A.innerHTML = sixthD7A.innerHTML;
                } // end if seven D men

                else if (awayRosterDArray.length == 6) {
                  var firstD6A = document.createElement('p3');
                  firstD6A.innerHTML = pairingsArray4[3][9] + ' sh ' + pairingsArray4[3][8] + ' sec ' + '<br>' + pairingsArray4[4][9] + ' sh ' + pairingsArray4[4][8] + ' sec ' + '<br>' + pairingsArray4[5][9] + ' sh ' + pairingsArray4[5][8] + ' sec ';
                  document.getElementById('firstD6A').appendChild(firstD6A);
                  var secondD6A = document.createElement('p2'); document.getElementById('secondD6A').appendChild(secondD6A);
                  secondD3A.innerHTML = pairingsArray4[3][13] + ' sh ' + pairingsArray4[3][12] + ' sec ' + '<br>' + pairingsArray4[4][13] + ' sh ' + pairingsArray4[4][12] + ' sec ' + '<br>' + pairingsArray4[5][13] + ' sh ' + pairingsArray4[5][12] + ' sec ';
                  secondD3A.innerHTML = pairingsArray4[3][11] + ' sh ' + pairingsArray4[3][10] + ' sec ' + '<br>' + pairingsArray4[4][11] + ' sh ' + pairingsArray4[4][10] + ' sec ' + '<br>' + pairingsArray4[5][11] + ' sh ' + pairingsArray4[5][10] + ' sec ';
                  secondD4A.innerHTML = pairingsArray4[3][13] + ' sh ' + pairingsArray4[3][12] + ' sec ' + '<br>' + pairingsArray4[4][13] + ' sh ' + pairingsArray4[4][12] + ' sec ' + '<br>' + pairingsArray4[5][13] + ' sh ' + pairingsArray4[5][12] + ' sec ';
                  secondD5A.innerHTML = pairingsArray4[3][15] + ' sh ' + pairingsArray4[3][14] + ' sec ' + '<br>' + pairingsArray4[4][15] + ' sh ' + pairingsArray4[4][14] + ' sec ' + '<br>' + pairingsArray4[5][15] + ' sh ' + pairingsArray4[5][14] + ' sec ';
                  secondD6A.innerHTML = pairingsArray4[3][17] + ' sh ' + pairingsArray4[3][16] + ' sec ' + '<br>' + pairingsArray4[4][17] + ' sh ' + pairingsArray4[4][16] + ' sec ' + '<br>' + pairingsArray4[5][17] + ' sh ' + pairingsArray4[5][16] + ' sec ';
                  thirdD2A.innerHTML = secondD3A.innerHTML;
                  thirdD4A.innerHTML = pairingsArray4[3][19] + ' sh ' + pairingsArray4[3][18] + ' sec ' + '<br>' + pairingsArray4[4][19] + ' sh ' + pairingsArray4[4][18] + ' sec ' + '<br>' + pairingsArray4[5][19] + ' sh ' + pairingsArray4[5][18] + ' sec ';
                  thirdD5A.innerHTML = pairingsArray4[3][21] + ' sh ' + pairingsArray4[3][20] + ' sec ' + '<br>' + pairingsArray4[4][21] + ' sh ' + pairingsArray4[4][20] + ' sec ' + '<br>' + pairingsArray4[5][21] + ' sh ' + pairingsArray4[5][20] + ' sec ';
                  thirdD6A.innerHTML = pairingsArray4[3][23] + ' sh ' + pairingsArray4[3][22] + ' sec ' + '<br>' + pairingsArray4[4][23] + ' sh ' + pairingsArray4[4][22] + ' sec ' + '<br>' + pairingsArray4[5][23] + ' sh ' + pairingsArray4[5][22] + ' sec ';
                  forthD2A.innerHTML = secondD4A.innerHTML; forthD3A.innerHTML = thirdD4A.innerHTML;
                  forthD5A.innerHTML = pairingsArray4[3][25] + ' sh ' + pairingsArray4[3][24] + ' sec ' + '<br>' + pairingsArray4[4][25] + ' sh ' + pairingsArray4[4][24] + ' sec ' + '<br>' + pairingsArray4[5][25] + ' sh ' + pairingsArray4[5][24] + ' sec ';
                  forthD6A.innerHTML = pairingsArray4[3][27] + ' sh ' + pairingsArray4[3][26] + ' sec ' + '<br>' + pairingsArray4[4][27] + ' sh ' + pairingsArray4[4][26] + ' sec ' + '<br>' + pairingsArray4[5][27] + ' sh ' + pairingsArray4[5][26] + ' sec ';
                  fifthD2A.innerHTML = secondD5A.innerHTML; fifthD3A.innerHTML = thirdD5A.innerHTML;
                  fifthD4A.innerHTML = forthD5A.innerHTML;
                  fifthD6A.innerHTML = pairingsArray4[3][29] + ' sh ' + pairingsArray4[3][28] + ' sec ' + '<br>' + pairingsArray4[4][29] + ' sh ' + pairingsArray4[4][28] + ' sec ' + '<br>' + pairingsArray4[5][29] + ' sh ' + pairingsArray4[5][28] + ' sec ';
                  sixthDNumberA.innerHTML = awayRosterArray[awayRosterDIDArray[11] - 4] + ' ' + awayRosterArray[awayRosterDIDArray[11] - 1] + ' ' + awayRosterArray[awayRosterDIDArray[11] - 3];;
                  sixthD1A.innerHTML = pairingsArray4[3][9] + ' sh ' + pairingsArray4[3][8] + ' sec ' + '<br>' + pairingsArray4[4][9] + ' sh ' + pairingsArray4[4][8] + ' sec ' + '<br>' + pairingsArray4[5][9] + ' sh ' + pairingsArray4[5][8] + ' sec ';
                  sixthD6A.innerHTML = 'X' + '<br>' + 'X' + '<br>' + 'X';
                  sixthD2A.innerHTML = secondD6A.innerHTML; sixthD3A.innerHTML = thirdD6A.innerHTML;
                  sixthD4A.innerHTML = forthD6A.innerHTML; sixthD5A.innerHTML = fifthD6A.innerHTML
                } // end if sixth D men 

                else if (awayRosterDArray.length == 5) {
                  secondD3A.innerHTML = pairingsArray4[3][9] + ' sh ' + pairingsArray4[3][8] + ' sec ' + '<br>' + pairingsArray4[4][9] + ' sh ' + pairingsArray4[4][8] + ' sec ' + '<br>' + pairingsArray4[5][9] + ' sh ' + pairingsArray4[5][8] + ' sec ';
                  secondD4A.innerHTML = pairingsArray4[3][11] + ' sh ' + pairingsArray4[3][10] + ' sec ' + '<br>' + pairingsArray4[4][11] + ' sh ' + pairingsArray4[4][10] + ' sec ' + '<br>' + pairingsArray4[5][11] + ' sh ' + pairingsArray4[5][10] + ' sec ';
                  secondD5A.innerHTML = pairingsArray4[3][13] + ' sh ' + pairingsArray4[3][12] + ' sec ' + '<br>' + pairingsArray4[4][13] + ' sh ' + pairingsArray4[4][12] + ' sec ' + '<br>' + pairingsArray4[5][13] + ' sh ' + pairingsArray4[5][12] + ' sec ';
                  thirdD2A.innerHTML = secondD3A.innerHTML;
                  thirdD4A.innerHTML = pairingsArray4[3][15] + ' sh ' + pairingsArray4[3][14] + ' sec ' + '<br>' + pairingsArray4[4][15] + ' sh ' + pairingsArray4[4][14] + ' sec ' + '<br>' + pairingsArray4[5][15] + ' sh ' + pairingsArray4[5][14] + ' sec ';
                  thirdD5A.innerHTML = pairingsArray4[3][17] + ' sh ' + pairingsArray4[3][16] + ' sec ' + '<br>' + pairingsArray4[4][17] + ' sh ' + pairingsArray4[4][16] + ' sec ' + '<br>' + pairingsArray4[5][17] + ' sh ' + pairingsArray4[5][16] + ' sec ';
                  forthD2A.innerHTML = secondD4A.innerHTML; forthD3A.innerHTML = thirdD4A.innerHTML;
                  forthD5A.innerHTML = pairingsArray4[3][19] + ' sh ' + pairingsArray4[3][18] + ' sec ' + '<br>' + pairingsArray4[4][19] + ' sh ' + pairingsArray4[4][18] + ' sec ' + '<br>' + pairingsArray4[5][19] + ' sh ' + pairingsArray4[5][18] + ' sec ';
                  fifthD2A.innerHTML = secondD5A.innerHTML; fifthD3A.innerHTML = thirdD5A.innerHTML;
                  fifthD4A.innerHTML = forthD5A.innerHTML;
                } // end if five D men 

                document.getElementById('secondD3A').appendChild(secondD3A); document.getElementById('secondD4A').appendChild(secondD4A);
                document.getElementById('secondD5A').appendChild(secondD5A);
                document.getElementById('thirdD4A').appendChild(thirdD4A); document.getElementById('thirdD5A').appendChild(thirdD5A);
                document.getElementById('thirdD6A').appendChild(thirdD6A); document.getElementById('forthD5A').appendChild(forthD5A);
                document.getElementById('forthD6A').appendChild(forthD6A); document.getElementById('fifthD6A').appendChild(fifthD6A);

                linesArray5 = [[], [], [], [], [], []]; linesArray6 = []; linesArray3 = [];
                console.log(linesArray4);

                for (i = 0; i < 6; i++) { // i is for 3 periods x 2 teams
                  for (j = 0; j < linesArray4[i].length / 5; j++) {
                    if (linesArray4[i][5 * j] > 120 && linesArray4[i][5 * j + 1] > 3) {
                      linesArray5[i].push(linesArray4[i][5 * j], 5 * j, linesArray4[i][5 * j + 1], linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4])
                    }
                  }
                }

                for (i = 2; i > -1; i--) {
                  if (linesArray5[i].length === 18 || linesArray5[i].length === 24) {
                    console.log(i); linesArray2 = [];
                    for (j = 0; j < linesArray5[i].length / 6; j++) {
                      linesArray2.push(linesArray5[i][6 * j + 3], linesArray5[i][6 * j + 4], linesArray5[i][6 * j + 5])
                    }
                  }
                }
                for (i = 5; i > 2; i--) {
                  if (linesArray5[i].length === 18 || linesArray5[i].length === 24) {
                    console.log(i); linesArray6 = [];
                    for (j = 0; j < linesArray5[i].length / 6; j++) {
                      linesArray6.push(linesArray5[i][6 * j + 3], linesArray5[i][6 * j + 4], linesArray5[i][6 * j + 5])
                    }
                  }
                }
                console.log(linesArray5, linesArray2, linesArray6);
                const maxLineHome = Math.max(linesArray5[0].length, linesArray5[1].length, linesArray5[2].length);
                const maxLineAway = Math.max(linesArray5[3].length, linesArray5[4].length, linesArray5[5].length);
                linesArray3 = [];
                if (maxLineHome < 18) {
                  const maxLineHomeIndex = [linesArray5[0].length, linesArray5[1].length, linesArray5[2].length].indexOf(maxLineHome); linesArray3 = [];
                  for (i = 0; i < linesArray4[maxLineHomeIndex].length / 5; i++) { linesArray3.push(linesArray4[maxLineHomeIndex][5 * i]) }

                }
                linesArray = linesArray3.sort();
                console.log(linesArray);

                if (maxLineAway < 18) {
                  const maxLineAwayIndex = [linesArray5[3].length, linesArray5[4].length, linesArray5[5].length].indexOf(maxLineAway); linesArray3 = [];
                  console.log(maxLineAwayIndex);
                  // console.log(linesArray4[maxLineAwayIndex + 3].length, linesArray4[maxLineAwayIndex + 3]);
                  for (i = 0; i < linesArray4[maxLineAwayIndex + 3].length / 5; i++) { linesArray3.push(linesArray4[maxLineAwayIndex + 3][5 * i]) } //

                }
                // linesArray = linesArray3.sort(); 
                console.log(linesArray3);

                // else if (i == 3) {linesArray6.push(linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4]) }
                if (linesArray5[0].length < 18) {
                  linesArray2 = [];
                  linesArray5 = [[], [], [], linesArray5[3], linesArray5[4], linesArray5[5]];
                  for (i = 0; i < 3; i++) {
                    for (j = 0; j < linesArray4[i].length / 5; j++) {
                      if (linesArray4[i][5 * j] > 120 && linesArray4[i][5 * j + 1] > 2) {
                        linesArray5[i].push(linesArray4[i][5 * j], 5 * j, linesArray4[i][5 * j + 1], linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4]);
                        if (i == 0) { linesArray2.push(linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4]) }
                      }
                    }
                  }
                }
                if (linesArray5[3].length < 18) {
                  linesArray5 = [linesArray5[0], linesArray5[1], linesArray5[2], [], [], []];
                  linesArray6 = [];
                  for (i = 3; i < 6; i++) {
                    for (j = 0; j < linesArray4[i].length / 5; j++) {
                      if (linesArray4[i][5 * j] > 120 && linesArray4[i][5 * j + 1] > 2) {
                        linesArray5[i].push(linesArray4[i][5 * j], 5 * j, linesArray4[i][5 * j + 1], linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4]);
                        if (i == 3) { linesArray6.push(linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4]) }
                      }
                    }
                  }
                }
                console.log(linesArray5);
                if (linesArray5[0].length < 18) {
                  linesArray2 = []; tempArray2 = []; console.log('home exception');
                  for (i = 0; i < linesArray4[0].length / 5; i++) {
                    for (j = 0; j < 24; j++) {
                      if (linesArray4[0][5 * i] > 120 - 5 * j && linesArray4[0][5 * i] < 120 && linesArray4[0][5 * i + 1] > 2) {
                        console.log(linesArray4[0][5 * i]);
                        tempArray2.push(i, j);
                      }
                    }
                  }
                  console.log(tempArray2);
                  linesArray5 = [[], [], [], linesArray5[3], linesArray5[4], linesArray5[5]];
                  for (i = 0; i < 3; i++) {
                    for (j = 0; j < linesArray4[i].length / 5; j++) {
                      if (linesArray4[i][5 * j] > 120 - 5 * tempArray2[0] && linesArray4[i][5 * j + 1] > 2) {
                        linesArray5[i].push(linesArray4[i][5 * j], 5 * j, linesArray4[i][5 * j + 1], linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4]);
                        if (i == 0) { linesArray2.push(linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4]) }
                      }
                    }
                  }
                }

                if (linesArray5[3].length < 18) {
                  console.log('road exception'); linesArray6 = []; tempArray2 = [];
                  for (i = 0; i < linesArray4[3].length / 5; i++) {
                    for (j = 0; j < 24; j++) {
                      if (linesArray4[3][5 * i] > 120 - 5 * j && linesArray4[3][5 * i + 1] > 2) { tempArray2.push(j) }
                    }
                  }
                  console.log(tempArray2); linesArray5 = [linesArray5[0], linesArray5[1], linesArray5[2], [], [], []];
                  for (i = 3; i < 6; i++) {
                    for (j = 0; j < linesArray4[i].length / 5; j++) {
                      if (linesArray4[i][5 * j] > 120 - 5 * tempArray2[0] && linesArray4[i][5 * j + 1] > 2) {
                        linesArray5[i].push(linesArray4[i][5 * j], 5 * j, linesArray4[i][5 * j + 1], linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4]);
                        if (i == 3) { linesArray6.push(linesArray4[i][5 * j + 2], linesArray4[i][5 * j + 3], linesArray4[i][5 * j + 4]) }
                      }
                    }
                  }
                }
                console.log(linesArray5, linesArray2, linesArray6);

                firstLine.innerHTML = homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[0]] - 4] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[0]] - 1] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[0]] - 3] + '<br>' +
                  homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[1]] - 4] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[1]] - 1] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[1]] - 3] + '<br>' +
                  homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[2]] - 4] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[2]] - 1] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[2]] - 3];
                secondLine.innerHTML = homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[3]] - 4] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[3]] - 1] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[3]] - 3] + '<br>' +
                  homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[4]] - 4] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[4]] - 1] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[4]] - 3] + '<br>' +
                  homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[5]] - 4] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[5]] - 1] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[5]] - 3];
                thirdLine.innerHTML = homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[6]] - 4] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[6]] - 1] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[6]] - 3] + '<br>' +
                  homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[7]] - 4] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[7]] - 1] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[7]] - 3] + '<br>' +
                  homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[8]] - 4] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[8]] - 1] + ' ' + homeRosterArray[homeRosterFIDArray[1 + 2 * linesArray2[8]] - 3];
                firstLineTime.innerHTML = linesArray4[0][linesArray5[0][1] + 1] + 'sh' + linesArray4[0][linesArray5[0][1]] + 's' + '<br>' + linesArray4[1][linesArray5[0][1] + 1] + 'sh' + linesArray4[1][linesArray5[0][1]] + 's' + '<br>' + linesArray4[2][linesArray5[0][1] + 1] + 'sh' + linesArray4[2][linesArray5[0][1]] + 's';
                secondLineTime.innerHTML = linesArray4[0][linesArray5[0][7] + 1] + 'sh' + linesArray4[0][linesArray5[0][7]] + 's' + '<br>' + linesArray4[1][linesArray5[0][7] + 1] + 'sh' + linesArray4[1][linesArray5[0][7]] + 's' + '<br>' + linesArray4[2][linesArray5[0][7] + 1] + 'sh' + linesArray4[2][linesArray5[0][7]] + 's';
                thirdLineTime.innerHTML = linesArray4[0][linesArray5[0][13] + 1] + 'sh' + linesArray4[0][linesArray5[0][13]] + 's' + '<br>' + linesArray4[1][linesArray5[0][13] + 1] + 'sh' + linesArray4[1][linesArray5[0][13]] + 's' + '<br>' + linesArray4[2][linesArray5[0][13] + 1] + 'sh' + linesArray4[2][linesArray5[0][13]] + 's';

                firstLineAway.innerHTML = awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[0]] - 4] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[0]] - 1] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[0]] - 3] + '<br>' +
                  awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[1]] - 4] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[1]] - 1] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[1]] - 3] + '<br>' +
                  awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[2]] - 4] + ' ' + awayRosterArray[homeRosterFIDArray[1 + 2 * linesArray6[2]] - 1] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[2]] - 3];
                secondLineAway.innerHTML = awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[3]] - 4] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[3]] - 1] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[3]] - 3] + '<br>' +
                  awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[4]] - 4] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[4]] - 1] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[4]] - 3] + '<br>' +
                  awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[5]] - 4] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[5]] - 1] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[5]] - 3];
                thirdLineAway.innerHTML = awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[6]] - 4] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[6]] - 1] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[6]] - 3] + '<br>' +
                  awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[7]] - 4] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[7]] - 1] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[7]] - 3] + '<br>' +
                  awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[8]] - 4] + ' ' + awayRosterArray[homeRosterFIDArray[1 + 2 * linesArray6[8]] - 1] + ' ' + awayRosterArray[awayRosterFIDArray[1 + 2 * linesArray6[8]] - 3];
                firstLineTimeAway.innerHTML = linesArray4[3][linesArray5[3][1] + 1] + 'sh' + linesArray4[3][linesArray5[3][1]] + 's' + '<br>' + linesArray4[4][linesArray5[3][1] + 1] + 'sh' + linesArray4[4][linesArray5[3][1]] + 's' + '<br>' + linesArray4[5][linesArray5[3][1] + 1] + 'sh' + linesArray4[5][linesArray5[3][1]] + 's';
                secondLineTimeAway.innerHTML = linesArray4[3][linesArray5[3][7] + 1] + 'sh' + linesArray4[3][linesArray5[3][7]] + 's' + '<br>' + linesArray4[4][linesArray5[3][7] + 1] + 'sh' + linesArray4[4][linesArray5[3][7]] + 's' + '<br>' + linesArray4[5][linesArray5[3][7] + 1] + 'sh' + linesArray4[5][linesArray5[3][7]] + 's';
                thirdLineTimeAway.innerHTML = linesArray4[3][linesArray5[3][13] + 1] + 'sh' + linesArray4[3][linesArray5[3][13]] + 's' + '<br>' + linesArray4[4][linesArray5[3][13] + 1] + 'sh' + linesArray4[4][linesArray5[3][13]] + 's' + '<br>' + linesArray4[5][linesArray5[3][13] + 1] + 'sh' + linesArray4[5][linesArray5[3][13]] + 's';
              } // end function getDPairs Joel Henley was dressed as F on 11/19 against NYI he missed entire 3rd period
            });
        } // end getshifts line 68 start
      
    } // end second .then from getinputvalue
    );
} // end getInput Value function $65k at 4.50% on 3/27
// check tix casa. climb sierra blanca; split functions
// nazca drawings Peru; update resume