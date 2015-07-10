var scenes = {};
var waypoints = {};

var sceneIndex = [];

$().ready(function(){
	'use strict';


	$(window).resize(_.once(function() {
		location.reload(false);
	}));

	// scroll to top before reload
	$(window).on('beforeunload', function() {
	    $(window).scrollTop(0);
	});

	setTimeout(function(){ 
		generateScenes();
	}, 100);

	window.controller = new ScrollMagic.Controller({
			globalSceneOptions: {
				triggerHook: 'onLeave'
			}
		});

});