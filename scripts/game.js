// Variable with the settings of the games
window.settings = {};
    settings.offset = -1;
    settings.round = 1;
    settings.currentQuestion = -1;
    settings.totalQuestions = -1;
    settings.game_id = "";
    settings.currentAnswer = 0;
    settings.between = false;
    
$( document ).ready(function() {
    //set timer
    $("#timer").TimeCircles({start: false});
    $("#timer").TimeCircles({use_background: false});
    $('.answer-input').prop('disabled', true);
    //set score
    var username = $("#username").attr('value');
    settings.game_id = username + $.now();
    console.log("Settings game_id: " + settings.game_id);
    setScore(settings.game_id);
    //set offset
    setOffset();
    //set total questions
    setTotalQuestions();
});

// 
// Click on the button "start game"
//
// Initialize the game.
$('#start_game').on("click", function () {
    $("#start_game").prop("disabled", true);
    console.log("settings Offset: " + settings.offset);
    // Text for attempt box
    $('.attempt-box').append('<span style="color:red; font-size:1.6rem;">Wrong attempts</span>');
    $('.attempt-box').append('<div class="attempts"></div>');
    // Text for answers box
    $('#correct-answers-box').append('<div class="answers"></div>');
    if (settings.round <= settings.totalQuestions) {
        // Get question
        $.ajax({
            type: "get",
            url: '/getQuestion',
            dataType: 'json',
            ContentType: 'application/json',
            data: {'offset': settings.offset},
            success: function(question) {
                console.log(question);
                // update current question
                settings.currentQuestion = question.question_id;
                // Clean div
                $('.question-box').empty();
                // Append question
                $('.question-box').append('<span class="q-content">' + question.question_content +'</span>');
                // Enable answer box
                $('.answer-input').prop('disabled', false);
                //start the timer
                $("#timer").TimeCircles({use_background: false}); 
                $("#timer").TimeCircles().rebuild();
                $("#timer").TimeCircles().start();
                $("#timer").TimeCircles({count_past_zero: false}).addListener(function(unit, value, total){
                    //turn colour orange on 30 seconds remaining
                    if(total === 30){
                        $("#timer").TimeCircles({ time: {Seconds: { color: "#e5a960" }}});
                    }
                    //turn colour red on 15 seconds remaining
                    if(total === 15){
                        $("#timer").TimeCircles({ time: {Seconds: { color: "#db6767" }}});
                    }
                    //time is out
                    if(total === 0){
                        console.log("round finished timer");
                        // Clean div
                        $('.question-box').empty();
                        // Final round - game ended
                        if (settings.round === settings.totalQuestions) {
                            $('.question-box').append('<span style="color:red"><strong>Game has ended. Thanks for playing.</strong></span>');
                        } else {
                            console.log("betweenTimer");
                            betweenTimer();
                        }
                    }
                });
                
            },
            error: function(e) {
                console.log(e.message);
            }
        });
        return false;
    }
});

// 
// Clicking on the pause button
//
// Stop any timer and show button to resume game.
$('#pause_game').on("click", function () {
    if (settings.between) {
        $("#timerbetween").TimeCircles().stop()
    } else {
        $("#timer").TimeCircles().stop();
    }
    
    // Show resume button
    $('#resume_game').show();
    // Hide pause button
    $('#pause_game').hide();
});

// 
// Clicking on the resume button
//
// Resume time, hide resume button and show pause button.
$('#resume_game').on("click", function () {
    if (settings.between) {
        $("#timerbetween").TimeCircles().start()
    } else {
        $("#timer").TimeCircles().start();
    }
    // hide resume button
    $('#resume_game').hide();
    // Show pause button
    $('#pause_game').show();
});

