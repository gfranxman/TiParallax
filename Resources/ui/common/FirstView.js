function FirstView() {

	var self  = Ti.UI.createView({top:0, left:0, 
		width:Ti.UI.FILL, height:Ti.UI.FILL,
		backgroundColor:'black'
	});
	
	//physics
	var velocity = 0.0, 
		damping = 0.9, 
		parallax = 4.0;
	
	//scene
	var	width = 2 * Titanium.Platform.displayCaps.platformWidth,
		height = Titanium.Platform.displayCaps.platformHeight,
		sky =[],
		clouds = [], 
		hills = [], 
		BackgroundScene, 
		ForegroundScene;
		
	// app state
	var touchStart = null,
		lastTouch = null,
		drawing = false,
		dragging = false ;
	
	
	function createClouds() {
		var self = Ti.UI.createView({top:0,left:-width/4,width:2*width,height:height,
			backgroundColor:'#33CCff'
		});

		for (x=0;x<20;x++) {
			
			var cloudHeight = Math.floor(Math.random()*height/5.0);
			var cloudWidth = cloudHeight + Math.floor(Math.random()*150);

			clouds[x] = Ti.UI.createView({
				width	: cloudWidth,
				height	: cloudHeight,
				backgroundColor	: '#fff',
				top		: 10 + Math.floor(Math.random()*height *2.0/3.0),
				left	: width/20*x,
				borderRadius:30
			});	

			self.add(clouds[x]);
		}
		
		return self;
	}
	
	function createHills() {
		var self = Ti.UI.createView({bottom:0,left:-width/4,width:2*width,height:height});///3});

		for (x=0;x<20;x++) {
			hills[x] = Ti.UI.createView({
				width	: Math.floor(Math.random()*300),
				height	: Math.floor(Math.random()*height/3),
				backgroundColor	: '#009966',
				bottom	: 0,
				left	: width/20*x,
				borderRadius : 15,
				borderWidth:5,
				borderColor : '#008855'
			});
			self.add(hills[x]);
		}
		return self;
	}
	
	function clip( val, min, max ){
		if( val > max){
			return max;
		}
		else if( val < min ){
			return min;
		}
		return val;
	}
	
	function adjustScene(){
		if( ! drawing ){
			drawing = true ;
			
			var maxLeft = 0;
			var minLeft = Ti.Platform.displayCaps.platformWidth - width;//BackgroundScene.width  ;
			
			var fgLeft = clip( ForegroundScene.left + velocity, minLeft, maxLeft ) ;
			var bgLeft = clip( BackgroundScene.left + (velocity/parallax), minLeft/parallax, maxLeft/parallax) ;
				
			ForegroundScene.left = fgLeft ;
			BackgroundScene.left = bgLeft ;	
		}	
	}
	
	
	function runApplication(container) {
		BackgroundScene = createClouds();
		ForegroundScene = createHills();
	
		
		ForegroundScene.addEventListener( 'touchstart', function(e){
			dragging = true ;
			touchStart = e;
			Ti.API.debug( "touchstart");
		});
	
		
		ForegroundScene.addEventListener( 'touchmove', function(e){
			if( !drawing ){			
				lastTouch = e ;
				velocity = e.x - touchStart.x ;
	
				//Ti.API.debug( e.x, touchStart.x, velocity);
				
				adjustScene() ;
			}		
		});
	
	 
	 	ForegroundScene.addEventListener( "touchend", function(e){
	 		dragging = false ;
			Ti.API.debug( "touchend");
		});
	
	
		ForegroundScene.addEventListener( "postlayout", function(e){
			drawing=false;
		})
		
		// here's our momentum
		setInterval(function(){
			if( !drawing && !dragging ){
				velocity *= damping ;
				adjustScene();
			}
		}, 1000/30);
		/*
		win.add(BackgroundScene);
		win.add(ForegroundScene);
		*/
		container.add( BackgroundScene );
		container.add(ForegroundScene);
	}
	
	/*
	  
	 var win = Ti.UI.createWindow();
		win.fullscreen = true;
		win.orientationModes = [Ti.UI.LANDSCAPE_LEFT,Ti.UI.LANDSCAPE_RIGHT];
		win.open();
		
	runApplication();
	return win ;
	*/
	runApplication(self);
	return self;
}

module.exports = FirstView;
