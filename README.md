TypeTen
=======
Link:type-ten-1.appspot.com

Presentation:https://prezi.com/krom20ajk2ca/type10/

Type Ten is an online questions and answers game built on javascript and Google App Engine using Python. The primary objective of the game is to challenge the players with ten questions that have ten or more possible answers each. The player must type in as many answers as possible in sixty seconds time. An example of a question will be “Type 10 items that can be seen in the ECS Lab”. The player can type in relevant answer and the system will indicate whether they are correct or wrong. Each time a player types in an answer the system will look in the database for a matching entry, if no matching entry was found it will indicate a wrong attempt, if a matching entry is found it will indicate a correct answer and award the player with the points available for the specific answer. In other words, obtaining a high score depends upon difficulty of the answers, meaning each answer has a different weight. For example, a “Computer” would be considered as a low difficulty answer while an “HDMI cable” would worth more points. Consequently, in this implementation, weight of answers is divided into three categories: low, medium and high which worth ten, fifteen and twenty points respectively. 

During the game and while the player answer the questions, the current score will be displayed along with a leader’s board that will show a ranking of the ten best scores in the game. If the player manage to gather enough points during the game time to progress in the leader’s board, this will be displayed in real-time. Finally, the game will finish upon the lapse of ten rounds.

The game can be played numerous times by a certain player as the questions will be chosen randomly for every attempt. All the attempts will be recorded and displayed in the overall leader’s board. New users would be asked to login with their Google account in order to play the game.

Besides the game page, the application has a “Leaderboard” page where show the current rankings and scores of the users that have played the game. It specifies the rank position, the user name and the score obtained by game. The game also has an “Instructions” page where new users can find more information about the game how the game works.

Finally, another important feature provided by the application is an administrator user interface that is available only to certified users. The administrator page provides facilities to add new questions and answers in the game or manage existing ones once.  
