const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://chhavicw1618:Zjm5uZ9rU3cCWfQf@jobs-collection.9cptd.mongodb.net/?retryWrites=true&w=majority&appName=jobs-collection"
, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
