const socket=io('/')
const videoGrid=document.getElementById('video-grid')
const myPeer = new Peer()
const myVideo = document.createElement('video')
var videoStream=null
myVideo.muted=true
const peers={}
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{
  addVideoStream(myVideo,stream)
  videoStream=stream
  myPeer.on('call',call => {
      call.answer(stream)
      const video=document.createElement('video')
      call.on('stream',userVideoStream => {
        addVideoStream(video,userVideoStream)  
      })

  })

 
  socket.on('user-connected',userId => {
      connectToNewUser(userId,stream)
  })
})

socket.on('user-disconnected',userId=>{
  alert("disconnecting")
  if(peers[userId]) peers[userId].close()
})

myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id)
})


socket.on('user-connected',userId => {
     
})

function addVideoStream(video,stream) {
    video.srcObject=stream
    video.setAttribute("playsinline","")
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}

function connectToNewUser(userId,stream){
   const call = myPeer.call(userId,stream)
   const video = document.createElement('video')
   call.on('stream',userVideoStream => {
       addVideoStream(video,userVideoStream)
   })
   call.on('close',()=>{
       video.remove() 
   })

   peers[userId]=call
}

function toggleVideo(){
if(videoStream.getVideoTracks()[0].enabled){
videoStream.getVideoTracks()[0].enabled = false
$('.vid-btn').html("<i class='fa fa-video-slash'></i>")
}else{
videoStream.getVideoTracks()[0].enabled = true
$('.vid-btn').html("<i class='fa fa-video'></i>")
}
}

function toggleAudio(){
if(videoStream.getAudioTracks()[0].enabled){
videoStream.getAudioTracks()[0].enabled = false
$('.aud-btn').html("<i class='fa fa-microphone-slash'></i>")
}else{
videoStream.getAudioTracks()[0].enabled = true
$('.aud-btn').html("<i class='fa fa-microphone'></i>")
}
}


