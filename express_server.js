const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//-----------------body parser------------------------//

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//--------------------uses of cookie parser ----------------------//
const cookieParser = require("cookie-parser");
app.use(cookieParser())


//---------------------------------random fuction used in post urls-----------------//

function generateRandomString() {
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i <= 5; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
//------------------ GET METHOD ------------------------------------------------



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
  // app.get("/hello", (req, res) => {
  //   let templateVars = { greeting: 'Hello World!' };
  //   res.render("hello_world", templateVars);
  // });
  //  app.get("/urls", (req, res) => {
  //   let templateVars = { urls: urlDatabase };
  //   res.render("urls_index", templateVars);
  //  });
   app.get("/urls/new", (req, res) => {
    let templateVars = {
      username: req.cookies["username"]
    };
    res.render("urls_new", templateVars);                  // ====> giving new url ejs "adding new html css attribute"
  });
  app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL:urlDatabase[req.params.shortURL] ,
      username : req.cookies["username"] };
    res.render("urls_show", templateVars );
  });

  app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL]
    res.redirect(longURL);
  });
  app.get("/urls", (req,res) => {
    let templateVars = {  username : req.cookies["username"],
                          urls : urlDatabase };
    res.render('urls_index', templateVars);
  });


  // -------------------------------POST METHOD ---------------------------------------

  // app.post("/urls", (req, res) => {
  //   console.log(req.body);  // Log the POST request body to the console
  //   res.send("Ok");         // Respond with 'Ok' (we will replace this)
  // });
  app.post("/urls", (req, res) => {
    shortURL = generateRandomString();
    longURL = req.body.longURL;
    urlDatabase[shortURL] = longURL;
    res.redirect(`/urls/${shortURL}`);
  });

  //-----------------DELETE --------------------------------//
  app.post("/urls/:shortURL/delete", (req, res) => {
    let key = req.params.shortURL
    delete urlDatabase[key];
    res.redirect("/urls");
  });


  //-----------------------EDIT ------------------------------//
  app.post('/urls/:shortURL', (req, res) => {
    urlDatabase[req.params.shortURL]["longURL"] = req.params.longURL;
      res.redirect(`/urls/${req.params.shortURL}`);
  });


//----------------submit------------------------------//


// Update a longURL resource
app.post("/urls/:shortURL/edit", (req, res) => {
  let key = req.params.shortURL;
  urlDatabase[key] = req.body.newlongURL;
  res.redirect(`/urls/${key}`);
})


//--------------------login-------------------------------//
app.post("/login", (req, res) => {
  console.log(req.body.userName);
  res.cookie("username",req.body.username);
  res.redirect("/urls");
});




//---------------------logout----------//

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  // res.cookie("username",req.body.username);
  res.redirect("/urls");
});

//------------------------- LISTEN ---------------------------



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

