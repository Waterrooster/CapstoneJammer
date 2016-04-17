/**
 * @author Srikanth Jonnakuti <sjonnakuti2015@my.fit.edu>
 */
 
$(document).ready(function () {
    $('#btnreset').click(function () {
        $('#rusername').val('');
        $('#rpwd').val('');
        $('#rrpwd').val('');
        $('#remail').val('');
    });

    $('#lsubmit').click(function () {
        var uname = $('#lusername').val();
        var pwd = $('#lpwd').val();
        if (uname === '' || pwd === '') {
            alert('field/s are empty');
        }
    });
});

function rverify(){
 var uname = $('#rusername').val();
        var pwd = $('#rpwd').val();
        var rpwd = $('#rrpwd').val();
        var email = $('#remail').val();
        if (uname === '' || pwd === '' || rpwd === '' || email === '') {
            alert('field/s are empty');
	    return false;
        } else if (pwd !== rpwd) {
            alert('password mismatch');
            $('#rpwd').val('');
            $('#rrpwd').val('');
	    return false;
        } else {
	    return true;
        }   
}
function lverify(){
var uname = $('#lusername').val();
        var pwd = $('#lpwd').val();
        if (uname === '' || pwd === '') {
            alert('field/s are empty');
		return false;
        }else{
		return true;
	}
}
