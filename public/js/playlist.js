/**
 * @author Srikanth Jonnakuti <sjonnakuti2015@my.fit.edu>
 */

$('document').ready(function(){
    $.get("/getPlaylist", function(data) {
        var playlist=data;    
	var tr;
        for (var i = 0; i < playlist.length; i++) {
            tr = $('<tr/>');
            tr.append("<td>" + (i+1) + "</td>");
            tr.append("<td>" + playlist[i].song + "</td>");
            tr.append("<td><span>" + playlist[i].album + "</span></td>");
            tr.append("<td>" + playlist[i].time + "</td>");
            $('#table').append(tr);
        }
});
});
