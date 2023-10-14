import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose"

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

const itemsSchema = {
    name: String
  };

const Item = mongoose.model("Item", itemsSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, ".." ,"/public")))

app.listen(port, (req, res) => {
    console.log(`Server listening port: ${port}`);
})

app.get("/", async (req, res) => {
    try {
      const found = await Item.find().exec();
      res.render(path.join(__dirname, "..", "/views", "/index.ejs"), { list: found });
    } catch (err) {
      console.log(err);
      res.status(500).send("Items cannot be found");
    }
  });
  
app.post("/create-task", (req, res) => {
  let taskText = req.body["newTask"];

    const itemToAdd = new Item({
        name: taskText
    })
    itemToAdd.save();
 
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
    try {
        const idFind = req.body["index"]; 
  
        let removed = await Item.findByIdAndRemove(idFind).exec();
        res.redirect("/"); 
    } 
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    } 
})

app.post("/update", async (req, res) => {
  try {
      const idFind = req.body["index"]; 
      let updatedText = req.body.updateTask;
      let taskUpdate = await Item.findByIdAndUpdate(idFind, {name: updatedText});
      
      res.redirect("/"); 
  } 
  catch (err) {
      console.log(err);
      res.status(500).send(err);
  } 
})



