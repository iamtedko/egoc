var scenes = {};
var waypoints = {};

var sceneIndex = [];

$().ready(function(){
	'use strict';

    // Mobile logic
    if (screen.width <= 899 || screen.height <= 649 || window.innerWidth <= 899 || window.innerHeight <= 649) {
      loadMobile();
    }

	// Handlers for window resize
	$(window).resize(window.layout.onResize);

	setTimeout(function(){ 
		generateAboutScenes();
	}, 100);

	window.controller = new ScrollMagic.Controller({
			globalSceneOptions: {
				triggerHook: 'onLeave'
			}
		});

});

function loadMobile() {
	$('.externallinks').hide();
	$('.externallinksmobile').show();
	$('.uni').hide();
	$('.header2').hide();
	$('.header1').removeClass('header1');
	$('#aboutfooter').hide();
}