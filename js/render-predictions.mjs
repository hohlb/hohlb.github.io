export const renderImageClassification = (canvasRef, predictedClass, classes) => {
  const canvasContext = createCanvasBase(canvasRef)
  const boundingBox = [0, 0, canvasContext.canvas.width, canvasContext.canvas.height]
  
  const predictedClassLabel = classes[predictedClass.label]
  const predictedClassProbability = predictedClass.confidences[predictedClass.label]
  const predictedClassProbabilityPercentage = predictedClassProbability.toLocaleString('en', {style: 'percent'})
  const classLabel = `${predictedClassLabel} ${predictedClassProbabilityPercentage}`
      
  drawBoundingBox(canvasContext, boundingBox, classLabel)
  drawClassLabel(canvasContext, boundingBox, classLabel)
}

export const renderObjectDetection = (canvasRef, predictions) => {
  const canvasContext = createCanvasBase(canvasRef)
  
  predictions.forEach(prediction => drawBoundingBox(canvasContext, prediction.bbox, prediction.class))
  predictions.forEach(prediction => drawClassLabel(canvasContext, prediction.bbox, prediction.class))
}

const createCanvasBase = (canvasRef) => {
  const canvasContext = canvasRef.getContext('2d')    
  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height)
  canvasContext.font = '16px sans-serif'
  canvasContext.textBaseline = 'top'
  
  return canvasContext
}

const drawBoundingBox = (canvasContext, boundingBox, classLabel) => {
    const x = boundingBox[0]
    const y = boundingBox[1]
    const width = boundingBox[2]
    const height = boundingBox[3]
    
    // Draw the bounding box.
    canvasContext.strokeStyle = '#00FFFF'
    canvasContext.lineWidth = 4
    canvasContext.strokeRect(x, y, width, height)
    
    // Draw the label background.
    canvasContext.fillStyle = '#00FFFF'
    const textWidth = canvasContext.measureText(classLabel).width
    const textHeight = parseInt(canvasContext.font, 10) // base 10
    canvasContext.fillRect(x, y, textWidth + 4, textHeight + 4)
}

const drawClassLabel = (canvasContext, boundingBox, classLabel) => {
    const x = boundingBox[0]
    const y = boundingBox[1]
    
    // Draw the text last to ensure it's on top.
    canvasContext.fillStyle = '#000000'
    canvasContext.fillText(classLabel, x, y)
}
