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

// Define each scene from the template object
function generateScenes() { 

	sceneIndex.push(new Scene(1,'Change the Future',bg.themes.grey,{sel:'#future',offset:0}));
	sceneIndex.push(new Scene(2,'Bitcoin Intro',bg.themes.grey,{sel:'#intro',offset:0,segueEnterDown:animations.fadeIntroText}));
	sceneIndex.push(new Scene(3,'Bank',bg.themes.white,{sel:'#bank',offset:0,segueEnterDown:animations.decentralize},svg.drawBankLines));
	sceneIndex.push(new Scene(4,'Use Case',bg.themes.white,{sel:'#usecase',offset:0,segueEnterDown:interactions.waitUseCase}));
	sceneIndex.push(new Scene(5,'Addresses',bg.themes.white,{sel:'#address',offset:0}));	
	sceneIndex.push(new Scene(6,'Pick Address',bg.themes.white,{sel:'#pickaddress',offset:0,segueEnterDown:interactions.waitAddress}));	
	sceneIndex.push(new Scene(7,'Use Address',bg.themes.white,{sel:'#useaddress',offset:0}));	
	sceneIndex.push(new Scene(8,'Secret Key',bg.themes.white,{sel:'#secretkey',offset:0,segueEnterDown:animations.rotateCycle}));
	sceneIndex.push(new Scene(9,'Your Account',bg.themes.white,{sel:'#account',offset:0}));
	sceneIndex.push(new Scene(10,'Transfer',bg.themes.white,{sel:'#transfer',offset:0,segueEnterDown:interactions.waitTransfer}));
	sceneIndex.push(new Scene(11,'Transaction',bg.themes.white,{sel:'#transaction',offset:0}));
	sceneIndex.push(new Scene(12,'Ledger',bg.themes.white,{sel:'#ledger',offset:0,segueEnterDown:animations.solveBlock,segueEnterUp:animations.undoBlock}));
	sceneIndex.push(new Scene(13,'Package',bg.themes.white,{sel:'#package',offset:0}));
	sceneIndex.push(new Scene(14,'Reward',bg.themes.gradient,{sel:'#reward',offset:0}));
	sceneIndex.push(new Scene(15,'Network',bg.themes.grey,{sel:'#network',offset:0}));
	sceneIndex.push(new Scene(16,'Block Chain',bg.themes.grey,{sel:'#blockchain',offset:0}));
	sceneIndex.push(new Scene(17,'Resolution',bg.themes.grey,{sel:'#resolution',offset:0}));
	sceneIndex.push(new Scene(18,'Medium',bg.themes.grey,{sel:'#medium',offset:0}));

	_.indexBy(sceneIndex,'sceneIndex');

	// Add ScrollMagic listeners for scenes
	_.each(sceneIndex, function(val,key) {

		val.init();

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
		var pin = new ScrollMagic.Scene({
		  triggerElement: ".scene"+val.sceneIndex, // point of execution
		  duration: $(window).height() - val.segue.offset, // pin element for the window height - 1
		  triggerHook: 0, // don't trigger until trigger hits the top of the viewport
		  reverse: true // allows the effect to trigger when scrolled in the reverse direction
		})
		//.addIndicators()
		.setPin(".scene"+val.sceneIndex) // the element we want to pin
		.addTo(window.controller);

		// Background DOWNWARD transitions
		var downward = new ScrollMagic.Scene({
			triggerElement: '.scene'+val.sceneIndex,
			offset: -200,
			duration: val.height
		})
		.on("enter leave", function(e) {
			var enter = e.type === "enter";
			var down = e.scrollDirection === "FORWARD";
			(enter && down) && val.bgState();
			enter && breadcrumbs.open(val.sceneIndex);
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
				
	})

	generateTweens();
	generateSceneListeners();
	breadcrumbs.init();
}

// Initiate tween listeners (animations that respond to scroll)
function generateTweens() {

	// Tweens
	var tween = new TimelineMax()
		.add(TweenMax.to("#introfirst", 1, {transform: "translateY(0)"}))

	new ScrollMagic.Scene({
	  triggerElement: "#intro",
	  duration: '100%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#introsecond", 1, {transform: "translateY(0)"}))

	new ScrollMagic.Scene({
	  triggerElement: "#intro",
	  duration: '100%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//
/*
	var tween = new TimelineMax()
		.add(TweenMax.to("#pickaddressheader", 1, {transform: "translateY(-100px)"}))

	new ScrollMagic.Scene({
	  triggerElement: "#address",
	  duration: '100%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#public", 1.0, {transform: "translateY(-100px)"}))

	new ScrollMagic.Scene({
	  triggerElement: "#useaddress",
	  duration: '80%'
	})
	.setTween(tween)
	.addTo(window.controller);
*/
	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#useaddressimages", 1.0, {width: "100%"}))

	new ScrollMagic.Scene({
	  triggerElement: "#useaddress",
	  duration: '100%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#transline", 1.0, {width: "222px"}))

	new ScrollMagic.Scene({
	  triggerElement: "#transaction",
	  duration: '60%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#secretkeyinfo", 1.0, {autoAlpha: 1}))
		.add(TweenMax.to("#keyimg", 1.0, {autoAlpha: 1}))

	new ScrollMagic.Scene({
	  triggerElement: "#secretkey",
	  duration: '80%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#ledgerright", 0.5, {transform: "translateX(0)"}))

	new ScrollMagic.Scene({
	  triggerElement: "#ledger",
	  duration: '100%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#ledgerleft", 1, {transform: "translateX(-50%)"}))

	new ScrollMagic.Scene({
	  triggerElement: "#ledger",
	  duration: '100%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#packagepanel", 1, {transform: "translateX(0)"}))

	new ScrollMagic.Scene({
	  triggerElement: "#package",
	  duration: '50%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#networkpropinfo", 1.0, {autoAlpha: 1}))

	new ScrollMagic.Scene({
	  triggerElement: "#network",
	  duration: '80%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#check1", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check3", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check7", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check8", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check10", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check12", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check14", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check16", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check18", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check20", 0.5, {autoAlpha:1}))


	new ScrollMagic.Scene({
	  triggerElement: "#network",
	  duration: '80%'
	})
	.setTween(tween)
	.addTo(window.controller);

	var tween = new TimelineMax()
		.add(TweenMax.to("#check2", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check4", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check6", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check9", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check11", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check13", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check15", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check17", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check19", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check21", 0.5, {autoAlpha:1}))

	new ScrollMagic.Scene({
	  triggerElement: "#network",
	  duration: '80%'
	})
	.setTween(tween)
	.addTo(window.controller);

	var tween = new TimelineMax()
		.add(TweenMax.to("#check2", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check5", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check6", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check9", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check11", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check13", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check15", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check17", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check19", 0.5, {autoAlpha:1}))
		.add(TweenMax.to("#check21", 0.5, {autoAlpha:1}))

	new ScrollMagic.Scene({
	  triggerElement: "#network",
	  duration: '80%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#animatedblockchain", 1, {transform: "translateY(0)"}))
		.add(TweenMax.to("#animatedwinner", 1, {transform: "translateY(0)",autoAlpha:1}))

	new ScrollMagic.Scene({
	  triggerElement: "#blockchain",
	  duration: '80%'
	})
	.setTween(tween)
	.addTo(window.controller);

	//

	var tween = new TimelineMax()
		.add(TweenMax.to("#blockchaininfo", 1.0, {autoAlpha: 1}))

	new ScrollMagic.Scene({
	  triggerElement: "#blockchain",
	  duration: '80%'
	})
	.setTween(tween)
	.addTo(window.controller);

}

// Initiate click listeners and timers
function generateSceneListeners() { 

	animations.loopFutureText();
	setInterval(animations.loopFutureText, 1000);

	animations.addressLoop = setInterval(animations.loopAddressGenerator, 1000);

	$('#usecasemusic').click(function(){interactions.selectUseCase('music');});
	$('#usecasehouse').click(function(){interactions.selectUseCase('house');});
	$('#usecasesports').click(function(){interactions.selectUseCase('sports');});

	$('#addresspicker').click(function(){interactions.pickAddress(animations.a1)});
	$('#address-picker-button').click(function(){interactions.pickAddress(animations.a1)});

	$('#transfer4').click(function(){interactions.selectTransfer('transfer4');});
	$('#transfer5').click(function(){interactions.selectTransfer('transfer5');});
	$('#transfer6').click(function(){interactions.selectTransfer('transfer6');});

	$('#futuredownarrow').click(function(){breadcrumbs.jump(2);});
	$('#usecasedownarrow').click(function(){breadcrumbs.jump(5);});
	$('#addresspickerdownarrow').click(function(){breadcrumbs.jump(7);});
	$('#transferdownarrow').click(function(){breadcrumbs.jump(11);});

	// new tooltip("#usecasemusic","Support a musician.",-35,150).init();
	// new tooltip("#usecasehouse","Investments pay off.",-35,150).init();
	// new tooltip("#usecasesports","Home team's in town.",-35,150).init();
	// new tooltip("#animatedblockchain","The hard work it takes to package each block makes it nearly impossible to alter the history of records.",300,210).init();
	// new tooltip("#animatednetwork","All the other computers check to make sure the new block is correct.",150,200).init();
	// new tooltip("#addresspicker","Pick an address",270,50).init();
	// new tooltip("#keyimg","You keep your secret key, and can share your public key",50,50).init();

}

// Breadcrumbs object+operations
var breadcrumbs = {
	
	pages: 17,
	currentPage: 0,

	init: function() {
		/*for(var i = 1; i <= this.pages; i++) {
			$('#crumb'+i).click((function(p){return function(){breadcrumbs.jump(p);}})(i));
		}*/
	},

	jump: function(page) {
		interactions.unwait();

		//this.open(page);

		var aTag = $('.scene'+page);
		$('html,body').animate({scrollTop: aTag.offset().top},'slow');
	},

	open: function(page) {

		$('.crumb'+this.currentPage).removeClass('active');
		this.currentPage = page;
		$('.crumb'+page).addClass('visible active');
	}

}

// Scene Animations
var animations = {

	f: 0,
	futureText: ['Music','Real Estate','Sports Fandom', 'Food', 'Transactions', 'Trust', 'Reputation'],

	a1: 0,
	a2: 0,
	numberAddresses: 23,
	addressLoop: {},

	// TODO: modularize text fading
	introtext: false,
	decentralized: false,
	ledgersolved: false,
	dancing: false,
	dancingIter: 0,
	cycle: false,

	loopFutureText: function() {
		var t = $('#futuretext').find('span')
		var d = 1000
		t
			.velocity({ opacity: 0 }, {delay: d, duration: d})
			.velocity({ opacity: 1 }, { begin: function(){
				t.removeClass('text'+animations.f);
				animations.f = (animations.f+1)%animations.futureText.length;
				t.text(animations.futureText[animations.f]);
				t.addClass('text'+animations.f);
			} }, {duration: d})
	},

	fadeIntroText: function() {
		$('#bankpig').removeClass('hidden');
		/*if(!animations.introtext){
			animations.introtext = true;
			$('#intro .header h3').velocity({opacity:0}, { delay: 0, duration: 500 })
				.velocity({opacity:1}, { begin: function(){
					$('#intro .header h3').html('It has many potential uses but first let\'s talk about money.');
				}}, {duration: 1500});
		}*/
	},

	rotateCycle: function() {
		var r = 1;
		var rad = function() {
			return (r-=1)%-360 + "deg"
		}
		this.cycle = !this.cycle ? setInterval(function(){
			$('.cycle').css("-webkit-transform","rotate(" + rad() + ")");
			$('.cycle').css("-moz-transform","rotate(" + rad() + ")");
		}, 60) : this.cycle;
	},

	decentralize: function() {
		if(!animations.decentralized) {

			interactions.waitDecentralize();

			animations.decentralized = true;
			$('#bankpig span').velocity({opacity:0}, { delay: 500, duration: 500 })
				.velocity({opacity:1}, { begin: function(){
					$('#bankpig span').html('Bitcoin is decentralized. It’s sent person to person.');
				}, complete: function(){
					interactions.completeDecentralize();
				}}, {duration: 1000});
			$('#bankpig').velocity({backgroundColor: '#e3e3e3', color: '#000000'}, { delay: 500, duration: 500 });

			$('#banknode1').velocity({opacity:0}, { delay: 500, duration: 500 });
			$('#banknode2').velocity({opacity:0}, { delay: 500, duration: 500 });
			$('#banknode3').velocity({opacity:0}, { delay: 500, duration: 500 });
			$('#banknode6').velocity({opacity:0}, { delay: 500, duration: 500 });
			$('#banknode7').velocity({opacity:0}, { delay: 500, duration: 500 });
			$('#banknode8').velocity({opacity:0}, { delay: 500, duration: 500 });
			$('#banknode9').velocity({opacity:0}, { delay: 500, duration: 500 });
			$('#banknode10').velocity({opacity:0}, { delay: 500, duration: 500 });
			$('#banknode11').velocity({opacity:0}, { delay: 500, duration: 500 });

			animations.animateLineToNode('#bankline5','#banknode4','1s');

			animations.animateLineToZero('#bankline1','1s');
			animations.animateLineToZero('#bankline2','1s');
			animations.animateLineToZero('#bankline3','1s');
			animations.animateLineToZero('#bankline4','1s');
			animations.animateLineToZero('#bankline6','1s');
			animations.animateLineToZero('#bankline7','1s');
			animations.animateLineToZero('#bankline8','1s');
			animations.animateLineToZero('#bankline9','1s');
			animations.animateLineToZero('#bankline10','1s');
			animations.animateLineToZero('#bankline11','1s');
		}
	},

	animateLineToNode: function(lineId,nodeId,dur) {

		var svgNS = svg.svgNamespace();

		var line = $(lineId);
		var x2 = svg.xForNode(nodeId);
		var y2 = svg.yForNode(nodeId);

		var begin = animations.secondsElapsed()+'s';

		var animateX = document.createElementNS(svgNS,'animate');
		animateX.setAttribute('attributeName','x2');
		animateX.setAttribute('from',line.attr('x2'));
		animateX.setAttribute('to',x2);
		animateX.setAttribute('begin',begin);
		animateX.setAttribute('dur',dur);
		animateX.setAttribute('fill','freeze');

		var animateY = document.createElementNS(svgNS,'animate');
		animateY.setAttribute('attributeName','y2');
		animateY.setAttribute('from',line.attr('y2'));
		animateY.setAttribute('to',y2);
		animateY.setAttribute('begin',begin);
		animateY.setAttribute('dur',dur);
		animateY.setAttribute('fill','freeze');

		line.append(animateX);
		line.append(animateY);
	},

	animateLineToZero: function(lineId,dur) {
		var svgNS = svg.svgNamespace();

		var line = $(lineId);

		var begin = animations.secondsElapsed()+'s';

		var animateX = document.createElementNS(svgNS,'animate');
		animateX.setAttribute('attributeName','x1');
		animateX.setAttribute('from',line.attr('x1'));
		animateX.setAttribute('to','50%');
		animateX.setAttribute('begin',begin);
		animateX.setAttribute('dur',dur);
		animateX.setAttribute('fill','freeze');

		var animateY = document.createElementNS(svgNS,'animate');
		animateY.setAttribute('attributeName','y1');
		animateY.setAttribute('from',line.attr('y1'));
		animateY.setAttribute('to','50%');
		animateY.setAttribute('begin',begin);
		animateY.setAttribute('dur',dur);
		animateY.setAttribute('fill','freeze');

		line.append(animateX);
		line.append(animateY);
	},


	loopAddressGenerator: function() {

		animations.a1 = (animations.a1+1)%animations.numberAddresses;
		$('#addresspicker').css('background-image','url(\'/svgs/address'+animations.a1+'.png\')');

		/*$('#addressfade')
			.velocity({opacity: 0.1}, {duration: 150})
			.velocity({opacity: 0.3}, { begin: function(){
				$('#addressfade').attr('src','svgs/address'+animations.a2+'.png');
				animations.a2 = (animations.a2+1)%animations.numberAddresses;
			} },{duration: 150})*/

		$('.numberpicker').html(btcHelper.getAddress());
	},

	solveBlock: function() {
		svg.animateBlock($('#animatedledger'),true);
	},

	undoBlock: function() {
		svg.animateBlock($('#animatedledger'),false);
	},

	// return # seconds elapsed since pageload
	secondsElapsed: function() {
		var date_now = new Date (); 
		var time_now = date_now.getTime (); 
		var time_diff = time_now - startTime; 
		var seconds = Math.floor ( time_diff / 1000 ); 
		return seconds;
	},

	animateAddressesDancing: function(active) {
		var _this = this;
		// var t = $('.dancingSVG');
		// // if(!this.dancing && active) {
		// 	_.each(t,function(v,i) { 
		// 		if($(v).hasClass('hidden')) $(v).removeClass('hidden')
		// 		$(v).css({
		// 			top: Math.random() * $(window).height(),
		// 			left: Math.random() * $(window).width(),
		// 			opacity: 0.1//Math.random()
		// 		})
		// 		$(v).attr('data-dir',function() {
		// 			return Math.random() > .5 ? 1 : 0;
		// 		})
		// 		$(v).attr('data-speed',function() {
		// 			return parseInt(Math.random() * 2) + 1;
		// 		})
		// 	});


			// this.dancing = setInterval(
			// 	function() {
			// 		_this.dancingIter += 1;
			// 		_this.dancingIter = _this.dancingIter % 100;
			// 		_.each(t, function(v,i,l) {

			// 			if($(v).hasClass('hidden')) $(v).removeClass('hidden')
			// 			var at = (parseInt($(v).attr('data-rad')) + 5) % 360;

			// 			$(v).attr('data-rad',at);
			// 			var dir = !!parseInt($(v).attr('data-dir'));

			// 			if(!dir && ($(v).position().left < 0) ||
			// 				dir && ($(v).position().left > $(window).width)) 
			// 			{
			// 					dir = !dir;
			// 					$(v).attr('data-dir',function(){
			// 						return dir ? 1: 0;
			// 					});
			// 			}


			// 			var cycle = 1;//Math.sin(parseInt($(v).attr('data-rad')));
			// 			var speed = parseInt($(v).attr('data-speed'));

			// 			if(_this.dancingIter%speed == 0) {
			// 				$(v).css({
			// 					top: function() {
			// 						return dir ? parseInt($(v).position().top) + cycle : parseInt($(v).position().top) - cycle
			// 					},
			// 					left: function() {
			// 						return dir ? parseInt($(v).position().left) + cycle : parseInt($(v).position().left) - cycle
			// 					},
			// 					opacity: 0.1//(.5 + cycle)
			// 				})
			// 			}
			// 		});
			// 	}, 60);
		// } else {
		// 	clearInterval(this.dancing);
		// 	this.dancing = false;
		// }
	}
}

// Scene Interactions
var interactions = {

	bank: -1,
	usecase: -1,
	address: -1,
	addressHash: -1,
	transfer: -1,

	// Why doesn't "this" work here?
	waitDecentralize: function() {
		interactions.wait(interactions.bank, "section#bank");		
	},

	waitUseCase: function() {
		interactions.wait(interactions.usecase, "section#usecase");
	},

	waitAddress: function() {
		interactions.wait(interactions.address,"section#pickaddress");
	},

	waitTransfer: function() {
		interactions.wait(interactions.transfer,"section#transfer");
	},

	wait: function(waiton,target) {
		if(waiton == -1){
			$('html').addClass('disablescroll');
			$('body').addClass('disablescroll');
			interactions.checkWaitValid(target);
		}else{
			console.log('wait on: "'+waiton+'"');
		}
	},

	checkWaitValid: function(waitaddress) {
		var targetPos = $(waitaddress);
		if(targetPos[0].getBoundingClientRect().top < 0) {
			$("html,body").animate({scrollTop: targetPos.offset().top})
		}
	},

	unwait: function() {
		$('html').removeClass('disablescroll');
		$('body').removeClass('disablescroll');
	},

	completeDecentralize: function() {
		this.bank = 1;
		this.unwait();
	},

	selectUseCase: function(usecase) {
		// console.log('selected use case: '+usecase);
		$('.usecase').removeClass('active nope');
		$('.usecasetext>span').removeClass('nope');
		$('#usecase'+usecase).addClass('active');
		$('.usecase:not(#usecase'+usecase+')').addClass('nope');
		$('.usecasetext>span:not(#usecasetext'+usecase+')').addClass('nope');
		$('#usecase .downarrow').removeClass('hidden nope');
		this.usecase = usecase;
		this.unwait();
		this.setupTransfer(usecase)
		//setTimeout(function() {breadcrumbs.jump(5);}, 500);
	},

	pickAddress: function(address) {
		// console.log('pick address: '+address);
		clearInterval(animations.addressLoop);
		if(this.addressHash !== '') {
			animations.loopAddressGenerator();
		}
		// Changes "you" address 
		$('.you>img').attr('src','svgs/address'+address+'.png');
		$('#addresspicker').css('background-image','url(\'/svgs/address'+address+'.png\')');
		$('#addresskeyimg').attr('src','svgs/address'+address+'.png');

		// Changes next scene bg to svg
		$('#useaddressimages').attr('src','svgs/address'+address+'.svg');
		
		$('#addressbg').removeClass("interactive")
		//$('#addressfade').remove();

		$('#background').css({
			"display":"block"
		});

		$('#address-picker-button')
		.removeClass("address-picker-button-class")
		.addClass("address-picker-button-class-selected")
		.html("That's You!");

		$('#pickaddress .downarrow').removeClass('hidden nope');

		var viewbox = "0 0 " + $(window).width() + " " + $(window).height();
		var svgBg = $('#background').find('svg');
		svgBg
			.height($(window).height())
			.width($(window).width())


		svgBg[0].setAttribute('viewBox',viewbox);


		this.address = address;
		this.addressHash = $('.numberpicker').html();
		this.unwait();
		//setTimeout(function() {breadcrumbs.jump(7);}, 2000);
	},

	setupTransfer: function(usecase) {
		var content;
		var choices = [];
		var texts = [];
		// console.log("usecase ", usecase)
		switch(usecase) {
			case "music":
				content = "Pick an album to buy."
				res = "<span>Good call on the album.</span><br/><br/> Bitcoin offers the potential to directly pay musicians for their work. Scroll on to read how block chains might more fundamentally change how you buy music."
				choices.push("music01.svg");
				choices.push("music02.svg");
				choices.push("music03.svg");
				texts.push("Rift");
				texts.push("SHA-256's");
				texts.push("Bit Haus");
				break;
			case "house":
				content = "Choose a home upgrade to purchase."
				res = "<span>You’re on your way to a lower energy bill.</span><br/><br/> In the future, smart homes might pay or receive bitcoin depending on how much energy they’re using. Scroll on to read how block chains might more fundamentally change how you buy a house."
				choices.push("house01.svg");
				choices.push("house02.svg");
				choices.push("house03.svg");
				texts.push("Smart Thermostat");
				texts.push("Solar Panels");
				texts.push("Efficient Windows");
				break;
			case "sports":
				content = "Buy some tickets to a game."
				res = "<span>See you at the game!</span><br/><br/> Bitcoin offers a way to buy tickets from a friend with lower transaction fees than credit or bank cards. Scroll on to read how block chains might more fundamentally change your relationship with your favorite team."
				choices.push("sports01.svg");
				choices.push("sports02.svg");
				choices.push("sports03.svg");
				texts.push("The Blockers");
				texts.push("The Hashers");
				texts.push("The Em-Dashers");
				break;
			default:
				content = "How did you get here...?"
				break;
		}

		// Update all the transfer options for new use case
		$('#transfer').find("h3>span").html(content)
		$('#transfer').attr('data-resolution',res);
		_.each($('.transfer').find('.front'), function(v,i) {
			$(v).find('img').attr('src',"svgs/" + choices[i]);
			$('#transfertext'+(i+1)).html(texts[i]);
		})

		// When the use case has changed, update the transfer selected + propagate
		$.each($('.transfer'),function(i,v){
			if($(v).hasClass('active')){
				//console.log('select transfer: '+$(v).attr('id'));
				interactions.selectTransfer($(v).attr('id'));
			}
		});

	},

	selectTransfer: function(transfer) {
		// console.log('selected transfer: '+transfer);
		this.transfer = transfer;
		var tNum = transfer.split('transfer')[1]
		$('.transfer').removeClass('active nope');
		$('.transfertext>span').removeClass('nope');
		$('#transfer'+tNum).addClass('active');
		$(".transfer").removeClass('interactive');
		$('.transfer:not(#transfer'+tNum+')').addClass('nope');
		$('.transfertext>span:not(#transfertext'+(tNum-3)+')').addClass('nope');
		$('.them').removeClass('them4 them5 them6');
		$('#transline').removeClass('line4 line5 line6');
		$('.them>img').attr('src','svgs/address2'+tNum+'.png');
		$('.them').addClass('them'+tNum);
		$('#transline').addClass('line'+tNum);
		$('#transfer .downarrow').removeClass('hidden');
		
		var content = $('#transfer').attr('data-resolution');
		$('#resolution').find('h3').html(content);
		$('#resolution').css('background','url(\'/svgs/tile_'+interactions.usecase+'0'+(tNum-3)+'.png\')');
		$('#resolution').css('background-size','35%');
		this.unwait();
		//setTimeout(function(){breadcrumbs.jump(10);}, 500);
	}
}

// Background Helpers, e.g. for fading
var bg = {

	colors : [],
	target : "#bkg",
	currentTheme : {},
	themes: {
			gradient: ['#eaf9aa','#e7dfbf','#dfabe6'],
			white: '#f5f5f5',
			lightgreen: '#5FC799',
			green: '#57BC8F',
			darkgreen: '#54B58A',
			grey: '#f5f5f5',
			yellow: '#cae575'
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

var tooltip = function(target, content, dx, dy) {
	this.el = ".hover",
	this.content = content,
	this.target = target,
	this.dx = dx,
	this.dy = dy,
	this.visible = false,

	this.init = function() {
		var _this = this;
		$(target).on('mouseover mouseleave', function(e) {
			if(e.type === 'mouseover') {
				// console.log("mouseover",_this.target)
				_this.show();
			} else if(e.type === 'mouseleave') {
				// console.log("mouseleave",_this.target)
				_this.hide();
			}
		});
		this.hide();
	};

	this.show = function(){
		var _this = this;
		if(!_this.visible){
			_this.visible=true;
			$(_this.el).html(this.content);
			$(_this.el).css({
				position:'absolute',
				top: $(_this.target).offset().top + $(_this.el).height() + (_this.dy),
				left: $(_this.target).offset().left + (_this.dx)
			});
			$(_this.el).fadeIn(300);
		}
	};

	this.hide = function() {
		var _this = this;
		_this.visible=false;
		$(_this.el).fadeOut(100);
	}
};

// SVG Helpers
var svg = {

	duration: 1000,
	primary: ".p1",
	secondary: ".p2",

	// Namespace
	svgNamespace: function() {
		return 'http://www.w3.org/2000/svg';
	},

	// Primary
	primaryFromObject: function(e) {
		var elDoc = e[0].contentDocument;
		return $(this.primary,elDoc);
	},

	// Secondary
	secondaryFromObject: function(e) {
		var elDoc = e[0].contentDocument;
		return $(this.secondary,elDoc);
	},

	// Defs
	defsFromObject: function(e) {
		var elDoc = e[0].contentDocument;
		return $("defs",elDoc)[0];
	},

	// SVG Transformations

	// Translate
	translate: function(e,tx,ty) {
		e.velocity({ translateX: tx, translateY: ty}, this.duration);
	},

	// Fill and stroke color
	applyColor: function(e) {
		var svgItem = this.primaryFromObject(e);
		svgItem.velocity({ fill: "#ffffff", stroke: "#ff0000" });
	},

	animateBlock: function(e,solve) {

		// Solved transactions
		var primary = this.primaryFromObject(e);

		// Unsolved transactions
		var secondary = this.secondaryFromObject(e);

		var svgNS = svg.svgNamespace();

		//setTimeout(function(){
		//	new tooltip("#animatedledger","Solved!",290,50).init();
		//},animations.secondsElapsed()*1000);

		var from = solve ? 0 : 1;
		var to = solve ? 1 : 0;

		$.each(secondary,function(i,node){

			var begin = animations.secondsElapsed()+(0.05*i)+'s';

			var animate = document.createElementNS(svgNS,'animate');
			animate.setAttribute('attributeName','opacity');
			animate.setAttribute('from',from);
			animate.setAttribute('to',to);
			animate.setAttribute('begin',begin);
			animate.setAttribute('dur','100ms');
			animate.setAttribute('fill','freeze');

			node.appendChild(animate);
		});
	},

	// Animate gradient
	createGradient: function(e) {

		var primary = this.primaryFromObject(e);
		primary.attr('style','stroke:url(#bkg);');

		var secondary = this.secondaryFromObject(e);
		secondary.attr('style','fill:url(#bkg);');

		// Preserve namespace or camelcase fails
		var svgNS = this.svgNamespace();

		var lg = document.createElementNS(svgNS,'linearGradient');
		lg.setAttribute('id','bkg');
		lg.setAttribute('fy',0);
		lg.setAttribute('gradientTransform','rotate(0)');
		lg.setAttribute('gradientUnits','userSpaceOnUse');

		var firstStop = document.createElementNS(svgNS,'stop');
		firstStop.setAttribute('offset',0);
		firstStop.setAttribute('stop-color','#ffffff');

		var secondStop = document.createElementNS(svgNS,'stop');
		secondStop.setAttribute('offset',0.75);
		secondStop.setAttribute('stop-color','#000000');

		var thirdStop = document.createElementNS(svgNS,'stop');
		thirdStop.setAttribute('offset',1);
		thirdStop.setAttribute('stop-color','#000000');
		
		var firstAnimate = document.createElementNS(svgNS,'animate');
		firstAnimate.setAttribute('attributeName','stop-color');
		firstAnimate.setAttribute('dur','3s');
		firstAnimate.setAttribute('values','#000000;#ffffff');
		firstAnimate.setAttribute('repeatCount',0);

		var secondAnimate = document.createElementNS(svgNS,'animate');
		secondAnimate.setAttribute('attributeName','offset');
		secondAnimate.setAttribute('dur','3s');
		secondAnimate.setAttribute('values','0.25;0.75');
		secondAnimate.setAttribute('repeatCount',0);

		var thirdAnimate = document.createElementNS(svgNS,'animate');
		thirdAnimate.setAttribute('attributeName','stop-color');
		thirdAnimate.setAttribute('dur','3s');
		thirdAnimate.setAttribute('values','#ffffff;#000000');
		thirdAnimate.setAttribute('repeatCount',0);

		firstStop.appendChild(firstAnimate);
		secondStop.appendChild(secondAnimate);
		thirdStop.appendChild(thirdAnimate);

		lg.appendChild(firstStop);
		lg.appendChild(secondStop);
		lg.appendChild(thirdStop);

		var defs = this.defsFromObject(e);
		defs.appendChild(lg);

	},

	xForNode: function(n) {
		return parseInt($(n).css('margin-left')) + parseInt($(n).css('width'))/2.0;
	},

	yForNode: function(n) {
		return parseInt($(n).css('margin-top')) + parseInt($(n).css('height'))/2.0;
	},

	// a = origin, b = destination, c = container
	// pass b=false to center in container, otherwise pass an element
	drawLine: function(a,b,c,lineId,color,width,viewBoxWidth,viewBoxHeight) {

		var svgNS = this.svgNamespace();

		var svg = document.createElementNS(svgNS,'svg');
		svg.setAttribute('width','100%');
		svg.setAttribute('height','100%');
		svg.setAttribute('viewBox','0 0 '+viewBoxWidth+' '+viewBoxHeight);
		svg.setAttribute('version','1.1');
		svg.setAttribute('style','position:absolute;top:0;left:0;');

		var x1 = this.xForNode(a);
		var y1 = this.yForNode(a);

		var x2 = this.xForNode(b);
		var y2 = this.yForNode(b);

		var line = document.createElementNS(svgNS,'line');
		line.setAttribute('x1',x1);
		line.setAttribute('y1',y1);
		line.setAttribute('x2',b?x2:'50%');
		line.setAttribute('y2',b?y2:'50%');
		line.setAttribute('style','stroke:'+color+';stroke-width:'+width+';');
		line.setAttribute('id',lineId);

		svg.appendChild(line);
		$('#banklines').prepend(svg);

		return line;
	},

	drawBankLines: function() {
		svg.drawLine('#banknode1',false,'#banklines','bankline1','#DFBEFA',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode2',false,'#banklines','bankline2','#FABEBE',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode3',false,'#banklines','bankline3','#F8FABE',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode4',false,'#banklines','bankline4','#FAEABE',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode5',false,'#banklines','bankline5','#BEDAFA',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode6',false,'#banklines','bankline6','#F4F0F5',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode7',false,'#banklines','bankline7','#DCFABE',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode8',false,'#banklines','bankline8','#F4F0F5',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode9',false,'#banklines','bankline9','#BEDAFA',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode10',false,'#banklines','bankline10','#E7FAFB',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode11',false,'#banklines','bankline11','#F8FABE',4,window.innerWidth,window.innerHeight);

		// invisible
		svg.drawLine('#banknode8','#banknode8','#banklines','bankline12','#E7FAFB',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode4','#banknode4','#banklines','bankline13','#FAEABE',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode3','#banknode3','#banklines','bankline14','#FAEABE',4,window.innerWidth,window.innerHeight);
		svg.drawLine('#banknode9','#banknode9','#banklines','bankline15','#BEDAFA',4,window.innerWidth,window.innerHeight);

	}
}

