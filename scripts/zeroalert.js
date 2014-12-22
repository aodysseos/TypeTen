
(function($){


$(document).ready(function(){
 
 //countdown to zero and subsequent alert 
$("#timer").TimeCircles({count_past_zero: false}).addListener(function(unit,value,total){

	if(total==30){
		$("#timer").TimeCircles({ time: {Seconds: { color: "#e5a960" }}});
    }
	
	if(total==15){
		$("#timer").TimeCircles({ time: {Seconds: { color: "#db6767" }}});
    }

	if(total==0){
        alert('time is up');
    }

});
});

}(jQuery));