
function updateAnswer(answer_id, question_id, n) {
    console.log("updateAnswer ID: " + answer_id);
    console.log("updateAnswer question id: " + question_id);
    console.log("updateAnswer answer content: " + $('#' + answer_id).val());
    var number = Number(n);
    var answer_rating = $('#difficulty_answer_' + number).val();
    var answer_content = $('#' + answer_id).val();
    console.log("updateAnswer answer dif: " + answer_rating);
    if (answer_content.trim() === '' || answer_content.trim() === 'undefined') {
        $('#notification_messages').empty().removeAttr('style');
        $('#notification_messages').attr('class', 'pure-alert pure-alert-error');
        $('#notification_messages').append('The answer can\'t be <strong>empty</strong>.');
        $('#notification_messages').fadeOut(3000);
    } else {
        $.ajax({
            type: "POST",
            url: '/answers',
            dataType: 'json',
            ContentType: 'application/json',
            data: {'question_id': question_id, 'answer_id': answer_id, 'answer_content': answer_content, 'answer_rating': answer_rating}
        })
            .success(function (data) {
                alert("ok");
                console.log(data);
                if (data.success) {
                    $('#notification_messages').empty().removeAttr('style');
                    $('#notification_messages').attr('class', 'pure-alert pure-alert-success');
                    $('#notification_messages').append(data.message);
                    $('#notification_messages').fadeOut(3000);
                    $('#get_answers').trigger('click');
                }
            })
            .error(function () {
                alert("error");
            })
        return false;
    }

    /*
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
    */
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
// Function createAnswer
// 
// Function to create a new answer for an existing question.
function createAnswer(numberId, questionId) {
    var number = Number(numberId);
    console.log('question id: ' + questionId);
    var answer_content = $('#answer_value_' + number).val();
    var answer_rating = $('#difficulty_answer_' + number).val();
    console.log('new answer value: ' + answer_content);
    console.log('new answer dif: ' + answer_rating);
    if (answer_content.trim() === '' || answer_content.trim() === 'undefined') {
        $('#notification_messages').empty().removeAttr('style');
        $('#notification_messages').attr('class', 'pure-alert pure-alert-error');
        $('#notification_messages').append('The <strong>new </strong>answer can\'t be empty.');
        $('#notification_messages').fadeOut(3000);
    } else {
        $.ajax({
            type: "POST",
            url: '/answers',
            dataType: 'json',
            ContentType: 'application/json',
            data: {'question_id': questionId, 'answer_content': answer_content, 'answer_rating': answer_rating}
        })
            .success(function (data) {
                alert("ok");
                console.log(data);
                if (data.success) {
                    $('#notification_messages').empty().removeAttr('style');
                    $('#notification_messages').attr('class', 'pure-alert pure-alert-success');
                    $('#notification_messages').append(data.message);
                    $('#notification_messages').fadeOut(3000);
                    $('#get_answers').trigger('click');
                }
                //$('#answer_' + realID).parent().remove();
            })
            .error(function () {
                alert("error");
                
            })
        return false;
    }
    
}

//
// function to create a new answer input for an existing question
//

function addAnswerExistingQuestion(id, questionId) {
    console.log("ID: " + id);
    var tmp = id.split('_');
    var realID = tmp[2];
    var numberID = Number(realID) + 1;
    $('#answer_results_' +  Number(realID)).after('<div id="answer_results_' + numberID + '" class="pure-control-group">'
        + '<label for="answer_' + numberID + '">Answer # ' + numberID + '</label><input id="answer_value_' + numberID + '" class="pure-input-1-3" type="text" placeholder="New answer">' 
        + '<select id="difficulty_answer_' + numberID + '" style="margin-left: 0.3rem">'
        + '<option value="low">low</option>'
        + '<option value="medium">medium</option>'
        + '<option value="high">high</option>'
        + '</select>'
        + '<button style="margin-left: 0.3rem" type="button" id="create_answer' + numberID + '" name="create" class="pure-button pure-button-primary" onClick="createAnswer(' + numberID + ',' + questionId + ')">New answer</button>'
        + '<button style="margin-left: 0.3rem" type="button" id="add_answer_' + numberID + '" name="update" class="pure-button pure-button-primary" onClick="addAnswerExistingQuestion(this.id)"><i class="fa fa-plus"></i></button></div>');

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
            var flagten = false;
            var question_id = $("#question_title").val();
            $('#question_results').empty();
            $('#question_results').append('<form class="pure-form pure-form-aligned" id="form_answers">'
                                            + '<div class="pure-control-group">'
                                            + '<label for="question">Question:</label><input class="pure-input-2-3" id="' + $("#question_title").val() + '" type="text" value="' + $('#question_title').find(":selected").text() + '">'
                                            + '<button style="margin-left: 0.3rem" type="button" id="update_question_1" name="update" class="pure-button pure-button-primary" onClick="updateQuestion(this.id,' + question_id + ')">Update</button>'
                                            + '<button style="margin-left: 0.3rem" type="button" id="delete_question_1" name="update" class="pure-button button-error" onClick="deleteQuestion(this.id, true)">Delete</button>'
                                            + '</div>'
                                            + '</form>');
            
            for (i = 0; i < data.length; i++) {
                 $('#form_answers').append('<div id="answer_results_' + n + '" class="pure-control-group">'
                    + '<label for="answer_' + n + '">Answer # ' + n + '</label><input class="pure-input-1-3" id="'+ data[i].answer_id + '" type="text" value="' + data[i].answer_content + '">' 
                    + '<select id="difficulty_answer_' + n + '" style="margin-left: 0.3rem"></select>');

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
                if (data.length < 10) {
                    $('#difficulty_answer_' + n).after('<button style="margin-left: 0.3rem" type="button" id="update_answer_' + n + '" name="update" class="pure-button pure-button-primary" onClick="updateAnswer(' + data[i].answer_id + ', ' + question_id + ', ' + n + ')">Update</button>');
                } else {
                    $('#difficulty_answer_' + n).after('<button style="margin-left: 0.3rem" type="button" id="update_answer_' + n + '" name="update" class="pure-button pure-button-primary" onClick="updateAnswer(' + data[i].answer_id + ', ' + question_id + ', ' + n + ')">Update</button>'
                                            + '<button style="margin-left: 0.3rem" type="button" id="delete_answer_' + n + '" name="update" class="pure-button button-error" onClick="deleteAnswer(this.id, false)">Delete</button>');
                    flagten = true;
                }
                
                 n++;
            }
            if (flagten) {
                $('#delete_answer_' + (n - 1)).after('<button style="margin-left: 0.3rem" type="button" id="add_answer_' + (n - 1) + '" name="update" class="pure-button pure-button-primary" onClick="addAnswerExistingQuestion(this.id,' + question_id + ')"><i class="fa fa-plus"></i></button></div>');
            } else {
                $('#update_answer_' + (n - 1)).after('<button style="margin-left: 0.3rem" type="button" id="add_answer_' + (n - 1) + '" name="update" class="pure-button pure-button-primary" onClick="addAnswerExistingQuestion(this.id,' + question_id + ')"><i class="fa fa-plus"></i></button></div>');
            }
            
           
        })
        .error(function () {
            //alert("error");
        })
    return false;
});

