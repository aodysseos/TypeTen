function getQuestion() {
    $.ajax({
        url: 'random_ques',
        type: 'GET',
        data: 'json',
        success: function(data) {
            var questions = jQuery.parseJSON(data);

            console.log(questions['question_content'] );
            $(".question-box").append('<div id="question">' + questions['question_content'] + '</div>');
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}

function checkAnswer(value, e) {
   
   var answers = [
    {"answer":"right1"}, 
    {"answer":"right2"},  
    {"answer":"right3"}, 
    {"answer":"right4"}, 
    {"answer":"right5"}, 
    {"answer":"right6"}, 
    {"answer":"right7"}, 
    {"answer":"right8"}, 
    {"answer":"right9"}, 
    {"answer":"right10"} 
   ];
   
   console.log(value);
    $.ajax({
        //url: $(this).attr('action'),
        //type: $(this).attr('method'),
        //data: {value: value}
        success: function () {
            
            var correct_answer = false;
            
            for (var key in answers)
            {
                if (answers.hasOwnProperty(key))
                { 
                    var answer = answers[key].answer;
                    var user_input = $('.answer-input').val();
                    //check if use input is correct
                    if (answer != user_input){
                        correct_answer = false;
                    }else{
                        correct_answer = true;
                        break;
                    }     
                }
            }
            if (correct_answer === false){
                $(".attempt-box").append('<div id="false-answer">' + user_input + '</div>');
            }else{
                $("#correct-answers-box").append('<div id="correct-answer">'+ user_input +'</div>');
            }  
            //alert('ok');
        },
        error: function () {
            $(".attempt-box").append('<p>ERROR</p>');
        }

    });
    return false;
}