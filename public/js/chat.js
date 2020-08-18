const socket = io();
// querySelector
const form = document.querySelector('#form');
const formBtn = form.querySelector('button');
const formInput = document.querySelector('#formInput');
const clientLocation = document.querySelector('#clientLocation');
const mssgContainer = document.querySelector('#mssgContainer');
const chatSidebar = document.querySelector('#chatSidebar')

// templtating
const mssgTemp = document.querySelector('#mssgTemp').innerHTML;
const locatTemp = document.querySelector('#locatTemp').innerHTML;
const roomTemp = document.querySelector('#roomTemp').innerHTML;

// auto scrolling
const autoScroll = ()=>{
    const newMessage = mssgContainer.lastElementChild;

    // Height of the message 
    const newMessageStyles = getComputedStyle(newMessage);
    console.log(newMessageStyles);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)+ 16;
    console.log(newMessageMargin);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin
    console.log(newMessageHeight);

    // visible Height
    const visibleHeight = mssgContainer.offsetHeight;
    console.log(visibleHeight)

    // heigth of the massage container 
    const containerHeight = mssgContainer.scrollHeight;
    console.log(containerHeight);

    // how for i have scrolled
    const scrollOffset = mssgContainer.scrollTop + visibleHeight
    console.log(scrollOffset)

    if(containerHeight - newMessageHeight <= scrollOffset){
        mssgContainer.scrollTop = mssgContainer.scrollHeight
    }
}

socket.on('message',(mssg)=>{
    console.log(mssg);
    const html = Mustache.render(mssgTemp , {
      username:mssg.username, mssg: mssg.mssg , createdAt: moment(mssg.createdAt).format('h:mm a')
    })
    mssgContainer.insertAdjacentHTML('beforeend', html);
    autoScroll();
})


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    formBtn.setAttribute('disable', 'disable');
    if(!formInput.value){
              return
    }
    socket.emit('clientMssg', formInput.value, ()=>{
        formBtn.removeAttribute('disable', 'disable')
        formInput.value ='';
        formInput.focus();
        console.log('Message is deliverd');    

    });

})
clientLocation.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('You have not send Location');
    }
    clientLocation.setAttribute('disable', 'disable');
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const location = { 
            latitude, longitude
        }
        socket.emit('location', location , ()=>{
            console.log('Location is delivered!')
            clientLocation.removeAttribute('disable', 'disable');
        })
    })

})

socket.on('locationLink', (locatMssg)=>{
    let url = locatMssg.url
    const html = Mustache.render(locatTemp , {
   username:locatMssg.username,  url ,  createdAt: moment(locatMssg.createdAt).format('h:mm a')
    })
    mssgContainer.insertAdjacentHTML('beforeend', html);
    autoScroll();
   
})
const {username , room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
socket.emit('join', {username, room}, (error)=>{
        alert(error);
        location.href = '/'
})

 socket.on('roomData', ({room , roomuser})=>{
     const html = Mustache.render(roomTemp ,{
         room , roomuser 
     })
     chatSidebar.innerHTML =html;
 })