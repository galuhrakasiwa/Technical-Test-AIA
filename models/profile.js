const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myUser",
  },
  username: {
    type: String,
    require: true,
    max: 50,
  },
  website: {
    type: String,
  },
  country: {
    type: String,
  },
  laguages: {
    type: [String],
    require: true,
  },
  portfolio: {
    type: String,
  },
  profilePic: {
    type: String,
    default: null,
    required: false,
    get: getImage,

 },

  workrole: [
    {
      role: {
        type: String,
        require: true,
      },
      company: {
        type: String,
      },
      country: {
        type: String,
      },
      from: {
        type: Date,
        
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      details: {
          type: String
      }
    },
  ],

  social : {
      youtube:{
          type : String,

      },
      facebook : {
          type: String
      },
      instagram : {
          type: String
      }
  },
  date: {
    type:Date,
    default: Date.now
  },
},
{
    // enable timestamps
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
    versionKey: false,
    toJSON: { getters: true },
});

function getImage(image) {
return "/myupload/" + image; // image
}



module.exports = Profile = mongoose.model("myProfile", ProfileSchema)