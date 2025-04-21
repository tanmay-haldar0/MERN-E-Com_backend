import mongoose from "mongoose";
// import dotenv from "dotenv"; 
import User from "./model/user.js"; // adjust path based on your project structure



const mongoURI = "mongodb+srv://haldettanmoy59:kl50r5kZAcrRvKnU@classicustom.r4ghp.mongodb.net/?retryWrites=true&w=majority&appName=classicustom"; // make sure this is in your .env file

async function patchUsers() {
    try {
        await mongoose.connect(mongoURI);
        console.log("✅ Connected to MongoDB");

        const result = await User.updateMany(
            {
                $or: [
                    { cart: { $exists: false } },
                    { cart: null },
                    { cart: { $type: 10 } }, // type 10 = undefined
                ],
            },
            {
                $set: { cart: [] },
            }
        );

        console.log(`🛠️ Users modified: ${result.modifiedCount}`);
        await mongoose.disconnect();
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
}

patchUsers();