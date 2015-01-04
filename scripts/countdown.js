
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