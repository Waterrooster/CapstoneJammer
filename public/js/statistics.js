/**
 * @author Srikanth Jonnakuti <sjonnakuti2015@my.fit.edu>
 */

 
$(document).ready(function () {
// get played details from server
$.get("/getPlayed", function(data) { 
	var info=data;
	var bar = Morris.Bar({
    	    element: 'bar-count',
    	    data: info.length>0?info:[{"name":"No songs Played","count":1}],
    	    xkey: 'name',
    	    ykeys: ['count'],
    	    labels: ['No. Of times song played'],
    	    barColors: ['green']
	   	 });	
});
});
