
function updateAnswer(id, question) {
    console.log("ID: " + id);
    console.log("question param: " + question)
    var tmp = id.split('_');
    var realID = tmp[2];
    if (question) {
        var questionValue = $('#question_' + realID).val();y
        if (questionValue.trim().length > 0) {
            $.ajax({
                type: "POST",
                //url: // to define
                dataType: 'json',
                ContentType: 'application/json',
                data: {questionID: realID, question: questionValue}
            })
                .success(function (data) {
                    alert("ok");
                })
                .error(function () {
                    alert("error");
                })
            return false;
        }
    } else {
        var answer = $('#answer_'+ realID).val();
        var difficulty = $('#difficulty_answer_' + realID).val()
        console.log(realID);
        console.log(answer);
        console.log(difficulty);
        if (answer.trim().length > 0) {
            $.ajax({
                type: "POST",
                //url: // to define
                dataType: 'json',
                ContentType: 'application/json',
                data: {answer_id: realID, answer: answer}
            })
                .success(function (data) {
                    alert("ok");
                })
                .error(function () {
                    alert("error");
                })
            return false;
        }    
    }
}

function deleteAnswer (id, question) {
    console.log("ID: " + id);
    var tmp = id.split('_');
    var realID = tmp[2];
    if (question) {
        $.ajax({
            type: "POST",
            //url: // to define
            dataType: 'json',
            ContentType: 'application/json',
            data: {questionID: realID}
        })
            .success(function (data) {
                alert("ok");
                //$('#question_' + realID).parent().parent().empty();
            })
            .error(function () {
                alert("error");

            })
        return false;
    } else {
        $.ajax({
            type: "POST",
            //url: // to define
            dataType: 'json',
            ContentType: 'application/json',
            data: {answer_id: realID}
        })
            .success(function (data) {
                alert("ok");
                //$('#answer_' + realID).parent().remove();
            })
            .error(function () {
                alert("error");
                
            })
        return false;
    }
    
}

function addAnswer(id) {
    var tmp = id.split('_');
    var realID = tmp[2];
    var numberID = Number(realID) + 1;
    $('<div class="pure-control-group">'
        + '<label for="answer_'+ numberID +'">Answer # ' + numberID + '</label>'
        + '<input class="pure-input-1-3" id="answer_' + numberID + '" name="answer_' + numberID + '" type="text" placeholder="Answer #' + numberID + '">'
        + '<select id="new_difficulty_answer_'+ numberID + '" name="new_difficulty_answer_'+ numberID + '" style="margin-left: 0.3rem">'
        + '<option value="low">low</option>'
        + '<option value="medium">medium</option>'
        + '<option value="high">high</option>'
        + '</select>'
        + '<button style="margin-left: 0.3rem" type="button" id="add_answer_' + numberID + '" name="update" class="pure-button pure-button-primary" onClick="addAnswer(this.id)"><i class="fa fa-plus"></i></button>'
        + '</div>').insertBefore($('#button_section'));

    $('#' + id).remove();
    console.log("parent: " + parent);
    console.log("add answer id: " + realID);
}

//
// Get answers for a given question ID
//
$('#get_answers').on("click", function () {
    console.log("value: " + $("#question_title").val());
    // Disable the button
    //$('#get_answers').prop('disabled', true);
    console.log("url: " + $(this).attr('action'));
    $.ajax({
        url: '/answers?question_id=' + $("#question_title").val(),
        type: 'get',
        dataType: 'json',
        ContentType: 'application/json',
        data: $("#question_title").val()
    })
        .success(function (data) {
            console.log(data);
            console.log(data[0].answer_id);
            var n = 1;
            var i;
            $('#question_results').empty();
            $('#question_results').append('<form class="pure-form pure-form-aligned" id="form_answers">'
                                            + '<div class="pure-control-group">'
                                            + '<label for="question">Question:</label><input class="pure-input-2-3" id="' + $("#question_title").val() + '" type="text" value="' + $('#question_title').find(":selected").text() + '">'
                                            + '<button style="margin-left: 0.3rem" type="button" id="update_question_1" name="update" class="pure-button pure-button-primary" onClick="updateAnswer(this.id, true)">Update</button>'
                                            + '<button style="margin-left: 0.3rem" type="button" id="delete_question_1" name="update" class="pure-button button-error" onClick="deleteAnswer(this.id, true)">Delete</button>'
                                            + '</div>'
                                            + '</form>');
            
            for (i = 0; i < data.length; i++) {
                 $('#form_answers').append('<div id="answer_results" class="pure-control-group">'
                    + '<label for="answer_1">Answer # ' + n + '</label><input class="pure-input-1-3" id="'+ data[i].answer_id + '" type="text" value="' + data[i].answer_content + '">' 
                    + '<select id="difficulty_answer_' + n + '" style="margin-left: 0.3rem"></select></div>');

                 if (data[i].answer_difficulty.toLowerCase() === 'low') {
                    $('#difficulty_answer_' + n).append('<option value="low" selected>low</option>'
                                                        + '<option value="medium">medium</option>'
                                                        + '<option value="high">high</option>');
                 }
                 else if (data[i].answer_difficulty.toLowerCase() === 'medium') {
                    $('#difficulty_answer_' + n).append('<option value="low">low</option>'
                                                        + '<option value="medium" selected>medium</option>'
                                                        + '<option value="high">high</option>');
                 }
                 else if (data[i].answer_difficulty.toLowerCase() === 'high') {
                    $('#difficulty_answer_' + n).append('<option value="low">low</option>'
                                                        + '<option value="medium" >medium</option>'
                                                        + '<option value="high" selected>high</option>');
                 }
                
                $('#difficulty_answer_' + n).after('<button style="margin-left: 0.3rem" type="button" id="update_answer_1" name="update" class="pure-button pure-button-primary" onClick="updateAnswer(this.id, false)">Update</button>'
                                            + '<button style="margin-left: 0.3rem" type="button" id="delete_answer_1" name="update" class="pure-button button-error" onClick="deleteAnswer(this.id, false)">Delete</button>');
                 n++;
            }
           
        })
        .error(function () {
            //alert("error");
        });
    return false;
});

$('#create_new_question').on("click", function () {
    alert($('#form_new_question').serialize());
});

$('#check_questions').on("click", function () {
    $('#questions').show();
    $('#new_question_result').hide();
    
});

$('#new_question').on("click", function () {
    $('#new_question_result').show();
    $('#questions').hide();
    $('#question_results').empty();
    
});

$('#question_title').on('change', function() {
    $('#question_results').empty();
});