
//
// Function updateAnswer
//
// Function to update an answer that belongs to an specific question. It receives the next parameters:
// answer_id: id of the answer.
// question_id: id of the question.
// n: number of the element. For example: answer # 2 has the id of the dropdown is difficulty_answer_2
function updateAnswer(answer_id, question_id, n) {
    console.log("updateAnswer ID: " + answer_id);
    console.log("updateAnswer question id: " + question_id);
    console.log("updateAnswer answer content: " + $('#' + answer_id).val());
    var number = Number(n);
    // Get the difficulty value
    var answer_rating = $('#difficulty_answer_' + number).val();
    // Get the content or text of the answer
    var answer_content = $('#' + answer_id).val();
    console.log("updateAnswer answer dif: " + answer_rating);
    // Check that the answer is not empty
    if (answer_content.trim() === '' || answer_content.trim() === 'undefined') {
        // If its empty, display an error message
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
            data: {'question_id': question_id, 'answer_id': answer_id, 'answer_content': answer_content, 'answer_rating': answer_rating},
            success: function(data) {
               console.log(data);
                // If data.success = true, display the success message.
                if (data.success) {
                    $("form#form_answers :input").prop("disabled", true);
                    $("form#form_answers :button").prop("disabled", true);
                    $('#notification_messages').empty().removeAttr('style');
                    $('#notification_messages').attr('class', 'pure-alert pure-alert-success');
                    $('#notification_messages').append(data.message);
                    $('#notification_messages').fadeOut(3000);
                    $('#get_answers').trigger('click');
                }
            },
            error: function(e) {
                console.log(e.message);
            }
        });
        return false;
    }
}

//
// Function updateQuestion
//
// Function to update the question content. It receives one parameter:
// question_id: id of the question.
function updateQuestion(question_id) {
    console.log("updateAnswer question id: " + question_id);
    console.log("updateAnswer question content: " + $('#' + question_id).val());
    // Get the content value for the question
    var question_content = $('#' + question_id).val();
    // Check that the question content is not empty
    if (question_content.trim() === '' || question_content.trim() === 'undefined') {
        // If it is empty, display an error message. Otherwise, communicate with the server.
        $('#notification_messages').empty().removeAttr('style');
        $('#notification_messages').attr('class', 'pure-alert pure-alert-error');
        $('#notification_messages').append('The question can\'t be <strong>empty</strong>.');
        $('#notification_messages').fadeOut(3000);
    } else {
        $.ajax({
            type: "POST",
            url: '/questions',
            dataType: 'json',
            ContentType: 'application/json',
            data: {'question_id': question_id, 'question_content': question_content},
            success: function(data) {
                console.log(data);
                // If in the response the data.success = true, display a success notification message.
                if (data.success) {
                    $("form#form_answers :input").prop("disabled", true);
                    $("form#form_answers :button").prop("disabled", true);
                    $('#notification_messages').empty().removeAttr('style');
                    $('#notification_messages').attr('class', 'pure-alert pure-alert-success');
                    $('#notification_messages').append(data.message);
                    $('#notification_messages').fadeOut(3000);
                    $('#get_answers').trigger('click');
                }
            },
            error: function(e) {
                console.log(e.message);
            }
        });
        return false;
    }
}

