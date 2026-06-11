const Task = require('../models/Task');
const { logActivity } = require('../utils/logActivity');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Protected
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      userId: req.user._id,
    });

    logActivity(req.user._id, 'TASK_CREATED', `Task created: "${title}"`);

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('[CreateTask Error]:', error.message);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// @desc    Get own tasks
// @route   GET /api/tasks
// @access  Protected
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('[GetTasks Error]:', error.message);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Update own task
// @route   PUT /api/tasks/:id
// @access  Protected
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    logActivity(req.user._id, 'TASK_UPDATED', `Task updated: "${task.title}" → status: ${task.status}`);

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('[UpdateTask Error]:', error.message);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// @desc    Delete own task
// @route   DELETE /api/tasks/:id
// @access  Protected
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    const taskTitle = task.title;
    await task.deleteOne();

    logActivity(req.user._id, 'TASK_DELETED', `Task deleted: "${taskTitle}"`);

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('[DeleteTask Error]:', error.message);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