//
// function setOffset
//
// function to get the offset from the Database, used as pointer to obtain the questions, to avoid 
function setOffset() {
    $.ajax({
        type: 'GET',
        url: '/offset',
        dataType: 'json',
        ContentType: 'application/json',
        success: function(offset) {
            settings.offset = offset.offset;
            console.log("settings offset: " + settings.offset);
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

function setTotalQuestions() {
    $.ajax({
        type: 'GET',
        url: '/getTotalQuestions',
        dataType: 'json',
        ContentType: 'application/json',
        success: function(questions) {
            settings.totalQuestions = questions.ques_count;
            console.log("Settings Total questions: " + settings.totalQuestions);
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

/**
 * Create an initial entry for the score
 * @param Number score
 */
function setScore(game_id){
    
    var score_number = 0;

    $.ajax({
        type: 'POST',
        url: '/SaveScore',
        dataType: 'json',
        ContentType: 'application/json',
        data: {'game_id': game_id, 'score_number': score_number},
        success: function(response) {
            //display attempt in answers if right or attempts if wrong    
            if (response[0].success === true){
                $("#score").append('<p>Your score is ' + 0 + '</p>');
            }else{
                $("#score").append('<p>error</p>');
            } 
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

/**
 * Update the player score
 * @param Number score
 */
function updateScore(game_id, score){
    $.ajax({
        type: 'POST',
        url: '/update_score',
        dataType: 'json',
        ContentType: 'application/json',
        data: {'game_id': game_id, 'score': score},
        success: function(response) {
            //display updated score    
            if (response[0].success === true){
                $("#score").empty();
                $("#score").append('<p style="margin-bottom:0px;">Your score is</p><span class="score-number"><strong>' + response[0].new_score + '</strong></span>');
                // Update Leaderboard
                updateLeaderboard();
            }else{
                $("#score").empty();
                $("#score").append('<p>Your score is ' + score + '</p>');
            } 
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

function uniqueAnswer(current_answer, user_answer){
    var i;
    var answerToCheck;
    var notFound = true;
    for (i = 1; i <= current_answer; i++) {
        answerToCheck = $('#answer-' + i).text().trim().toLowerCase();
        console.log("Answer to check: " + answerToCheck);
        console.log("User answer: " + user_answer);
        if (answerToCheck === user_answer.trim().toLowerCase()) {
            notFound = false;
        }
    }
    return notFound;
}

//
// Function updateLeaderboard
// 
// Function to update the leaderboard after the user has answers successfully.
function updateLeaderboard() {
    $.ajax({
        type: 'get',
        url: '/topTen',
        dataType: 'json',
        ContentType: 'application/json',
        success: function(users) {
            if (users.length > 0) {
                $('#leaderboard').remove();
                $('<table class="pure-table pure-table-horizontal" id="leaderboard">'
                                        + '<thead>'
                                        + '<tr>'
                                        + '<th>#</th>'
                                        + '<th>Username</th>'
                                        + '<th>Score</th>'
                                        + '</tr>'
                                        + '</thead>'
                                        + '<tbody id="leaderboard-table-body></tbody>').insertAfter('#high-scores-table-title');
                var i;
                for (i = 0; i < users.length; i++) {
                    if (settings.game_id === users[i].game_id) {
                        $('#leaderboard').append('<tr style="color:#FF8F35"><td>' + (i + 1) +'</td>'
                                                        + '<td>' + users[i].user_nickname + '</td>'
                                                        + '<td>' + users[i].score + '</td></tr>');
                    } else {
                        $('#leaderboard').append('<tr><td>' + (i + 1) +'</td>'
                                                        + '<td>' + users[i].user_nickname + '</td>'
                                                        + '<td>' + users[i].score + '</td></tr>');
                    }
                } 
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    });
    return false;
}

function betweenTimer() {
    var new_round = settings.round + 1;
    $('.question-box').empty();
    if (new_round !== 11){ 
        $('.question-box').append('<span style="color:red"><strong>Get Ready for round ' + new_round + '</strong></span>');
    }else{
        $('.question-box').append('<span style="color:red"><strong>You have completed all 10 rounds!</strong></span>');
    }
    $("#timer").TimeCircles().end();
    $("#timer").TimeCircles().destroy();
    $("#timer").hide();
    console.log("hide timer");
    settings.betweenTimer = true;
    $("#timerbetween").show();
    $("#timerbetween").TimeCircles({use_background: false}); 
    $("#timerbetween").TimeCircles().rebuild();
    $("#timerbetween").TimeCircles().start();
    console.log("start break");
    // Reset current answer
    settings.currentAnswer = 0;
    // Disable answer box
    $('.answer-input').prop('disabled', true);
    // Clean attempts box
    $('.attempt-box').empty();
    // Clean answers box
    $('#correct-answers-box').empty();
    $("#timerbetween").TimeCircles({count_past_zero: false}).addListener(function(unit, value, total){
        //fade timer out when time has run out
        if(total === 0){
            console.log("round finished between");
            $("#timerbetween").TimeCircles().end();
            $("#timerbetween").TimeCircles().destroy();
            $("#timerbetween").hide();
            $("#timer").show();

            // update round
            settings.round = settings.round + 1;
            // Update offset
            settings.offset = settings.offset + 1;
            console.log("CLICK");
            $('#start_game').trigger('click');
            //$("#timer").TimeCircles().start();
            
        }
    });
}

function checkAnswer(user_answer) {
    var proceed = false;
    if (settings.currentAnswer < 10) {
        $.ajax({
            type: 'POST',
            url: '/check_ans',
            dataType: 'json',
            ContentType: 'application/json',
            data: {'question_id': settings.currentQuestion, 'user_answer': user_answer},
            success: function(answer) {
                //display attempt in answers if right or attempts if wrong    
                if (answer.found === false){
                    $(".attempts").append('<div id="false-answer-' + user_answer + '"><i class="fa fa-close" style="font-size:1.5rem; color:#FF3300"></i><span style="color:rgba(255, 51, 0, 0.6); padding-left:0.5rem">' + user_answer + '</span></div>');
                    $("#false-answer-"+ user_answer).effect("pulsate", { times:3 }, 300);
                }else{
                    //check if the answer was not found before
                    if (uniqueAnswer(settings.currentAnswer, answer.actual_answer)) {
                        //calculate answer score
                        var score = countScore(answer.rating);
                        //update score
                        updateScore(settings.game_id, score);
                        //add new answer in the correct answers list
                        settings.currentAnswer = settings.currentAnswer + 1;
                        $(".answers").append('<div id="correct-answer-' + settings.currentAnswer + '" class="correct-answer"><i class="fa fa-check" style="font-size:2rem; color:#00B01D"></i><span id="answer-' + settings.currentAnswer + '" style="color:rgba(0, 176, 29, 0.6); padding-left:0.5rem">' + answer.actual_answer + '</span><span style="color:rgba(0, 176, 29, 0.6); padding-left:0.5rem">...' + score + 'pts</div>');
                        //add bounce effect
                        $("#correct-answer-" + settings.currentAnswer).effect("bounce", { times:3 }, 300);
                        if (settings.currentAnswer === 10) {
                            // All answers covered
                            $(".attempts").append('<div><i class="fa fa-check" style="font-size:2rem; color:#00BF30"></i><span style="color:rgba(0, 191, 48, 0.9); padding-left:0.5rem">You already have 10 answers!</span></div>');
                            $('.answer-input').prop('disabled', true);

                            setTimeout(function () {
                                betweenTimer();
                            }, 1500);
                        }
                    }
                }
                $('.answer-input').val('');
            },
            error: function(e) {
                console.log(e.message);
            }
        });
        return false;
    }
    
}

function countScore(rating) {
    var score = 0;
    switch (rating) {
      case 'low':
        score = 10;
        break;
      case 'medium':
        score = 15;
        break;
      case 'high':
        score = 20;
        break;
    }

    return score;
}

