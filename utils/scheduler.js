const scrapeJobs = require('./scraper');

// Run the scraper every 60 seconds
setInterval(() => {
    console.log("⏳ Running scheduled job...");
    scrapeJobs();
}, 60000); // 60,000 ms = 60 seconds

console.log("✅ Job Scheduler Initialized (Runs every 60 seconds)");
