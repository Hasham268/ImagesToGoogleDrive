const express = require("express");
const router = express.Router();
const { googleDriveUpload } = require("../controllers/driveUpload");

router.post("/upload", googleDriveUpload);

module.exports = router;
