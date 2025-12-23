const net=require('net')

const socket=net.createConnection({port:3099,host:"127.0.0.1"},()=>{
    socket.write("This is message from simple-sender.js")
})