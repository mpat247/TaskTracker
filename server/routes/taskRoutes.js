const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('list');
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('list');
    if (!task) throw new Error('Task not found');
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a task by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) throw new Error('Task not found');
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) throw new Error('Task not found');
    res.json(deletedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Search for tasks
router.get('/search', async (req, res) => {
  try {
    const { title, description, dateDue, priority, category } = req.query;
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (description) query.description = { $regex: description, $options: 'i' };
    if (dateDue) query.dateDue = dateDue;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
