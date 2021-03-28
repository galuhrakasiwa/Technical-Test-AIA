const express = require('express');
const router = express.Router()
const passport = require('passport');
const { Router } = require("express");
const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken');
const key = require("../../setup/mongodb");
// const multer = require('multer');
// var upload = multer({ dest: 'uploads/' })
// const path = require ('path');

//import user schema
const User = require('../../models/user');


const Profile = require("../../models/profile");

const Question = require ('../../models/question');
const question = require('../../models/question');


//@POST
// @ question/
// @ router post question
// @accses private


router.post('/', passport.authenticate('jwt', { seasson: false}), (req,res) => {
    const newQuestion = new Question ({

    question1: req.body.question1,
    question2: req.body.question2,
    user: req.user.user,
    nama: req.user.nama
    })
    newQuestion
    .save()
    .then((question) => res.json(question))
    .catch((err) => console.log('unabel push to database'))
})


//@ GET
// @ question
// provate

router.get(
    "/",
    passport.authenticate("jwt", { seasson: false }),
    (req, res) => {
      Question.find()
        .sort({ date: "desc" }) // sorting
        .then((question) => res.json(question))
        .catch((err) => console.log({ noquestion: "noquestion display" }));
    }
  );


// @ POST
// @ question/answer/id


  router.post('/answer/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
      Question.findById( req.params.id )
      .then((question) => {
          const newAnswers = {
              user: req.user.id,
              nama:req.user.nama,
              text: req.body.text
          }
          question.answers.unshift(newAnswers)
          question
          .save()
          .then((question) => res.json(question))
          .catch((err) => console.log(err))
      })
      .catch((err) => console.log(err)) 
  })

// @ POST
// @ question/upvote/id

router.post(
    "/upvote/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then((profile) => {
          Question.findById(req.params.id)
          
            .then((question) => {
              if (
                question.upvotes.filter(
                  (upvote) => upvote.user.toString() === req.user.id.toString()
                ).length > 0
              )  {
                return res.status(400).json({ noupvote: "User already upvoted" });
              }
              question.upvotes.unshift({ user: req.user.id });
              question
                .save()
                .then((question) => res.json(question))
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  );

  //@ DELETE
  // @ question/delete/id

  router.delete('/delete/:id' , passport.authenticate('jwt' , { session: false}), (req, res) => {
    Question.findOne({question: req.question.id})

    
    .then( question  => {
        if(!question) {
            res.status(404).res.json({ questionnotfound : 'question Not Found'})
        }
        const removethis = question
        .modifiedPaths(item => item.id)
        .indexOf(req.params.id)

        question.splice(removethis, 1)
        question
        .save()
        .then(question => res.json(question))
        .catch((err) => console.log ('wew' + err))
    })
    .catch((err) => console.log('error' + err))
  })



module.exports = router;