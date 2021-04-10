const Express = require("express");
const router = Express.Router();
const { LogModel } = require("../models");
let validateJWT = require("../middleware/validate-JWT");

router.get("/practice", validateJWT, (req, res) => {
  res.send("Hey, this is a practice test");
});

router.get("/", (req, res) => {
  res.send("this is another test route");
});

router.post("/", async (req, res) => {
  LogModel.create({
    description: "test log",
    definition: "test",
    result: "good",
    owner_id: 1,
  });
});

module.exports = router;
