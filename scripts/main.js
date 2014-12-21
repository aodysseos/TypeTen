function checkAnswer(value, e) {
    alert(value);
    $.ajax({
        //url: $(this).attr('action'),
        //type: $(this).attr('method'),
        data: {value: value}
    })
        .success(function (data) {
            $(".attempt-box").append('<p>' + $('.answer-input').val() + '</p>');
            //alert('ok');
        })
        .error(function () {
            alert("error");

        })
    return false;
}