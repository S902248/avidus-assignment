const ActivityLog = require('../models/ActivityLog');

/**
 * Log user activity — non-blocking (fire and forget)
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} action - One of: LOGIN, TASK_CREATED, TASK_UPDATED, TASK_DELETED
 * @param {string} details - Additional context string
 */
const logActivity = (userId, action, details = '') => {
  ActivityLog.create({ userId, action, details }).catch((err) => {
    console.error('[ActivityLog Error]:', err.message);
  });
};

module.exports = { logActivity };