//
// Function deleteAnswer
//
// Function to delete an answer from the list. It receives one argument:
// answer_id: id of the answer.
function deleteAnswer(answer_id) {
    // Communicate with the back end to delete the answer, sending the answer id.
    $.ajax({
        type: "POST",
        url: '/removeAnswer',
        dataType: 'json',
        ContentType: 'application/json',
        data: {'answer_id': answer_id},
        success: function(data) {
            // If in the response the data.success = true, display a success notification message.
            console.log(data);
            if (data.success) {
                $("form#form_answers :input").prop("disabled", true);
                $("form#form_answers :button").prop("disabled", true);
                $('#notification_messages').empty().removeAttr('style');
                $('#notification_messages').attr('class', 'pure-alert pure-alert-success');
                $('#notification_messages').append(data.message);
                $('#notification_messages').fadeOut(3000);
                $('#get_answers').trigger('click');
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    });
    return false;
}

//
// Function deleteQuestion
// Function to delete a question, including its answers. It receives one argument:
// question_id: id of the question.
function deleteQuestion(question_id) {
    // Communicate with the back end to delete the question, sending the question id.
    $.ajax({
        type: "POST",
        url: '/removeQuestion',
        dataType: 'json',
        ContentType: 'application/json',
        data: {'question_id': question_id},
        success: function(data) {
            // If in the response the data.success = true, display a success notification message.
            console.log(data);
            if (data.success) {
                $("form#form_answers :input").prop("disabled", true);
                $("form#form_answers :button").prop("disabled", true);
                $('#notification_messages').empty().removeAttr('style');
                $('#notification_messages').attr('class', 'pure-alert pure-alert-success');
                $('#notification_messages').append(data.message);
                $('#notification_messages').fadeOut(2500);
                setTimeout( function() { 
                                $('#get_answers_refresh').trigger('click');
                            }
                , 2000);
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    });
    return false;
}

//
// Function addAnswer
//
// Function to add more nodes/inputs to the form when clicking on the + button in the "New question" section.
// It receives one argument:
// id: id of the button, used to obtain the number at the end.
function addAnswer(id) {
    var tmp = id.split('_');
    // Get number from the id.
    var realID = tmp[2];
    var numberID = Number(realID) + 1;
    // Add the nodes to the form.
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

    // Remove + button. + button must be only next to the last input (added in the lines above).
    $('#' + id).remove();
    console.log("parent: " + parent);
    console.log("add answer id: " + realID);
}

//
// Function createAnswer
// 
// Function to create a new answer for an existing question. It receives two arguments:
// numberId: number from the id.
// questionId: id of the question.
function createAnswer(numberId, questionId) {
    var number = Number(numberId);
    console.log('question id: ' + questionId);
    // Get answer content.
    var answer_content = $('#answer_value_' + number).val();
    // Get answer difficulty.
    var answer_rating = $('#difficulty_answer_' + number).val();
    console.log('new answer value: ' + answer_content);
    console.log('new answer dif: ' + answer_rating);
    // Check that the answer content is not empty. In case that its empty display an error message. Otherwise, communicate with the server.
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
            data: {'question_id': questionId, 'answer_content': answer_content, 'answer_rating': answer_rating},
            success: function(data) {
                console.log(data);
                // If in the response the data.success = true, display a success notification message.
                if (data.success) {
                    $('#notification_messages').empty().removeAttr('style');
                    $('#notification_messages').attr('class', 'pure-alert pure-alert-success');
                    $('#notification_messages').append(data.message);
                    $('#notification_messages').fadeOut(3000);
                    $('#get_answers').trigger('click');
                }
                //$('#answer_' + realID).parent().remove();
            },
            error: function(e) {
                console.log(e.message);
            }
        });
        return false;
    }
}

//
// Function addAnswerExistingQuestion
// 
// Function to create a new answer input for an existing question. It receives two arguments:
// id: id of the button, used to obtain the number at the end.
// questionId: id of the question
function addAnswerExistingQuestion(id, questionId) {
    console.log("ID: " + id);
    var tmp = id.split('_');
    var realID = tmp[2];
    var numberID = Number(realID) + 1;
    // Add new nodes to the form.
    $('#answer_results_' +  Number(realID)).after('<div id="answer_results_' + numberID + '" class="pure-control-group">'
        + '<label for="answer_' + numberID + '">Answer # ' + numberID + '</label><input id="answer_value_' + numberID + '" class="pure-input-1-3" type="text" placeholder="New answer">' 
        + '<select id="difficulty_answer_' + numberID + '" style="margin-left: 0.3rem">'
        + '<option value="low">low</option>'
        + '<option value="medium">medium</option>'
        + '<option value="high">high</option>'
        + '</select>'
        + '<button style="margin-left: 0.3rem" type="button" id="create_answer' + numberID + '" name="create" class="pure-button pure-button-primary" onClick="createAnswer(' + numberID + ',' + questionId + ')">New answer</button>'
        + '<button style="margin-left: 0.3rem" type="button" id="add_answer_' + numberID + '" name="update" class="pure-button pure-button-primary" onClick="addAnswerExistingQuestion(this.id)"><i class="fa fa-plus"></i></button></div>');

    // Remove + button. + button must be only next to the last input (added in the lines above).
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
        data: $("#question_title").val(),
        success: function(data) {
            console.log(data);
            console.log(data[0].answer_id);
            var n = 1;
            var i;
            var flagten = false;
            var question_id = $("#question_title").val();
            // Add nodes to the div to display the information.
            $('#question_results').empty();
            $('#question_results').append('<form class="pure-form pure-form-aligned" id="form_answers">'
                                            + '<div class="pure-control-group">'
                                            + '<label for="question">Question:</label><input class="pure-input-2-3" id="' + $("#question_title").val() + '" type="text" value="' + $('#question_title').find(":selected").text() + '">'
                                            + '<button style="margin-left: 0.3rem" type="button" id="update_question_1" name="update" class="pure-button pure-button-primary" onClick="updateQuestion(' + $("#question_title").val() + ')">Update</button>'
                                            + '<button style="margin-left: 0.3rem" type="button" id="delete_question_1" name="update" class="pure-button button-error" onClick="deleteQuestion(' + $("#question_title").val() + ')">Delete</button>'
                                            + '</div>'
                                            + '</form>');

            // Loop to retrieve all the answers.
            for (i = 0; i < data.length; i++) {
                $('#form_answers').append('<div id="answer_results_' + n + '" class="pure-control-group">'
                                        + '<label for="answer_' + n + '">Answer # ' + n + '</label><input class="pure-input-1-3" id="'+ data[i].answer_id + '" type="text" value="' + data[i].answer_content + '">' 
                                        + '<select id="difficulty_answer_' + n + '" style="margin-left: 0.3rem"></select>');

                if (data[i].answer_difficulty.toLowerCase() === 'low') {
                $('#difficulty_answer_' + n).append('<option value="low" selected>low</option>'
                                                    + '<option value="medium">medium</option>'
                                                    + '<option value="high">high</option>');
                } else if (data[i].answer_difficulty.toLowerCase() === 'medium') {
                $('#difficulty_answer_' + n).append('<option value="low">low</option>'
                                                    + '<option value="medium" selected>medium</option>'
                                                    + '<option value="high">high</option>');
                } else if (data[i].answer_difficulty.toLowerCase() === 'high') {
                $('#difficulty_answer_' + n).append('<option value="low">low</option>'
                                                    + '<option value="medium" >medium</option>'
                                                    + '<option value="high" selected>high</option>');
                }
                // There must be at least 11 answers to be able to delete. Everyquestion must have, at least, 10 answers.
                if (data.length <= 10) {
                    $('#difficulty_answer_' + n).after('<button style="margin-left: 0.3rem" type="button" id="update_answer_' + n + '" name="update" class="pure-button pure-button-primary" onClick="updateAnswer(' + data[i].answer_id + ', ' + question_id + ', ' + n + ')">Update</button>');
                } else {
                    $('#difficulty_answer_' + n).after('<button style="margin-left: 0.3rem" type="button" id="update_answer_' + n + '" name="update" class="pure-button pure-button-primary" onClick="updateAnswer(' + data[i].answer_id + ', ' + question_id + ', ' + n + ')">Update</button>'
                                            + '<button style="margin-left: 0.3rem" type="button" id="delete_answer_' + n + '" name="update" class="pure-button button-error" onClick="deleteAnswer(' + data[i].answer_id + ')">Delete</button>');
                    flagten = true;
                }
                
                 n++;
            }
            if (flagten) {
                $('#delete_answer_' + (n - 1)).after('<button style="margin-left: 0.3rem" type="button" id="add_answer_' + (n - 1) + '" name="update" class="pure-button pure-button-primary" onClick="addAnswerExistingQuestion(this.id,' + question_id + ')"><i class="fa fa-plus"></i></button></div>');
            } else {
                $('#update_answer_' + (n - 1)).after('<button style="margin-left: 0.3rem" type="button" id="add_answer_' + (n - 1) + '" name="update" class="pure-button pure-button-primary" onClick="addAnswerExistingQuestion(this.id,' + question_id + ')"><i class="fa fa-plus"></i></button></div>');
            }
        },
        error: function(e) {
            console.log(e.message);
        }
    });
    return false;
});

