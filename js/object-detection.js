import { renderPredictions } from './render-predictions.mjs'
// the "cocoSsd" and "tf" variables are not explicitly imported because module imports for tensorflow.js are only provided for node.js packages, not directly for the CDN scripts (therefore those variables are loaded into the global namespace for now)

// use the web cam stream to predict objects on images
(async () => {  
  const videoRef = document.getElementById('video')
  const canvasRef = document.getElementById('canvas')
  const modelPromise = cocoSsd.load()
  const webCamPromise = tf.data.webcam(videoRef)
  
  // wait for fulfillment of promises in parallel
  const [model, webCam] = await Promise.all([modelPromise, webCamPromise])
  
  // continuosly predict objects
  while (true) {
    const img = await webCam.capture()
    const predictions = await model.detect(img)

    renderPredictions(canvasRef, predictions)
       
    // Dispose the tensor to release the memory.
    img.dispose()

    // Give some breathing room by waiting for the next animation frame to
    // fire.
    await tf.nextFrame()
  }
})()  // using an Async Immediately-Invoked Function Expression so we can use use Await instead of Promises
