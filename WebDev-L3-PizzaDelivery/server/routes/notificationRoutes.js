const express = require("express");

const {
  getAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");

const router = express.Router();

// Get notifications
router.get(
  "/",
  getAdminNotifications
);

// Mark one notification as read
router.patch(
  "/:id/read",
  markNotificationRead
);

// Mark all notifications as read
router.patch(
  "/read-all",
  markAllNotificationsRead
);

module.exports = router;