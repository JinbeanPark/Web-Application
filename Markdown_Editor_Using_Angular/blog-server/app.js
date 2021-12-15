var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var commonmark = require('commonmark');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwtKey = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c"

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser(jwtKey));


 // import MongoDB driver
const MongoClient = require('mongodb').MongoClient;
const { JsonWebTokenError } = require('jsonwebtoken');
const options = { useUnifiedTopology: true, writeConcern: {j: true}};

 // connection URL
 const url = 'mongodb://localhost:27017/BlogServer';

 // create a new MongoClient
 const client = new MongoClient(url, options);

 // use connect method to connect to the server
client.connect((err) => {
  if (err)
    console.log("Unable to connect to Mongo.")
  else
    console.log("Listening on port 3000...");
});


var findPostWithUsernameNpostid = function (req) {

  return new Promise((resolve, reject) => {
    const Posts = client.db('BlogServer').collection('Posts');
    var docs = Posts.find({ username: req.query.username, postid: parseInt(req.query.postid)}).toArray();
    resolve(docs);
  })
}

var findPostWithUsername = function (req, postsOrUsers) {

  if (postsOrUsers === "Posts") {
    return new Promise((resolve, reject) => {
      const Posts = client.db('BlogServer').collection('Posts');
      var docs = Posts.find({ username: req.query.username}).toArray();
      resolve(docs);
    })
  }
  else {
    return new Promise((resolve, reject) => {
      const Users = client.db('BlogServer').collection('Users');
      var docs = Users.find({ username: req.query.username}).toArray();
      resolve(docs);
    })
  }
}


var deletePostWithUsernameNpostid = function (req) {

  return new Promise((resolve, reject) => {
    const Posts = client.db('BlogServer').collection('Posts');
    resolve(Posts.deleteOne({ username: req.query.username, postid: parseInt(req.query.postid)}));
  })
}


var findPostWithBodyUsername = function (req) {

  return new Promise((resolve, reject) => {
    const Users = client.db('BlogServer').collection('Users');
    var docs = Users.find({ username: req.body.username}).toArray();
    resolve(docs);
  })
}

var findPostWithBodyUsernameNpostid = function (req) {
      
  return new Promise((resolve, reject) => {
    const Posts = client.db('BlogServer').collection('Posts');
    var docs = Posts.find({ username: req.body.username, postid: parseInt(req.body.postid)}).toArray();
    resolve(docs);
  })
}

var findPostWithParamUsername = function (req) {

  return new Promise((resolve, reject) => {
    const Posts = client.db('BlogServer').collection('Posts');
    var docs = Posts.find({ username: req.params.username}).toArray();
    resolve(docs);
  })
}

var findPostWithParamUsernameNpostid = function (req) {

  return new Promise((resolve, reject) => {
    const Posts = client.db('BlogServer').collection('Posts');
    var docs = Posts.find({ username: req.params.username, postid: parseInt(req.params.postid)}).toArray();
    resolve(docs);
  })
}


var findPostWithParamStartN = function (req) {
      
  return new Promise((resolve, reject) => {
    const Posts = client.db('BlogServer').collection('Posts');
    var docs = Posts.find({$and: [{username: req.params.username}, {postid: {$gte: parseInt(req.query.start)}}]}).toArray();
    resolve(docs);
  })
}


var insertOnePost = function (req, updatedMaxID, createdDate, modifiedDate) {

  return new Promise((resolve, reject) => {
    const Posts = client.db('BlogServer').collection('Posts');
    resolve(Posts.insertOne({ postid: updatedMaxID,
      username: req.body.username,
      created: createdDate,
      modified: modifiedDate,
      title: req.body.title,
      body: req.body.body}));
  })
}

var updateOnePost = function (req, updatedMaxID) {

  return new Promise((resolve, reject) => {
    const Users = client.db('BlogServer').collection('Users');
    resolve(Users.updateOne({ username: req.body.username}, {$set: {maxid: updatedMaxID}}));
  })
}


var updateTitleNbody = function (req, modifiedDate) {
      
  return new Promise((resolve, reject) => {
    const Posts = client.db('BlogServer').collection('Posts');
    resolve(Posts.updateOne({ username: req.body.username, postid: parseInt(req.body.postid)}, 
    {$set: {modified: modifiedDate, title: req.body.title, body: req.body.body}}));
  })
}

