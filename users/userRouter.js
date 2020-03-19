const express = require('express');

const Users = require('./userDb.js');

const router = express.Router();

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
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

router.get('/:id', (req, res) => {
  // do your magic!
  Users.getById(req.params.id)
  .then(user=>{
    res.status(200).json(user);
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({
      message:'error getting user data'
    });
  });
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
  Users.getUserPosts(req.params.id)
  .then(posts=>{
    res.status(200).json(posts);
  })
  .catch(error=>{
    console.log(error);
    res.status(500).json({message:'error getting user posts'})
  });
});

router.delete('/:id', (req, res) => {
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

router.put('/:id', [validateUserId, validatePost], (req, res) => {
  // do your magic!
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
      if (user) {
        req.user = user;
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
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
