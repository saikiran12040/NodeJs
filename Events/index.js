const EventEmitter=require("events")

class Emitter extends EventEmitter{}

const myE=new Emitter()


myE.on('foo',()=>{
    console.log('An event occurred!1')
})

myE.on('foo',()=>{
    console.log('An event occured!2')
})

myE.on('foo',(x)=>{
    console.log('An event occured with parameter')
    console.log(x)
})

myE.once('bar',()=>{
    console.log('An event occured bar.')
})

myE.emit('foo')
myE.emit('foo','take this')

myE.emit('bar')
myE.emit('bar')