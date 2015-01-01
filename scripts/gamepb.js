$( document ).ready(function() {
    console.log( "timer!" );
    $("#timer").TimeCircles({start: false});
    $("#timer").TimeCircles({use_background: false});
    $('.answer-input').prop('disabled', true);
    // Set offset
    setOffset();
    // Set total questions
    setTotalQuestions();
});

//
//
//
function setOffset() {
    $.ajax({
        type: "get",
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
        type: "get",
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
    $('.attempt-box').append('<span style="color:red">Wrong attempts: </span>');
    $('.attempt-box').append('<div class="attempts"></div>');
    // Text for answers box
    $('#correct-answers-box').append('<div style="background-color:#00BF30; color:white">Correct Answers: </span>');
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
                $('.question-box').append('<span style="color:black">Question: </span><span>"' + question.question_content +'"</span>');
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
                    //fade timer out when time has run out
                    if(total === 0){
                        console.log("round finished timer");
                        // Clean div
                        $('.question-box').empty();
                        // Append question
                        $('.question-box').append('<span style="color:red"><strong>Break</strong> for next round.</span>');
                        $("#timer").TimeCircles().end();
                        $("#timer").TimeCircles().destroy();
                        $("#timer").hide();
                        $("#timerbetween").show();
                        $("#timerbetween").TimeCircles({use_background: false}); 
                        $("#timerbetween").TimeCircles().rebuild();
                        //$("#timerbetween").TimeCircles().restart();
                        $("#timerbetween").TimeCircles().start();
                        // Notify of break
                        
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
    //start the timer
    $("#timer").TimeCircles().stop();
});


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

function checkAnswer(user_answer) {
    //get the question id
    var question_id = $('#current-question').attr('name');    
    var current_answer = $('#current-answer').attr('name');
    var proceed = false;
    
    $.ajax({
        type: "POST",
        url: '/check_ans',
        dataType: 'json',
        ContentType: 'application/json',
        data: {'question_id': question_id, 'user_answer': user_answer},
        success: function(answer) {
            console.log(answer);
            //display attempt in answers if right or attempts if wrong    
            if (answer.found === 'no'){
                $(".attempts").append('<div id="false-answer"><i class="fa fa-close" style="font-size:3rem; color:#FF3300"></i><span style="color:rgba(255, 51, 0, 0.6); padding-left:0.5rem">' + user_answer + '</span></div>');
            }else{
                console.log('Answer: ' + answer.actual_answer);
                if (uniqueAnswer(current_answer, answer.actual_answer)) {
                    //display the answer and score
                    var score = countScore(answer.rating);//calculate answer score
                    var new_number_answer = Number(current_answer) + 1;
                    $(".answers").append('<div id="correct-answer-' + new_number_answer + '" class="correct-answer"><i class="fa fa-check" style="font-size:3rem; color:#00B01D"></i><span id="answer-' + new_number_answer + '" style="color:rgba(0, 176, 29, 0.6); padding-left:0.5rem">' + answer.actual_answer + '</span><span style="color:rgba(0, 176, 29, 0.6); padding-left:0.5rem">..."' + score + 'pts</div>');
                    $('#current-answer').attr('name', new_number_answer); 
                    //update the new score value
                    //var new_score = adjustScore(score);
                    //$("#score").append(new_score);
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

    return score
}
/**
 * Calculate the new score of the current player and save it.
 * @param Number score
 */
function adjustScore(score){
    //get the question id
    var question_id = $('#current-question').attr('name');   
    $.ajax({
        type: "POST",
        url: '/SaveScore',
        dataType: 'json',
        ContentType: 'application/json',
        data: {'question_id': question_id, 'user_answer': 'ok'},
        success: function(answer) {
            //display attempt in answers if right or attempts if wrong    
            if (answer[0].found === 'no'){
                $(".attempt-box").append('<div id="false-answer">' + user_answer + '</div>');
            }else{
                var score = countScore(answer[0].rating);//calculate answer score
                var new_score = adjustScore(score);
                $("#score").append(new_score);
                $("#correct-answers-box").append('<div id="correct-answer">'+ answer[0].actual_answer + " " + score + 'pts</div>');
            } 
        },
        error: function(e) {
            console.log(e.message);
        }
    });
    return false;







    var current_score = 0;
    var new_score = current_score + score;
    return new_score;
}

function newRound(current_score){

}
