const {Router} = require("express");
const authRouter = Router();
const bcrypt = require("bcryptjs");
const passport =
require("../passportConfig");
const {
  ensureAuthenticated
} = require(
  "../middlewares/authMiddleware"
);

const {
  body,
  validationResult
} = require("express-validator");

const db = require("../db/queries");

authRouter.get("/sign-up",(req,res)=>{
    res.render("signup");
});

authRouter.post(
  "/sign-up",

  [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name required"),

    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name required"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage(
        "Password must be at least 6 chars"
      ),

    body("confirmPassword")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage(
        "Passwords do not match"
      ),
  ],

  async (req, res) => {

    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors.array());
    }

    const hashedPassword =
      await bcrypt.hash(
        req.body.password,
        10
      );

    await db.createUser(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      hashedPassword
    );

    res.redirect("/login");
  }
);

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.post(
  "/login",

  passport.authenticate(
    "local",
    {
      successRedirect: "/",
      failureRedirect: "/login",
    }
  )
);
authRouter.get(
  "/join-club",

  (req, res) => {

    res.render(
      "join-club"
    );

  }
);
authRouter.get(
  "/join-club",

  ensureAuthenticated,

  (req, res) => {

    res.render(
      "join-club"
    );

  }
);
authRouter.post(
  "/join-club",

  ensureAuthenticated,

  async (req, res) => {

    if (
      req.body.passcode ===
      process.env.MEMBER_PASSCODE
    ) {

      await db.becomeMember(
        req.user.id
      );

      res.redirect("/");

    } else {

      res.send(
        "Wrong passcode"
      );

    }

  }
);
authRouter.get(
  "/become-admin",
  ensureAuthenticated,
  (req,res)=>{
    res.render(
      "become-admin"
    );
  }
);
authRouter.get(
  "/logout",

  (req, res, next) => {

    req.logout((err) => {

      if (err) {
        return next(err);
      }

      res.redirect("/");

    });

  }
);

module.exports = authRouter;