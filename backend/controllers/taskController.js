const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user._id });
  res.json(tasks);
});

// @desc    Create a task
// @route   POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    createdBy: req.user._id,
  });
  res.status(201).json(task);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (task.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (task.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  await task.remove();
  res.json({ message: 'Task removed' });
});

module.exports = { getTasks, createTask, updateTask, deleteTask };