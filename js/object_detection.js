import { detectFrame, webCamPromise } from './predictions.mjs'
// "cocoSsd" is not explicitly imported because module imports for tensorflow.js are only provided for NPM/node.js, not directly for the browser (therefore it is loaded into the global context for now)

// use the web cam stream to predict objects on images
(async () => {  
  const videoRef = document.getElementById('video')
  const canvasRef = document.getElementById('canvas')
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const model = cocoSsd.load()
    const webCam = webCamPromise(videoRef)
        
    try {
      const [predictions] = await Promise.all([model, webCam])

      detectFrame(canvasRef, videoRef, predictions)
    } catch(error) {
      console.error(error)
    }
  }
})()  // using an Async Immediately-Invoked Function Expression so we can use use Await instead of Promises
