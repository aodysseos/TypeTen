function checkAnswer(user_answer) {
    //get the question id
    var question_id = $('.question').attr("id");    

    $.ajax({
        type: "POST",
        url: '/check_ans',
        dataType: 'json',
        ContentType: 'application/json',
        data: {'question_id': $('.question').attr("id"), 'user_answer': user_answer},
        success: function(answer) {
            //display attempt in answers if right or attempts if wrong    
            if (answer[0].found === 'no'){
                $(".attempt-box").append('<div id="false-answer">' + user_answer + '</div>');
            }else{
                //display the answer and score
                var score = countScore(answer[0].rating);//calculate answer score
                $("#correct-answers-box").append('<div id="correct-answer">'+ answer[0].actual_answer + " " + score + 'pts</div>');
                //update the new score value
                var new_score = adjustScore(score);
                $("#score").append(new_score);
                
            } 
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

    $.ajax({
        type: "POST",
        url: '/SaveScore',
        dataType: 'json',
        ContentType: 'application/json',
        data: {'question_id': $('.question').attr("id"), 'user_answer': user_answer},
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
