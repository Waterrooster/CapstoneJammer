/**
 * @author Srikanth Jonnakuti <sjonnakuti2015@my.fit.edu>
 */
var curTrack = 0;
var playing = false;
var trackCount = -1;
var tracks = [];
var played = [];

$(document).ready(function () {
// To load prev played info
$.get("/getPlayed", function(data) {
	played=data; 
});
// to load prev playList
$.get("/getPlaylist", function(data) {
        tracks=[];   

        for(var i=0;i<data.length;i++){   
         tracks.push(
                    {"track": (i+1),
                        "name": data[i].song,
                        "length": data[i].time,
                        "file": data[i].album + "/" + data[i].song
                    });
  
	var newLi = '<div class="plItem"><div class="plNum">' + (i+1) + '.</div><div class="plTitle">' + data[i].song + '</div><div class="plLength">' + 				data[i].time + '</div></div>';

            $('#plList').append($('<li>' + newLi + '</li>'));
            $('#plList').trigger("create");
        }
        trackCount=data.length-1;
});

// on btn play click
    $('#btnPlay').click(function () {
        var audio = $('#audio1').get(0);
        if (playing) {
            playing = false;
            audio.pause();
        } 
        else{
            if (tracks.length === 0) {
                alert('No Songs in playlist');
                audio.pause();
            } else {
                playSong();
            }
            playing = true;
        }        
        changeIcon();

    });
// on btn prev click
    $('#btnPrev').click(function () {
        var audio = $('#audio1').get(0);
        if (curTrack === 0) {
            curTrack = trackCount;
        } else {
            curTrack = curTrack - 1;
        }
        if (playing) {
            playSong();
        } else {
            audio.pause();
        }
    });
// on btn prev next
    $('#btnNext').click(function () {
        var audio = $('#audio1').get(0);
        if (curTrack === trackCount) {
            curTrack = 0;
        } else {
            curTrack = curTrack + 1;
        }
        if (playing) {
            playSong();
        } else {
            audio.pause();
        }
    });
// add new song to album
    $('.addSong').click(function () {
        var hasMatch = false;
        for (var index = 0; index < tracks.length; ++index) {
            var song = tracks[index];
            if (song.name === $(this).attr('data-song')) {
                hasMatch = true;
                break;
            }
        }

        if (!hasMatch) {
            // to add as json data tracks
            trackCount += 1;
            tracks.push(
                    {"track": trackCount,
                        "name": $(this).attr('data-song'),
                        "length": $(this).attr('data-time'),
                        "file": $(this).attr('data-album') + "/" + $(this).attr('data-song')
                    });
            // to show in play list
            var newLi = '<div class="plItem"><div class="plNum">' + (trackCount+1) + '.</div><div class="plTitle">' + $(this).attr('data-song') + '</div><div class="plLength">' + $(this).attr('data-time') + '</div></div>';

            $('#plList').append($('<li>' + newLi + '</li>'));
            $('#plList').trigger("create");
            // send new item to server
            $.post("updatePlayList",
                   {
			"song": $(this).attr('data-song'),
		   	"album": $(this).attr('data-album'),
	                "time": $(this).attr('data-time')
        	});
        } else {
            alert('Already added to list');
        }
    });

// on click statistics send played details to server  
$('#statistics').click(function (e) {
	e.preventDefault();
	var info=JSON.stringify(played);
	$.ajax({
	   url:"updatePlayed",
	   type: 'POST',
	   contentType: 'application/json',
	   data: info
	   });
	   var url = "statistics";        
           window.location.href = url;
    });    
$('#playlist').click(function (e) {
	e.preventDefault();
	var info=JSON.stringify(played);
	$.ajax({
	   url:"updatePlayed",
	   type: 'POST',
	   contentType: 'application/json',
	   data: info
	   });
	   var url = "playlist";        
           window.location.href = url;
    });    

});// end of ready

function changeIcon(){
    if(playing){
        $('#btnPlay span').removeClass('glyphicon-play').addClass('glyphicon-stop');
        $('#npAction').text('Playing...');
    }else{
        $('#btnPlay span').removeClass('glyphicon-stop').addClass('glyphicon-play');
        $('#npAction').text('Paused...');
    }
}

function playSong() {
    var audio = $('#audio1').get(0);
    var path = "songs/" + tracks[curTrack].file + ".mp3";

    var hasSong = false;
    $.each(played, function (i, obj) {
        if (obj.name === tracks[curTrack].name) {
            obj.count += 1;
            hasSong = true;
            return false;
        }
    });
    if (!hasSong) {
        played.push(
                {
                    name: tracks[curTrack].name,
                    count: 1
                });
    }
    $('#npTitle').text(tracks[curTrack].name);
    audio.src = path;
    audio.play();
}
   

      

