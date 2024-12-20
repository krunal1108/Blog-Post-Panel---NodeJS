const Blog = require('../models/blog');  // Assuming you have a Blog model
const User = require('../models/adminPanelModel'); // Path to your User model
const commentModel = require('../models/commentModel');



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

        console.log("newblog", newBlog);


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
// const viewAllBlogs = async (req, res) => {
//     try {
//         const blogs = await Blog.find().populate('user');
//         res.render('all-blogs', { blogs });
//     } catch (error) {
//         res.status(500).send('Error fetching blogs');
//     }
// };


// const viewAllBlogs = async (req, res) => {
//     try {
//         const blogs = await Blog.find().populate('user');
//         console.log("ALL BLOG YEEEHHHHHHHH>>>>>>", blogs);

//         const commentsData = await commentModel.find({}).populate({
//             path:'blog', populate: {
//                 path: 'user'
//             }
//         }).populate('user');

//         console.log("Comment All Data",commentsData);

//         const data = await Blog.find();


//         if (!blogs || blogs.length === 0) {
//             return res.status(404).send('No blogs found');
//         }
//         res.render('all-blogs', { blogs, commentsData, data });
//     } catch (error) {
//         console.error('Error fetching blogs:', error);
//         res.status(500).send('Error fetching blogs');
//     }
// };

const viewAllBlogs = async (req, res) => {
    try {
        // Fetch blogs with user data
        const blogs = await Blog.find().populate('user', 'fname');

        // Fetch all comments with associated blog and user data
        const commentsData = await commentModel.find().populate({
            path: 'blog',
            select: '_id', // Only fetching the blog ID for matching
            populate: { path: 'user', select: 'fname' } // Populating user info for the blog
        }).populate('user', 'fname');

        if (!blogs || blogs.length === 0) {
            return res.status(404).send('No blogs found');
        }

        res.render('all-blogs', { blogs, commentsData });
    } catch (error) {
        console.error('Error fetching blogs:', error);
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





// const commentStorage = async (req, res) => {
//     try {
//         const commentsAll = new commentModel({
//             comment: req.body.commentBox,
//             blog: req.params.id,
//             user: req.user._id,
//         });

//         console.log("Comment Section:- ", commentsAll);
//         const commentBlogData = new commentModel(commentsAll);
//         await commentBlogData.save();

//         console.log("COMMENT!!!!!", commentBlogData);

//         res.redirect('/all-blogs');
//     } catch (error) {
//         console.log("ERROR adding comment:- ", error);
//         res.redirect('/');
//     }
// }

const commentStorage = async (req, res) => {
    try {
        // Create new comment with the associated blog and user
        const newComment = new commentModel({
            comment: req.body.commentBox,
            blog: req.params.id,
            user: req.user._id,
        });

        // Save the comment to the database
        await newComment.save();
        console.log("New Comment Added: ", newComment);

        // Redirect back to the all-blogs page after submission
        res.redirect('/all-blogs');
    } catch (error) {
        console.error("Error adding comment:", error);
        res.redirect('/');
    }
};





module.exports = { getEditBlog, addBlog, editBlog, deleteBlog, viewAllBlogs, viewMyBlogs, getAddBlogForm, commentStorage }