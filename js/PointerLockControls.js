/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 * @author n1ckfg / http://fox-gieg.com/
 **/

THREE.PointerLockControls = function(camera, domElement) {

	var scope = this;

	this.domElement = domElement || document.body;
	this.isLocked = false;

	camera.rotation.set(0, 0, 0);

	var pitchObject = new THREE.Object3D();
	pitchObject.add(camera);

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add(pitchObject);

	var PI_2 = Math.PI / 2;

	function onMouseMove(event) {
		if (scope.isLocked === false) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max(- PI_2, Math.min(PI_2, pitchObject.rotation.x));
	}

	function onPointerlockChange() {
		if (document.pointerLockElement === scope.domElement) {
			scope.dispatchEvent({ type: 'lock' });
			scope.isLocked = true;
		} else {
			scope.dispatchEvent({ type: 'unlock' });
			scope.isLocked = false;
		}
	}

	function onPointerlockError() {
		console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
	}

	var controlsEnabled = false;

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var canJump = false;

	var prevTime = performance.now();
	var velocity = new THREE.Vector3();
	var direction = new THREE.Vector3();
	var vertex = new THREE.Vector3();
	var color = new THREE.Color();

	function setupPointerLock() {
			var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

			if (havePointerLock) {
				var element = document.body;
				var pointerlockchange = function(event) {
					if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
						controlsEnabled = true;
						controls.enabled = true;
					} else {
						controls.enabled = false;
					}
				};

				var pointerlockerror = function(event) {
					//
				};

				// Hook pointer lock state change events
				document.addEventListener('pointerlockchange', pointerlockchange, false);
				document.addEventListener('mozpointerlockchange', pointerlockchange, false);
				document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

				document.addEventListener('pointerlockerror', pointerlockerror, false);
				document.addEventListener('mozpointerlockerror', pointerlockerror, false);
				document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

				instructions.addEventListener('click', function(event) {
					// Ask the browser to lock the pointer
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
					element.requestPointerLock();
				}, false);
			} else {
				console.log('Your browser doesn\'t seem to support Pointer Lock API');
			}
	}

	this.connect = function () {
		document.addEventListener('mousemove', onMouseMove, false);
		document.addEventListener('pointerlockchange', onPointerlockChange, false);
		document.addEventListener('pointerlockerror', onPointerlockError, false);
	};

	this.disconnect = function () {
		document.removeEventListener('mousemove', onMouseMove, false);
		document.removeEventListener('pointerlockchange', onPointerlockChange, false);
		document.removeEventListener('pointerlockerror', onPointerlockError, false);
	};

	this.dispose = function () {
		this.disconnect();
	};

	this.getObject = function () {
		return yawObject;
	};

	this.getDirection = function () {
		// assumes the camera itself is not rotated
		var direction = new THREE.Vector3(0, 0, - 1);
		var rotation = new THREE.Euler(0, 0, 0, 'YXZ');

		return function (v) {
			rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);
			v.copy(direction).applyEuler(rotation);
			return v;
		};
	}();

	this.lock = function () {
		this.domElement.requestPointerLock();
	};

	this.unlock = function () {
		document.exitPointerLock();
	};

	this.connect();

	function onKeyDown(event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if (canJump === true) velocity.y += 350;
				canJump = false;
				break;
		}
	};

	function onKeyUp(event) {
		switch(event.keyCode) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};

	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);



	function update() {
		if (controlsEnabled === true) {
			var time = performance.now();
			var delta = (time - prevTime) / 1000;

			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;

			velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

			direction.z = Number(moveForward) - Number(moveBackward);
			direction.x = Number(moveLeft) - Number(moveRight);
			direction.normalize(); // this ensures consistent movements in all directions

			if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
			if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

			if (onObject === true) {
				velocity.y = Math.max(0, velocity.y);
				canJump = true;
			}

			controls.getObject().translateX(velocity.x * delta);
			controls.getObject().translateY(velocity.y * delta);
			controls.getObject().translateZ(velocity.z * delta);

			if (controls.getObject().position.y < 10) {
				velocity.y = 0;
				controls.getObject().position.y = 10;
				canJump = true;
			}

			prevTime = time;
		}
	}

};

THREE.PointerLockControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.PointerLockControls.prototype.constructor = THREE.PointerLockControls;
