
(function($){


$(document).ready(function(){
 
	 //countdown to zero and subsequent alert 
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
});

}(jQuery));