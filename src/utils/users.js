const users = [];

const saveUser = ({id ,username , room })=>{
        username= username.trim().toLowerCase();
        room = room.trim().toLowerCase();
        //find user 
        const index = users.findIndex((user)=> user.username === username && user.room === room);
        if(index >=0){
            return {
                error: 'User is Existed try another'
            }
        }
        const user = { id ,username, room   }

        users.push(user);
 
        return {user};
}
const getUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id);
    if(index <0){
        return{
            error: 'User id not find'
        }
    }
    return users[index];
}
const deleteUser =   (id)=>{
    const index = users.findIndex((user)=> user.id === id);
    if(index<0){
        return {
            error: 'user is not find'
        }
    }
    const user = users[index];
   
    users.splice(index , 1);
    return {user};
}
const getRoomUser = (room)=>{
    room = room.trim().toLowerCase();
  //  let userName = []
    const roomUser = users.filter((user)=>user.room === room);
    if(!roomUser){
        return {
            error : 'no users'
        }
    }
   //roomUser.forEach((user)=> userName.push(user.username))
   return roomUser;
}


module.exports = {saveUser , getRoomUser , getUser , deleteUser}