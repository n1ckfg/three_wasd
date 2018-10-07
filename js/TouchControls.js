/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 * @author n1ckfg / https://fox-gieg.com/
 **/

"use strict";

THREE.TouchControls = function(object, domElement) {

	this.object = object;
	this.target = new THREE.Vector3(0, 0, 0);

	this.domElement = (domElement !== undefined) ? domElement : document;

	this.enabled = true;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if (this.domElement !== document) {
		this.domElement.setAttribute('tabindex', - 1);
	}

	//

	this.handleResize = function() {
		if (this.domElement === document) {
			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;
		} else {
			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;
		}
	}

	this.onTouchDown = function(event) {
		if (this.domElement !== document) {
			this.domElement.focus();
		}

		event.preventDefault();
		event.stopPropagation();

		/*
		if (this.activeLook) {
			switch (event.button) {
				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;
			}
		}

		this.mouseDragOn = true;
		*/
	}

	this.onTouchUp = function(event) {
		event.preventDefault();
		event.stopPropagation();

		/*
		if (this.activeLook) {
			switch (event.button) {
				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;
			}
		}

		this.mouseDragOn = false;
		*/
	}

	this.onTouchMove = function(event) {
		/*
		if (this.domElement === document) {
			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;
		} else {
			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
		}
		*/
	}
	
	this.dispose = function() {
		this.domElement.removeEventListener('touchdown', _onTouchDown, false);
		this.domElement.removeEventListener('touchmove', _onTouchMove, false);
		this.domElement.removeEventListener('touchup', _onTouchUp, false);
	}

	var _onTouchMove = bind(this, this.onTouchMove);
	var _onTouchDown = bind(this, this.onTouchDown);
	var _onTouchUp = bind(this, this.onTouchUp);

	this.domElement.addEventListener('touchmove', _onTouchMove, false);
	this.domElement.addEventListener('touchdown', _onTouchDown, false);
	this.domElement.addEventListener('touchup', _onTouchUp, false);

	function bind(scope, fn) {
		return function() {
			fn.apply(scope, arguments);
		}
	}

	this.handleResize();

}