const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: String,
    location: String,
    experience: String,
    company: String,
    link: { type: String, unique: true },
    postedAt: { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
