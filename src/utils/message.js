const genrateMssg = (username ,mssg)=>{
   const  createdAt = new Date().getTime();
   return {
     username,  mssg , createdAt
   }
}
const genrateLocatMssg = (username ,url)=>{
    const createdAt = new Date().getTime();
    return {
     username, url ,createdAt
    }
}

module.exports = {genrateMssg , genrateLocatMssg}