// routes/userRoutes.js
import express from 'express';
import { createUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
const router = express.Router();

// Create a new user
router.post('/register', createUser);

// Login for user
router.post('/login', loginUser);

// Get all users
router.get('/', getAllUsers);

// Get a single user by ID
router.get('/:id', getUserById);

// Update a user by ID
router.put('/:id', updateUser);

// Delete a user by ID
router.delete('/:id', deleteUser);

export default router;
