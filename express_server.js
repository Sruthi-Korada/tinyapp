const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
function generateRandomString() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });
// app.get("/urls.json", (req, res) => {                            // commented code are routes for the server
//     res.json(urlDatabase);
//   });
 
  // app.get("/set", (req, res) => {
  //   const a = 1;
  //   res.send(`a = ${a}`);
  //  });
   
  //  app.get("/fetch", (req, res) => {
  //   res.send(`a = ${a}`);
  //  })
  app.get("/hello", (req, res) => {
    let templateVars = { greeting: 'Hello World!' };
    res.render("hello_world", templateVars);
  });
   app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
   });
   app.get("/urls/new", (req, res) => {
    res.render("urls_new");                   // ====> giving new url ejs "adding new html css attribute"
  });
  app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL]  };
    res.render("urls_show", templateVars );
  });

  app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL]
    res.redirect(longURL);
  });

  // app.post("/urls", (req, res) => {
  //   console.log(req.body);  // Log the POST request body to the console
  //   res.send("Ok");         // Respond with 'Ok' (we will replace this)
  // });
  app.post("/urls", (req, res) => {
    console.log(req.body);
    let key = generateRandomString();
    res.send({key});
  });
  app.post("/urls/:shortURL/delete", (req, res) => {
    let key = req.params.shortURL
    delete urlDatabase[key];
    res.redirect("/urls");
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

