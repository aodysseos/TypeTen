function checkAnswer(user_answer) {
    //get the question id
    var question_id = $('.question').attr("id");    
    //var user_answer = $('.answer-input').val();
    console.log(question_id);

    $.ajax({
        type: "POST",
        url: '/check_ans',
        dataType: 'json',
        ContentType: 'application/json',
        data: {'question_id': $('.question').attr("id"), 'user_answer': user_answer},
        success: function(answer) {
            
            console.log(answer);

            if (answer[0].found === 'no'){
                $(".attempt-box").append('<div id="false-answer">' + user_answer + '</div>');
            }else{
                var score = countScore(answer[0].rating);
                $("#correct-answers-box").append('<div id="correct-answer">'+ answer[0].actual_answer + " " + score + 'pts</div>');
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
