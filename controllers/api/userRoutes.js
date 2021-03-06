const router = require('express').Router();
const session = require('express-session');
const { User, Post } = require('../../models');



router.post('/login', async (req, res) => {
  try {
    // Find the user who matches the posted e-mail address
    const userData = await User.findOne({ where: { email: req.body.email } });
    console.log(userData, "-------------");
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // Verify the posted password with the password store in the database
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // Create session variables based on the logged in user
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    // Remove the session variables
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});




router.post('/signup', async (req, res) => {
  try {
    const newUser = await User.create(req.body)
    res.status(200).json(newUser)

  } catch (err) {
    res.status(400).json(err);
  }
})

// router.post('/newPosting', async (req,res) => {
//   try {
//     const newPost = await Post.create({

//       post_title: req.body.post_title,
//       post_bio: req.body.post_bio,
//       user_id: req.session.user_id,
//       author: req.session.user_id
      
//     })

//     res.status(200).json(newPost)

//   } catch (err){
//     res.status(400).json(err);
//   }
// })

module.exports = router;

