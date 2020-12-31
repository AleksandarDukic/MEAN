const { isExportAssignment } = require('typescript');
const Post = require('../models/post');


exports.createPost = (req, res, next) => {
  // !!!! body is new field added by body-parser !!!!
  const url = req.protocol + '://' + req.get('host') // constructs URL to our server
   const post = new Post({
     title: req.body.title,
     content: req.body.content,
     imagePath: url + "/images/" + req.file.filename,   // file property is provided by multer
     creator: req.userData.userId
   });
   post.save().then(createdPost => {
     console.log("result", createdPost)
     res.status(201).json({
       message: 'Post added sucessfully',
       post: {
         id: createdPost._id,
         title: createdPost.title,
         content: createdPost.content,
         imagePath: createdPost.imagePath
       }

     })
   })
   .catch( error => {
     res.status(500).json({
       message: "Creating a post failed!"
     })
   })
}

exports.updatePost =  (req, res, next) => {
  /* !!!!    UPDATE MOZE I PREKO POSTA - AKO IMA ISTI _id     !!!!    ili preko parametara    !!!!    */
  // multer file - console.log(req.file)
  let imagePath = req.body.image;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host') // constructs URL to our server
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
     _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post/* {title: req.body.title, content:req.body.content} */).then(result => {
    if(result.n > 0) {
    res.status(200).json({
      message: 'Update successful'
    })
  } else {
    res.status(401).json({message: 'Not authorized'})
  }
  })
  .catch( error => {
    res.status(500).json({
      messsage: "Couldn't update post!"
    })
  });
}

exports.getPosts = (req, res, next) => {
  // we import query parameters
  // added at the end of URL separated by "?"
  // we access it in express by "req.query"
  // console.log(req.query)

  // IMAMO req.params - koji se oznacava u URL-u sa /:id ili kako god
  // I req.query - koji su oznaceni u URL-u sa "?...&...&..."
  const pageSize = +req.query.pageSize;   // "+" converts to NUMBER
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    // MANIPULATE MONGOOSE QUERY
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(documents => {        // kao da "then" izvrsava poziv ka db
      fetchedPosts = documents;
      return Post.count() // if we return into "then" block it will create a new Promise and listen to its result automaticaly
        .then(count => {
          res.status(200).json({
            message: "Posts fetched successfully",
            posts: documents,
            maxPosts: count
          })
        })
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed"
      })
    })
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed"
    })
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(
      result => {
        if(result.n > 0) {
          res.status(200).json({
            message: 'Deletion successful'
          })
        } else {
          res.status(401).json({message: 'Not authorized'})
        }
      })
      .catch(error => {
        res.status(500).json({
          message: "Deleting posts failed"
        })
      })
}
