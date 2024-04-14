import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

// Register controller
export const register = async (req, res) => {
  try {
    // check if all field is entered
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: "Please enter mendatory fields" });
    } else {
      // hashed the entered password
      const hashedPass = await bcrypt.hash(password, 10);
      // create new user
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPass,
        },
      });
      res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to create user!" });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // check if all field is entered
    if (!username || !password) {
      res.status(400).json({ message: "Please enter mendatory fields" });
    } else {
      // check if user exist
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user) {
        res.status(401).json({ message: "Invalid Credentials!" });
      } else {
        // check if password valid
        const isPasswordValid = bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          res.status(401).json({ message: "Invalid Credentials!" });
        } else {
          // Generate token for authenticated user
          const age = 1000 * 60 * 60 * 24 * 7;

          const token = jwt.sign(
            {
              id: user.id,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
          );
          const { password: userPassword, ...userInfo } = user;
          res
            .cookie("token", token, {
              httpOnly: true,
              // secure: true,
              maxAge: age,
            })
            .status(200)
            .json({ message: "Login successfull", userInfo: userInfo });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      domain: process.env.CLIENT_URL,
    })
    .status(200)
    .json({ message: "Logout Successfull" });
};
