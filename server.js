require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

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
    score: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

const Participant = mongoose.model('Participant', participantSchema);

// 3. The Route
app.post('/submit-data', async (req, res) => {
    try {
        const newParticipant = new Participant(req.body);
        await newParticipant.save();
        console.log("Saved to Cloud:", newParticipant.name);
        res.status(200).send({ message: "Data saved to the Cloud!", id: newParticipant._id });
    } catch (err) {
        res.status(500).send({ error: "Failed to save data." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});