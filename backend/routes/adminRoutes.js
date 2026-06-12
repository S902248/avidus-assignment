const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  deleteAnyTask,
  getActivityLogs,
  getAnalytics,
} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Apply both middlewares to all admin routes
router.use(verifyToken, adminOnly);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', updateUserStatus);

router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteAnyTask);

router.get('/activity-logs', getActivityLogs);
router.get('/analytics', getAnalytics);

module.exports = router;
