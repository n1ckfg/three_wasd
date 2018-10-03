"use strict";

function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    scene = new THREE.Scene();

    controls = new THREE.DeviceOrientationControls(camera);

    room = new THREE.Mesh(
        new THREE.BoxGeometry(6, 6, 6, 10, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0x202020, wireframe: true })
    );
    room.position.y = 0;//3;
    scene.add(room);

    clock = new THREE.Clock;

    setupPlayer();

    window.addEventListener('resize', onWindowResize, false);

    /*
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
    */

    document.addEventListener("keydown", function(event) {
    	if (event.altKey && !altKeyBlock) {
    		altKeyBlock = true;
    		console.log(altKeyBlock);
    	}
    });

    document.addEventListener("keyup", function(event) {
    	if (altKeyBlock) {
    		altKeyBlock = false;
    		console.log(altKeyBlock);
    	}
    });
}

function animate(timestamp) {
    window.requestAnimationFrame(animate);
    controls.update();
    updatePlayer();
    renderer.render(scene, camera);
}

function main() {
    init();
    animate();
}

window.onload = main;
