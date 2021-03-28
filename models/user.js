const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    nama: {
        type: String,
        require: true
    },
    email: {
       type: String,
       require: true
    },
    password: {
       type: String,
       require: true
    },
    username: {
       type: String,
       require: true
    },
    gender: {
     type: String,
     require: true
  },
    profilepic:{
       type: String,
       default: "https://www.nicepng.com/png/full/914-9144016_avatar-pictures-anime-male-hair-reference.png"        
    },
    date:{
       type: Date,
       default: Date.now
    }
})


module.exports = User = mongoose.model("myUser", UserSchema)