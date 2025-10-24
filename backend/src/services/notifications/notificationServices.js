import { createTransport } from 'nodemailer';
import { AppError } from "../../utils/appError.js";
import Notification from "../../models/Notification.js";
import User from "../../models/User.js";
import dotenv from 'dotenv';

dotenv.config();

export async function sendNotification({ channel, to, subject, emailContent, appContent, type = 'generic' }) {
  if (!channel || !to || !subject || (!emailContent && !appContent)) {
    console.error('sendNotification için gerekli parametreler eksik.');
    return;
  }

  const user = await User.findOne({ _id: to._id });
  if (!user) throw new AppError('User not found', 404);

  const channelsToSend = Array.isArray(channel) ? channel : [channel];

  const basePayload = {
    user: to._id,
    type,
    subject,
  };

  for (const currentChannel of channelsToSend) {
    if (currentChannel === 'app') {
      const notification = new Notification({
        ...basePayload,
        channel: 'app',
        content: appContent,
      });
      await notification.save();
    } 
    else if (currentChannel === 'email') {
      try {
        const transporter = createTransport({
          host: process.env.BREVO_HOST,
          port: process.env.BREVO_PORT,
          secure: false,
          auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_API_KEY,
          },
        });

        await transporter.sendMail({
          from: process.env.DEFAULT_SENDER_EMAIL,
          to: user.email,
          subject: subject,
          html: emailContent,
        });
        
        const notification = new Notification({
          ...basePayload,
          channel: 'email',
          read: true,
          content: emailContent,
        });
        await notification.save();

      } catch (error) {
        console.error('Email could not be sent:', error);
      }
    }
  }
}

export async function getUserNotifications(userId, queryOptions = {}) {
  const { 
    limit = 10,     
    status,         
    type,
    channel
  } = queryOptions;
  const query = { user: userId }; 

  if (status) {
    query.read = status === 'read' ? true : false;
  }

  if (type) {
    query.type = type;
  }

  if (channel) {
    query.channel = channel;
  }

  const notifications = await Notification.find(query) 
  .sort({ createdAt: -1 }) 
  .limit(limit);        
  
  return notifications;
}