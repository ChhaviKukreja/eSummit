const express = require ("express");
const { User } = require("../db")
const userMiddleware = require("../middleware/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'amogh1212';
const { z } = require("zod");
const cors = require("cors");
router.use(cors());

// Export the router
module.exports = router;
