const express = require('express');
const router = express.Router()
const passport = require('passport');
const { Router } = require("express");
const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken');
const key = require("../../setup/mongodb");
const multer = require('multer');
// var upload = multer({ dest: 'uploads/' })
const path = require ('path');

//import user schema
const User = require('../../models/user');


const Profile = require("../../models/profile");

// multer seting
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/myupload')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})
 

const upload = multer({ storage: storage, dest: "myupload" });


//test
router.get('/', (req, res) => res.json({ test : 'test user sucsses'}))


// @POST
// @ user/register
// register user

router.post('/register', (req,res) => {
    User.findOne({ email: req.body.email})
    .then((user) => {
        if(user) {
            return res
            .status(400)
            .json({ emailerror : 'Email Sudah Ada'})
        }else {
            const newUser = new User ({
                
                email: req.body.email,
                gender:req.body.gender,
                password: req.body.password,
                nama: req.body.nama

            })
            // encript password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  // Store hash in your password DB.
                  if (err) throw err;
                  newUser.password = hash;
                  newUser
                    .save()
                    .then((user) => res.json(user))
                    .catch((err) => console.log(err));
                });
              });
            }
    })
    .catch(err => console.log(err))
})


//@ POST
//@ user/login
//@ login user
//@ publck

router.post('/login', (req,res) => {
    const email = req.body.email
    const password = req.body.password

    User.findOne({email})
    .then((user) => {
        if(!user) {
            return res
            .status(404)
            .json({ emailerror : 'email tidak ada'})
        }
        bcrypt
        .compare(password, user.password)
        .then((isTrue) => {
          if (isTrue) {
            // res.json({success: 'user is able login successfuly'})
            //payload and create token
            const payload = {
              id: user.id,
              nama: user.nama,
              email: user.email,
            };
            jsonwt.sign(payload, key.secret, (err, token) => {
              res.json({
                success: true,
                token: token,
              });
            });
        }else {
            res.status (400).json({ passworderror: 'password salah'}) }
            
    }).catch((err) => console.log(err));
})
    .catch( err => console.log (err))
})

//@ GET
//@ /user/profile
//@ profile user
//  privat

router.get('/profile', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        
        res.json({
          id: req.user.id,
          nama: req.user.nama,
          email:req.user.email,
          gender:req.user.gender,
          profilepic: req.user.profilepic,
          
        })
    }
);


//serialize passport

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


//@ GET
//@ user/getprofile
//@ get peronal profile

router.get('/getprofile', passport.authenticate('jwt', {seasson: false}),  (req, res) => {
  User.findOne({ user: req.user.id})
  .then((user) =>{
    if(!user) {
      return res
      .status(404)
      .json({profilenotfound: 'profil tidak di temukan'})
    }
    res.json(user)
  })
  .catch( (err) => console.log(err))
})

//@POST
//@ /user/postprofile
//@ post personal profile
//@ provate

router.post('/getprofile', passport.authenticate('jwt', {seasson: false}),  (req, res) => {

  const userValues = {};
  userValues.user = req.user.id;
  if (req.body.username) userValues.username = req.body.username;
  if (req.body.website) userValues.website = req.body.website;
  if (req.body.country) userValues.country = req.body.country;
  
  if ( typeof req.body.laguages !== undefined)
  {userValues.laguages = req.body.laguages.split(",")}

  // sosial link
  userValues.social = {}
  if (req.body.youtube) userValues.social.youtube = req.body.youtube;
  if (req.body.facebook) userValues.social.facebook = req.body.facebook;
  if (req.body.instagram) userValues.social.instagram = req.body.instagram;


  // doit data base

  Profile.findOne({ user: req.user.id})
  .then((profile) => {
    if(profile) {
      Profile.findOneAndUpdate(
        { user: req.user.id},
        { $set : userValues},
        { new: true}
      )
      .then((profile) => res.json(profile))
      .catch(err => console.log( "ada masalah di update" + err))
    } else {
      Profile.findOne({ username: userValues.username})
      .then((profile) => {
      if (profile) {
        res.status(400).json({username : 'username sudah ada'})
        }
        // save user ke data base
        new Profile(userValues)
        .save()
        .then((profile) => res.json(profile))
        .catch(err => console.log (err))
      })
      .catch( err => console.log(err))
    }
  })
  .catch(err => console.log(err))
  
})

// upload foto multer

router.post ( '/upload', passport.authenticate('jwt', {session: false}), upload.single("image"), (req, res) => {
  
  // console.log(req.file.filename);
  Profile.findOneAndUpdate(
    { user: req.user.id},
    { profilePic: req.file.filename},
    { new: true}
  )
  // console.log(data)

  
  res.json ({
    profilepic : "myupload/"+req.file.filename
  })
})

//@ Get
//@ /user/pofile/:user
//@ public

router.get('/profile/:username', (req,res) => {
  Profile.findOne({username: req.params.username})
  .populate('user', ['nama', 'profilepic'])
  .then(profile => {
    if (!profile) {
      res.status(404)
      .json({usernotfound: 'user tidak ada' })
    }
    res.json(profile)
  }) 
  .catch(err => console.log('error mencari username' + err))
})

// GET
// /profile/getall
// public

router.get('/getall', (req,res) => {
  Profile.find()
  .populate('user', ['nama', 'profilepic'])   // nambah status 
  .then(profiles => {
    if(!profiles){
      res.status(404).json({usernotfound : 'all not found'})
    }
    res.json(profiles)
  })
  .catch(err => console.log('Error in pacching user name' + err )  )
})

// @type Post
// @route /api/profile/workrole
//@desc route for add mywork at profile
//@accses provate


router.post('/workrole', passport.authenticate ('jwt', {session: false}), (req, res) => {
  Profile.findOne({ user : req.user.id})
  .then( profile => {
    //assigment

    if (!profile){
      res.status(404).json({usernotfound : 'all not found'})
      res.json('azz')
    }

    const newWork = {
      role:req.body.role,
      company:req.body.company,
      country: req.body.country,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      details: req.body.details
    };
    profile.workrole.push(newWork)
    profile.save()
    .then(profile => res.json(profile))
    .catch(err => console.log(err))
  })
.catch(err => console.log(console.error))


})

/*
@ Delete
@ user/deleteworkrole
@private

*/

router.delete('/workrole/:w_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user:req.user.id})
  .then( profile => {
    if(!profile) {
      res.status(404).json({usernotfound : 'all not found'})
      res.json('azz')
    }
    const removethis = profile.workrole
    .map(item => item.id)
    .indexOf(req.params.w_id);

   profile.workrole.splice(removethis, 1)
    profile.save().then(profile => res.json(profile)).catch(err => console.log(err))

  }).catch(err => console.log (err))
})




module.exports = router;