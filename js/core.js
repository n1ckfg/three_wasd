"use strict";

var canvas, renderer, scene, camera, controls, effect, clock, light;

function init() {
    setupWebVrPolyfill();

    setupRenderer();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

    scene = new THREE.Scene();

    clock = new THREE.Clock();

    setupPlayer();
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = renderer.domElement;
    document.body.appendChild(canvas);
    window.addEventListener('resize', onResize, false);
}

function setupWebVrPolyfill() {
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
}

function setupPlayer() {
    selectControls();
}

function updatePlayer(delta) {
    try {
      controls.update(delta);
    } catch (err) { }
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

function selectControls() {
    navigator.getVRDisplays().then(function (vrDisplays) {
      if (vrDisplays.length) {
        controls = new THREE.VRControls(camera);
      } else {
        controls = new THREE.FirstPersonControls(camera);
        controls.lookSpeed = 0.1;
      }
    });
}

