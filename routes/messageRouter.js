const { Router } =
require("express");

const {
  ensureAuthenticated,
  ensureAdmin
} = require(
  "../middlewares/authMiddleware"
);

const db =
require("../db/queries");

const messageRouter =
Router();
messageRouter.get(
  "/new-message",

  ensureAuthenticated,

  (req, res) => {

    res.render(
      "new-message"
    );

  }
);
messageRouter.post(
  "/new-message",
  ensureAuthenticated,
  async (req, res) => {

    await db.createMessage(
      req.body.title,
      req.body.message,
      req.user.id
    );

    res.redirect("/");

  }
);
messageRouter.post(
  "/message/:id/delete",

  ensureAdmin,

  async (req, res) => {

    await db.deleteMessage(
      req.params.id
    );

    res.redirect("/");

  }
);

module.exports = messageRouter;