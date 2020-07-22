const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

const router = express.Router();

router.route("/").get(getBootcamp).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamps)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
