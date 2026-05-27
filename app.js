require("dotenv").config();

const express =
require("express");

const path =
require("path");

const session =
require("express-session");

const passport =
require("./passportConfig");

const indexRouter =
require("./routes/indexRouter");

const authRouter =
require("./routes/authRouter");

const messageRouter =
require("./routes/messageRouter");

const app = express();

app.set(
  "view engine",
  "ejs"
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(
  express.static(
    path.join(
      __dirname,
      "public"
    )
  )
);



// SESSION MIDDLEWARE

app.use(
  session({

    secret:
      process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

  })
);



// PASSPORT MIDDLEWARE

app.use(
  passport.initialize()
);

app.use(
  passport.session()
);



// MAKE USER AVAILABLE IN EJS

app.use(
  (req, res, next) => {

    res.locals.currentUser =
      req.user;

    next();

  }
);



// ROUTES

app.use(
  "/",
  indexRouter
);

app.use(
  "/",
  authRouter
);

app.use(
  "/",
  messageRouter
);



// SERVER

app.listen(
  3000,
  () => {

    console.log(
      "Server running"
    );

  }
);