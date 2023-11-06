import dotenv from 'dotenv';
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import passportLocalMongoose from "passport-local-mongoose";
//configure .env file
dotenv.config();

//Connecting to the local database
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

//----------------middlewares and schemas---------------
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

//schema for the task items
const itemsSchema = new mongoose.Schema({
    name: String,
    //reference the user id
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  });

  //schema for the users
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose)

//create new model for tasks
const Item = new mongoose.model("Item", itemsSchema);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, ".." ,"/public")))


app.listen(port, (req, res) => {
    console.log(`Server listening port: ${port}`);
})

//------------------Get routes-----------------

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/views", "/main_page.html"));
  });

//If the user is authenticated get the main page, if not return to the welcome page
app.get("/index", async(req, res) => {
   if(req.isAuthenticated()){
    try {
      const user = req.user;
      const found = await Item.find({ owner: user._id }).exec();
      res.render(path.join(__dirname, "..", "/views", "/index.ejs"), { list: found });
    } catch (err) {
      console.log(err);
      res.status(500).send("Items cannot be found");
    } }  else {
        res.redirect("/");
    }
  });

  //Get login or register pages
  app.get("/register", async(req, res) => {
    res.sendFile(path.join(__dirname, "..", "/views", "/register.html"));
  });

  app.get("/login", async(req, res) => {
    res.sendFile(path.join(__dirname, "..", "/views", "/login.html"));
  });

  //Log out route
  app.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });
 
//--------------Post routes--------------------

//route for creating tasks
app.post("/create-task", async (req, res) => {
 try{ 
  const user = req.user;
  let taskText = req.body["newTask"];

    const itemToAdd = new Item({
        name: taskText,
        owner: user._id
    })
   await itemToAdd.save();
 
  res.redirect("/index");
} catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong.")
  }
});

//route for deleting tasks
app.post("/delete", async (req, res) => {
    try {
        const idFind = req.body["index"]; 
  
        let removed = await Item.findByIdAndRemove(idFind).exec();
        res.redirect("/index"); 
    } 
    catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong.');
    } 
})

//route for updating tasks
app.post("/update", async (req, res) => {
  try {
      const user = req.user;
      const idFind = req.body["index"]; 
      let updatedText = req.body.updateTask;
      let taskUpdate = await Item.findByIdAndUpdate(idFind, {name: updatedText, owner: user._id});
      
      res.redirect("/index"); 
  } 
  catch (err) {
      console.log(err);
      res.status(500).send('There has been a mistake');
  } 
})

//Register request handler
app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/index");
      });
    }
  });

});

//Login request handler
app.post("/login", function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log(err);
      return res.redirect('/login');
    }
    if (!user) {
      //If there is no such user or the password does not match, redirects to the login page
      console.log('There was a mistake in the username or the password');
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log(err);
        return res.redirect('/login');
      }
      return res.redirect('/index');
    });
  })(req, res, next);
});

