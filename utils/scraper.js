const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Job = require('./../models/Job'); 
const connectDB = require('./../config/db')

connectDB();

const scrapeJobs = async () => {
    try {
        console.log("🔍 Launching Puppeteer...");
        const browser = await puppeteer.launch({ 
            headless: true, // Set to true if you want it to run in the background
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36");

        console.log("🔍 Scraping Tech Mahindra Jobs...");
        await page.goto('https://careers.techmahindra.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });

        console.log("✅ Page loaded. Extracting jobs...");
        const jobs = await page.evaluate(() => {
            let jobListings = [];
            for (let i = 1; i <= 10; i++) {
                let jobXPath = `/html/body/div[1]/form/div[4]/div[4]/div/section/div[1]/div/div[2]/div/div/div/div/div/div/div/div[2]/div/div/div/div/div/div[${i}]/div/div/div[1]/div/div`;

                let titleNode = document.evaluate(`${jobXPath}/div`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                let locationNode = document.evaluate(`${jobXPath}/p`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                let linkNode = document.evaluate(`${jobXPath}/a`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                let title = titleNode ? titleNode.innerText.trim() : null;
                let location = locationNode ? locationNode.innerText.trim() : null;
                let link = linkNode ? linkNode.getAttribute('href') : null;

                if (title && location && link) {
                    jobListings.push({ title, location, company: 'Tech Mahindra', link: `https://careers.techmahindra.com${link}` });
                }
            }
            return jobListings;
        });

        console.log(`✅ Jobs found: ${jobs.length}`);
        console.log("📋 Job List:", jobs);

        let jobCount = 0;
        for (const job of jobs) {
            const existingJob = await Job.findOne({ link: job.link });
            if (!existingJob) {
                await new Job(job).save();
                jobCount++;
                console.log(`✅ New Job Added: ${job.title}`);
            } else {
                console.log(`🔄 Job Already Exists: ${job.title}`);
            }
        }

        console.log(`🎯 Scraping Completed. Jobs Processed: ${jobCount}`);
        await browser.close();
    } catch (error) {
        console.error('❌ Error Scraping Jobs:', error.message);
    }
};

// Export the function to be used in scheduler
module.exports = scrapeJobs;
