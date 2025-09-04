// routes/facilityRoutes.js
const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");

router.post("/", facilityController.createFacility);
router.get("/", facilityController.getFacilities);
router.delete("/:id", facilityController.deleteFacility);

module.exports = router;
