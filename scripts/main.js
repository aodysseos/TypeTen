function checkAnswer(value, e) {
   console.log(value);
   console.log("yes");
    $.ajax({
        //url: $(this).attr('action'),
        //type: $(this).attr('method'),
        //data: {value: value}
    })
        .success(function (data) {
            console.log("success");
            $(".attempt-box").append('<p>' + $('.answer-input').val() + '</p>');
            //alert('ok');
        })
        .error(function () {
            console.log("error");
            $(".attempt-box").append('<p>' + $('.answer-input').val() + '</p>');

        })
    return false;
}