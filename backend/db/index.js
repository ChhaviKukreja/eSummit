require('dotenv').config();
const mongoose=require("mongoose");
const bcrypt = require('bcrypt');   

const mongoUri = process.env.MONGO_URI;
// Connect to MongoDB
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000, // 60 seconds
    socketTimeoutMS: 60000,  // 60 seconds
  });

// User Schema (Entrepreneurs, Mentors, Experts)
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['mentor', 'entrepreneur'], required: true },
    industry: { type: String, required: true },
    skills: [String],
    bio: String,
    profilePicture: String,
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// AI-Powered Matching Recommendations Schema
const recommendationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recommendedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

// Knowledge Hub Schema (Articles & Resources)
const knowledgeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
// Messaging Schema (Direct Messages & Group Chats)
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Event Schema (Workshops, Webinars, Networking Events)
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
const Recommendation = mongoose.model('Recommendation', recommendationSchema);
const Knowledge = mongoose.model('Knowledge', knowledgeSchema);
const Message = mongoose.model('Message', messageSchema);
const Event = mongoose.model('Event', eventSchema);

// Export models
module.exports = { User, Recommendation, Knowledge, Message, Event };
