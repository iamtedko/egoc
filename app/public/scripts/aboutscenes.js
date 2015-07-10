var startDate = new Date();
var startTime = startDate.getTime();

// Scene Template
// virtual class for scenes of the story 
function Scene(index,title,theme,segue,init) {
	
	this.sceneIndex = index;
	this.sceneTitle = title;

	this.segue = segue; 	// jquery sel (trigger)
	this.height = 500;		// height on page
	this.isActive = false;	// currently in view?
	this.theme = theme;		// background theme
	this.initcallback = init;
	// Dynamic loading?
	// Multiple segues?
	// Separate segue for interactivity?

	this.init = function() {
		// Init function
		this.initcallback && this.initcallback();
	};

	this.bgState = function() {
		// Changing background
		bg.changeTheme(this.theme);
	};

	this.segueScene = function(enter,down) {
		var up = !down;
		var leave = !enter;

		enter && up && this.segue.segueEnterUp && this.segue.segueEnterUp();
		enter && down && this.segue.segueEnterDown && this.segue.segueEnterDown();
		leave && up && this.segue.segueLeaveUp && this.segue.segueLeaveUp();
		leave && down && this.segue.segueLeaveDown && this.segue.segueLeaveDown();
		
		this.isActive = enter;
	}
}

// Scroll Magic Logic
function generateAboutScenes() { 

	// Define each scene from the template object
	sceneIndex.push(new Scene(1,'Creating Something',bg.themes.grey,{sel:'#creating',offset:500}));
	sceneIndex.push(new Scene(2,'New Technologies',bg.themes.yellow,{sel:'#newtech',offset:500,segueEnterDown:preloadContent}));
	sceneIndex.push(new Scene(3,'Do Tank',bg.themes.yellow,{sel:'#dotank',offset:500}));
	sceneIndex.push(new Scene(4,'Video',bg.themes.yellow,{sel:'#video',offset:500}));
	sceneIndex.push(new Scene(5,'Ventures',bg.themes.yellow,{sel:'#venture',offset:500}));
	sceneIndex.push(new Scene(6,'Contributing Members',bg.themes.yellow,{sel:'#ideoteam',offset:500}));

	_.indexBy(sceneIndex,'sceneIndex');

	_.each(sceneIndex, function(val,key) {

		val.init();

		// console.log(val.segue.offset)

		// Animated segues
		var trigger = new ScrollMagic.Scene({
		triggerElement: val.segue.sel,
		offset: 200,
		duration: val.height
		})
		.on("enter leave", function(e) {
			var enter = e.type === "enter";
			var down = e.scrollDirection === "FORWARD";
			val.segueScene(enter,down);
		})
		//.addIndicators()
		.addTo(window.controller);

		// Pin the page
		/*var pin = new ScrollMagic.Scene({
		  triggerElement: ".scene"+val.sceneIndex, // point of execution
		  duration: $(window).height() - val.segue.offset, // pin element for the window height - 1
		  triggerHook: 0, // don't trigger until trigger hits the top of the viewport
		  reverse: true // allows the effect to trigger when scrolled in the reverse direction
		})
		//.addIndicators()
		.setPin(".scene"+val.sceneIndex) // the element we want to pin
		.addTo(window.controller);*/

		// Background DOWNWARD transitions
		/*var downward = new ScrollMagic.Scene({
			triggerElement: '.scene'+val.sceneIndex,
			offset: -200,
			duration: val.height
		})
		.on("enter leave", function(e) {
			var enter = e.type === "enter";
			var down = e.scrollDirection === "FORWARD";
			(enter && down) && val.bgState();
		})
		.addTo(window.controller);

		// Background UPWARD transitions
		var upward = new ScrollMagic.Scene({
			triggerElement: '.scene'+val.sceneIndex,
			offset: 400,
			duration: val.height
		})
		.on("enter leave", function(e) {
			var enter = e.type === "enter";
			var down = e.scrollDirection === "FORWARD";
			(val.sceneIndex > 0) && (enter && !down) && sceneIndex[val.sceneIndex-1].bgState();
		})
		.addTo(window.controller);
		*/
				
	})

	//generateTweens();
	//generateSceneListeners();
}


function generateSceneListeners() { 

	//$('#aboutvideocontainer').click(function(){window.open('https://player.vimeo.com/video/121833725','_blank');});

}

function preloadContent() {
	// This is kind of a hack but otherwise it will be weird when it loads
	//$('#venture').css('visibility','visible');
}

// Background Helpers
var bg = {

	colors : [],
	target : "#bkg",
	currentTheme : {},
	themes: {
			gradient: ['#c3e9c4','#edf0a3','#f6c697'],
			white: '#ffffff',
			green: '#60C89A',
			grey: '#f5f5f5',
			yellow: '#F4F27B'
	},

	changeTheme: function(theme) {
		this.changeColor(theme);
		this.currentTheme = theme;
	},

	changeColor: function(colors) { // Colors is an array like ['#fff',"#eee"] or a single color like "#fff"

		var isArray = $.isArray(colors);
		var $stops = $(bg.target).children('stop')
		$.each($stops, function(i,v){
			var c;
			if(isArray){
				c = colors.length > i ? colors[i] : colors[colors.length]
			} else {
				c = colors
			}
			$(this).velocity({stopColor: c })
		})
	}
}
