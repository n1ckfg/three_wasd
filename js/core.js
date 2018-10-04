"use strict";

var canvas, renderer, scene, camera, controls, effect, clock, light;

var sprites = [];
var colliders = [];

var isWalkingForward = false;
var isWalkingBackward = false;
var isWalkingLeft = false;
var isWalkingRight = false;
var isFlyingUp = false;
var isFlyingDown = false;

var flyingAllowed = true;
var flyingThreshold = 0.15;
var movingSpeed = 0;
var movingSpeedMax = 0.04;
var movingDelta = 0.002;
var floor = 0;
var gravity = 0.01;
var cameraGaze;
var isMobile = false;

function init() {
    // Get config from URL
    var config = (function() {
      var config = {};
      var q = window.location.search.substring(1);
      if (q === '') {
        return config;
      }
      var params = q.split('&');
      var param, name, value;
      for (var i = 0; i < params.length; i++) {
        param = params[i].split('=');
        name = param[0];
        value = param[1];

        // All config values are either boolean or float
        config[name] = value === 'true' ? true :
                       value === 'false' ? false :
                       parseFloat(value);
      }
      return config;
    })();

    var polyfill = new WebVRPolyfill(config);

    console.log("Using webvr-polyfill version " + WebVRPolyfill.version + " with configuration: " + JSON.stringify(config));
    
    //document.querySelector('button#fullscreen').addEventListener('click', function() {
      //enterFullscreen(canvas);
    //});

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = renderer.domElement;
    document.body.appendChild(canvas);
    window.addEventListener('resize', onResize, false);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    scene = new THREE.Scene();

    clock = new THREE.Clock;

    setupPlayer();
}

function onMouseDown() {
    //
}

function onMouseMove() {
    //
}

function onMouseUp() {
    //
}

function onTouchStart() {
    //
}

function onTouchMove() {
    //
}

function onTouchEnd() {
    //
}

function onResize() {
  // The delay ensures the browser has a chance to layout
  // the page and update the clientWidth/clientHeight.
  // This problem particularly crops up under iOS.
  if (!onResize.resizeDelay) {
    onResize.resizeDelay = setTimeout(function () {
      onResize.resizeDelay = null;
      console.log('Resizing to %s x %s.', window.innerWidth, window.innerHeight);
      //effect.setSize(canvas.clientWidth, canvas.clientHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 250);
  }
}

function enterFullscreen (el) {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
}

function setupControls() {
    navigator.getVRDisplays().then(function (vrDisplays) {
      if (vrDisplays.length) {
        controls = new THREE.VRControls(camera);
      } else {
        controls = new THREE.OrbitControls(camera);
        controls.target.set(0, 0, -1);
      }
    });

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    
    window.addEventListener("keydown", function(event) {
        if (getKeyCode(event) == 'w') isWalkingForward = true;
        if (getKeyCode(event) == 'a') isWalkingLeft = true;
        if (getKeyCode(event) == 's') isWalkingBackward = true;
        if (getKeyCode(event) == 'd') isWalkingRight = true;
        if (getKeyCode(event) == 'q') isFlyingDown = true;
        if (getKeyCode(event) == 'e') isFlyingUp = true;
    });

    window.addEventListener("keyup", function(event) {
        if (getKeyCode(event) == 'w') isWalkingForward = false;
        if (getKeyCode(event) == 'a') isWalkingLeft = false;
        if (getKeyCode(event) == 's') isWalkingBackward = false;
        if (getKeyCode(event) == 'd') isWalkingRight = false;
        if (getKeyCode(event) == 'q') isFlyingDown = false;
        if (getKeyCode(event) == 'e') isFlyingUp = false;
    });
}

function getKeyCode(event) {
    var k = event.charCode || event.keyCode;
    var c = String.fromCharCode(k).toLowerCase();
    return c;
}

function setupPlayer() {
    setupControls();
}

function updatePlayer() {
    if ((isWalkingForward || isWalkingBackward || isWalkingLeft || isWalkingRight || isFlyingUp || isFlyingDown) && movingSpeed < movingSpeedMax) {
        if (movingSpeed < movingSpeedMax) {
            movingSpeed += movingDelta;
        } else if (movingSpeed > movingSpeedMax) {
            movingSpeed = movingSpeedMax;
        }
    } else {
        if (movingSpeed > 0) {
            movingSpeed -= movingDelta;
        } else if (movingSpeed < 0) {
            movingSpeed = 0;
        }
    }

    if (movingSpeed > 0) {
    	if (isWalkingForward) {
            camera.translateZ(-movingSpeed);
    	}

    	if (isWalkingBackward) {
            camera.translateZ(movingSpeed);		
    	} 

    	if (isWalkingLeft) {
    		camera.translateX(-movingSpeed);
    	}

    	if (isWalkingRight) {
            camera.translateX(movingSpeed);
    	}

    	if (isFlyingUp) {
            camera.translateY(movingSpeed);
    	}

    	if (isFlyingDown) {
            camera.translateY(-movingSpeed);
    	}
    }

    controls.update(); // must be last
}

function spriteAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {          
    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;

    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
    texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

    this.tileDisplayDuration = tileDispDuration;

    this.currentDisplayTime = 0;

    this.currentTile = 0;
        
    this.update = function( milliSec ) {
        this.currentDisplayTime += milliSec;
        while (this.currentDisplayTime > this.tileDisplayDuration) {
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;
            if (this.currentTile == this.numberOfTiles)
                this.currentTile = 0;
            var currentColumn = this.currentTile % this.tilesHorizontal;
            texture.offset.x = currentColumn / this.tilesHorizontal;
            var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
            texture.offset.y = currentRow / this.tilesVertical;
        }
    };
}

function updateSprites() {
    var delta = clock.getDelta(); 
    for (var i=0; i<sprites.length; i++){
        sprites[i].update(1000 * delta);
    }
}