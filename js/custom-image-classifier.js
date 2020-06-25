import { renderImageClassification } from './render-predictions.mjs'
// the "mobilenet", "knnClassifier" and "tf" variables are not explicitly imported because module imports for tensorflow.js are only provided for node.js packages, not directly for the CDN scripts (therefore those variables are loaded into the global namespace for now)

// use the web cam stream to predict objects on images
(async () => {  
  const videoRef = document.getElementById('video')
  const canvasRef = document.getElementById('canvas')
  const modelPromise = mobilenet.load()
  const classifier = knnClassifier.create()
  const webCamPromise = tf.data.webcam(videoRef)
  
  // wait for fulfillment of promises in parallel
  const [model, webCam] = await Promise.all([modelPromise, webCamPromise])
  
  const addExample = async classId => {
    // Capture an image from the web camera.
    const img = await webCam.capture()

    // Get the intermediate activation of MobileNet 'conv_preds' and pass that
    // to the KNN classifier.
    const activation = model.infer(img, true)

    // Pass the intermediate activation to the classifier.
    classifier.addExample(activation, classId)

    // Dispose the tensor to release the memory.
    img.dispose()
  }
  
  // When clicking a button, add an example for that class.
  document.getElementById('class-a').addEventListener('click', () => addExample(0))
  document.getElementById('class-b').addEventListener('click', () => addExample(1))
  document.getElementById('class-c').addEventListener('click', () => addExample(2))

  const classes = ['A', 'B', 'C']
  
  while (true) {
    if (classifier.getNumClasses() > 0) {
      const img = await webCam.capture()

      // Get the activation from mobilenet from the webcam.
      const activation = model.infer(img, 'conv_preds')
      // Get the most likely class and confidence from the classifier module.
      const predictedClass = await classifier.predictClass(activation)

      renderImageClassification(canvasRef, predictedClass, classes)

      // Dispose the tensor to release the memory.
      img.dispose()
    }

    await tf.nextFrame()
  }
})()  // using an Async Immediately-Invoked Function Expression so we can use use Await instead of Promises
