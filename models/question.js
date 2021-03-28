const mongoose = require('mongoose');
const Schema = mongoose.Schema

const QuestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myUser",
  },
  question1: {
    type:String,
    require: true
  },
  question2:{
    type : String,
    require: true
  },
  nama: {
    type: String,
    
  },
  upvotes: [
    {
    user: {
      type: Schema.Types.ObjectId,
      ref: "myPerson",
    }
  }
],
  answers:[ {
    user: {
      type: Schema.Types.ObjectId,
      ref: "myPerson",
    },
    text : {
      type: String,
      require : true
    },
    nama: {
      type:String
    },
    date:{
      type: Date,
      default: Date.now
   }
  },
],
date:{
  type: Date,
  default: Date.now
}
})

module.exports = Question = mongoose.model("myQuestion", QuestionSchema)