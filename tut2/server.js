// BASE SETUP
// =======================================

// Call the Packages
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var port        = process.env.port || 8080;
var jwt         = require('jsonwebtoken');

// Declare secret for token authentication
var superSecret = 'ilovescotchyscotch';

// Call User models
var User      = require('./app/models/user');

// Call Product Models
var Product   = require('./app/models/product'); 


// connect to our database (hosted on modulus.io)
mongoose.connect('mongodb://localhost:27017/baseapp2');

// APP CONFIGURATION-------------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');
  next();
});

//log all requests to the console
app.use(morgan('dev'));

// ROUTES FOR OUR API
// =============================

// basic route for the home page
app.get('/', function(req, res) {
  res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// create an instance of the express router for products
var productRouter = express.Router();

// route for authenticating users
apiRouter.post('/authenticate', function(req, res) {
  //find the user
  // select the username and password explicitly
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err,user) {
    
    if (err) throw err;
    
    // no user with that username was found
    if (!user) {
      res.json({
        success: false,
        message: 'Authentication Failed, no user with that name exists'
      });
    } else if (user) {
      
      //check if the password matches
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication Failed. Invalid Password'
        });
      } else {
      //create a token
      
      var token = jwt.sign({
        name: user.name,
        username: user.username
      }, superSecret, {
        expiresInMinutes: 1440
      });
      
      // return the information including the token as a JSON
      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
      });
    }
   }
  });
});

// middleware for all requests
apiRouter.use(function(req, res, next) {
  // Do Logging
  console.log('Someone Just Used Our api');
  
  //check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  //decode token 
  if (token) {
    
    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err) {
        return res.status(403).send({
          success: false,
          message: 'Failed to Authenticate token.'
      	 });
         
    } else {
      // if everything is good, save to request for use in other routes
    req.decoded = decoded;
    
    next();
    }
   });
   
  } else {
   
   // if there is no token
   // return an HTTP response of 403 (access forbidden) and an error message
   return res.status(403).send({
     success: false,
     message: 'No Token Provided.'
   });
  }
  // we'll add more to the middleware
  // this is where we authenticate users

  // next(); used to be used here
  //make sure to go to the next route and not to stop here
});

productRouter.route('/')
  //create a product
  .post(function(req, res) {
    // create the instance of the product model
    var product = new Product();
    
    product.name = req.body.name;
    
    product.save(function(err){
      res.json({ message: 'Product added!'});
    });
  })
  
  .get(function(req, res) {
    Product.find(function(err, products) {
      if (err) res.send(err);
      
      //return products
      res.json(products);
    })
  })

apiRouter.route('/users')
    //create a user ()
    .post(function(req, res){

      //create the instance of the user modal
      var user = new User();

      //set the users information comes from the requests
      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      //save the user and check for errors
      user.save(function(err){
        if (err) {
          //duplicate entry
          if (err.code == 11000)
            return res.json({ success: false, message: "A user with that username already exists"});
          else
              return res.send(err);
        }
      res.json({ message: 'User Created!'});
    });

  })

  .get(function(req, res){
    User.find(function(err, users){
      if (err) res.send(err);

      //return the users
      res.json(users);
    });
  });

apiRouter.route('/users/:user_id')

  // get the user with that id
  .get(function(req, res){
    User.findById(req.params.user_id, function(err, user){
      if (err) res.send(err);

      //return the user
      res.json(user);
    });
  })

  .put(function(req,res){

    //use our user model to find what we want
    User.findById(req.params.user_id, function(err, user) {

      if (err) res.send(err);

      //update new users info only if it is new
      if (req.body.name) user.name = req.body.name;
      if (req.body.username) user.username = req.body.username;
      if (req.body.password) user.password = req.body.password;

      //save the user
      user.save(function(err){
        if (err) res.send(err);

        //return a message
        res.json({ message: 'User Updated!'});
      });
    });
  })

  .delete(function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user){
      if (err) return res.send(err);

      res.json({ message: 'User Deleted Successfully!'});
    });
  })
  
apiRouter.get('/me', function(req, res){
  res.send(req.decoded);
});

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res){
  res.json({ message: 'hooray! welcome to our api!'});
});



// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);
app.use('/products', productRouter);

// START THE SERVER
// ===============================
app.listen(port);
console.log('Magic happens on port ' + port);
