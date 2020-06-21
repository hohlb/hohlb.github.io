export const webCamPromise = (videoRef) => navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: {
      facingMode: 'user'
    }
  })
  .then(stream => {
    window.stream = stream
    videoRef.srcObject = stream
    return new Promise((resolve, reject) => {
      videoRef.onloadedmetadata = () => {
        resolve()
      }
    })
  })
  
export const detectFrame = (canvasRef, videoRef, model) => {
  model.detect(videoRef).then(predictions => {
    renderPredictions(canvasRef, predictions)
    requestAnimationFrame(() => {
      detectFrame(canvasRef, videoRef, model)
    })
  })
}

const renderPredictions = (canvasRef, predictions) => {
  const ctx = canvasRef.getContext('2d')    
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  // Font options.
  const font = '16px sans-serif'
  ctx.font = font
  ctx.textBaseline = 'top'
  predictions.forEach(prediction => {
    const x = prediction.bbox[0]
    const y = prediction.bbox[1]
    const width = prediction.bbox[2]
    const height = prediction.bbox[3]
    // Draw the bounding box.
    ctx.strokeStyle = '#00FFFF'
    ctx.lineWidth = 4
    ctx.strokeRect(x, y, width, height)
    // Draw the label background.
    ctx.fillStyle = '#00FFFF'
    const textWidth = ctx.measureText(prediction.class).width
    const textHeight = parseInt(font, 10) // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4)
  })

  predictions.forEach(prediction => {
    const x = prediction.bbox[0]
    const y = prediction.bbox[1]
    // Draw the text last to ensure it's on top.
    ctx.fillStyle = '#000000'
    ctx.fillText(prediction.class, x, y)
  })
}