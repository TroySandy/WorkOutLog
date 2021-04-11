const Express = require("express");
const router = Express.Router();
const { LogModel } = require("../models");
const validateJWT = require("../middleware/validate-jwt");

// router.get("/",  (req, res) => {
//   res.send("this is another test route");
// });

router.post("/", validateJWT, async (req, res) => {
  const { description, definition, result, owner_id } = req.body;

  try {
    const Log = await LogModel.create({
      description,
      definition,
      result,
      owner_id,
    });
    res.status(201).json({
      message: "Workout Log created",
      Log,
    });
  } catch (err) {
    res.status(500).json({
      message: `Failed to create entry ${err}`,
    });
  }
});

router.get("/", validateJWT, async (req, res) => {
  const { id } = req.user;
  console.log(id);
  try {
    const allLogs = await LogModel.findAll({
      where: {
        owner_id: id,
      },
    });
    res.status(200).json(allLogs);
  } catch (err) {
    res.status(500).json({ message: "Failed Task" });
  }
});

router.get("/:id", validateJWT, async (req, res) => {
  const { id } = req.user;
  console.log(id);
  try {
    const allLogs = await LogModel.findAll({
      where: {
        owner_id: id,
      },
    });
    res.status(200).json(allLogs);
  } catch (err) {
    res.status(500).json({ message: "Failed Task" });
  }
});

router.put("/:id", validateJWT, async (req, res) => {
  const { description, definition, result } = req.body;

  try {
    await LogModel.update(
      { description, definition, result },
      { where: { id: req.params.id }, returning: true }
    ).then((result) => {
      res.status(200).json({
        message: "Log successfully updated",
        updatedLog: result,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Failed to update log: ${err}`,
    });
  }
});

router.delete("/:id", validateJWT, async (req, res) => {
  
  try {
    const query = {
      where: {
        id: req.params.id
      },
    };
    await LogModel.destroy(query);
    res.status(200).json({ message: "Log destroyed"});
  } catch (err) {
    res.status(500).json({ message: "Failed Task" });
  }
});

module.exports = router;
