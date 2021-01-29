const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const dotenv = require('dotenv')
const app = express()
const port = process.env.PORT || 8080
const routesAPI = require('./routes/api')
const helmet = require('helmet')
const server = require('http').Server(app);
const controllerSocket = require('./socket/socket')
const path = require('path');
const io = require('socket.io')(server,{
    cors: {
        origin: '*',
      }
});
var clients =[]
const queueClients = []
const queueQuestion = []
const key = {}
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));
dotenv.config()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(helmet())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});
app.use('/api',routesAPI)
io.on('connection', (socket) => {
    socket.on('setName',(name)=>controllerSocket.setName(name,socket,io))
    socket.on('sendQuestionServer',(data)=>controllerSocket.sendQuestionServer(data,socket,io))
    socket.on('sendAnswer',(data)=>controllerSocket.sendAnswer(data,socket,io))
    socket.on('searchKey',(data)=>controllerSocket.searchKey(data,socket,io))
    // socket.on('checkUser',(client)=>controllerSocket.checkUser(client.socket,io))
    // controllerSocket.checkKey(socket,io)
    socket.on('disconnect',()=>controllerSocket.disconnect(socket,io));
  });

server.listen(port, ()=>{
    console.log(`Server is listening on port: ${port}` )
})
