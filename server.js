require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas!'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// 2. Define the Participant Schema (The "Blueprint" for your data)
const participantSchema = new mongoose.Schema({
    name: String,
    age: Number,
    sex: String,
    hasTakenBefore: String, // Added this field
    score: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

const Participant = mongoose.model('Participant', participantSchema);

// 3. The Route
app.post('/submit-data', async (req, res) => {
    try {
        console.log("Attempting to save:", req.body);
        const newUser = new Participant(req.body); // Make sure this matches your model name!
        await newUser.save();
        res.status(200).send('Success');
    } catch (error) {
        // This will print the EXACT reason to your Render Logs
        console.error("MONGODB ERROR:", error); 
        res.status(500).send("Database Error: " + error.message);
    }
});
app.post('/update-experience', async (req, res) => {
    try {
        const { name, hasTakenBefore } = req.body;
        
        // Find the user by name and update their experience field
        const updatedUser = await Participant.findOneAndUpdate(
            { name: name }, 
            { hasTakenBefore: hasTakenBefore },
            { new: true }
        );

        if (updatedUser) {
            console.log("Updated experience for:", name);
            res.status(200).send('Updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
// This line tells the code: "Use Render's port, or 3000 if I'm testing at home"
const PORT = process.env.PORT || 3000;

// This line tells the server to listen on "0.0.0.0" 
// This is required for Render to "see" your app
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});