# NHLShiftsStats3
## Background
Original repo is located at https://github.com/umnovjp/NHLShiftStats3. It was working in 98% of games. But with NHL changing its APIs without any announcement I realized that it was better to start new repo from scratch instead of fixing original one. One of the reasons is that trying to fix issues with original repo created too many new hurdles. Like fixing one led to a new one. And as script progressed, I knew I am on the right path after 2 years of JavaScript experience. What I could not accomplish with 1200 lines of code last year, I did with just 400 lines. Compare script.js files! Another NHL stats repo https://github.com/umnovjp/NHLShiftStats1 will be easier to fix.
## Usage
First thing is to select a date. And remember to select date when games actually were played. ![calendar](image.png) 
Then you will be prompted to select a game. Press one button to select a game. ![select a game](image-1.png) Separate tables will be displayed for home and away team defensemen. ![Alt text](image-2.png) You can easy determine defensive pairs from this table. It is not that easy for forward lines. Because lines of three forwards are not that easy to display in a 2D table. This is how it is done currently ![Alt text](image-3.png). Also, special teams are frequently played with 2 or 4 forwards depending on, depending if it is penalty kill or power play. This script limits 5x5 play as play with 2D and 3F only. This is done to exclude PP with 4F and 1 D, and sometimes playes where D comes out of penalty box where his team plays with 3D and 2F till next stoppage. Still it includes PP with 3F and 2D, which is usually second PP unit. 

Definition of shift is 10 seconds pair of defensmen or trio of forwards played continuously at the same time.
## Notes
I tried maybe 30-40 different algorithms to come up with reasonable lines combinations. There are 32 teams in NHL. And each of them has its own defensive system. Next, each game is different. Player may be injured in 1st period or may get a game misconduct. There may be multiple penalties resulting in limited 5x5 play. This algorithm works for virtually every game. And if it does not, I will add a list of games where it does not work.

## Live version URL
https://umnovjp.github.io/NHLShiftsStats3/

