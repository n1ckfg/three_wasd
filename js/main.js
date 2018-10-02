"use strict";

function main() {
    
    threeStart();

}

window.onload = main;

function threeStart() {
    document.addEventListener("visibilitychange", visibilityChanged);

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);

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
    if (viveMode) updateControllers();

    if (armFrameForward) {
        armFrameForward = false;
        isPlaying = false;
        frameForward();
        if (latkDebug) console.log("ff: " + counter);
    }
    if (armFrameBack) {
        armFrameBack = false;
        isPlaying = false;
        frameBack();
        if (latkDebug) console.log("rew: " + counter);
    }
    if (armTogglePause) {
        isPlaying = !isPlaying;
        if (latkDebug) console.log("playing: " + isPlaying);
        armTogglePause = false;
    }

    if (isPlaying) {
        if (!useAudioSync && !hidden) {
            pTime = time;
            time = new Date().getTime() / 1000;
            frameDelta += time - pTime;
        } else if (useAudioSync && !hidden) {
            /*
            if (subtitleText) {
                subtitleText.lookAt(camera);
                subtitleText.rotation.set(0, -45, 0);
            }
            */
        }

        if (frameDelta >= frameInterval) {
            frameDelta = 0;

            frameMain();
        }

        if (isDrawing) {
            var last = layers.length - 1;
            var drawTrailLength = 4;

            if (drawWhilePlaying && layers[last].frames.length > 1 && layers[last].frames[layers[last].previousFrame].length > 0) {
                var lastStroke = layers[last].frames[layers[last].previousFrame][layers[last].frames[layers[last].previousFrame].length - 1];
                var points = getPoints(lastStroke);

                for (var pts = parseInt(points.length / drawTrailLength) + 1; pts < points.length - 1; pts++) {
                    createTempStroke(points[pts].x, points[pts].y, points[pts].z);
                }
                layers[last].frames[layers[last].counter].push(tempStroke);
                //~
                endStroke();

                beginStroke(mouse3D.x, mouse3D.y, mouse3D.z);
            }
        }

        /*
        if (isDrawing) {
            var last = layers.length - 1;
            var drawTrailLength = 4;

            if (drawWhilePlaying && layers[last].frames.length > 1 && layers[last].frames[layers[last].previousFrame].length > 0) {
                var lastStroke = layers[last].frames[layers[last].previousFrame][layers[last].frames[layers[last].previousFrame].length - 1];
                var points = getPoints(lastStroke);
                console.log(points);
                
                for (var pts = parseInt(points.length / drawTrailLength); pts < points.length - 1; pts++) {
                    //layerList[currentLayer].frameList[layerList[currentLayer].currentFrame].brushStrokeList[layerList[currentLayer].frameList[layerList[currentLayer].currentFrame].brushStrokeList.Count - 1].points.Add(lastStroke.points[pts]);
                    updateStroke(points[pts].x, points[pts].y, points[pts].z);
                }
                    endStroke();
                    beginStroke(mouse3D.x, mouse3D.y, mouse3D.z);
            }
        }
        */

        /*
        if (clicked && !isDrawing) {
            beginStroke();
            if (drawWhilePlaying && isPlaying && layerList[currentLayer].frameList.Count > 1 && layerList[currentLayer].frameList[layerList[currentLayer].previousFrame].brushStrokeList.Count > 0) {
                BrushStroke lastStroke = layerList[currentLayer].frameList[layerList[currentLayer].previousFrame].brushStrokeList[layerList[currentLayer].frameList[layerList[currentLayer].previousFrame].brushStrokeList.Count - 1];
                for (int pts = lastStroke.points.Count / drawTrailLength; pts < lastStroke.points.Count - 1; pts++) {
                    layerList[currentLayer].frameList[layerList[currentLayer].currentFrame].brushStrokeList[layerList[currentLayer].frameList[layerList[currentLayer].currentFrame].brushStrokeList.Count - 1].points.Add(lastStroke.points[pts]);
                }
            }
        }
        */
    }