app.get('/editor', async(req, res, next) => {
  try {
    
    jwt.verify(req.cookies.jwt, jwtKey, async (err, decoded) => {

      if (err || decoded == undefined) {
        console.log("jwt cookie is invalid");
        res.redirect(302, '/login?redirect=/editor/');
        return;
      }
      else {
        console.log("Finish checking");
        next();
      }
      })
    } catch (e) {
      console.log("Error in processing request!")
    }
})



app.use('/api/posts', async (req, res, next) => {
  

  try {
    jwt.verify(req.cookies.jwt, jwtKey, async (err, decoded) => {
    
      if (err || decoded == undefined) {
        console.log("jwt cookie is invalid");
        res.sendStatus(401);
      }
      else if (decoded.exp < Math.round(Date.now() / 1000)) {
        console.log("Expiration date is passed");
        res.sendStatus(401);
      }
      else if (req.query.username !== undefined && decoded.usr !== req.query.username) {
        console.log("path username does not match to usr");
        res.sendStatus(401);
      }
      else if (req.body.username !== undefined && decoded.usr !== req.body.username) {
        console.log("body username does not match to usr");
        res.sendStatus(401);
      }
      else {
        console.log("Finish checking");
        next();
      }
      })
    } catch (e) {
      console.log("Error in processing request!")
    }
});



app.get('/api/posts', async (req,res,next) => {
  
  try {

    var usernameWithPostID = false;
    if (req.query.username === undefined) {
      res.sendStatus(400);
      return;
    }
    else if ((typeof req.query.username !== "string")) {
      res.sendStatus(400);
      return;
    }
    if (req.query.username !== undefined && req.query.postid !== undefined) {
      if ((typeof req.query.postid !== "string") || parseInt(req.query.postid) <= 0) {
        res.sendStatus(400);
        return;
      }
      usernameWithPostID = true;
    }
    

    if (usernameWithPostID) {

      var docs = await findPostWithUsernameNpostid(req);

      // Case: the corresponding post does not exist.
      if (docs.length <= 0) {
        res.sendStatus(404);
        return;
      }

      console.log(docs[0]);
      res.status(200).send(docs[0]);
    }
    else {

      var post = await findPostWithUsername(req, "Posts");
      var user = await findPostWithUsername(req, "Users");


      // Case: the user does not exist or have no post.
      if (post.length <= 0 || user.length <= 0) {
        var emptyJSON = {};
        res.status(404).send(emptyJSON);
      }
      else {
        console.log(post);
        res.status(200).send(post);
      }
    }
  } catch (e) {
      console.log("Error in processing request!")
  }
})


app.delete('/api/posts', async (req,res,next) => {
  
  try {    

    if (req.query.username === undefined || req.query.postid === undefined) {
      res.sendStatus(400);
      return;
    }
    else if ((typeof req.query.username !== "string") || (typeof req.query.postid !== "string")) {
      res.sendStatus(400);
      return;
    }
    else if (parseInt(req.query.postid) <= 0) {
      res.sendStatus(400);
      return;
    }

    var docs = await findPostWithUsernameNpostid(req);

    // Case: the corresponding post does not exist.
    if (docs.length <= 0) {
      res.sendStatus(404);
      return;
    }
    else {
      await deletePostWithUsernameNpostid(req);
      res.sendStatus(204);
    }
  } catch (e) {
      console.log("Error in processing request!")
  }
})


