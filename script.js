const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(async()=>{
  console.log("1");
  startVideo();
})

async function startVideo() {
  console.log("2");
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
  const labeledFaceDescriptors = await loadLabeledImages()
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    document.body.append('Loaded');
    video.addEventListener('play', async() => {
      const canvas = faceapi.createCanvasFromMedia(video)
      document.body.append(canvas)
      const displaySize = { width: video.width, height: video.height }
      faceapi.matchDimensions(canvas, displaySize)
      let p = 0;
      setInterval(async () => { 
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        if(resizedDetections.length)
        {
          const result =  resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
          // console.log(resizedDetections[0])
          const box = resizedDetections[0].detection.box
        const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
        if(result[0].label=='narendra')
        p=p+1;
          // console.log(p)
        if(p==50)
        {
          console.log("attended");
        }
        drawBox.draw(canvas)
        }
      }, 100)
    })
}


function loadLabeledImages() {
  console.log("5");
  const labels = ['narendra']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      console.log("9");
        const img = await faceapi.fetchImage(`https://media-exp1.licdn.com/dms/image/C4E03AQEjeflD2KZJ2Q/profile-displayphoto-shrink_400_400/0?e=1603929600&v=beta&t=RAWxiMMc_Vr8HdZt4ruXZejvvWHIutrZOR-h4eEVuLs`)
        console.log("10")
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      console.log("6");
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}