//
// Send data of the new question to the back end
//
$('#create_new_question').on("click", function() {
    console.log("click");
    var tmp = $('#form_new_question').serialize();
    var split_obj = tmp.split('&');
    var i;
    var value;
    var empty = false;
    for (i = 0; i < split_obj.length; i++) {
        value = split_obj[i].split('=');
        if (value[1].trim().toLowerCase() === '') {
            console.log("vacio");
            empty = true;
            break;
        } else {
            console.log("no vacio");
        }
    }
    if (empty) {
        $('#notification_messages').empty().removeAttr('style');
        $('#notification_messages').attr('class', 'pure-alert pure-alert-error');
        $('#notification_messages').append('<strong>Missing fields</strong>. All fields must have a value before submitting.');
        $('#notification_messages').fadeOut(3000);
    } else {
        $('#notification_messages').attr('class', '');
        console.log(JSON.stringify($('#form_new_question').serializeArray()));
        console.log('length: ' + $('#form_new_question').serializeArray().length);
        var actual = Number(($('#form_new_question').serializeArray().length - 1) / 2);
        console.log('actual ' + actual);
        if (actual < 10) {
            $('#notification_messages').empty().removeAttr('style');
            $('#notification_messages').attr('class', 'pure-alert pure-alert-error');
            $('#notification_messages').append('The question must contain at least <strong>10 answers </strong>.');
            $('#notification_messages').fadeOut(3000);
        } else {
            $.ajax({
                type: "POST",
                url: '/completeQuestion',
                dataType: 'json',
                ContentType: 'application/json',
                data: $('#form_new_question').serialize()
            })
                .success(function (data) {
                    console.log(data);
                    console.log(data.success);
                    console.log(data['success']);
                    if (data[0].success) {
                        console.log('print message');
                        $('#notification_messages').empty().removeAttr('style');
                        $('#notification_messages').attr('class', 'pure-alert pure-alert-success');
                        $('#notification_messages').append(data[0].message);
                        $('#notification_messages').fadeOut(3000);
                        $('#form_new_question').trigger('reset');

                    }
                    //$('#answer_' + realID).parent().remove();
                })
                .error(function () {
                    alert("error");
                    
                })
            return false;
        }
    }
    
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

$('#get_answers_refresh').on('click', function() {
    location.reload();
});