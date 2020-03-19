const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding the user',
      });
    });
});

router.post('/:id/posts', [validatePost, validateUserId], (req, res) => {
  // do your magic!
  const { text } = req.body;
  const user_id = req.params.id;

  Users.getById(user_id)
    .then(post => {
        let newPost = {
          text,
          user_id,
        }

        Posts.insert(newPost)
          .then(post => {
            res.status(201).json({ message: "post created" })
          })
    })
    .catch(err => {
      res.status(500).json({ error: 'I cannot provide any info from the inner server, try again!', err })
    })
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
    .then(users=>{
      res.status(200).json(users);
    })
    .catch(error=>{
      console.log(error);
      res.status(500).json({
        message: 'Error getting user data'
      });
    });
});


router.get('/:id', validateUserId, (req, res) => {
      res.status(200).json(req.user);
});


router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
  .then(posts=>{
    res.status(200).json(posts);
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({message:'error getting user posts'})
  });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.params.id)
  .then(count=>{
    if(count>0){
      res.status(200).json({message: 'user deleted'});
    } else{
      res.status(404).json({message: "couldn't find user"})
    }
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({message: 'there was an error removing the user', error})
  });
});

router.put('/:id',validateUserId, (req, res) => {
  // do your magic!
  console.log(req.body);
  Users.update(req.params.id, req.body)
  .then(user=>{
    if(user){
      res.status(200).json(user);
    } else{
      res.status(404).json({message:"error finding the user"})
    }
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({message:"error updating the user"})
  });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      console.log(user);
      if (user) {
        
        req.user = user;
        req.user.id=user.id;
        next();
      } else {
        // res.status(404).json({ message: 'does not exist' });
        next(new Error('does not exist'));
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'exception', err });
    });
}

function validateUser(req, res, next) {
  // do your magic!
  console.log(req.body);
  const body = req.body;
  if (Object.entries(req.body).length === 0) {
    res.status(400).json({ message: 'Please include request body' })
  }
  else if (!req.body.name) {
    res.status(400).json({ message: "missing a name" })
  }
    next();
}

function validatePost(req, res, next) {
  // do your magic!
  console.log(req.body);
  const body = req.body;
  if(!body || body === {}){
    res.status(400).json({ message: 'Please include request body' })}
  else if (!req.body.text){
    res.status(400).json({message: "missing some text"})
  }
    next();
}

module.exports = router;
