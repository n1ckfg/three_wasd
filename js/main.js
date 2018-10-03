"use strict";

var room, sky;

function setup() {
    init();
    
    var texLoader = new THREE.TextureLoader();
    texLoader.load("./textures/pano.jpg", function(data) {
        var skyGeo = new THREE.SphereGeometry(500, 60, 40);
        skyGeo.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
        var skyMtl = new THREE.MeshBasicMaterial({ map : data });
        sky = new THREE.Mesh(skyGeo, skyMtl);
        scene.add(sky);
    });

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
    renderer.render(scene, camera);
}

function main() {
    setup();
    animate();
}

window.onload = main;
