
    socket.emit('updatedCount', count);
    socket.on('increment', ()=>{
        count++;
        io.emit('updatedCount', count);
    })


    
socket.on('updatedCount', (count)=>{
    console.log('total no of collection', count);
})
const btn = document.querySelector('#btn');
btn.addEventListener('click', ()=>{
    socket.emit('increment');
})
