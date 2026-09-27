const Notification = require("../models/Notification");

// GET ADMIN NOTIFICATIONS
const getAdminNotifications = async (req, res) => {
  try {
    const notifications =
      await Notification.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

// MARK ONE AS READ
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification =
      await Notification.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(
      "Mark notification read error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update notification",
    });
  }
};

// MARK ALL AS READ
const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { read: false },
      {
        $set: {
          read: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update notifications",
    });
  }
};

module.exports = {
  getAdminNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};