const express = require ("express");
const { Submission, Student, Assignment } = require("../db")
const userMiddleware = require("../middleware/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { z } = require("zod");
const cors = require("cors");
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
    role: z.enum(["teacher", "student"]),
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
  
         
          if (role === "mentor") {
              const existingUser = await Teacher.findOne({ email });
              // console.log(existingUser);
              if (existingUser) {
                  return res.status(400).json({ msg: "User already exists" });
              }
              else{
                  await Teacher.create({ firstName, lastName, email, password, role });
              }
          } else {
              const existingUser = await Student.findOne({ email });
              if (existingUser) {
                  return res.status(400).json({ msg: "User already exists" });
              }
              else{
                  await Student.create({ firstName, lastName, email, password, role });
              }
              
          }
  
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
  
          // Check if user exists in Teacher or Student collection
          const user = await Student.findOne({ email, password });
          console.log("user", user);
  
          if (!user) {
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
    
    
  router.get("/auth/check", studentMiddleware, (req, res) => {
      res.status(200).json({ username: req.email }); // Send back the authenticated user's details
    });