## Known Failuresn and Comments (those will be deleted later)
Some game data are not displayed correctly because of obvious errors in NHL API data. Example is STL at FLA game on 12/21/2023 where data for many shifts are duplicated. Similar example is TOR at CBJ game on 12/23/2023 where many shifts are duplicated while some non existing overlapping shifts are added. Game CBJ at NJD on 12/28/2023 generated unreliable results for DMen because there were 3 of them on ice frequently. Most likely one D(#2?) was dressed as an F. Not sure if this paragraph is still relevant. on 1/21 game 0 H lines are incorrect because #11 played on 2 lines. game 0 on 01/29 12 F but only 11 displayednt game report still counts him as D. Game 4 on 01/09 A has 3 lines only with 12F. Game 1 on 1/14 only 3 h lines are displayed because 3 played on 2 lines. game 8 on 1/15 only 3 lines displayed. game 6 on 1/16 determines lines correctly. but toi . And for H team, all lines changed in 2nd. Game 4 on 01/09: A lines displayed incorrectly with #14, #16, #19 playiis absolutg on 2 lines; and only 3 lines. Game 10 on 01/06 A has 11F but #28, #81, #91 played for 2 lines. Game 1 on 12/29 has terrible shift data for A team. Game 10 on 12/27 #11 and #16 play on two lines. Game 8 on 12/21 #97 played on 2 lines. game 0 on 12/14 #26 played on 2 lines. Game 2 on 12/14 H only one line displayed. Game 3 on 12/12 #63 and #25 played on two lines. game 4 on 12/9 all H lines undefined because there was no one line. Game 2 on 12/03 only 3 lines displayed but #15 plyed on 4th line as well. Game 9 on 12/02 #17 played on 2 lines. Game 0 on 12/01 3 lines displayed #28 played on 2 lines. Game 4 on 11/28 only 1 line H displayed. Game 5 on 11/27 #24 A played on 2 lines. Game 3 on 11/25 A #19 played on 2 lines. Game 2 on 11/22 only 1 lines displayed. Game 3 on 11/22 3 H lines displayed but #19 played on 2 lines. Game 6 11/22 #9 played on 2 A lines. Game 13 11/22 only 3 A lines displayed because #10 and #48 both played on 2 lines. Game 0 on 11/20 3 lines displayed, #19 and #23 played on 2 lines. Game 3 on 11/20 one line dispalyed; on A team #20 plyed for 2 lines. Game 3 on 11/18 1 line displayed. Game 0 on 11/17 3 lines displayed one F played on 2 lines. Game 8 on 11/14 3 lines displayed. game 9 on 11/11 #13, #29, #96 plyed on 2 lines. Game 5 on 11/04 #64 played on 2 lines 3 lines displayed. Game 1 on 10/28 3 lines displayed 315 played on 2 lines. Game 2 on 10/28 3 lines displayed. Game 3 10/27 3 lines displayed #8 played on 2 lines. Game 8 10/24 3 lines displayed F played on 2 lines. Game 12 10/24 3 lines displayed F played on 2 lines. Game 6 on 10/21 #21 played on 2 lines.

on 1/31 checked 10/19 to 1/31. stopped 1:50:00. Movie ended. 36:40. 39:00 and after. 40:22. 53:09. 59:50. Stalker stopped 1:45:33 2:02:08 2:11:14 2:41:49 0:01

Summary of January 2024. 48 + 50 + 53 + 51 + 6 = 208 games. December 34 + 54 + 53 + 33 + 45 = 219 games. November 33 + 48 + 45 + 49 + 38 = 213 games. 

9 Games in January and 5 games in December and 13 games in November with 5 lines: Game 10 on 01/02 H had 5 lines 1810 345 are unique. Game 1 on 01/31 H have 5 lines and 2 unique lines. Game 2 on 01/07 A has 5 lines 268 is the only unique line. Game 4 on 01/27 has 5 lines incorrectly only 5910 line is unique. Game 2 on 1/25 H has 5 lines incorrectly 017 268 are unique. Game 3 on 1/19 has 5 limes correct 056 348 are unique. Game 3 on 1/20 A ahas 5 lines incorrect 138 2410 are unique. game 10 on 1/18 H has 5 lines. 0611 578 are unique lines. game 0 on 1/15 had 5 lines calculated correctly 236 and 4510 are unique. Game 0 on 12/23 5 lines 0311 467 are unique. Game 1 on 12/23 268 91011 are unique. Game 0 on 12/18 025 467 are unique. Game 1 on 12/10 068 157 lines are unique. Game 3 on 12/6 A 5 lines 068 5910 are unique. 

Game 13 on 11/30 179 3410 are unique. Game 7 on 11/28 A two unique lines. Game 9 on 11/28 A has 3 unique lines. Game 0 on 11/27 H has 3 unique lines. Game 3 on 11/24 2 unique lines. Game 5 on 11/24 A 3 unique lines. Game 0 on 11/16 2 unique lines. Game 0 on 11/15 A has 2 unique lines. Game 4 on 11/11 2 unique lines H. Game 6 11/09 2 unique lines. Game 0 on 11/05 2 unique lines. Game 3 on 11/04 3 unique lines. Game 4 on 11/02 2 unique lines. Game 5 on 10/28 3 unique lines. Game 0 10/22 2 unique lines. Game 13 ON 10/21 3 UNIQUE LINES. Game 11 10/21 2 unique lines. at leat 5 games with repeating lines. 

11F playing in 3 or 4 lines 5 times in January and 3 or more times in December and once in November. Currently game 3 on 01/04 displays 4 lines because H team had 7 Ds but #71 belongs to 2 lines. Game 3 on 01/04 11F but #71 played on 2 lines. on 1/22  game 3 H team 11F #9 played on 2 lines. game 3 on 1/18 #11 played on two lines for 11F home team. Game 9 on 1/13 A has 3 lines with 7D. Game 6 on 12/29 11F but 4 lines. game 9 on 12/9 displays #13, #96, #29 all playing on two lines. Game 12 on 12/7 #15 played on two lines. Game 7 on 11/2 11F but 4 lines displayed with #29 on 2 lines. Will add October games here. No games so far in October

Example of 2 line game is game 2 02/12. Example of 1 line game 9 on 01/02. both work well now.

Where new script works better: Game 2 01/31; game 1 01/30 3 lines displayed; game 0 01/29 only 11F are displayed though there are 12F; game 11 on 01/27 only 3 lines displayed; game 2 on 01/26 only 3 lines dispalyed; game 0 on 01/24 new does not show F10, 11; game 2 on 1/23 does not work repeating player; game 3 on 1/22 repeating player; game 0 on 1/21 repeating player; game 1 1/20 repeating player H; game 2 1/20 repeating player; game 7 on 1/20 my script has 10 F; game 1 on 1/18 3 lines displayed but I have 11F; game 3 on 1/18 repeating player; game 5 1/18 my script has just 11F; game 9 1/18 3 lines displayed but script has 11F; game 1 1/14 repeating player updated

New test starts 02/26: game 1 on 1/31 5F lines; game 0 02/05 11F 3 lines all unique; game 0 2/07 5F lines; game 2 2/07 1 line; game 0 02/08 again 1 line; game 1 02/08 0 lines case to be added 

game 7 03/09 13F time not displayed correctly; game 7 03/02 apparently incorrect lines because of H line change; game 2 on 03/12 6F lines but too many 0s; game 0 03/12 apparently incorrect because of lines change; game 9 2/22 apparently 4th H line wrong; game 7 2/22 line combinations changed does not look perfect; game 6 2/22 A team no lines at all; game 2 2/22 A team wrong 4th line; game 0 2/22 17s 3 shifts and 10s 10 shifts; game 3 2/21 8s 4 shifts; game 7 2/20 apparently 4th line wrong; game 5 3/14 data displayed incorrectly 5D; game 6 3/17 and even worse lines change; 
tested 02/12-03/17 

Game 1 04/24 and game DAL on 04/29 are examples of games with line changes and stars game on 05/07; stars game 1 5/17 changed lines in 3rd; game 0 3/12 game 3 3/16 failed because final lineup is empty. game 1 3/15 failed because final lineup is empty. game 3 3/14 failed because final lineup is empty. game 8 2/15 all lines changed in 2nd. game 6 2/20 4th line wrong.

Checked games in May starting May 1. Game 1 05/08: 0 lines defined for H team also game 1 05/10 and game 1 5/12 same thing game 1 5/14 same thing because nhle web API does not have any data for those 3 games. game 0 5/12 H team 3rd period because no lines played 100s