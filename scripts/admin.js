
function updateAnswer(id) {
    console.log("ID: " + id);
    var tmp = id.split('_');
    var realID = tmp[2];
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

function deleteAnswer(id) {
    console.log("ID: " + id);
    var tmp = id.split('_');
    var realID = tmp[2];
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
        + '<button style="margin-left: 0.3rem" type="button" id="add_answer_' + numberID + '" name="update" class="pure-button pure-button-primary" onClick="addAnswer(this.id)">+</button>'
        + '</div>').insertBefore($('#button_section'));

    $('#' + id).remove();
    console.log("parent: " + parent);
    console.log("add answer id: " + realID);
}

$('#get_answers').on("click", function () {
    console.log("value: " + $("#question_title").val());
    // Disable the button
    //$('#get_answers').prop('disabled', true);
    $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        dataType: 'json',
        ContentType: 'application/json',
        data: $("#question_title").val()
    })
        .success(function (data) {
            alert("ok");
        })
        .error(function () {
            //alert("error");
            var answers = new Array("answer1", "answer2", "answer3");
            $('#question_results').empty();
            //if($("#question_title").val() === "1")
            $('#question_results').append('<div class="pure-form pure-form-aligned" id="form_answers"><div class="pure-control-group"><label for="question">Question:</label><input class="pure-input-2-3" id="question_1" type="text" value="question_title"></div></div>');
            $('#form_answers').append('<div class="pure-control-group"><label for="answer_1">Answer # 1</label><input class="pure-input-1-3" id="answer_1" type="text" value="Answer #1">' 
                + '<select id="difficulty_answer_1" style="margin-left: 0.3rem">'
                + '<option value="low">low</option>'
                + '<option value="medium">medium</option>'
                + '<option value="high">high</option>'
                + '</select>'
                + '<button style="margin-left: 0.3rem" type="button" id="update_answer_1" name="update" class="pure-button pure-button-primary" onClick="updateAnswer(this.id)">Update</button>'
                + '<button style="margin-left: 0.3rem" type="button" id="update_answer_1" name="update" class="pure-button button-error" onClick="deleteAnswer(this.id)">Delete</button>'
                + '</div>');
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