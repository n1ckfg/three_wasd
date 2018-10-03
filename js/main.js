"use strict";

function setup() {
    init();
    
    room = new THREE.Mesh(
        new THREE.BoxGeometry(6, 6, 6, 10, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0x202020, wireframe: true })
    );
    room.position.y = 0;//3;
    scene.add(room);
}

function animate() {
    window.requestAnimationFrame(animate);
    updatePlayer();
    controls.update();
    renderer.render(scene, camera);
}

function main() {
    setup();
    animate();
}

window.onload = main;
