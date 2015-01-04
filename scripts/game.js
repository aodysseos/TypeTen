
$( document ).ready(function() {
    //set timer
    $("#timer").TimeCircles({start: false});
    $("#timer").TimeCircles({use_background: false});
    $('.answer-input').prop('disabled', true);
    //set score
    var username = $("#username").attr('value');
    var game_id = username + $.now();
    $("#username").attr('value', game_id);
    setScore(game_id);
    //set offset
    setOffset();
    //set total questions
    setTotalQuestions();
});

$('#start_game').on("click", function () {
    $("#start_game").prop("disabled", true);
    // Get offset.
    var offset = $('#offset').attr('name');
    console.log("Offset: " + offset);
    // Get round
    var round = $('#round').attr('name');
    // Get total questions
    var totalQuestions = $('#total-questions').attr('name');
    // Text for attempt box
    $('.attempt-box').append('<span style="color:red">Wrong attempts</span>');
    $('.attempt-box').append('<div class="attempts"></div>');
    // Text for answers box
    $('#correct-answers-box').append('<div class="answers"></div>');
    if (Number(round) <= totalQuestions) {
        // Get question
        $.ajax({
            type: "get",
            url: '/getQuestion',
            dataType: 'json',
            ContentType: 'application/json',
            data: {'offset': offset},
            success: function(question) {
                console.log(question);
                // update current question
                $('#current-question').attr('name', '' + question.question_id);
                // Clean div
                $('.question-box').empty();
                // Append question
                $('.question-box').append('<span>' + question.question_content +'</span>');
                // Enable answer box
                $('.answer-input').prop('disabled', false);
                //start the timer
                $("#timer").TimeCircles({use_background: false}); 
                $("#timer").TimeCircles().rebuild();
                //$("#timer").TimeCircles().restart();
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
                        console.log("Round: " + round + " tota Questions: " + totalQuestions);
                        // Final round - game ended
                        if (Number(round) === totalQuestions) {
                            $('.question-box').append('<span style="color:red"><strong>Game has ended. Thanks for playing.</strong></span>');
                        } else {
                            // Append question
                            var new_round = Number(round) + 1;
                            if (new_round !== 11){ 
                                $('.question-box').append('<span style="color:red"><strong>Get Ready for round ' + new_round + '</strong></span>');
                            }else{
                                $('.question-box').append('<span style="color:red"><strong>You have completed all 10 rounds!</strong></span>');
                            }
                            $("#timer").TimeCircles().end();
                            $("#timer").TimeCircles().destroy();
                            $("#timer").hide();
                            $("#timerbetween").show();
                            $("#timerbetween").TimeCircles({use_background: false}); 
                            $("#timerbetween").TimeCircles().rebuild();
                            //$("#timerbetween").TimeCircles().restart();
                            $("#timerbetween").TimeCircles().start();
                            // Notify of break
                            
                            // Reset current answer
                            $('#current-answer').attr('name', '0');
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
                                    //$('#round').removeAttr('name');
                                    $('#round').attr('name', '' + (Number(round) + 1));
                                    // Update offset
                                    $('#offset').attr('name', '' + (Number(offset) + 1));
                                    console.log("CLICK");
                                    $('#start_game').trigger('click');
                                    //$("#timer").TimeCircles().start();
                                    
                                }
                            });
                        }
                        
                        //$("#timer").TimeCircles().start();
                        
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

$('#pause_game').on("click", function () {
    // stop timers
    $("#timer").TimeCircles().stop();
    $("#timerbetween").TimeCircles().stop()
    // Show resume button
    $('#resume_game').show();
    // Hide pause button
    $('#pause_game').hide();
});

$('#resume_game').on("click", function () {
    // stop timers
    $("#timer").TimeCircles().start();
    $("#timerbetween").TimeCircles().start()
    // hide resume button
    $('#resume_game').hide();
    // Show pause button
    $('#pause_game').show();
});

//
//
//
function setOffset() {
    $.ajax({
        type: 'GET',
        url: '/offset',
        dataType: 'json',
        ContentType: 'application/json',
        success: function(offset) {
            offset = offset.offset;
            console.log(offset);
            $('#offset').attr('name', offset);
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
            console.log(questions.ques_count);
            $('#total-questions').attr('name', questions.ques_count);
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
                var game_id = $("#username").attr('value');
                for (i = 0; i < users.length; i++) {
                    if (game_id === users[i].game_id) {
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

function checkAnswer(user_answer) {
    //get the question id
    var question_id = $('#current-question').attr('name');    
    var current_answer = $('#current-answer').attr('name');
    var proceed = false;
    if (current_answer < 10) {
        $.ajax({
            type: 'POST',
            url: '/check_ans',
            dataType: 'json',
            ContentType: 'application/json',
            data: {'question_id': question_id, 'user_answer': user_answer},
            success: function(answer) {
                //display attempt in answers if right or attempts if wrong    
                if (answer.found === false){
                    $(".attempts").append('<div id="false-answer"><i class="fa fa-close" style="font-size:3rem; color:#FF3300"></i><span style="color:rgba(255, 51, 0, 0.6); padding-left:0.5rem">' + user_answer + '</span></div>');
                }else{
                    //check if the answer was not found before
                    if (uniqueAnswer(current_answer, answer.actual_answer)) {
                        //calculate answer score
                        var score = countScore(answer.rating);
                        // get game id
                        var game_id = $("#username").attr('value');
                        //update score
                        updateScore(game_id, score);
                        //add new answer in the correct answers list
                        var new_number_answer = Number(current_answer) + 1;
                        $(".answers").append('<div id="correct-answer-' + new_number_answer + '" class="correct-answer"><i class="fa fa-check" style="font-size:3rem; color:#00B01D"></i><span id="answer-' + new_number_answer + '" style="color:rgba(0, 176, 29, 0.6); padding-left:0.5rem">' + answer.actual_answer + '</span><span style="color:rgba(0, 176, 29, 0.6); padding-left:0.5rem">...' + score + 'pts</div>');
                        //add bounce effect
                        $("#correct-answer-" + new_number_answer).effect("bounce", { times:3 }, 300);
                        $('#current-answer').attr('name', new_number_answer);
                        if (new_number_answer === 10) {
                            // All answers covered
                            $(".attempts").append('<div><i class="fa fa-check" style="font-size:3rem; color:#00BF30"></i><span style="color:rgba(0, 191, 48, 0.9); padding-left:0.5rem">You already have 10 answers!</span></div>');
                            $('.answer-input').prop('disabled', true);
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

