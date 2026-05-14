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

// 2. Define the Participant Schema
const participantSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    age: Number,
    sex: String,
    hasTakenBefore: String,
    predictedScore: Number,
    testResults: Array, // To store their answers permanently
    totalScore: { type: Number, default: 0 },
    timeLeftTotal: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

const Participant = mongoose.model('Participant', participantSchema);

// ==========================================
// --- ROUTES ---
// ==========================================

// Login or Register Route
app.post('/login-or-register', async (req, res) => {
    try {
        const { username } = req.body;
        let user = await Participant.findOne({ username });

        if (user) {
            // User exists! Tell the frontend they are "Logged In"
            res.status(200).json({ status: 'exists', user });
        } else {
            // New user! Create the account
            user = new Participant({ username });
            await user.save();
            res.status(201).json({ status: 'created', user });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send('Server Error');
    }
});

// Update Demographics (Used by new users)
app.post('/submit-data', async (req, res) => {
    try {
        const { username, age, sex } = req.body;
        
        // Find the user created during login and UPDATE them
        await Participant.findOneAndUpdate(
            { username: username }, 
            { age: age, sex: sex },
            { new: true }
        );
        res.status(200).send('Success');
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).send('Database Error');
    }
});

// Update Experience Route
app.post('/update-experience', async (req, res) => {
    try {
        const { username, hasTakenBefore } = req.body; // Switched to username
        
        const updatedUser = await Participant.findOneAndUpdate(
            { username: username }, // Switched to username
            { hasTakenBefore: hasTakenBefore },
            { new: true }
        );

        if (updatedUser) {
            console.log("Updated experience for:", username);
            res.status(200).send('Updated successfully');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Submit Prediction Route
app.post('/submit-prediction', async (req, res) => {
    try {
        const { username, predictedScore } = req.body; // Switched to username
        
        await Participant.findOneAndUpdate(
            { username: username }, // Switched to username
            { predictedScore: predictedScore },
            { new: true }
        );

        res.status(200).send('Prediction processed');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Leaderboard Route
app.get('/leaderboard', async (req, res) => {
    try {
        // Find all users, select only username and score, sort highest to lowest
        const topUsers = await Participant.find({}, 'username totalScore')
            .sort({ totalScore: -1 }) // -1 means descending order (highest first)
            .limit(50); // Only grab the top 50
        
        res.status(200).json(topUsers);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// --- SERVER SETUP ---
// ==========================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});