app.post('/api/posts', async (req,res,next) => {

  
  try {

    if (req.body.username === undefined || req.body.postid === undefined || req.body.title === undefined || req.body.body === undefined) {
      
      console.log("username: " + req.body.username);
      console.log("postid: " + req.body.postid);
      
      console.log("111");
      res.sendStatus(400);
      return;
    }
    else if ((typeof req.body.username !== "string") || (typeof req.body.postid !== "number") || (typeof req.body.title !== "string") || (typeof req.body.body !== "string")) {
      console.log("222");
      
      res.sendStatus(400);
      return;
    }
    else if (req.body.postid < 0) {
      console.log("333");
      
      res.sendStatus(400);
      return;
    }

    const Posts = await client.db('BlogServer').collection('Posts');
    const Users = await client.db('BlogServer').collection('Users');
    
    if (req.body.postid == 0) {

      var userDoc = await findPostWithBodyUsername(req);
      var updatedMaxID = userDoc[0].maxid + 1;

      var createdDate = Date.now();
      var modifiedDate = Date.now();

      await insertOnePost(req, updatedMaxID, createdDate, modifiedDate);
      await updateOnePost(req, updatedMaxID);
      var updatedJSON = {"postid": updatedMaxID, "created": createdDate, "modified": modifiedDate};
      res.status(201).send(updatedJSON);
    }
    else {

      var PostDoc = await findPostWithBodyUsernameNpostid(req);
      
      if (PostDoc <= 0) {
        res.sendStatus(404);
        return;
      }
      
      var modifiedDate = Date.now();
      await updateTitleNbody(req, modifiedDate);
      
      var updatedJSON = {"modified": modifiedDate, "title": req.body.title, "body": req.body.body};
      res.status(200).send(updatedJSON);
    }
  } catch (e) {
      console.log("Error in processing request!")
  }
})



app.get('/login', async (req,res,next) => {

  try {
    if (req.query.redirect === undefined) {
      res.render('login', {username: null, password: null, redirect: null});
    }
    else {
      res.render('login', {username: null, password: null, redirect: req.query.redirect})
    }
  } catch (e) {
    console.log("Error in processing request!");
  }
})



app.post('/login', async (req,res,next) => {

  try {
    if (req.body.username === undefined || req.body.password === undefined) {
      res.sendStatus(401);
      return;
    }
    
    var docs = await findPostWithBodyUsername(req);

    if (docs.length <= 0) {
      res.status(401).render('login', {username: req.body.username, password: req.body.password, redirect: req.body.redirect});
    }
    await bcrypt.compare(req.body.password, docs[0].password).then((result) => {

      if (result === true) {
        
        // The server generate an appropriate JWT, set it as the value of the cookie jwt (lowerase)
        jwt.sign({exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60), usr: req.body.username},
                  jwtKey,
                  {header: {alg: 'HS256', typ: "JWT"}}, function(err, token) {
                    console.log("Token: " + token);
                    res.cookie("jwt", token);

                    if (req.body.redirect === undefined) {
                      res.status(200).send("The autehntication was successful");
                    }
                    // & redirect the request to the redirect parameter in the request if it exists.
                    else
                      res.redirect(302, req.body.redirect);
        });
      }
      else {
        console.log("username is correct, but password is incorrect!");
        res.status(401).render('login', {username: req.body.username, password: req.body.password, redirect: req.body.redirect});
      }
    });
  } catch (e) {
    console.log("POST /login Error in processing request!");
  }
})



app.get('/blog', async (req,res,next) => {
  res.sendStatus(404);
})

app.get('/blog/:username/:postid', async (req, res, next) => {
  
  // obtain Posts collection in BlogServer db
  try {
    var docs = await findPostWithParamUsernameNpostid(req);

    if (docs.length <= 0) {
      res.sendStatus(404);
      return;
    }

    res.render('index', {documents: docs, commonmark: commonmark, nextStartPosid : null});
  } catch (e) {
      console.log("Error in processing request!")
  }
});



app.get('/blog/:username', async (req, res, next) => {

  // obtain Posts collection in BlogServer db
  try {
    var nextStartPosid;

    if (req.query.start === undefined) {

      var docs = await findPostWithParamUsername(req);
  
      if (docs.length <= 0) {
        res.sendStatus(404);
        return;
      }
  
      if (docs.length > 5) {
        nextStartPosid = "?start=" + docs[5].postid;
        docs = docs.slice(0, 5);
      }
  
      res.render('index', {documents: docs, commonmark: commonmark, nextStartPosid : nextStartPosid});
    }
    else {
      var docs = await findPostWithParamStartN(req);
  
      if (docs.length <= 0) {
        res.sendStatus(404);
        return;
      }
        
      if (docs.length > 5) {
        nextStartPosid = "?start=" + docs[5].postid;
        docs = docs.slice(0, 5);
      }

      res.render('index', {documents: docs, commonmark: commonmark, nextStartPosid : nextStartPosid});
    }
  } catch (e) {
      console.log("Error in processing request!");
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;