
(function($){
	$(document).ready(function(){
		$.ajax({
	        url: 'random_ques',
	        type: 'GET',
	        data: 'json',
	        success: function(data) {
	        	initilize();
	        	var question = jQuery.parseJSON(data);
	        	//load the question
	            $(".question-box").append('<div id="' + question[0].question_id + '" class="question">' + question[0].question_content + '</div>');
	 
				 //start the timer
				$("#timer").TimeCircles({count_past_zero: false}).addListener(function(unit,value,total){
					//turn colour orange on 30 seconds remaining
					if(total==30){
						$("#timer").TimeCircles({ time: {Seconds: { color: "#e5a960" }}});
				    }
					//turn colour red on 15 seconds remaining
					if(total==15){
						$("#timer").TimeCircles({ time: {Seconds: { color: "#db6767" }}});
				    }
				    //fade timer out when time has run out
					if(total==0){
				        $("#timer").TimeCircles().end().fadeOut();
				        $("#main").TimeCircles().end().fadeOut();
				        $("#main-menu").TimeCircles().end().fadeOut(); 
				    }
				});
			},
	        error: function(e) {
	            console.log(e.message);
	        }
	    });
	});
}(jQuery));

// show modal when the game is first initialized 
function initilize(){

    $("#myModal").append('<div class="modal-dialog"><div class="modal-content"><div class="modal-header">'   +
                         '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                         '<h4 class="modal-title" id="myModalLabel">Modal title</h4></div>' +
                         '<div class="modal-body">' +
                         '...' +
                         '</div>'+
                         '<div class="modal-footer">' +
                         '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                         '<button type="button" class="btn btn-primary">Save changes</button>' +
                         '</div>' +
                         '</div>' +
                         '</div>'
                        );
}