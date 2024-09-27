const Blog = require('../models/blog');  // Assuming you have a Blog model


// Render the form for adding a new blog
const getAddBlogForm = (req, res) => {
    res.render('addBlogForm'); // Assuming you have an 'addBlogForm.ejs' file in your 'views' folder
};


// Add a new blog
const addBlog = async (req, res) => {
    try {
        const newBlog = new Blog({
            title: req.body.title,
            content: req.body.content,
            image: req.file.filename,  // The file is uploaded via multer
            user: req.user.id  // Assuming you store the logged-in user info in req.user
        });

        console.log("newblog",newBlog);
        

        await newBlog.save();
        res.redirect('/my-blogs');  // Redirect to 'My Blogs' page after successful creation
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
    console.log("ADDED Blog Succesfully..");
    
};

// Render the form to edit an existing blog
const getEditBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        // Check if the logged-in user is the owner of the blog
        if (blog.user.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized');
        }

        res.render('editBlogForm', { blog });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
    console.log("EDIT Blog Succesfully..");
};


// Handle updating the blog
const editBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        // Check if the logged-in user is the owner of the blog
        if (blog.user.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized');
        }

        // Update blog fields
        blog.title = req.body.title;
        blog.content = req.body.content;

        // Check if a new image is uploaded
        if (req.file) {
            blog.image = req.file.filename;
        }

        await blog.save();
        res.redirect('/my-blogs');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};


// Delete a blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        // Check if the blog exists
        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        // Ensure that the logged-in user is the owner of the blog
        if (blog.user.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized');
        }

        // Delete the blog using findByIdAndDelete
        await Blog.findByIdAndDelete(req.params.id);

        // Redirect to the 'My Blogs' page after deletion
        res.redirect('/my-blogs');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting blog');
    }
    console.log("DELETE Blog Succesfully..");

};


// View all blogs
const viewAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('user', 'username');
        res.render('all-blogs', { blogs });
    } catch (error) {
        res.status(500).send('Error fetching blogs');
    }
};

// View user's blogs
const viewMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user._id });
        res.render('my-blogs', { blogs });
    } catch (error) {
        res.status(500).send('Error fetching blogs');
    }
    console.log("VIEW MY Blog Succesfully..");

};



module.exports = { getEditBlog, addBlog, editBlog, deleteBlog, viewAllBlogs, viewMyBlogs, getAddBlogForm }