
(function($){


$(document).ready(function(){
 
 //countdown to zero and subsequent alert 
$("#timer").TimeCircles({count_past_zero: false}).addListener(function(unit,value,total){

 if(total==0){

        alert('time is up');
    }

});
});

}(jQuery));