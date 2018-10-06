"use strict";

var room, sky, flower, flowerMixer, pointLight;

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

    pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(-5, 1, 5);
    scene.add(pointLight);

    var loader = new THREE.GLTFLoader();
    loader.load("./models/flower.glb", function(data) {
        flower = data.scene;
        scene.add(flower);
        flower.position.y -= 1;
        flower.position.x += 1;

        flowerMixer = new THREE.AnimationMixer(flower);
        for (var i=0; i<data.animations.length; i++) {
            flowerMixer.clipAction(data.animations[i]).play();
        }
    });
}

function animate() {
    window.requestAnimationFrame(animate);

    var delta = clock.getDelta();
    updatePlayer(delta);
    if (flowerMixer) flowerMixer.update(delta);

    renderer.render(scene, camera);
}

function main() {
    setup();
    animate();
}

window.onload = main;
