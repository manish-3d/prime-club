const { Router } =
require("express");
const db =
require("../db/queries");

const indexRouter =
Router();

indexRouter.get(
  "/",

  async (req, res) => {

    const messages =
      await db.getAllMessages();

    res.render(
      "index",
      {
        user: req.user,
        messages,
      }
    );

  }
);

module.exports =
indexRouter;