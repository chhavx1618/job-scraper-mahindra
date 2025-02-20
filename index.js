require('dotenv').config(); 
const mongoose = require('mongoose');
const express = require('express'); 
require('./utils/scheduler'); 
const limiter = require('./middleware/rateLimiter')
const app = express();


app.use(limiter);

const PORT = process.env.PORT || 5000;

// Simple test route (if needed later for API)
app.get('/', (req, res) => {
    res.send(' Job Scraper is Running!');
});


app.get("/api/jobs", async (req, res) => {
    try {
        let jobTitles = JSON.parse(req.query.titles);
        let experience = req.query.experience;
        let location = req.query.location;

        let filteredJobs = await Job.find({
            title: { $in: jobTitles },
            location: new RegExp(location, "i"), // Case-insensitive search
            experience: new RegExp(experience, "i")
        });

        res.json(filteredJobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
