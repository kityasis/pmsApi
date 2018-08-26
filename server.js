var express     = require('express');
var app         = express();
var cors        = require('cors');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var jwt         = require('jwt-simple')
//var config      = require('./config/dbConfig'); // get db config file
var User        = require('./models/User.js'); // get the mongoose model
var auth        = require('./auth.js');
var Post        = require('./models/post.js');
var port        = process.env.PORT || 3000;

mongoose.Promise=Promise
 

app.use(cors());
app.use(bodyParser.json());

app.get('/posts/:id',async (req, res) =>{
  var author=req.params.id
  var posts=await Post.find({author})
  res.send(posts)
});

app.post('/post',auth.checkAuthenticated, (req, res) =>{  
  var postData=req.body
  postData.author=req.userId

  var post=new Post(postData)

  post.save((err,result)=> {    
    if(err){
      console.error('Saving post data')
      return res.status(500).send({message:'saving data error'})
    }
    res.sendStatus(200);
  })

});
 
// demo Route (GET http://localhost:8080)
app.get('/', (req, res) =>{
  res.send('Hello! The API is at http://localhost:');
});

app.get('/Users',async (req, res)=> {
      try {        
        var users= await User.find({},'-password -__v')
        res.send(users)
      }
      catch(error) {
        console.error(error)
        res.sendStatus(500)
      }      
});
 
app.get('/profile/:id', async (req, res)=> { 
  try {
     var user= await User.findById(req.params.id,'-password -__v')
     res.send(user)
   }
   catch(error){
     console.error(error)
     res.sendStatus(200)
   }  
});


mongoose.connect('mongodb://localhost:27017/pms',{ useNewUrlParser: true },(err)=> { 
  if(!err)
    console.log('connected to mongo')
})

app.use('/auth',auth.router)
// Start the server
app.listen(port);