//
// Send data of the new question, from the form found in "New question" section, to the server.
//
$('#create_new_question').on("click", function() {
    console.log("click");
    $("button#create_new_question").prop("disabled", true);
    var tmp = $('#form_new_question').serialize();
    var split_obj = tmp.split('&');
    var i;
    var value;
    var empty = false;
    // Check that there are not empty fields in the serialized data.
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
    // If one field is empty display an error message.
    if (empty) {
        $('#notification_messages').empty().removeAttr('style');
        $('#notification_messages').attr('class', 'pure-alert pure-alert-error');
        $('#notification_messages').append('<strong>Missing fields</strong>. All fields must have a value before submitting.');
        $('#notification_messages').fadeOut(3000);
        $("button#create_new_question").prop("disabled", false);
    } else {
        $('#notification_messages').attr('class', '');
        console.log(JSON.stringify($('#form_new_question').serializeArray()));
        console.log('length: ' + $('#form_new_question').serializeArray().length);
        var actual = Number(($('#form_new_question').serializeArray().length - 1) / 2);
        console.log('actual ' + actual);
        // If there are less than 10 answers, display error message. Otherwise, communicate with the server.
        if (actual < 10) {
            $('#notification_messages').empty().removeAttr('style');
            $('#notification_messages').attr('class', 'pure-alert pure-alert-error');
            $('#notification_messages').append('The question must contain at least <strong>10 answers </strong>.');
            $('#notification_messages').fadeOut(3000);
            $("button#create_new_question").prop("disabled", false);
        } else {
            // Send data to the server.
            $.ajax({
                type: "POST",
                url: '/completeQuestion',
                dataType: 'json',
                ContentType: 'application/json',
                data: $('#form_new_question').serialize(),
                success: function(data) {

                    console.log(data);
                    // Display success notification message.
                    if (data[0].success) {
                        console.log('print message');
                        $('#notification_messages').empty().removeAttr('style');
                        $('#notification_messages').attr('class', 'pure-alert pure-alert-success');
                        $('#notification_messages').append(data[0].message);
                        $('#notification_messages').fadeOut(3000);
                        $("button#create_new_question").prop("disabled", false);
                        $('#form_new_question').trigger('reset');

                    }
                    //$('#answer_' + realID).parent().remove();
                },
                error: function(e) {
                    console.log(e.message);
                    $("button#create_new_question").prop("disabled", false);
                }
            });
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