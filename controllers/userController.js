// controllers/userController.js

import bcrypt from 'bcrypt';
import jwt from'jsonwebtoken';
import { v4 as uuid } from'uuid';
import { PrismaClient } from'@prisma/client';
import dotenv from 'dotenv';

dotenv.config(); 

const prisma = new PrismaClient();

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, referralName, referralEmail } = req.body;

        console.log('Received data:', { name, email, password, referralName, referralEmail });

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        let data = {
            id: uuid(),
            name,
            email,
            password: await bcrypt.hash(password, 10),
        };

        // Check if referralName and referralEmail are provided
        if (referralName && referralEmail) {
            // Find the user with the provided referralEmail
            const referredUser = await prisma.user.findUnique({
                where: { email: referralEmail },
            });

            // If referredUser doesn't exist or the name doesn't match, send an error
            if (!referredUser || referredUser.name !== referralName) {
                return res.status(400).json({ error: 'Referred user does not exist' });
            }

            // Add referral name and email to data
            data.referralName = referralName;
            data.referralEmail = referralEmail;
        }

        const user = await prisma.user.create({
            data,
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if user with provided email exists
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

      // Compare provided password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

      // Generate JWT token
        const token = generateToken(user);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Error logging in user' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
    } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure the id is a string or number (depending on your database schema)
        const user = await prisma.user.findUnique({
            where: { id: id }, // Assuming `id` is a string in your schema
        });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

      // Prepare data for update
        const dataToUpdate = {};

      // Validate and add fields to update
        if (name) dataToUpdate.name = name;
        if (email) dataToUpdate.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            dataToUpdate.password = hashedPassword;
        }

      // Update user
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
        });

            res.status(200).json(updatedUser);
    } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Error updating user' });
    }
};

export const deleteUser = async (req, res) => {
    try {
    const { id } = req.params;
    await prisma.user.delete({
        where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
    }
};
