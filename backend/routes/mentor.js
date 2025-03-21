const express = require("express");
const { User, Message, Meeting } = require("../db")
const userMiddleware = require("../middleware/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'amogh1212';
const { z } = require("zod");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
router.use(cors());


const signupSchema = z.object({
    firstName: z.string().min(2, "First name must have at least 2 characters"),
    lastName: z.string().min(2, "Last name must have at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string().min(8),
    role: z.enum(["mentor", "entrepreneur"]),
    //   agreedToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the Terms of Service" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});



router.post("/signup", async function (req, res) {
    try {
        const { firstName, lastName, email, password, role } = signupSchema.parse(req.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        await User.create({
            firstName,
            lastName,
            email,
            password,
            role,
            industry: req.body.industry || 'Technology',
            skills: req.body.skills || [],
            bio: req.body.bio || ''
        });

        const token = jwt.sign({ email, role }, JWT_SECRET);
        res.json({ msg: "User created successfully", token });

    } catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
});


router.post("/signin", async function (req, res) {
    try {
        console.log("inside try");
        const { email, password } = signinSchema.parse(req.body);
        console.log("email and pwd", email, password);

        // Check if user exists
        const user = await User.findOne({ email });
        console.log("user", user);

        if (!user) {
            return res.status(401).json({ msg: "Incorrect email or password" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Incorrect email or password" });
        }

        // Generate JWT token with user role
        const token = jwt.sign({ email: user.email, role: user.role }, JWT_SECRET);
        console.log("token", token);

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(400).json({ error: error.errors || error.message });
    }
});


router.get("/auth/check", userMiddleware, (req, res) => {
    res.status(200).json({ username: req.email }); // Send back the authenticated user's details
});


// Get all mentors
router.get("/mentors", async (req, res) => {
    try {
        const mentors = await User.find({ role: "mentor" })
            .select('firstName lastName email industry skills bio profilePicture');
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get mentor by ID
router.get("/mentors/:id", async (req, res) => {
    try {
        const mentor = await User.findById(req.params.id)
            .select('firstName lastName email industry skills bio profilePicture');

        if (!mentor) {
            return res.status(404).json({ msg: "Mentor not found" });
        }

        res.json(mentor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get chat messages between two users
router.get("/chat/:receiverId", userMiddleware, async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.receiverId;

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ timestamp: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send a message
router.post("/chat/send", userMiddleware, async (req, res) => {
    try {
        const { receiverId, message } = req.body;

        if (!receiverId || !message) {
            return res.status(400).json({ msg: "Receiver ID and message are required" });
        }

        const newMessage = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            message
        });

        res.json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Schedule a meeting
router.post("/meetings/schedule", userMiddleware, async (req, res) => {
    try {
        const { participantId, startTime, endTime, title, description } = req.body;

        if (!participantId || !startTime || !endTime || !title) {
            return res.status(400).json({ msg: "Participant ID, start time, end time, and title are required" });
        }

        const meetingId = uuidv4();

        const newMeeting = await Meeting.create({
            host: req.user._id,
            participant: participantId,
            startTime,
            endTime,
            title,
            description,
            meetingId
        });

        res.json(newMeeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's meetings
router.get("/meetings", userMiddleware, async (req, res) => {
    try {
        const meetings = await Meeting.find({
            $or: [
                { host: req.user._id },
                { participant: req.user._id }
            ]
        })
            .populate('host', 'firstName lastName email')
            .populate('participant', 'firstName lastName email')
            .sort({ startTime: 1 });

        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get meeting by ID
router.get("/meetings/:id", userMiddleware, async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id)
            .populate('host', 'firstName lastName email')
            .populate('participant', 'firstName lastName email');

        if (!meeting) {
            return res.status(404).json({ msg: "Meeting not found" });
        }

        // Check if user is part of the meeting
        if (meeting.host._id.toString() !== req.user._id.toString() &&
            meeting.participant._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "Not authorized to view this meeting" });
        }

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update meeting status
router.put("/meetings/:id", userMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['scheduled', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ msg: "Valid status is required" });
        }

        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({ msg: "Meeting not found" });
        }

        // Check if user is part of the meeting
        if (meeting.host.toString() !== req.user._id.toString() &&
            meeting.participant.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "Not authorized to update this meeting" });
        }

        meeting.status = status;
        await meeting.save();

        res.json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the router
module.exports = router;
