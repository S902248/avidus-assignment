const User = require('../models/User');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Admin cannot delete their own account' });
    }

    // Also delete user's tasks
    await Task.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.status(200).json({ message: 'User and their tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// @desc    Update user status
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Active or Inactive' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: `User status updated to ${status}`, user: { _id: user._id, name: user.name, status: user.status } });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating user status' });
  }
};

// @desc    Get all tasks (all users)
// @route   GET /api/admin/tasks
// @access  Admin
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};

// @desc    Delete any task
// @route   DELETE /api/admin/tasks/:id
// @access  Admin
const deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// @desc    Get all activity logs
// @route   GET /api/admin/activity-logs
// @access  Admin
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(200);
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching activity logs' });
  }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalTasks, completedTasks, pendingTasks] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: 'completed' }),
      Task.countDocuments({ status: 'pending' }),
    ]);

    res.status(200).json({ totalUsers, totalTasks, completedTasks, pendingTasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Admin
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'User',
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating user' });
  }
};

// @desc    Update user password
// @route   PATCH /api/admin/users/:id/password
// @access  Admin
const updateUserPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save(); // This will trigger the pre-save hook to hash the new password

    res.status(200).json({ message: 'User password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating password' });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  deleteAnyTask,
  getActivityLogs,
  getAnalytics,
  createUser,
  updateUserPassword,
};
