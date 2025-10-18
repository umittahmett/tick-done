import express from 'express'
import { auth } from '../middlewares/authMiddleware.js'
import { getUserNotifications } from '../controllers/notificationControllers.js'
import { getUserNotificationsSchema } from '../validation/notification/index.js'
import { validate } from '../middlewares/validateMiddleware.js'

const router = express.Router()

router.get('/getUserNotifications', auth, validate(getUserNotificationsSchema), getUserNotifications)

export default router
