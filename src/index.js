const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {genrateMssg, genrateLocatMssg} = require('./utils/message');
const { saveUser , deleteUser, getUser, getRoomUser} = require('./utils/users');



const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000
const publicDir = path.join(__dirname , '../public');

app.use(express.static(publicDir));


io.on('connection', (socket)=>{
    console.log('New socket connection' , socket.conn.id);
    
     socket.on('join', (options , callback)=>{
      const {user , error} =   saveUser({id:socket.id, ...options});
       if(error !==undefined){
            return callback(error);
        }
        socket.join(user.room);
        socket.emit('message', genrateMssg('Admin' ,'Welcome!'));
        socket.broadcast.to(user.room).emit('message' , genrateMssg('Admin' ,`${user.username} has Join!`));
        io.to(user.room).emit('roomData',{
             room: user.room,
             roomuser : getRoomUser(user.room)
        })       
     })  

   
   
    socket.on('clientMssg', (mssg, callback)=>{
        const filter = new Filter();
        const user = getUser(socket.id);
        filter.addWords('chut','bur', 'bhosdike', 'land', 'chuchi')
        if(filter.isProfane(mssg)){
            io.to(user.room).emit('message',genrateMssg(user.username ,filter.clean(mssg)));
          return  callback();    
        }
        io.to(user.room).emit('message',genrateMssg(user.username ,mssg));
        callback();
    })
    socket.on('location', (location , callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('locationLink', genrateLocatMssg(user.username ,`https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback();
    })
    socket.on('disconnect', ()=>{
        const { user, error} = deleteUser(socket.id);
        if(error){
            return 
        }
        const mssg = `${user.username} has left!`
        io.to(user.room).emit('message', genrateMssg('Admin' ,mssg));
    })

})

server.listen(port , ()=>{
    console.log(`App is listen on port ${port}`)
})
