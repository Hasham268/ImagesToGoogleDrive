const mongoose = require("mongoose");

const driveLinkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
});

const DriveLink = mongoose.model("DriveLink", driveLinkSchema);

module.exports = DriveLink;
