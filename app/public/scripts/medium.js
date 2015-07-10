var scenes = {};
var waypoints = {};

var sceneIndex = [];

$().ready(function(){
	'use strict';

    // Mobile logic
    if (screen.width <= 899 || screen.height <= 649 || window.innerWidth <= 899 || window.innerHeight <= 649) {
      loadMobile();
    }

});

function loadMobile() {
	$('.mediumexternallinks').hide();
}