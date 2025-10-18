
import * as notificationServices from '../services/notifications/notificationServices.js'

export async function getUserNotifications(req, res) {
  try {
    const data = await notificationServices.getUserNotifications(req.user.id,{limit: req.query.limit, status: req.query.status, type: req.query.type, channel: req.query.channel})

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: data
    })
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message })
  }
}