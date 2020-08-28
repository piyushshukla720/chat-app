const express=require('express')
const app = express()
const server=require('http').Server(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser');
const { v4:uuidV4 }=require('uuid')

const PORT=process.env.PORT || 3231
app.set('view engine','ejs')

console.log('Listening on port *'+PORT)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/',(req ,res)=>{
 //res.redirect(`/${uuidV4()}`)
 res.render('home')
})

app.post('/',(req,res)=>{
  res.redirect(`/${req.body.room_id}`)
})

app.get('/:room',(req,res) => {
 res.render('room', {roomId: req.params.room })
})

io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected',userId)
        socket.on('disconnect',()=>{
            console.log('disconnecting...')
            socket.to(roomId).broadcast.emit('user-disconnected',userId)
        })
    })
})

server.listen(PORT)
