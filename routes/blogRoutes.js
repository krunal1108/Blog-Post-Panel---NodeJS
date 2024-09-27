const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const upload = require('../middleware/multer');
const { ensureAuthenticated } = require('../middleware/auth');

// Display the form to add a new blog
router.get('/add-blog', ensureAuthenticated, (req, res) => {
  res.render('addBlogForm');
});
// Define a GET route to render the Add Blog form
router.get('/addBlogForm', ensureAuthenticated, blogController.getAddBlogForm);

// Handle the POST request to add a new blog
router.post('/add-blog', ensureAuthenticated, upload.single('image'), blogController.addBlog);

// Other routes
router.get('/all-blogs', blogController.viewAllBlogs);
router.get('/my-blogs', ensureAuthenticated, blogController.viewMyBlogs);
router.post('/edit-blog/:id', ensureAuthenticated, upload.single('image'), blogController.editBlog);
// Get blog details by ID and render the edit form
router.get('/edit-blog/:id', ensureAuthenticated, blogController.getEditBlog);

router.post('/delete-blog/:id', ensureAuthenticated, blogController.deleteBlog);
// router.delete('/delete-blog/:id', ensureAuthenticated, blogController.deleteBlog);


module.exports = router;
