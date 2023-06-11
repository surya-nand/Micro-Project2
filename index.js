const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");

dotEnv.config();
const app = express();

const Recipe = mongoose.model("recipe", {
  receipeName: String,
  receipeTime: Number,
  ingredients: Array,
  serves: Number,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/recipes_data", (req, res) => {
  //Fetching all the recipe data from the database
  Recipe.find()
    .then((recipes) => {
      res.json(recipes);
    })
    .catch((error) => {
      console.log("Error in fetching recipes from database");
    });
});

app.post("/recipes", (req, res) => {
  const recipe = new Recipe({
    receipeName: req.body.recipeName,
    receipeTime: req.body.recipeTime,
    ingredients: req.body.ingredients,
    serves: req.body.serves,
  });
  recipe
    .save()
    .then((recipe) => {
      res.send(recipe);
    })
    .catch((error) => {
      res.send("Error in adding recipe data");
    });
});

app.put("/recipes/:id", (req, res) => {
  //Update the details in the DB
  let { id } = req.params;
  const recipe = Recipe.findByIdAndUpdate(id);
  if (!recipe) {
    res.json({
      Msg: "Update Falied",
      error: "id NOt found",
    });
  } else {
    (recipe.receipeName = req.body.recipeName),
      (recipe.receipeTime = req.body.recipeTime),
      (recipe.ingredients = req.body.ingredients),
      (recipe.serves = req.body.serves);

    recipe
      .save()
      .then(() => {
        res.json({
          msg: "Update Completed",
        });
      })
      .catch((error) => {
        res.json({
          msg: "Update Failed",
          error: error,
        });
      });
  }
});

app.delete("/recipes/:id", (req, res) => {
  //Delete the details in the DB
  let { id } = req.params;
  const recipe = Recipe.findByIdAndDelete(id);
  if (!recipe) {
    res.json({
      Msg: "Delete Falied",
      error: "id NOt found",
    });
  } else {
    recipe
      .remove()
      .then(() => {
        res.json({
          msg: "Delete Completed",
        });
      })
      .catch((error) => {
        res.json({
          msg: "Delete Failed",
          error: error,
        });
      });
  }
});

app.listen(9000, () => {
  mongoose
    .connect(process.env.MONGO_SERVER, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Database connection failed", error);
    });

  console.log("Server is running at port:9000");
});
