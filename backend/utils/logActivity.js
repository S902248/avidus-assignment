const ActivityLog = require('../models/ActivityLog');
const socket = require('./socket');

/**
 * Log user activity — non-blocking (fire and forget)
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} action - One of: LOGIN, TASK_CREATED, TASK_UPDATED, TASK_DELETED
 * @param {string} details - Additional context string
 */
const logActivity = (userId, action, details = '') => {
  ActivityLog.create({ userId, action, details }).then((log) => {
    try {
      const io = socket.getIO();
      // Emit to all admins currently connected
      io.to('admin_room').emit('new_activity', {
        _id: log._id,
        userId,
        action,
        details,
        createdAt: log.createdAt
      });
    } catch (err) {
      console.log('[Socket Emit Error]:', err.message);
    }
  }).catch((err) => {
    console.error('[ActivityLog Error]:', err.message);
  });
};

module.exports = { logActivity };
