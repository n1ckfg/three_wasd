/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.WasdControls = function(camera) {

	var scope = this;

	this.isWalkingForward = false;
	this.isWalkingBackward = false;
	this.isWalkingLeft = false;
	this.isWalkingRight = false;
	this.isFlyingUp = false;
	this.isFlyingDown = false;

	this.flyingAllowed = true;
	this.flyingThreshold = 0.15;
	this.movingSpeed = 0;
	this.movingSpeedMax = 0.04;
	this.movingDelta = 0.002;
	this.floor = 0;
	this.gravity = 0.01;

	camera.rotation.set(0, 0, 0);

	this.pitchObject = new THREE.Object3D();
	this.pitchObject.add(camera);

	this.yawObject = new THREE.Object3D();
	this.yawObject.position.y = 0; //10;
	this.yawObject.add(this.pitchObject);

	this.PI_2 = Math.PI / 2;

	this.enabled = false;

	this.update = function() {
	    if ((this.isWalkingForward || this.isWalkingBackward || this.isWalkingLeft || this.isWalkingRight || this.isFlyingUp || this.isFlyingDown) && this.movingSpeed < this.movingSpeedMax) {
	        if (this.movingSpeed < this.movingSpeedMax) {
	            this.movingSpeed += this.movingDelta;
	        } else if (this.movingSpeed > this.movingSpeedMax) {
	            this.movingSpeed = this.movingSpeedMax;
	        }
	    } else {
	        if (this.movingSpeed > 0) {
	            this.movingSpeed -= this.movingDelta;
	        } else if (this.movingSpeed < 0) {
	            this.movingSpeed = 0;
	        }
	    }

	    if (this.movingSpeed > 0) {
	    	if (this.isWalkingForward) {
	            camera.translateZ(-this.movingSpeed);
	    	}

	    	if (this.isWalkingBackward) {
	            camera.translateZ(this.movingSpeed);		
	    	} 

	    	if (this.isWalkingLeft) {
	    		camera.translateX(-this.movingSpeed);
	    	}

	    	if (this.isWalkingRight) {
	            camera.translateX(this.movingSpeed);
	    	}

	    	if (this.isFlyingUp) {
	            camera.translateY(this.movingSpeed);
	    	}

	    	if (this.isFlyingDown) {
	            camera.translateY(-this.movingSpeed);
	    	}
	    }
	}

	this.onMouseMove = function(event) {
		if (scope.enabled === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		this.yawObject.rotation.y -= movementX * 0.002;
		this.pitchObject.rotation.x -= movementY * 0.002;

		this.pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, this.pitchObject.rotation.x));
	}

	this.dispose = function() {
		document.removeEventListener('mousemove', this.onMouseMove, false);
	}

	document.addEventListener('mousemove', this.onMouseMove, false);

	this.getObject = function() {
		return this.yawObject;
	}

	this.getDirection = function() {
		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3(0, 0, - 1);
		var rotation = new THREE.Euler(0, 0, 0, 'YXZ');

		return function(v) {
			rotation.set(this.pitchObject.rotation.x, this.yawObject.rotation.y, 0);

			v.copy(direction).applyEuler(rotation);

			return v;
		}
	}

	this.setupPointerLock = function() {
	    scene.add(this.getObject());

	    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	    if (havePointerLock) {
	        var element = document.body;

	        var pointerlockchange = function(event) {
	            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
	                this.enabled = true;
	            } else {
	                this.enabled = false;
	            }
	        }

	        var pointerlockerror = function(event) {
	            console.log("Pointer lock error");
	        }

	        // Hook pointer lock state change events
	        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	        document.addEventListener( 'click', function(event) {
	            // Ask the browser to lock the pointer
	            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
	            element.requestPointerLock();
	        }, false);
	    } else {
	        console.log('Your browser doesn\'t seem to support the Pointer Lock API');
	    }
	}

	this.setupPointerLock();

	this.getKeyCode = function(event) {
	    var k = event.charCode || event.keyCode;
	    var c = String.fromCharCode(k).toLowerCase();
	    return c;
	}

	this.setupKeyControls = function() {
	    //window.addEventListener("mousedown", onMouseDown);
	    //window.addEventListener("mousemove", onMouseMove);
	    //window.addEventListener("mouseup", onMouseUp);

	    //window.addEventListener("touchstart", onTouchStart);
	    //window.addEventListener("touchmove", onTouchMove);
	    //window.addEventListener("touchend", onTouchEnd);
	    
	    window.addEventListener("keydown", function(event) {
	        if (this.getKeyCode(event) === 'w') this.isWalkingForward = true;
	        if (this.getKeyCode(event) === 'a') this.isWalkingLeft = true;
	        if (this.getKeyCode(event) === 's') this.isWalkingBackward = true;
	        if (this.getKeyCode(event) === 'd') this.isWalkingRight = true;
	        if (this.getKeyCode(event) === 'q') this.isFlyingDown = true;
	        if (this.getKeyCode(event) === 'e') this.isFlyingUp = true;
	    });

	    window.addEventListener("keyup", function(event) {
	        if (getKeyCode(event) === 'w') this.isWalkingForward = false;
	        if (getKeyCode(event) === 'a') this.isWalkingLeft = false;
	        if (getKeyCode(event) === 's') this.isWalkingBackward = false;
	        if (getKeyCode(event) === 'd') this.isWalkingRight = false;
	        if (getKeyCode(event) === 'q') this.isFlyingDown = false;
	        if (getKeyCode(event) === 'e') this.isFlyingUp = false;
	    });
	}

	this.setupKeyControls();

}
