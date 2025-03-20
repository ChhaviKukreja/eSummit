const express = require ("express");
const { Submission, Student, Assignment } = require("../db")
const userMiddleware = require("../middleware/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { z } = require("zod");
const cors = require("cors");
router.use(cors());

