const express = require('express');
const router = express.Router();
const List = require('../models/List');
const Task = require('../models/Task');

// Get all lists
router.get('/', async (req, res) => {
  try {
    const lists = await List.find();
    res.json(lists);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a list by ID
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) throw new Error('List not found');
    res.json(list);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new list
router.post('/', async (req, res) => {
  try {
    const newList = new List(req.body);
    const savedList = await newList.save();
    res.json(savedList);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a list by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedList = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedList) throw new Error('List not found');
    res.json(updatedList);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a list
router.delete('/:id', async (req, res) => {
  try {
    await Task.deleteMany({ list: req.params.id });
    const deletedList = await List.findByIdAndDelete(req.params.id);
    if (!deletedList) throw new Error('List not found');
    res.json(deletedList);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
